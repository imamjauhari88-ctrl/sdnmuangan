import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminTahunAjaranById } from "@/lib/data/admin-ppdb";
import TahunAjaranForm from "@/components/admin/ppdb/TahunAjaranForm";

export const metadata: Metadata = {
  title: "Edit Tahun Ajaran",
  robots: { index: false, follow: false },
};

interface EditTahunAjaranPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTahunAjaranPage({ params }: EditTahunAjaranPageProps) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const tahunAjaran = await getAdminTahunAjaranById(idNum);
  if (!tahunAjaran) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/ppdb/tahun-ajaran"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Tahun Ajaran</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tahunAjaran.tahun}</p>
      </div>

      <TahunAjaranForm mode="edit" initialData={tahunAjaran} />
    </div>
  );
}
