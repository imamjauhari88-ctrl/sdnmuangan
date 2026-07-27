import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Pesan, PesanStatusTesti } from "@/lib/types/database";

export const ADMIN_PESAN_PER_PAGE = 15;

export type PesanTabFilter = "semua" | "testimoni" | "pending";

export function normalizePesanTab(value: string | undefined): PesanTabFilter {
  if (value === "testimoni" || value === "pending") return value;
  return "semua";
}

export interface AdminPesanListResult {
  items: Pesan[];
  totalRows: number;
  totalPages: number;
  page: number;
  jmlBelumDibaca: number;
  jmlTestimoniPending: number;
}

export interface AdminPesanListParams {
  tab?: string;
  page?: number;
}

/**
 * Query daftar pesan untuk admin. Tab "semua" menampilkan seluruh pesan
 * (testimoni maupun bukan), tab "testimoni" hanya yang is_testi=true,
 * tab "pending" khusus testimoni yang status_testi='pending' (perlu
 * ditinjau admin sebelum tampil di halaman publik).
 */
export async function getAdminPesanList(params: AdminPesanListParams): Promise<AdminPesanListResult> {
  const supabase = await createAuthServerClient();
  const tab = normalizePesanTab(params.tab);
  const requestedPage = Math.max(1, params.page ?? 1);

  let countQuery = supabase.from("pesan").select("id", { count: "exact", head: true });
  let dataQuery = supabase
    .from("pesan")
    .select("id, nama, email, kelompok, subjek, pesan, is_testi, status_testi, rating, tanggal, status");

  if (tab === "testimoni") {
    countQuery = countQuery.eq("is_testi", true);
    dataQuery = dataQuery.eq("is_testi", true);
  } else if (tab === "pending") {
    countQuery = countQuery.eq("status_testi", "pending");
    dataQuery = dataQuery.eq("status_testi", "pending");
  }

  const [countRes, belumDibacaRes, testimoniPendingRes] = await Promise.all([
    countQuery,
    supabase.from("pesan").select("id", { count: "exact", head: true }).eq("status", "belum_dibaca"),
    supabase.from("pesan").select("id", { count: "exact", head: true }).eq("status_testi", "pending"),
  ]);

  const totalRows = countRes.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / ADMIN_PESAN_PER_PAGE));
  const page = Math.min(requestedPage, totalPages);
  const offset = (page - 1) * ADMIN_PESAN_PER_PAGE;

  const dataRes = await dataQuery
    .order("tanggal", { ascending: false })
    .range(offset, offset + ADMIN_PESAN_PER_PAGE - 1);

  const items: Pesan[] = dataRes.data ?? [];

  return {
    items,
    totalRows,
    totalPages,
    page,
    jmlBelumDibaca: belumDibacaRes.count ?? 0,
    jmlTestimoniPending: testimoniPendingRes.count ?? 0,
  };
}

/** Ambil 1 pesan by id, untuk halaman detail. Otomatis tandai 'dibaca' saat dibuka. */
export async function getAdminPesanByIdAndMarkRead(id: number): Promise<Pesan | null> {
  const supabase = await createAuthServerClient();

  const res = await supabase.from("pesan").select("*").eq("id", id).limit(1);
  const rows: Pesan[] = res.data ?? [];
  const pesan = rows[0] ?? null;

  if (pesan && pesan.status === "belum_dibaca") {
    await supabase.from("pesan").update({ status: "dibaca" } as never).eq("id", id);
    pesan.status = "dibaca";
  }

  return pesan;
}

export interface PesanStatusTestiCounts {
  pending: number;
  approved: number;
  rejected: number;
}

/** Hitung jumlah testimoni per status_testi, untuk dashboard ringkas di halaman list */
export async function getTestimoniStatusCounts(): Promise<PesanStatusTestiCounts> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("pesan").select("status_testi").eq("is_testi", true);
  const rows: { status_testi: PesanStatusTesti | null }[] = res.data ?? [];

  const counts: PesanStatusTestiCounts = { pending: 0, approved: 0, rejected: 0 };
  for (const row of rows) {
    if (row.status_testi === "pending") counts.pending++;
    else if (row.status_testi === "approved") counts.approved++;
    else if (row.status_testi === "rejected") counts.rejected++;
  }
  return counts;
}
