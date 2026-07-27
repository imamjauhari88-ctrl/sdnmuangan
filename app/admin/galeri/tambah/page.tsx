import type { Metadata } from "next";
import Link from "next/link";
import AlbumForm from "@/components/admin/galeri/AlbumForm";

export const metadata: Metadata = {
  title: "Tambah Album",
  robots: { index: false, follow: false },
};

export default function TambahAlbumPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/galeri"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tambah Album</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Buat album baru, lalu unggah foto-fotonya
        </p>
      </div>

      <AlbumForm mode="create" />
    </div>
  );
}
