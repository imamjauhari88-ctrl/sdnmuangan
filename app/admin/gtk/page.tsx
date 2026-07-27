import type { Metadata } from "next";
import Link from "next/link";
import { getAdminGtkList } from "@/lib/data/admin-gtk";
import GtkTable from "@/components/admin/gtk/GtkTable";

export const metadata: Metadata = {
  title: "Guru & Tendik",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminGtkPage() {
  const items = await getAdminGtkList();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Guru & Tendik</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola data Guru dan Tenaga Kependidikan (GTK) yang ditampilkan di halaman Profil
          </p>
        </div>
        <Link
          href="/admin/gtk/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center gap-2 text-sm"
        >
          <i className="fa-solid fa-user-plus" /> Tambah
        </Link>
      </div>

      <GtkTable items={items} />
    </div>
  );
}
