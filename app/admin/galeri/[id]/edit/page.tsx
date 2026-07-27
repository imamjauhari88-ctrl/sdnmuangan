import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminAlbumById } from "@/lib/data/admin-galeri";
import AlbumForm from "@/components/admin/galeri/AlbumForm";

export const metadata: Metadata = {
  title: "Edit Album",
  robots: { index: false, follow: false },
};

interface EditAlbumPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: EditAlbumPageProps) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const album = await getAdminAlbumById(idNum);
  if (!album) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/admin/galeri/${album.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Album</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{album.nama_album}</p>
      </div>

      <AlbumForm mode="edit" initialData={album} />
    </div>
  );
}
