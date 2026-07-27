import type { Metadata } from "next";
import Link from "next/link";
import { getAdminEkskulList } from "@/lib/data/admin-ekstrakurikuler";
import EkskulTable from "@/components/admin/ekstrakurikuler/EkskulTable";

export const metadata: Metadata = {
  title: "Ekstrakurikuler",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminEkstrakurikulerPage() {
  const items = await getAdminEkskulList();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ekstrakurikuler</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola kegiatan ekstrakurikuler yang ditampilkan di halaman Beranda
          </p>
        </div>
        <Link
          href="/admin/ekstrakurikuler/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center gap-2 text-sm"
        >
          <i className="fa-solid fa-plus" /> Tambah
        </Link>
      </div>

      <EkskulTable items={items} />
    </div>
  );
}
