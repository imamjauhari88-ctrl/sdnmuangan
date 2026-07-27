"use server";

import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { PendaftarStatus, TahunAjaran, TahunAjaranStatus } from "@/lib/types/database";

export interface PpdbActionResult {
  success: boolean;
  message: string;
}

function revalidatePpdbPaths() {
  revalidatePath("/admin/ppdb/pendaftar");
  revalidatePath("/admin/ppdb/tahun-ajaran");
  revalidatePath("/admin/dashboard");
  revalidatePath("/ppdb");
}

// ===================== PENDAFTAR =====================

export async function updateStatusPendaftar(
  id: number,
  status: PendaftarStatus
): Promise<PpdbActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("pendaftar").update({ status } as never).eq("id", id);

  if (error) {
    console.error("Gagal memperbarui status pendaftar:", error.message);
    return { success: false, message: "Gagal memperbarui status." };
  }

  revalidatePpdbPaths();
  return { success: true, message: `Status berhasil diubah menjadi "${status}".` };
}

export async function deletePendaftar(id: number): Promise<PpdbActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("pendaftar").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus pendaftar:", error.message);
    return { success: false, message: "Gagal menghapus data pendaftar." };
  }

  revalidatePpdbPaths();
  return { success: true, message: "Data pendaftar berhasil dihapus." };
}

// ===================== TAHUN AJARAN =====================

export interface TahunAjaranFormInput {
  tahun: string;
  kuota: number;
  status: TahunAjaranStatus;
}

function validateTahunAjaranInput(input: TahunAjaranFormInput): string | null {
  if (!input.tahun.trim()) return "Tahun ajaran wajib diisi.";
  if (!/^\d{4}\/\d{4}$/.test(input.tahun.trim())) {
    return "Format tahun ajaran harus seperti 2026/2027.";
  }
  if (input.kuota < 1) return "Kuota harus lebih dari 0.";
  return null;
}

/**
 * Karena PPDB publik (lib/data/ppdb.ts: getTahunAjaranAktif) mengambil
 * tahun ajaran dengan .eq("status", "Buka").limit(1) — kalau ada LEBIH
 * dari satu baris berstatus "Buka" sekaligus, perilakunya jadi ambigu
 * (baris mana yang dipakai tidak terjamin urutannya). Karena itu, setiap
 * kali satu tahun ajaran di-set "Buka", semua tahun ajaran LAIN otomatis
 * di-set "Tutup" terlebih dahulu — meniru constraint "hanya satu yang aktif
 * pada satu waktu" tanpa perlu mengubah skema database.
 */
async function tutupSemuaTahunAjaranLain(supabase: Awaited<ReturnType<typeof createAuthServerClient>>, kecualiId?: number) {
  let query = supabase.from("tahun_ajaran").update({ status: "Tutup" } as never);
  if (kecualiId) {
    query = query.neq("id", kecualiId);
  }
  await query;
}

export async function createTahunAjaran(input: TahunAjaranFormInput): Promise<PpdbActionResult> {
  const validationError = validateTahunAjaranInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  if (input.status === "Buka") {
    await tutupSemuaTahunAjaranLain(supabase);
  }

  const payload: Partial<TahunAjaran> = {
    tahun: input.tahun.trim(),
    kuota: input.kuota,
    status: input.status,
  };

  // Catatan: type assertion `as never` menghindari bug inference pada
  // @supabase/supabase-js@2.108 untuk Database type kustom — lihat catatan
  // detail di lib/actions/kontak.ts.
  const { error } = await supabase.from("tahun_ajaran").insert([payload] as never);

  if (error) {
    console.error("Gagal menambah tahun ajaran:", error.message);
    return { success: false, message: "Gagal menyimpan tahun ajaran." };
  }

  revalidatePpdbPaths();
  return { success: true, message: "Tahun ajaran berhasil ditambahkan." };
}

export async function updateTahunAjaran(
  id: number,
  input: TahunAjaranFormInput
): Promise<PpdbActionResult> {
  const validationError = validateTahunAjaranInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  if (input.status === "Buka") {
    await tutupSemuaTahunAjaranLain(supabase, id);
  }

  const payload: Partial<TahunAjaran> = {
    tahun: input.tahun.trim(),
    kuota: input.kuota,
    status: input.status,
  };

  const { error } = await supabase.from("tahun_ajaran").update(payload as never).eq("id", id);

  if (error) {
    console.error("Gagal memperbarui tahun ajaran:", error.message);
    return { success: false, message: "Gagal memperbarui tahun ajaran." };
  }

  revalidatePpdbPaths();
  return { success: true, message: "Tahun ajaran berhasil diperbarui." };
}

export async function deleteTahunAjaran(id: number): Promise<PpdbActionResult> {
  const supabase = await createAuthServerClient();

  // Cek dulu apakah masih ada pendaftar yang menaut ke tahun ajaran ini —
  // hapus tahun ajaran yang masih punya pendaftar akan menyisakan baris
  // `pendaftar.tahun_id` yang nyantol ke id yang sudah tidak ada (tidak ada
  // FK CASCADE di skema, sama seperti kasus album/foto).
  const countRes = await supabase
    .from("pendaftar")
    .select("id", { count: "exact", head: true })
    .eq("tahun_id", id);

  if ((countRes.count ?? 0) > 0) {
    return {
      success: false,
      message: `Tidak bisa menghapus: masih ada ${countRes.count} pendaftar di tahun ajaran ini.`,
    };
  }

  const { error } = await supabase.from("tahun_ajaran").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus tahun ajaran:", error.message);
    return { success: false, message: "Gagal menghapus tahun ajaran." };
  }

  revalidatePpdbPaths();
  return { success: true, message: "Tahun ajaran berhasil dihapus." };
}
