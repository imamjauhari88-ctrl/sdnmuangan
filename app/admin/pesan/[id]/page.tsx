import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminPesanByIdAndMarkRead } from "@/lib/data/admin-pesan";
import PesanDetail from "@/components/admin/pesan/PesanDetail";

export const metadata: Metadata = {
  title: "Detail Pesan",
  robots: { index: false, follow: false },
};

interface AdminPesanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPesanDetailPage({ params }: AdminPesanDetailPageProps) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const pesan = await getAdminPesanByIdAndMarkRead(idNum);
  if (!pesan) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/pesan"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition mb-3"
        >
          <i className="fa-solid fa-arrow-left text-xs" /> Kembali ke Daftar
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{pesan.nama}</h1>
      </div>

      <PesanDetail pesan={pesan} />
    </div>
  );
}
