import type { Metadata } from "next";
import Link from "next/link";
import FasilitasForm from "@/components/admin/fasilitas/FasilitasForm";

export const metadata: Metadata = {
  title: "Tambah Fasilitas",
  robots: { index: false, follow: false },
};

export default function TambahFasilitasPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/fasilitas"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tambah Fasilitas</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tambahkan sarana atau prasarana baru
        </p>
      </div>

      <FasilitasForm mode="create" />
    </div>
  );
}
