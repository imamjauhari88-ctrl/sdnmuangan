import { createAuthServerClient } from "@/lib/supabase/auth-server";

export interface DashboardStats {
  totalBerita: number;
  totalGtk: number;
  totalGaleriAlbum: number;
  totalPendaftarBaru: number;
  totalPesanBelumDibaca: number;
  totalTestimoniPending: number;
  pendaftarTerbaru: { id: number; nama: string | null; no_daftar: string | null; status: string | null }[];
  pesanTerbaru: { id: number; nama: string | null; subjek: string | null; tanggal: string | null }[];
}

/**
 * Query ringkasan untuk dashboard admin. Memakai createAuthServerClient
 * (bukan client publik anon) karena halaman ini hanya bisa diakses
 * setelah login — query di sini boleh mengambil data yang tidak
 * seharusnya terbuka untuk publik (misal status_testi='pending').
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createAuthServerClient();

  const [
    beritaCountRes,
    gtkCountRes,
    albumCountRes,
    pendaftarBaruRes,
    pesanBelumDibacaRes,
    testimoniPendingRes,
    pendaftarTerbaruRes,
    pesanTerbaruRes,
  ] = await Promise.all([
    supabase.from("berita").select("id", { count: "exact", head: true }),
    supabase.from("gtk").select("id", { count: "exact", head: true }),
    supabase.from("album").select("id", { count: "exact", head: true }),
    supabase.from("pendaftar").select("id", { count: "exact", head: true }).eq("status", "Menunggu"),
    supabase.from("pesan").select("id", { count: "exact", head: true }).eq("status", "belum_dibaca"),
    supabase.from("pesan").select("id", { count: "exact", head: true }).eq("status_testi", "pending"),
    supabase
      .from("pendaftar")
      .select("id, nama, no_daftar, status")
      .order("tanggal_daftar", { ascending: false })
      .limit(5),
    supabase
      .from("pesan")
      .select("id, nama, subjek, tanggal")
      .order("tanggal", { ascending: false })
      .limit(5),
  ]);

  return {
    totalBerita: beritaCountRes.count ?? 0,
    totalGtk: gtkCountRes.count ?? 0,
    totalGaleriAlbum: albumCountRes.count ?? 0,
    totalPendaftarBaru: pendaftarBaruRes.count ?? 0,
    totalPesanBelumDibaca: pesanBelumDibacaRes.count ?? 0,
    totalTestimoniPending: testimoniPendingRes.count ?? 0,
    pendaftarTerbaru: pendaftarTerbaruRes.data ?? [],
    pesanTerbaru: pesanTerbaruRes.data ?? [],
  };
}
