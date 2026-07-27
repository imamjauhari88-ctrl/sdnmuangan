import type { Metadata } from "next";
import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import { getGtkList } from "@/lib/data/gtk";
import { fallbackGtk } from "@/components/gtk/constants";
import GtkPageClient from "@/components/gtk/GtkPageClient";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const pengaturan = await getPengaturan();
  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Sekolah Kami");

  return {
    title: "Guru & Tenaga Kependidikan",
    description: `Profil guru dan tenaga kependidikan di ${namaSekolah}.`,
  };
}

export default async function GtkPage() {
  const [pengaturan, listGtkRaw] = await Promise.all([
    getPengaturan(),
    getGtkList(),
  ]);

  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "UPTD SDN TAMANSAREH 2");
  const isFallback = listGtkRaw.length === 0;
  const listGtk = isFallback ? fallbackGtk : listGtkRaw;

  return (
    <GtkPageClient
      namaSekolah={namaSekolah}
      listGtk={listGtk}
      isFallback={isFallback}
    />
  );
}
