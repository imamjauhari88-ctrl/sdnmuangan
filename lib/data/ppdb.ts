import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { TahunAjaran } from "@/lib/types/database";

export interface TahunAjaranAktif extends TahunAjaran {
  jml_pendaftar: number;
}

/**
 * Ambil tahun ajaran dengan status 'Buka' beserta jumlah pendaftar saat ini
 * (untuk cek kuota), porting dari query di ppdb/index.php versi lama.
 */
export async function getTahunAjaranAktif(): Promise<TahunAjaranAktif | null> {
  const supabase = createServerSupabaseClient();

  const tahunRes = await supabase
    .from("tahun_ajaran")
    .select("*")
    .eq("status", "Buka")
    .limit(1);
  const tahunRows: TahunAjaran[] = tahunRes.data ?? [];
  const tahun = tahunRows[0];

  if (!tahun) return null;

  const countRes = await supabase
    .from("pendaftar")
    .select("id", { count: "exact", head: true })
    .eq("tahun_id", tahun.id);

  return { ...tahun, jml_pendaftar: countRes.count ?? 0 };
}

export interface StatusPendaftarResult {
  nama: string;
  no_daftar: string;
  status: string;
  tanggal_daftar: string | null;
}

/** Cek status pendaftaran berdasarkan NIK, porting dari ppdb/cek-status.php */
export async function getStatusPendaftarByNik(nik: string): Promise<StatusPendaftarResult | null> {
  const supabase = createServerSupabaseClient();

  const res = await supabase
    .from("pendaftar")
    .select("nama, no_daftar, status, tanggal_daftar")
    .eq("nik", nik)
    .order("tanggal_daftar", { ascending: false })
    .limit(1);

  const rows: StatusPendaftarResult[] = (res.data ?? []) as StatusPendaftarResult[];
  return rows[0] ?? null;
}
