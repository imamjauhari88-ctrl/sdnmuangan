import type { Metadata } from "next";
import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import { getTahunAjaranAktif } from "@/lib/data/ppdb";
import { generateCaptcha } from "@/lib/utils/captcha";

import PpdbHeader from "@/components/ppdb/PpdbHeader";
import PpdbForm from "@/components/ppdb/PpdbForm";
import PpdbClosed from "@/components/ppdb/PpdbClosed";
import Link from "next/link";

// Selalu dirender dinamis: kuota & status PPDB harus selalu data terbaru,
// tidak cocok untuk ISR/cache statis.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pengaturan = await getPengaturan();
  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Sekolah Kami");
  const description = `Pendaftaran Peserta Didik Baru ${namaSekolah}.`;
  return {
    title: "PPDB Online",
    description,
    openGraph: {
      title: `PPDB Online | ${namaSekolah}`,
      description,
    },
    twitter: {
      title: `PPDB Online | ${namaSekolah}`,
      description,
    },
  };
}

export default async function PpdbPage() {
  const [pengaturan, tahun] = await Promise.all([getPengaturan(), getTahunAjaranAktif()]);
  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Nama Sekolah");

  if (!tahun) {
    return <PpdbClosed reason="closed" />;
  }

  const kuotaPenuh = tahun.kuota !== null && tahun.jml_pendaftar >= tahun.kuota;
  if (kuotaPenuh) {
    return <PpdbClosed reason="full" />;
  }

  const captcha = generateCaptcha();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <PpdbHeader
        namaSekolah={namaSekolah}
        tahunAjaran={tahun.tahun ?? "-"}
        kuota={tahun.kuota}
        jmlPendaftar={tahun.jml_pendaftar}
      />

      <PpdbForm tahunId={tahun.id} initialCaptcha={captcha} />

      <div className="text-center mt-4">
        <Link
          href="/ppdb/cek-status"
          className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition"
        >
          <i className="fa-solid fa-magnifying-glass mr-1.5" /> Sudah daftar? Cek status pendaftaran
        </Link>
      </div>
    </div>
  );
}
