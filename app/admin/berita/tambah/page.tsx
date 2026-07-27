import type { Metadata } from "next";
import Link from "next/link";
import BeritaForm from "@/components/admin/berita/BeritaForm";

export const metadata: Metadata = {
  title: "Tambah Berita",
  robots: { index: false, follow: false },
};

export default function TambahBeritaPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tambah Berita</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Buat berita, pengumuman, agenda, atau prestasi baru
        </p>
      </div>

      <BeritaForm mode="create" />
    </div>
  );
}
