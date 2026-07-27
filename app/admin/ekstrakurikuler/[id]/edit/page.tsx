import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminEkskulById, getAlbumOptionsForEkskul } from "@/lib/data/admin-ekstrakurikuler";
import EkskulForm from "@/components/admin/ekstrakurikuler/EkskulForm";

export const metadata: Metadata = {
  title: "Edit Ekstrakurikuler",
  robots: { index: false, follow: false },
};

interface EditEkskulPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEkskulPage({ params }: EditEkskulPageProps) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const [ekskul, albumOptions] = await Promise.all([
    getAdminEkskulById(idNum),
    getAlbumOptionsForEkskul(),
  ]);
  if (!ekskul) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/ekstrakurikuler"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Ekstrakurikuler</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ekskul.nama}</p>
      </div>

      <EkskulForm mode="edit" initialData={ekskul} albumOptions={albumOptions} />
    </div>
  );
}
