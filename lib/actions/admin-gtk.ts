"use server";

import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Gtk, GtkBerkasItem } from "@/lib/types/database";

export interface GtkActionResult {
  success: boolean;
  message: string;
}

export interface GtkFormInput {
  nama: string;
  jabatan: string;
  kategori: string;
  pendidikan: string;
  foto: string;
  warna: string;
  urutan: number;
  wa: string;
  berkas: GtkBerkasItem[];
}

function validateGtkInput(input: GtkFormInput): string | null {
  if (!input.nama.trim()) return "Nama wajib diisi.";
  if (!input.jabatan.trim()) return "Jabatan wajib diisi.";
  return null;
}

/** Buang baris berkas yang label/url-nya kosong, sama seperti proses PHP lama */
function cleanBerkas(berkas: GtkBerkasItem[]): GtkBerkasItem[] {
  return berkas
    .map((b) => ({ label: b.label.trim(), url: b.url.trim() }))
    .filter((b) => b.label !== "" && b.url !== "");
}

function revalidateGtkPaths() {
  revalidatePath("/admin/gtk");
  revalidatePath("/admin/dashboard");
  revalidatePath("/profil");
  revalidatePath("/");
}

export async function createGtk(input: GtkFormInput): Promise<GtkActionResult> {
  const validationError = validateGtkInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Gtk> = {
    nama: input.nama.trim(),
    jabatan: input.jabatan.trim(),
    kategori: input.kategori,
    pendidikan: input.pendidikan.trim() || null,
    foto: input.foto || null,
    warna: input.warna,
    urutan: input.urutan,
    wa: input.wa.trim() || null,
    berkas: cleanBerkas(input.berkas),
  };

  // Catatan: type assertion `as never` menghindari bug inference pada
  // @supabase/supabase-js@2.108 untuk Database type kustom — lihat catatan
  // detail di lib/actions/kontak.ts.
  const { error } = await supabase.from("gtk").insert([payload] as never);

  if (error) {
    console.error("Gagal menambah GTK:", error.message);
    return { success: false, message: "Gagal menyimpan data personel." };
  }

  revalidateGtkPaths();
  return { success: true, message: "Personel berhasil ditambahkan." };
}

export async function updateGtk(id: number, input: GtkFormInput): Promise<GtkActionResult> {
  const validationError = validateGtkInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<Gtk> = {
    nama: input.nama.trim(),
    jabatan: input.jabatan.trim(),
    kategori: input.kategori,
    pendidikan: input.pendidikan.trim() || null,
    foto: input.foto || null,
    warna: input.warna,
    urutan: input.urutan,
    wa: input.wa.trim() || null,
    berkas: cleanBerkas(input.berkas),
  };

  const { error } = await supabase.from("gtk").update(payload as never).eq("id", id);

  if (error) {
    console.error("Gagal memperbarui GTK:", error.message);
    return { success: false, message: "Gagal memperbarui data personel." };
  }

  revalidateGtkPaths();
  return { success: true, message: "Data personel berhasil diperbarui." };
}

export async function deleteGtk(id: number): Promise<GtkActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("gtk").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus GTK:", error.message);
    return { success: false, message: "Gagal menghapus data personel." };
  }

  revalidateGtkPaths();
  return { success: true, message: "Personel berhasil dihapus." };
}
