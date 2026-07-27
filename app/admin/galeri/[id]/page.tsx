import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminAlbumDetail } from "@/lib/data/admin-galeri";
import MultiUploadFoto from "@/components/admin/galeri/MultiUploadFoto";
import AdminFotoGrid from "@/components/admin/galeri/AdminFotoGrid";

export const metadata: Metadata = {
  title: "Kelola Foto Album",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminAlbumDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAlbumDetailPage({ params }: AdminAlbumDetailPageProps) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const { album, fotoList } = await getAdminAlbumDetail(idNum);
  if (!album) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/galeri"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali ke Daftar Album
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{album.nama_album}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{fotoList.length} foto</p>
          </div>
          <Link
            href={`/admin/galeri/${album.id}/edit`}
            className="text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5"
          >
            <i className="fa-solid fa-pen text-xs" /> Edit Info Album
          </Link>
        </div>
      </div>

      <MultiUploadFoto albumId={album.id} />

      <AdminFotoGrid albumId={album.id} fotoList={fotoList} />
    </div>
  );
}
