import type { Metadata } from "next";
import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import { getBeritaList, getAgendaKalenderData, normalizeKategori } from "@/lib/data/berita";

import BeritaHero from "@/components/berita/BeritaHero";
import BeritaSearchFilter from "@/components/berita/BeritaSearchFilter";
import FeaturedArticle from "@/components/berita/FeaturedArticle";
import KalenderAgendaInline from "@/components/berita/KalenderAgendaInline";
import BeritaGrid from "@/components/berita/BeritaGrid";
import BeritaPagination from "@/components/berita/BeritaPagination";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const pengaturan = await getPengaturan();
  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Sekolah Kami");
  const description = `Informasi terbaru kegiatan, pengumuman, dan agenda di ${namaSekolah}.`;
  return {
    title: "Berita & Informasi",
    description,
    openGraph: {
      title: `Berita & Informasi | ${namaSekolah}`,
      description,
    },
    twitter: {
      title: `Berita & Informasi | ${namaSekolah}`,
      description,
    },
  };
}

interface BeritaPageProps {
  searchParams: Promise<{ cari?: string; kategori?: string; page?: string }>;
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const params = await searchParams;
  const cari = (params.cari ?? "").trim();
  const kategori = normalizeKategori(params.kategori);
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [pengaturan, beritaResult] = await Promise.all([
    getPengaturan(),
    getBeritaList({ cari, kategori, page }),
  ]);

  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Sekolah Kami");

  // Kalender hanya dibutuhkan saat kategori "agenda" aktif — fetch kondisional
  // supaya tidak membebani request untuk tab lain.
  const agendaKalender = kategori === "agenda" ? await getAgendaKalenderData() : null;

  return (
    <>
      <BeritaHero namaSekolah={namaSekolah} />

      <section
        id="berita-section"
        className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900 min-h-[50vh] scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span
              className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full inline-block mb-3"
              aria-hidden="true"
            >
              📰 Seputar Sekolah
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-gray-900 dark:text-white mb-3">
              Publikasi Terbaru
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full" />
          </div>

          <BeritaSearchFilter
            initialCari={cari}
            activeKategori={kategori}
            kategoriCounts={beritaResult.kategoriCounts}
          />

          {beritaResult.featured && (
            <FeaturedArticle featured={beritaResult.featured} />
          )}

          {agendaKalender && (
            <KalenderAgendaInline
              visible={true}
              agenda={agendaKalender.agenda}
              hariLibur={agendaKalender.hariLibur}
            />
          )}

          <BeritaGrid items={beritaResult.items} cariActive={cari} />

          <BeritaPagination
            page={beritaResult.page}
            totalPages={beritaResult.totalPages}
            totalRows={beritaResult.totalRows}
            cari={cari}
            kategori={kategori}
          />
        </div>
      </section>
    </>
  );
}
