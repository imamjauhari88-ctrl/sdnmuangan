import type { Metadata } from "next";
import Link from "next/link";
import { getAdminTahunAjaranList } from "@/lib/data/admin-ppdb";
import TahunAjaranTable from "@/components/admin/ppdb/TahunAjaranTable";

export const metadata: Metadata = {
  title: "Tahun Ajaran PPDB",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTahunAjaranPage() {
  const items = await getAdminTahunAjaranList();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tahun Ajaran</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Atur kuota dan buka/tutup pendaftaran PPDB
          </p>
        </div>
        <Link
          href="/admin/ppdb/tahun-ajaran/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center gap-2 text-sm"
        >
          <i className="fa-solid fa-plus" /> Tambah
        </Link>
      </div>

      <TahunAjaranTable items={items} />
    </div>
  );
}
