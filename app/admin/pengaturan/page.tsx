import type { Metadata } from "next";
import { getPengaturan } from "@/lib/data/pengaturan";
import PengaturanForm from "@/components/admin/pengaturan/PengaturanForm";

export const metadata: Metadata = {
  title: "Pengaturan Situs",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPengaturanPage() {
  const pengaturan = await getPengaturan();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pengaturan Situs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola informasi umum, profil, statistik, dan kontak yang tampil di seluruh halaman publik
        </p>
      </div>

      <PengaturanForm initialData={pengaturan} />
    </div>
  );
}
