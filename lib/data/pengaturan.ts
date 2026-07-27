import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { PengaturanMap } from "@/lib/types/database";
import { cache } from "react";

/**
 * Setara dengan query lama di header.php / footer.php / index.php:
 *
 *   SELECT kunci, nilai FROM pengaturan
 *   $pengaturan[$row['kunci']] = $row['nilai'];
 *
 * Dipakai di banyak halaman (header, footer, beranda, profil, dll),
 * jadi diletakkan di satu tempat agar konsisten.
 *
 * Dibungkus dengan React `cache()` supaya dalam satu request server
 * yang sama, query ini hanya dieksekusi sekali walau dipanggil dari
 * banyak komponen (layout, halaman, dst).
 */
export const getPengaturan = cache(async (): Promise<PengaturanMap> => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("pengaturan")
    .select("kunci, nilai");

  if (error) {
    console.error("Gagal mengambil data pengaturan:", error.message);
    return {};
  }

  const rows: { kunci: string | null; nilai: string | null }[] = data ?? [];

  const map: PengaturanMap = {};
  for (const row of rows) {
    if (row.kunci) {
      map[row.kunci] = row.nilai ?? "";
    }
  }

  return map;
});

/**
 * Helper kecil untuk membaca satu nilai pengaturan dengan fallback,
 * setara `$pengaturan['kunci'] ?? 'fallback'` di PHP lama.
 */
export function pengaturanValue(
    map: PengaturanMap,
    kunci: string,
    fallback = ""
): string {
    return map && map[kunci] && map[kunci].length > 0 ? map[kunci] : fallback;
}
