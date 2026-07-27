"use server";

import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Ekstrakurikuler } from "@/lib/types/database";

export interface EkskulActionResult {
  success: boolean;
  message: string;
}

export interface EkskulFormInput {
  nama: string;
  icon: string;
  deskripsi: string;
  gambar: string;
  urutan: number;
  aktif: boolean;
  albumId: number | null;
}

function validateEkskulInput(input: EkskulFormInput): string | null {
  if (!input.nama.trim()) return "Nama ekstrakurikuler wajib diisi.";
  if (!input.icon.trim()) return "Icon wajib diisi.";
  return null;
}

function revalidateEkskulPaths() {
  revalidatePath("/admin/ekstrakurikuler");
  revalidatePath("/"); // beranda menampilkan grid ekstrakurikuler
}

export async function createEkskul(input: EkskulFormInput): Promise<EkskulActionResult> {
  const validationError = validateEkskulInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Ekstrakurikuler> = {
    nama: input.nama.trim(),
    icon: input.icon.trim(),
    deskripsi: input.deskripsi.trim() || null,
    gambar: input.gambar || null,
    urutan: input.urutan,
    aktif: input.aktif,
    album_id: input.albumId,
  };

  // Catatan: type assertion `as never` menghindari bug inference pada
  // @supabase/supabase-js@2.108 untuk Database type kustom — lihat catatan
  // detail di lib/actions/kontak.ts.
  const { error } = await supabase.from("ekstrakurikuler").insert([payload] as never);

  if (error) {
    console.error("Gagal menambah ekstrakurikuler:", error.message);
    return { success: false, message: "Gagal menyimpan ekstrakurikuler." };
  }

  revalidateEkskulPaths();
  return { success: true, message: "Ekstrakurikuler berhasil ditambahkan." };
}

export async function updateEkskul(id: number, input: EkskulFormInput): Promise<EkskulActionResult> {
  const validationError = validateEkskulInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Ekstrakurikuler> = {
    nama: input.nama.trim(),
    icon: input.icon.trim(),
    deskripsi: input.deskripsi.trim() || null,
    gambar: input.gambar || null,
    urutan: input.urutan,
    aktif: input.aktif,
    album_id: input.albumId,
  };

  const { error } = await supabase.from("ekstrakurikuler").update(payload as never).eq("id", id);

  if (error) {
    console.error("Gagal memperbarui ekstrakurikuler:", error.message);
    return { success: false, message: "Gagal memperbarui ekstrakurikuler." };
  }

  revalidateEkskulPaths();
  return { success: true, message: "Ekstrakurikuler berhasil diperbarui." };
}

export async function deleteEkskul(id: number): Promise<EkskulActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("ekstrakurikuler").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus ekstrakurikuler:", error.message);
    return { success: false, message: "Gagal menghapus ekstrakurikuler." };
  }

  revalidateEkskulPaths();
  return { success: true, message: "Ekstrakurikuler berhasil dihapus." };
}

/** Toggle aktif/non-aktif cepat dari tabel, tanpa buka form edit */
export async function toggleAktifEkskul(id: number, aktif: boolean): Promise<EkskulActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("ekstrakurikuler").update({ aktif } as never).eq("id", id);

  if (error) {
    console.error("Gagal mengubah status ekstrakurikuler:", error.message);
    return { success: false, message: "Gagal mengubah status." };
  }

  revalidateEkskulPaths();
  return { success: true, message: "Status berhasil diubah." };
}
