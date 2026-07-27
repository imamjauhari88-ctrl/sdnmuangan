import { createServerSupabaseClient } from "@/lib/supabase/server";
import { selisihHari } from "@/lib/utils/format";
import type { Berita, Ekstrakurikuler, Foto, HariLibur, Pesan } from "@/lib/types/database";

/**
 * Kumpulan query Supabase untuk halaman Beranda,
 * porting dari blok query di index.php versi lama (poin 1-8).
 */

export interface EkskulWithPreview extends Ekstrakurikuler {
  jml_foto: number;
  foto_preview: { file_foto: string; caption: string | null }[];
}

export interface GaleriPreviewItem {
  id: number;
  foto: string;
  judul: string;
  album: string | null;
}

export interface AgendaItem {
  id: number;
  judul: string;
  tanggal: string;
  lokasi: string | null;
  /** Selisih hari dari hari ini ke tanggal agenda, dihitung sekali di server saat fetch */
  selisihHari: number;
}

export interface FasilitasPreviewItem {
  id: number;
  nama: string;
  icon: string;
  color: string | null;
}

export interface TestimoniItem {
  nama: string;
  kelompok: string | null;
  pesan: string;
  rating: number;
}

export interface BerandaData {
  beritaTerbaru: Berita[];
  pengumumanTerbaru: Berita | null;
  prestasiTerbaru: Berita[];
  ekskulList: EkskulWithPreview[];
  galeriPreview: GaleriPreviewItem[];
  testimoni: TestimoniItem[];
  /** Semua berita kategori berita/pengumuman/prestasi, untuk tab filter (6 per kategori) */
  tabBerita: Record<"semua" | "berita" | "pengumuman" | "prestasi", Berita[]>;
  /** Semua agenda (untuk kalender bulanan), tanpa batas tanggal */
  semuaAgenda: AgendaItem[];
  /** Semua hari libur aktif (untuk kalender bulanan) */
  hariLibur: Pick<HariLibur, "tanggal" | "nama">[];
  /** Nama kepala sekolah, diambil dari tabel gtk kategori 'pimpinan' (bukan dari pengaturan) */
  namaKepsek: string;
  /** Fasilitas aktif untuk preview di beranda (maks 8), link "lihat semua" menuju /profil */
  fasilitasPreview: FasilitasPreviewItem[];
}

export async function getBerandaData(): Promise<BerandaData> {
  const supabase = createServerSupabaseClient();

  // Tahap 1: semua query yang TIDAK saling bergantung dijalankan paralel.
  const [
    beritaRes,
    pengumumanRes,
    prestasiRes,
    ekskulRes,
    galeriRes,
    semuaAgendaRes,
    testiRes,
    hariLiburRes,
    semuaRes,
    beritaTabRes,
    pengumumanTabRes,
    prestasiTabRes,
    kepsekRes,
    fasilitasRes,
  ] = await Promise.all([
    // 2. Berita terbaru (kategori 'berita', limit 5)
    supabase
      .from("berita")
      .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
      .eq("kategori", "berita")
      .order("id", { ascending: false })
      .limit(5),
    // 3. Pengumuman terbaru (limit 1)
    supabase
      .from("berita")
      .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
      .eq("kategori", "pengumuman")
      .order("id", { ascending: false })
      .limit(1),
    // 4. Prestasi terbaru (limit 4, urut tanggal desc — sejajar dengan Galeri)
    supabase
      .from("berita")
      .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
      .eq("kategori", "prestasi")
      .order("tanggal", { ascending: false })
      .limit(4),
    // 5. Ekstrakurikuler aktif
    supabase.from("ekstrakurikuler").select("*").eq("aktif", true).order("urutan", { ascending: true }),
    // 6. Galeri preview (6 foto terbaru — 1 besar + 5 kecil, sejajar dengan Prestasi)
    supabase
      .from("foto")
      .select("id, file_foto, caption, album_id")
      .order("id", { ascending: false })
      .limit(8),
    // Semua agenda (untuk kalender bulanan, tanpa batas tanggal — kalender ini juga
    // menggantikan section "Agenda Mendatang" versi list yang dulu terpisah)
    supabase.from("berita").select("id, judul, tanggal").eq("kategori", "agenda").order("tanggal", { ascending: true }),
    // 8. Testimoni
    supabase
      .from("pesan")
      .select("nama, kelompok, pesan, rating")
      .eq("is_testi", true)
      .eq("status_testi", "approved")
      .order("tanggal", { ascending: false })
      .limit(50),
    // Hari libur aktif
    supabase.from("hari_libur").select("tanggal, nama").eq("aktif", true).order("tanggal", { ascending: true }),
    // Tab filter: semua kategori berita/pengumuman/prestasi + per kategori, limit 6
    supabase
      .from("berita")
      .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
      .in("kategori", ["berita", "pengumuman", "prestasi"])
      .order("id", { ascending: false })
      .limit(6),
    supabase
      .from("berita")
      .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
      .eq("kategori", "berita")
      .order("id", { ascending: false })
      .limit(6),
    supabase
      .from("berita")
      .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
      .eq("kategori", "pengumuman")
      .order("id", { ascending: false })
      .limit(6),
    supabase
      .from("berita")
      .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
      .eq("kategori", "prestasi")
      .order("id", { ascending: false })
      .limit(6),
    // Nama kepala sekolah (kategori 'pimpinan', urutan pertama)
    supabase
      .from("gtk")
      .select("nama")
      .eq("kategori", "pimpinan")
      .order("urutan", { ascending: true })
      .limit(1),
    // Preview fasilitas aktif untuk beranda (maks 4, urut sesuai admin — daftar lengkap ada di /profil)
    supabase
      .from("fasilitas")
      .select("id, nama, icon, color")
      .eq("aktif", true)
      .order("urutan", { ascending: true })
      .limit(4),
  ]);

  const beritaTerbaru: Berita[] = beritaRes.data ?? [];

  const pengumumanRows: Berita[] = pengumumanRes.data ?? [];
  const pengumumanTerbaru: Berita | null = pengumumanRows[0] ?? null;

  const prestasiTerbaru: Berita[] = prestasiRes.data ?? [];

  // Tahap 2: query ekstrakurikuler butuh album_id hasil tahap 1, baru bisa ambil foto terkait.
  const ekskulRows: Ekstrakurikuler[] = ekskulRes.data ?? [];
  const ekskulAlbumIds = [
    ...new Set(ekskulRows.map((ek) => ek.album_id).filter((id): id is number => id !== null)),
  ];

  const fotoByAlbumId: Record<number, Pick<Foto, "file_foto" | "caption">[]> = {};
  if (ekskulAlbumIds.length > 0) {
    const fotoEkskulRes = await supabase
      .from("foto")
      .select("album_id, file_foto, caption")
      .in("album_id", ekskulAlbumIds)
      .order("id", { ascending: false });
    const fotoRows: Pick<Foto, "album_id" | "file_foto" | "caption">[] = fotoEkskulRes.data ?? [];

    for (const f of fotoRows) {
      (fotoByAlbumId[f.album_id] ??= []).push({ file_foto: f.file_foto, caption: f.caption });
    }
  }

  const ekskulList: EkskulWithPreview[] = ekskulRows.map((ek) => {
    const semuaFotoAlbum = ek.album_id ? fotoByAlbumId[ek.album_id] ?? [] : [];
    return {
      ...ek,
      jml_foto: semuaFotoAlbum.length,
      foto_preview: semuaFotoAlbum.slice(0, 4),
    };
  });

  // Galeri preview: butuh nama album hasil query foto di tahap 1
  const galeriRows: Pick<Foto, "id" | "file_foto" | "caption" | "album_id">[] = galeriRes.data ?? [];
  const galeriAlbumIds = [...new Set(galeriRows.map((g) => g.album_id))];
  let albumNameMap: Record<number, string> = {};
  if (galeriAlbumIds.length > 0) {
    const albumRes = await supabase.from("album").select("id, nama_album").in("id", galeriAlbumIds);
    const albumRows: { id: number; nama_album: string }[] = albumRes.data ?? [];
    albumNameMap = Object.fromEntries(albumRows.map((a) => [a.id, a.nama_album]));
  }

  const galeriPreview: GaleriPreviewItem[] = galeriRows.map((g) => ({
    id: g.id,
    foto: g.file_foto,
    judul: g.caption || albumNameMap[g.album_id] || "Foto Kegiatan",
    album: albumNameMap[g.album_id] ?? null,
  }));

  const semuaAgendaRows: { id: number; judul: string | null; tanggal: string | null }[] =
    semuaAgendaRes.data ?? [];
  const semuaAgenda: AgendaItem[] = semuaAgendaRows.map((a) => ({
    id: a.id,
    judul: a.judul ?? "",
    tanggal: a.tanggal ?? "",
    lokasi: null,
    selisihHari: a.tanggal ? selisihHari(a.tanggal) : 0,
  }));

  const testiRows: Pick<Pesan, "nama" | "kelompok" | "pesan" | "rating">[] = testiRes.data ?? [];
  const testimoni: TestimoniItem[] = testiRows
    .filter((t): t is { nama: string; kelompok: string | null; pesan: string; rating: number | null } =>
      Boolean(t.nama && t.pesan)
    )
    .map((t) => ({
      nama: t.nama!,
      kelompok: t.kelompok,
      pesan: t.pesan!,
      rating: t.rating ?? 5,
    }));

  const hariLibur: Pick<HariLibur, "tanggal" | "nama">[] = hariLiburRes.data ?? [];

  const kepsekRows: { nama: string }[] = kepsekRes.data ?? [];
  const namaKepsek = kepsekRows[0]?.nama ?? "";

  const tabBerita: BerandaData["tabBerita"] = {
    semua: semuaRes.data ?? [],
    berita: beritaTabRes.data ?? [],
    pengumuman: pengumumanTabRes.data ?? [],
    prestasi: prestasiTabRes.data ?? [],
  };

  const fasilitasPreview: FasilitasPreviewItem[] = fasilitasRes.data ?? [];

  return {
    beritaTerbaru,
    pengumumanTerbaru,
    prestasiTerbaru,
    ekskulList,
    galeriPreview,
    testimoni,
    tabBerita,
    semuaAgenda,
    hariLibur,
    namaKepsek,
    fasilitasPreview,
  };
}
