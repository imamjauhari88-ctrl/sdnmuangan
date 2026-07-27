import type { Metadata } from "next";
import Link from "next/link";
import { getAdminHariLiburList, getAvailableYears, type TahunFilter } from "@/lib/data/admin-hari-libur";
import HariLiburYearFilter from "@/components/admin/hari-libur/HariLiburYearFilter";
import HariLiburTable from "@/components/admin/hari-libur/HariLiburTable";
import SinkronGoogleCalendarButton from "@/components/admin/hari-libur/SinkronGoogleCalendarButton";

export const metadata: Metadata = {
  title: "Hari Libur",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminHariLiburPageProps {
  searchParams: Promise<{ tahun?: string }>;
}

export default async function AdminHariLiburPage({ searchParams }: AdminHariLiburPageProps) {
  const params = await searchParams;
  const tahunParsed = params.tahun ? parseInt(params.tahun, 10) : NaN;
  const tahun: TahunFilter = isNaN(tahunParsed) ? "semua" : tahunParsed;
  // Sync butuh tahun yang spesifik — kalau filter sedang "Semua Tahun",
  // default-kan ke tahun berjalan.
  const tahunSync = tahun === "semua" ? new Date().getFullYear() : tahun;

  const [items, availableYears] = await Promise.all([
    getAdminHariLiburList(tahun),
    getAvailableYears(),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hari Libur</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola hari libur yang ditampilkan di kalender publik
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <SinkronGoogleCalendarButton tahun={tahunSync} />
          <Link
            href="/admin/hari-libur/tambah"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center gap-2 text-sm"
          >
            <i className="fa-solid fa-plus" /> Tambah
          </Link>
        </div>
      </div>

      <HariLiburYearFilter activeTahun={tahun} availableYears={availableYears} />

      <HariLiburTable items={items} />
    </div>
  );
}
