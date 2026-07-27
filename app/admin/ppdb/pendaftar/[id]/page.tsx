import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminPendaftarById } from "@/lib/data/admin-ppdb";
import PendaftarDetail from "@/components/admin/ppdb/PendaftarDetail";

export const metadata: Metadata = {
  title: "Detail Pendaftar",
  robots: { index: false, follow: false },
};

interface AdminPendaftarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPendaftarDetailPage({ params }: AdminPendaftarDetailPageProps) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const pendaftar = await getAdminPendaftarById(idNum);
  if (!pendaftar) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/ppdb/pendaftar"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali ke Daftar
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{pendaftar.nama}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">{pendaftar.no_daftar}</p>
      </div>

      <PendaftarDetail pendaftar={pendaftar} />
    </div>
  );
}
