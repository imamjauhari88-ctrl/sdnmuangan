"use server";

import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Fasilitas } from "@/lib/types/database";

export interface FasilitasActionResult {
  success: boolean;
  message: string;
}

export interface FasilitasFormInput {
  nama: string;
  icon: string;
  deskripsi: string;
  gambar: string;
  color: string;
  urutan: number;
  aktif: boolean;
  albumId: number | null;
}

function validateFasilitasInput(input: FasilitasFormInput): string | null {
  if (!input.nama.trim()) return "Nama fasilitas wajib diisi.";
  if (!input.icon.trim()) return "Icon wajib diisi.";
  return null;
}

function revalidateFasilitasPaths() {
  revalidatePath("/admin/fasilitas");
  revalidatePath("/profil");
}

export async function createFasilitas(input: FasilitasFormInput): Promise<FasilitasActionResult> {
  const validationError = validateFasilitasInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Fasilitas> = {
    nama: input.nama.trim(),
    icon: input.icon.trim(),
    deskripsi: input.deskripsi.trim() || null,
    gambar: input.gambar || null,
    color: input.color,
    urutan: input.urutan,
    aktif: input.aktif,
    album_id: input.albumId,
  };

  // Catatan: type assertion `as never` menghindari bug inference pada
  // @supabase/supabase-js@2.108 untuk Database type kustom — lihat catatan
  // detail di lib/actions/kontak.ts.
  const { error } = await supabase.from("fasilitas").insert([payload] as never);

  if (error) {
    console.error("Gagal menambah fasilitas:", error.message);
    return { success: false, message: "Gagal menyimpan fasilitas." };
  }

  revalidateFasilitasPaths();
  return { success: true, message: "Fasilitas berhasil ditambahkan." };
}

export async function updateFasilitas(
  id: number,
  input: FasilitasFormInput
): Promise<FasilitasActionResult> {
  const validationError = validateFasilitasInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Fasilitas> = {
    nama: input.nama.trim(),
    icon: input.icon.trim(),
    deskripsi: input.deskripsi.trim() || null,
    gambar: input.gambar || null,
    color: input.color,
    urutan: input.urutan,
    aktif: input.aktif,
    album_id: input.albumId,
  };

  const { error } = await supabase.from("fasilitas").update(payload as never).eq("id", id);

  if (error) {
    console.error("Gagal memperbarui fasilitas:", error.message);
    return { success: false, message: "Gagal memperbarui fasilitas." };
  }

  revalidateFasilitasPaths();
  return { success: true, message: "Fasilitas berhasil diperbarui." };
}

export async function deleteFasilitas(id: number): Promise<FasilitasActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("fasilitas").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus fasilitas:", error.message);
    return { success: false, message: "Gagal menghapus fasilitas." };
  }

  revalidateFasilitasPaths();
  return { success: true, message: "Fasilitas berhasil dihapus." };
}

/** Toggle aktif/non-aktif cepat dari tabel, tanpa buka form edit */
export async function toggleAktifFasilitas(id: number, aktif: boolean): Promise<FasilitasActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("fasilitas").update({ aktif } as never).eq("id", id);

  if (error) {
    console.error("Gagal mengubah status fasilitas:", error.message);
    return { success: false, message: "Gagal mengubah status." };
  }

  revalidateFasilitasPaths();
  return { success: true, message: "Status berhasil diubah." };
}
