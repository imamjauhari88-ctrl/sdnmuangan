import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminGtkById } from "@/lib/data/admin-gtk";
import GtkForm from "@/components/admin/gtk/GtkForm";

export const metadata: Metadata = {
  title: "Edit Personel GTK",
  robots: { index: false, follow: false },
};

interface EditGtkPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGtkPage({ params }: EditGtkPageProps) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const gtk = await getAdminGtkById(idNum);
  if (!gtk) notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/gtk"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Personel</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{gtk.nama}</p>
      </div>

      <GtkForm mode="edit" initialData={gtk} />
    </div>
  );
}
