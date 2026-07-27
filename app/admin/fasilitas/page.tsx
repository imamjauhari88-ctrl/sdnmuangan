import type { Metadata } from "next";
import Link from "next/link";
import { getAdminFasilitasList } from "@/lib/data/admin-fasilitas";
import FasilitasTable from "@/components/admin/fasilitas/FasilitasTable";

export const metadata: Metadata = {
  title: "Fasilitas",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminFasilitasPage() {
  const items = await getAdminFasilitasList();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Fasilitas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola sarana dan prasarana sekolah yang ditampilkan di halaman Profil
          </p>
        </div>
        <Link
          href="/admin/fasilitas/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center gap-2 text-sm"
        >
          <i className="fa-solid fa-plus" /> Tambah
        </Link>
      </div>

      <FasilitasTable items={items} />
    </div>
  );
}
