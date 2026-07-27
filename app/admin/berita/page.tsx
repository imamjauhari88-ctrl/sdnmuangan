import type { Metadata } from "next";
import Link from "next/link";
import { getAdminBeritaList, normalizeAdminKategori } from "@/lib/data/admin-berita";
import AdminBeritaFilter from "@/components/admin/berita/AdminBeritaFilter";
import BeritaTable from "@/components/admin/berita/BeritaTable";
import AdminPagination from "@/components/admin/berita/AdminPagination";

export const metadata: Metadata = {
  title: "Berita & Agenda",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminBeritaPageProps {
  searchParams: Promise<{ cari?: string; kategori?: string; page?: string }>;
}

export default async function AdminBeritaPage({ searchParams }: AdminBeritaPageProps) {
  const params = await searchParams;
  const cari = (params.cari ?? "").trim();
  const kategori = normalizeAdminKategori(params.kategori);
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const result = await getAdminBeritaList({ cari, kategori, page });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Berita &amp; Agenda</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola berita, pengumuman, agenda, dan prestasi sekolah
          </p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center gap-2 text-sm"
        >
          <i className="fa-solid fa-plus" /> Tambah
        </Link>
      </div>

      <AdminBeritaFilter initialCari={cari} activeKategori={kategori} />

      <BeritaTable items={result.items} />

      <AdminPagination
        page={result.page}
        totalPages={result.totalPages}
        totalRows={result.totalRows}
        cari={cari}
        kategori={kategori}
      />
    </div>
  );
}
