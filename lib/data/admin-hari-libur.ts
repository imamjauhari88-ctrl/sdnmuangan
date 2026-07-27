import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { HariLibur } from "@/lib/types/database";

export type TahunFilter = number | "semua";

/**
 * Daftar hari libur, opsional difilter per tahun (berdasarkan kolom
 * `tanggal`). Urut tanggal ascending supaya admin melihat kronologis,
 * sama seperti tampilan kalender publik.
 */
export async function getAdminHariLiburList(tahun: TahunFilter): Promise<HariLibur[]> {
  const supabase = await createAuthServerClient();

  let query = supabase.from("hari_libur").select("*").order("tanggal", { ascending: true });

  if (tahun !== "semua") {
    query = query.gte("tanggal", `${tahun}-01-01`).lte("tanggal", `${tahun}-12-31`);
  }

  const res = await query;
  return res.data ?? [];
}

/** Daftar tahun unik yang punya data hari libur, untuk dropdown filter tahun */
export async function getAvailableYears(): Promise<number[]> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("hari_libur").select("tanggal");
  const rows: Pick<HariLibur, "tanggal">[] = res.data ?? [];

  const years = new Set<number>();
  for (const row of rows) {
    years.add(new Date(row.tanggal).getFullYear());
  }
  years.add(new Date().getFullYear()); // selalu sediakan tahun ini, walau belum ada data

  return [...years].sort((a, b) => b - a);
}

/** Ambil 1 hari libur by id, untuk halaman edit */
export async function getAdminHariLiburById(id: number): Promise<HariLibur | null> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("hari_libur").select("*").eq("id", id).limit(1);
  const rows: HariLibur[] = res.data ?? [];
  return rows[0] ?? null;
}
