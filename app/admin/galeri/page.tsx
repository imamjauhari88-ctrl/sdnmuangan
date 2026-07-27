import type { Metadata } from "next";
import Link from "next/link";
import { getAdminAlbumList } from "@/lib/data/admin-galeri";
import AdminAlbumGrid from "@/components/admin/galeri/AdminAlbumGrid";

export const metadata: Metadata = {
  title: "Galeri",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminGaleriPage() {
  const albums = await getAdminAlbumList();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Galeri</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola album dan foto kegiatan sekolah
          </p>
        </div>
        <Link
          href="/admin/galeri/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center gap-2 text-sm"
        >
          <i className="fa-solid fa-plus" /> Album Baru
        </Link>
      </div>

      <AdminAlbumGrid albums={albums} />
    </div>
  );
}
