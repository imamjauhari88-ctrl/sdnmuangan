"use server";

import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Berita, BeritaKategori } from "@/lib/types/database";

export interface BeritaActionResult {
  success: boolean;
  message: string;
}

export interface BeritaFormInput {
  judul: string;
  isi: string;
  tanggal: string;
  gambar: string;
  kategori: BeritaKategori;
  tingkat: string;
  peraih: string;
  juara: string;
}

function validateBeritaInput(input: BeritaFormInput): string | null {
  if (!input.judul.trim()) return "Judul wajib diisi.";
  if (!input.isi.trim()) return "Isi berita wajib diisi.";
  if (!input.tanggal) return "Tanggal wajib diisi.";
  if (!input.kategori) return "Kategori wajib dipilih.";
  return null;
}

/** Setelah create/update/delete, segarkan ulang cache halaman publik & admin yang terdampak */
function revalidateBeritaPaths() {
  revalidatePath("/admin/berita");
  revalidatePath("/berita");
  revalidatePath("/"); // beranda menampilkan berita terbaru & tab filter
}

export async function createBerita(input: BeritaFormInput): Promise<BeritaActionResult> {
  const validationError = validateBeritaInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Berita> = {
    judul: input.judul.trim(),
    isi: input.isi.trim(),
    tanggal: input.tanggal,
    gambar: input.gambar || null,
    kategori: input.kategori,
    tingkat: input.tingkat.trim() || null,
    peraih: input.peraih.trim() || null,
    juara: input.juara.trim() || null,
  };

  // Catatan: type assertion `as never` menghindari bug inference pada
  // @supabase/supabase-js@2.108 untuk Database type kustom — lihat catatan
  // detail di lib/actions/kontak.ts. Payload sudah divalidasi sesuai
  // Partial<Berita> oleh TypeScript pada baris di atas.
  const { error } = await supabase.from("berita").insert([payload] as never);

  if (error) {
    console.error("Gagal menambah berita:", error.message);
    return { success: false, message: "Gagal menyimpan berita ke database." };
  }

  revalidateBeritaPaths();
  return { success: true, message: "Berita berhasil ditambahkan." };
}

export async function updateBerita(id: number, input: BeritaFormInput): Promise<BeritaActionResult> {
  const validationError = validateBeritaInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Berita> = {
    judul: input.judul.trim(),
    isi: input.isi.trim(),
    tanggal: input.tanggal,
    gambar: input.gambar || null,
    kategori: input.kategori,
    tingkat: input.tingkat.trim() || null,
    peraih: input.peraih.trim() || null,
    juara: input.juara.trim() || null,
  };

  const { error } = await supabase.from("berita").update(payload as never).eq("id", id);

  if (error) {
    console.error("Gagal memperbarui berita:", error.message);
    return { success: false, message: "Gagal memperbarui berita." };
  }

  revalidateBeritaPaths();
  revalidatePath(`/berita/${id}`);
  return { success: true, message: "Berita berhasil diperbarui." };
}

export async function deleteBerita(id: number): Promise<BeritaActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("berita").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus berita:", error.message);
    return { success: false, message: "Gagal menghapus berita." };
  }

  revalidateBeritaPaths();
  return { success: true, message: "Berita berhasil dihapus." };
}
