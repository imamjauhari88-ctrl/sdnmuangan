import type { Metadata } from "next";
import { getAdminPesanList, normalizePesanTab } from "@/lib/data/admin-pesan";
import PesanTabs from "@/components/admin/pesan/PesanTabs";
import PesanTable from "@/components/admin/pesan/PesanTable";
import PesanPagination from "@/components/admin/pesan/PesanPagination";

export const metadata: Metadata = {
  title: "Pesan & Testimoni",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminPesanPageProps {
  searchParams: Promise<{ tab?: string; page?: string }>;
}

export default async function AdminPesanPage({ searchParams }: AdminPesanPageProps) {
  const params = await searchParams;
  const tab = normalizePesanTab(params.tab);
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const result = await getAdminPesanList({ tab, page });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pesan &amp; Testimoni</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tinjau pesan dari pengunjung dan kelola testimoni untuk halaman publik
        </p>
      </div>

      <PesanTabs
        activeTab={tab}
        jmlBelumDibaca={result.jmlBelumDibaca}
        jmlTestimoniPending={result.jmlTestimoniPending}
      />

      <PesanTable items={result.items} />

      <PesanPagination
        page={result.page}
        totalPages={result.totalPages}
        totalRows={result.totalRows}
        tab={tab}
      />
    </div>
  );
}
