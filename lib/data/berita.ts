import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Berita, BeritaKategori, HariLibur } from "@/lib/types/database";

export const PER_PAGE = 9;

export type KategoriFilter = "semua" | BeritaKategori;

const ALLOWED_KATEGORI: KategoriFilter[] = ["semua", "berita", "pengumuman", "agenda", "prestasi"];

export function normalizeKategori(value: string | undefined): KategoriFilter {
  const v = (value ?? "").toLowerCase();
  return ALLOWED_KATEGORI.includes(v as KategoriFilter) ? (v as KategoriFilter) : "semua";
}

export interface BeritaListResult {
  /** Berita unggulan (hanya tampil di page 1 tanpa filter/search) */
  featured: Berita | null;
  /** Daftar berita untuk grid (featured sudah dikecualikan) */
  items: Berita[];
  totalRows: number;
  totalPages: number;
  page: number;
  /** Jumlah berita per kategori (untuk badge count di tab filter), dihitung dari total data */
  kategoriCounts: Record<KategoriFilter, number>;
}

export interface BeritaListParams {
  cari?: string;
  kategori?: string;
  page?: number;
}

/**
 * Query daftar berita dengan search + filter kategori + pagination,
 * semuanya dieksekusi di server (Supabase), porting dari berita.php
 * versi lama — namun search & filter dipindah dari client-side
 * (yang sebelumnya hanya berlaku per-halaman) menjadi server-side
 * agar hasilnya konsisten di seluruh data.
 */
export async function getBeritaList(params: BeritaListParams): Promise<BeritaListResult> {
  const supabase = createServerSupabaseClient();
  const cari = (params.cari ?? "").trim();
  const kategori = normalizeKategori(params.kategori);
  const requestedPage = Math.max(1, params.page ?? 1);

  // Hitung jumlah per kategori (untuk badge tab), dari seluruh tabel tanpa filter
  const countAllRes = await supabase.from("berita").select("kategori");
  const countAllRows: { kategori: BeritaKategori }[] = countAllRes.data ?? [];
  const kategoriCounts: Record<KategoriFilter, number> = {
    semua: countAllRows.length,
    berita: 0,
    pengumuman: 0,
    agenda: 0,
    prestasi: 0,
  };
  for (const row of countAllRows) {
    kategoriCounts[row.kategori] = (kategoriCounts[row.kategori] ?? 0) + 1;
  }

  // Bangun query dengan filter search + kategori
  let countQuery = supabase.from("berita").select("id", { count: "exact", head: true });
  let dataQueryBase = supabase
    .from("berita")
    .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara");

  if (cari !== "") {
    countQuery = countQuery.ilike("judul", `%${cari}%`);
    dataQueryBase = dataQueryBase.ilike("judul", `%${cari}%`);
  }
  if (kategori !== "semua") {
    countQuery = countQuery.eq("kategori", kategori);
    dataQueryBase = dataQueryBase.eq("kategori", kategori);
  }

  const countRes = await countQuery;
  const totalRows = countRes.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / PER_PAGE));
  const page = Math.min(requestedPage, totalPages);
  const offset = (page - 1) * PER_PAGE;

  const dataRes = await dataQueryBase
    .order("tanggal", { ascending: false })
    .range(offset, offset + PER_PAGE - 1);
  const dataRows: Berita[] = dataRes.data ?? [];

  // Featured: hanya di page 1 tanpa search/filter, berita terbaru
  let featured: Berita | null = null;
  if (page === 1 && cari === "" && kategori === "semua") {
    const featRes = await supabase
      .from("berita")
      .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
      .order("tanggal", { ascending: false })
      .limit(1);
    const featRows: Berita[] = featRes.data ?? [];
    featured = featRows[0] ?? null;
  }

  const items = featured ? dataRows.filter((b) => b.id !== featured!.id) : dataRows;

  return { featured, items, totalRows, totalPages, page, kategoriCounts };
}

export interface AgendaKalenderItem {
  id: number;
  judul: string;
  tanggal: string;
}

/** Data agenda + hari libur untuk kalender yang muncul saat tab "Agenda" dipilih */
export async function getAgendaKalenderData(): Promise<{
  agenda: AgendaKalenderItem[];
  hariLibur: Pick<HariLibur, "tanggal" | "nama">[];
}> {
  const supabase = createServerSupabaseClient();

  const [agendaRes, hariLiburRes] = await Promise.all([
    supabase.from("berita").select("id, judul, tanggal").eq("kategori", "agenda").order("tanggal", { ascending: true }),
    supabase.from("hari_libur").select("tanggal, nama").eq("aktif", true).order("tanggal", { ascending: true }),
  ]);

  const agendaRows: { id: number; judul: string | null; tanggal: string | null }[] = agendaRes.data ?? [];
  const agenda: AgendaKalenderItem[] = agendaRows
    .filter((a): a is { id: number; judul: string; tanggal: string } => Boolean(a.judul && a.tanggal))
    .map((a) => ({ id: a.id, judul: a.judul, tanggal: a.tanggal }));

  const hariLibur: Pick<HariLibur, "tanggal" | "nama">[] = hariLiburRes.data ?? [];

  return { agenda, hariLibur };
}

/** Untuk detail berita: ambil 1 berita by id + 5 berita lain untuk sidebar "Terbaru" */
export async function getBeritaDetail(id: number): Promise<{
  berita: Berita | null;
  lainnya: Berita[];
}> {
  const supabase = createServerSupabaseClient();

  const [beritaRes, lainnyaRes] = await Promise.all([
    supabase
      .from("berita")
      .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
      .eq("id", id)
      .limit(1),
    supabase
      .from("berita")
      .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
      .neq("id", id)
      .order("tanggal", { ascending: false })
      .limit(5),
  ]);

  const beritaRows: Berita[] = beritaRes.data ?? [];
  const lainnya: Berita[] = lainnyaRes.data ?? [];

  return { berita: beritaRows[0] ?? null, lainnya };
}
