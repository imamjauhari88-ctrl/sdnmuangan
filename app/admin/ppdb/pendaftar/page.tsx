import type { Metadata } from "next";
import { getAdminPendaftarList, normalizeStatusFilter } from "@/lib/data/admin-ppdb";
import PendaftarFilter from "@/components/admin/ppdb/PendaftarFilter";
import PendaftarTable from "@/components/admin/ppdb/PendaftarTable";
import PendaftarPagination from "@/components/admin/ppdb/PendaftarPagination";

export const metadata: Metadata = {
  title: "Data Pendaftar PPDB",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminPendaftarPageProps {
  searchParams: Promise<{ cari?: string; status?: string; page?: string }>;
}

export default async function AdminPendaftarPage({ searchParams }: AdminPendaftarPageProps) {
  const params = await searchParams;
  const cari = (params.cari ?? "").trim();
  const status = normalizeStatusFilter(params.status);
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const result = await getAdminPendaftarList({ cari, status, page });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Pendaftar PPDB</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola dan tinjau pendaftaran peserta didik baru
        </p>
      </div>

      <PendaftarFilter initialCari={cari} activeStatus={status} statusCounts={result.statusCounts} />

      <PendaftarTable items={result.items} />

      <PendaftarPagination
        page={result.page}
        totalPages={result.totalPages}
        totalRows={result.totalRows}
        cari={cari}
        status={status}
      />
    </div>
  );
}
