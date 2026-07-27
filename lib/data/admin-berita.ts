import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Berita, BeritaKategori } from "@/lib/types/database";

export const ADMIN_PER_PAGE = 10;

export type AdminKategoriFilter = "semua" | BeritaKategori;

const ALLOWED_KATEGORI: AdminKategoriFilter[] = ["semua", "berita", "pengumuman", "agenda", "prestasi"];

export function normalizeAdminKategori(value: string | undefined): AdminKategoriFilter {
  const v = (value ?? "").toLowerCase();
  return ALLOWED_KATEGORI.includes(v as AdminKategoriFilter) ? (v as AdminKategoriFilter) : "semua";
}

export interface AdminBeritaListResult {
  items: Berita[];
  totalRows: number;
  totalPages: number;
  page: number;
}

export interface AdminBeritaListParams {
  cari?: string;
  kategori?: string;
  page?: number;
}

/**
 * Query daftar berita untuk admin: tanpa featured/teaser seperti versi
 * publik, tapi dengan search + filter kategori + pagination yang sama
 * (server-side, konsisten dengan pola di lib/data/berita.ts).
 */
export async function getAdminBeritaList(params: AdminBeritaListParams): Promise<AdminBeritaListResult> {
  const supabase = await createAuthServerClient();
  const cari = (params.cari ?? "").trim();
  const kategori = normalizeAdminKategori(params.kategori);
  const requestedPage = Math.max(1, params.page ?? 1);

  let countQuery = supabase.from("berita").select("id", { count: "exact", head: true });
  let dataQuery = supabase
    .from("berita")
    .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara");

  if (cari !== "") {
    countQuery = countQuery.ilike("judul", `%${cari}%`);
    dataQuery = dataQuery.ilike("judul", `%${cari}%`);
  }
  if (kategori !== "semua") {
    countQuery = countQuery.eq("kategori", kategori);
    dataQuery = dataQuery.eq("kategori", kategori);
  }

  const countRes = await countQuery;
  const totalRows = countRes.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / ADMIN_PER_PAGE));
  const page = Math.min(requestedPage, totalPages);
  const offset = (page - 1) * ADMIN_PER_PAGE;

  const dataRes = await dataQuery
    .order("id", { ascending: false })
    .range(offset, offset + ADMIN_PER_PAGE - 1);

  const items: Berita[] = dataRes.data ?? [];

  return { items, totalRows, totalPages, page };
}

/** Ambil 1 berita by id, untuk halaman edit */
export async function getAdminBeritaById(id: number): Promise<Berita | null> {
  const supabase = await createAuthServerClient();

  const res = await supabase
    .from("berita")
    .select("id, judul, isi, tanggal, gambar, kategori, tingkat, peraih, juara")
    .eq("id", id)
    .limit(1);

  const rows: Berita[] = res.data ?? [];
  return rows[0] ?? null;
}
