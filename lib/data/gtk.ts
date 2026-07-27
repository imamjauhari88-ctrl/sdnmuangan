import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { GTKMember } from "@/components/gtk/types";
import { cache } from "react";

/**
 * Ambil daftar GTK (Guru & Tenaga Kependidikan) untuk halaman publik /gtk.
 * Setara dengan query lama di gtk.php.
 *
 * Dibungkus `cache()` supaya query hanya dieksekusi sekali per request
 * server, konsisten dengan getPengaturan() di lib/data/pengaturan.ts.
 */
export const getGtkList = cache(async (): Promise<GTKMember[]> => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("gtk")
    .select("*")
    .order("urutan", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data GTK:", error.message);
    return [];
  }

  return data ?? [];
});
