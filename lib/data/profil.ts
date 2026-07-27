import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Fasilitas, Foto } from "@/lib/types/database";

export interface FasilitasWithCount extends Fasilitas {
  jml_foto: number;
}

export interface OrgChartItem {
  nama: string;
  jabatan: string | null;
}

export interface ProfilData {
  fasilitasList: FasilitasWithCount[];
  /** Fallback org chart dari tabel gtk, dipakai jika foto_struktur kosong */
  orgChart: OrgChartItem[];
  namaKepsek: string;
  fotoKepsek: string;
}

/**
 * Query data khusus halaman Profil, porting dari profil.php versi lama.
 */
export async function getProfilData(): Promise<ProfilData> {
  const supabase = createServerSupabaseClient();

  const [fasilitasRes, orgRes, kepsekRes] = await Promise.all([
    supabase.from("fasilitas").select("*").eq("aktif", true).order("urutan", { ascending: true }),
    supabase
      .from("gtk")
      .select("nama, jabatan")
      .not("jabatan", "ilike", "%Kepala Sekolah%")
      .order("urutan", { ascending: true })
      .limit(8),
    supabase.from("gtk").select("nama, foto").eq("kategori", "pimpinan").order("urutan", { ascending: true }).limit(1),
  ]);

  const fasilitasRows: Fasilitas[] = fasilitasRes.data ?? [];
  const albumIds = [
    ...new Set(fasilitasRows.map((f) => f.album_id).filter((id): id is number => id !== null)),
  ];

  let fotoCountByAlbum: Record<number, number> = {};
  if (albumIds.length > 0) {
    const fotoRes = await supabase.from("foto").select("album_id").in("album_id", albumIds);
    const fotoRows: Pick<Foto, "album_id">[] = fotoRes.data ?? [];
    fotoCountByAlbum = fotoRows.reduce<Record<number, number>>((acc, f) => {
      acc[f.album_id] = (acc[f.album_id] ?? 0) + 1;
      return acc;
    }, {});
  }

  const fasilitasList: FasilitasWithCount[] = fasilitasRows.map((f) => ({
    ...f,
    jml_foto: f.album_id ? fotoCountByAlbum[f.album_id] ?? 0 : 0,
  }));

  const orgRows: { nama: string; jabatan: string | null }[] = orgRes.data ?? [];
  const orgChart: OrgChartItem[] = orgRows;

  const kepsekRows: { nama: string; foto: string | null }[] = kepsekRes.data ?? [];
  const namaKepsek = kepsekRows[0]?.nama ?? "Kepala Sekolah";
  const fotoKepsek = kepsekRows[0]?.foto ?? "";

  return { fasilitasList, orgChart, namaKepsek, fotoKepsek };
}
