import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Pendaftar, PendaftarStatus, TahunAjaran } from "@/lib/types/database";

export const ADMIN_PENDAFTAR_PER_PAGE = 15;

export type StatusFilter = "semua" | PendaftarStatus;

const ALLOWED_STATUS: StatusFilter[] = ["semua", "Menunggu", "Diterima", "Cadangan", "Ditolak"];

export function normalizeStatusFilter(value: string | undefined): StatusFilter {
  const v = value ?? "";
  return ALLOWED_STATUS.includes(v as StatusFilter) ? (v as StatusFilter) : "semua";
}

export interface AdminPendaftarListResult {
  items: Pendaftar[];
  totalRows: number;
  totalPages: number;
  page: number;
  statusCounts: Record<StatusFilter, number>;
}

export interface AdminPendaftarListParams {
  cari?: string;
  status?: string;
  tahunId?: number;
  page?: number;
}

/**
 * Query daftar pendaftar PPDB untuk admin: search (nama/NIK/no_daftar) +
 * filter status + filter tahun ajaran + pagination, server-side, konsisten
 * dengan pola di modul Berita.
 */
export async function getAdminPendaftarList(
  params: AdminPendaftarListParams
): Promise<AdminPendaftarListResult> {
  const supabase = await createAuthServerClient();
  const cari = (params.cari ?? "").trim();
  const status = normalizeStatusFilter(params.status);
  const requestedPage = Math.max(1, params.page ?? 1);

  // Hitung jumlah per status (untuk badge tab) — mengikuti filter tahun ajaran
  // jika ada, tapi TIDAK mengikuti filter status itu sendiri (supaya semua
  // angka count tetap muncul lengkap walau salah satu tab sedang aktif).
  let countAllQuery = supabase.from("pendaftar").select("status");
  if (params.tahunId) {
    countAllQuery = countAllQuery.eq("tahun_id", params.tahunId);
  }
  const countAllRes = await countAllQuery;
  const countAllRows: { status: PendaftarStatus | null }[] = countAllRes.data ?? [];

  const statusCounts: Record<StatusFilter, number> = {
    semua: countAllRows.length,
    Menunggu: 0,
    Diterima: 0,
    Cadangan: 0,
    Ditolak: 0,
  };
  for (const row of countAllRows) {
    if (row.status) {
      statusCounts[row.status] = (statusCounts[row.status] ?? 0) + 1;
    }
  }

  let countQuery = supabase.from("pendaftar").select("id", { count: "exact", head: true });
  let dataQuery = supabase
    .from("pendaftar")
    .select("id, tahun_id, no_daftar, nik, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, ayah, ibu, hp, kk, akta, foto, status, tanggal_daftar");

  if (cari !== "") {
    // Cari di nama ATAU no_daftar ATAU NIK — pakai or() filter Supabase
    const orFilter = `nama.ilike.%${cari}%,no_daftar.ilike.%${cari}%,nik.ilike.%${cari}%`;
    countQuery = countQuery.or(orFilter);
    dataQuery = dataQuery.or(orFilter);
  }
  if (status !== "semua") {
    countQuery = countQuery.eq("status", status);
    dataQuery = dataQuery.eq("status", status);
  }
  if (params.tahunId) {
    countQuery = countQuery.eq("tahun_id", params.tahunId);
    dataQuery = dataQuery.eq("tahun_id", params.tahunId);
  }

  const countRes = await countQuery;
  const totalRows = countRes.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / ADMIN_PENDAFTAR_PER_PAGE));
  const page = Math.min(requestedPage, totalPages);
  const offset = (page - 1) * ADMIN_PENDAFTAR_PER_PAGE;

  const dataRes = await dataQuery
    .order("tanggal_daftar", { ascending: false })
    .range(offset, offset + ADMIN_PENDAFTAR_PER_PAGE - 1);

  const items: Pendaftar[] = dataRes.data ?? [];

  return { items, totalRows, totalPages, page, statusCounts };
}

/** Ambil 1 pendaftar by id, untuk halaman detail */
export async function getAdminPendaftarById(id: number): Promise<Pendaftar | null> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("pendaftar").select("*").eq("id", id).limit(1);
  const rows: Pendaftar[] = res.data ?? [];
  return rows[0] ?? null;
}

// ===================== TAHUN AJARAN =====================

export interface AdminTahunAjaranWithCount extends TahunAjaran {
  jml_pendaftar: number;
}

/** Daftar semua tahun ajaran + jumlah pendaftar masing-masing */
export async function getAdminTahunAjaranList(): Promise<AdminTahunAjaranWithCount[]> {
  const supabase = await createAuthServerClient();

  const [tahunRes, pendaftarRes] = await Promise.all([
    supabase.from("tahun_ajaran").select("*").order("id", { ascending: false }),
    supabase.from("pendaftar").select("tahun_id"),
  ]);

  const tahunRows: TahunAjaran[] = tahunRes.data ?? [];
  const pendaftarRows: { tahun_id: number | null }[] = pendaftarRes.data ?? [];

  const countByTahun = pendaftarRows.reduce<Record<number, number>>((acc, p) => {
    if (p.tahun_id) acc[p.tahun_id] = (acc[p.tahun_id] ?? 0) + 1;
    return acc;
  }, {});

  return tahunRows.map((t) => ({ ...t, jml_pendaftar: countByTahun[t.id] ?? 0 }));
}

/** Ambil 1 tahun ajaran by id, untuk halaman edit */
export async function getAdminTahunAjaranById(id: number): Promise<TahunAjaran | null> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("tahun_ajaran").select("*").eq("id", id).limit(1);
  const rows: TahunAjaran[] = res.data ?? [];
  return rows[0] ?? null;
}
