import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminHariLiburById } from "@/lib/data/admin-hari-libur";
import HariLiburForm from "@/components/admin/hari-libur/HariLiburForm";

export const metadata: Metadata = {
  title: "Edit Hari Libur",
  robots: { index: false, follow: false },
};

interface EditHariLiburPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHariLiburPage({ params }: EditHariLiburPageProps) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const hariLibur = await getAdminHariLiburById(idNum);
  if (!hariLibur) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/hari-libur"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Hari Libur</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{hariLibur.nama}</p>
      </div>

      <HariLiburForm mode="edit" initialData={hariLibur} />
    </div>
  );
}
