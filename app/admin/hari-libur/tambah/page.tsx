import type { Metadata } from "next";
import Link from "next/link";
import HariLiburForm from "@/components/admin/hari-libur/HariLiburForm";

export const metadata: Metadata = {
  title: "Tambah Hari Libur",
  robots: { index: false, follow: false },
};

export default function TambahHariLiburPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/hari-libur"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tambah Hari Libur</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tambahkan hari libur secara manual
        </p>
      </div>

      <HariLiburForm mode="create" />
    </div>
  );
}
