"use server";

import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Album, Foto } from "@/lib/types/database";

export interface GaleriActionResult {
  success: boolean;
  message: string;
  insertedId?: number;
}

function revalidateGaleriPaths(albumId?: number) {
  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  revalidatePath("/"); // beranda menampilkan preview galeri
  if (albumId) {
    revalidatePath(`/admin/galeri/${albumId}`);
  }
}

// ===================== ALBUM =====================

export interface AlbumFormInput {
  namaAlbum: string;
  deskripsi: string;
  cover: string;
  tanggalDibuat: string;
}

function validateAlbumInput(input: AlbumFormInput): string | null {
  if (!input.namaAlbum.trim()) return "Nama album wajib diisi.";
  if (!input.tanggalDibuat) return "Tanggal wajib diisi.";
  return null;
}

export async function createAlbum(input: AlbumFormInput): Promise<GaleriActionResult> {
  const validationError = validateAlbumInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Album> = {
    nama_album: input.namaAlbum.trim(),
    deskripsi: input.deskripsi.trim() || null,
    cover: input.cover || null,
    tanggal_dibuat: input.tanggalDibuat,
  };

  // Catatan: type assertion `as never` menghindari bug inference pada
  // @supabase/supabase-js@2.108 untuk Database type kustom — lihat catatan
  // detail di lib/actions/kontak.ts.
  const { data, error } = await supabase
    .from("album")
    .insert([payload] as never)
    .select("id")
    .single();

  if (error) {
    console.error("Gagal menambah album:", error.message);
    return { success: false, message: "Gagal menyimpan album." };
  }

  revalidateGaleriPaths();
  const insertedId = (data as { id: number } | null)?.id;
  return { success: true, message: "Album berhasil ditambahkan.", insertedId };
}

export async function updateAlbum(id: number, input: AlbumFormInput): Promise<GaleriActionResult> {
  const validationError = validateAlbumInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Album> = {
    nama_album: input.namaAlbum.trim(),
    deskripsi: input.deskripsi.trim() || null,
    cover: input.cover || null,
    tanggal_dibuat: input.tanggalDibuat,
  };

  const { error } = await supabase.from("album").update(payload as never).eq("id", id);

  if (error) {
    console.error("Gagal memperbarui album:", error.message);
    return { success: false, message: "Gagal memperbarui album." };
  }

  revalidateGaleriPaths(id);
  return { success: true, message: "Album berhasil diperbarui." };
}

/**
 * Hapus album. Karena tabel `foto` tidak punya FK CASCADE aktif (lihat
 * komentar di skema SQL: "Foreign Keys (opsional, aktifkan jika
 * diperlukan)"), foto-foto di dalam album dihapus dulu secara manual
 * sebelum album-nya, supaya tidak menyisakan baris foto yang nyantol ke
 * album_id yang sudah tidak ada.
 */
export async function deleteAlbum(id: number): Promise<GaleriActionResult> {
  const supabase = await createAuthServerClient();

  const { error: fotoError } = await supabase.from("foto").delete().eq("album_id", id);
  if (fotoError) {
    console.error("Gagal menghapus foto dalam album:", fotoError.message);
    return { success: false, message: "Gagal menghapus foto dalam album." };
  }

  const { error: albumError } = await supabase.from("album").delete().eq("id", id);
  if (albumError) {
    console.error("Gagal menghapus album:", albumError.message);
    return { success: false, message: "Gagal menghapus album." };
  }

  revalidateGaleriPaths();
  return { success: true, message: "Album dan seluruh fotonya berhasil dihapus." };
}

// ===================== FOTO =====================

export interface TambahFotoInput {
  albumId: number;
  fotoUrls: string[];
  caption?: string;
}

/** Tambah satu atau beberapa foto sekaligus ke dalam album (multi-upload) */
export async function tambahFoto(input: TambahFotoInput): Promise<GaleriActionResult> {
  if (input.fotoUrls.length === 0) {
    return { success: false, message: "Tidak ada foto untuk disimpan." };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Foto>[] = input.fotoUrls.map((url) => ({
    album_id: input.albumId,
    file_foto: url,
    caption: input.caption?.trim() || null,
  }));

  const { error } = await supabase.from("foto").insert(payload as never);

  if (error) {
    console.error("Gagal menambah foto:", error.message);
    return { success: false, message: "Gagal menyimpan foto." };
  }

  revalidateGaleriPaths(input.albumId);
  return {
    success: true,
    message: `${input.fotoUrls.length} foto berhasil ditambahkan.`,
  };
}

export async function updateCaptionFoto(
  fotoId: number,
  albumId: number,
  caption: string
): Promise<GaleriActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase
    .from("foto")
    .update({ caption: caption.trim() || null } as never)
    .eq("id", fotoId);

  if (error) {
    console.error("Gagal memperbarui caption foto:", error.message);
    return { success: false, message: "Gagal memperbarui caption." };
  }

  revalidateGaleriPaths(albumId);
  return { success: true, message: "Caption berhasil diperbarui." };
}

export async function hapusFoto(fotoId: number, albumId: number): Promise<GaleriActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("foto").delete().eq("id", fotoId);

  if (error) {
    console.error("Gagal menghapus foto:", error.message);
    return { success: false, message: "Gagal menghapus foto." };
  }

  revalidateGaleriPaths(albumId);
  return { success: true, message: "Foto berhasil dihapus." };
}
