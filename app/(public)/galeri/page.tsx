import type { Metadata } from "next";
import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import { getAlbumList, getAlbumDetail } from "@/lib/data/galeri";

import GaleriHero from "@/components/galeri/GaleriHero";
import AlbumSearch from "@/components/galeri/AlbumSearch";
import AlbumGrid from "@/components/galeri/AlbumGrid";
import AlbumHeader from "@/components/galeri/AlbumHeader";
import PhotoGridWithLightbox from "@/components/galeri/PhotoGridWithLightbox";
import Link from "next/link";

export const revalidate = 60;

interface GaleriPageProps {
  searchParams: Promise<{ album_id?: string; cari?: string }>;
}

export async function generateMetadata({ searchParams }: GaleriPageProps): Promise<Metadata> {
  const params = await searchParams;
  const pengaturan = await getPengaturan();
  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Sekolah Kami");

  const albumId = params.album_id ? parseInt(params.album_id, 10) : null;
  if (albumId && !isNaN(albumId)) {
    const { album } = await getAlbumDetail(albumId);
    if (album) {
      const title = album.nama_album;
      const description = album.deskripsi || `Dokumentasi kegiatan ${album.nama_album} di ${namaSekolah}`;
      return {
        title,
        description,
        openGraph: {
          title: `${title} | ${namaSekolah}`,
          description,
          images: album.cover ? [{ url: album.cover, width: 1200, height: 630 }] : undefined,
        },
        twitter: {
          title: `${title} | ${namaSekolah}`,
          description,
          images: album.cover ? [album.cover] : undefined,
        },
      };
    }
  }

  const description = `Dokumentasi kegiatan dan acara di ${namaSekolah}`;
  return {
    title: "Galeri Kegiatan",
    description,
    openGraph: {
      title: `Galeri Kegiatan | ${namaSekolah}`,
      description,
    },
    twitter: {
      title: `Galeri Kegiatan | ${namaSekolah}`,
      description,
    },
  };
}

export default async function GaleriPage({ searchParams }: GaleriPageProps) {
  const params = await searchParams;
  const pengaturan = await getPengaturan();
  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Sekolah Kami");

  const albumIdRaw = params.album_id ? parseInt(params.album_id, 10) : null;
  const albumId = albumIdRaw && !isNaN(albumIdRaw) ? albumIdRaw : null;
  const cari = (params.cari ?? "").trim();

  // Mode "Foto Dalam Album"
  if (albumId) {
    const { album, fotos } = await getAlbumDetail(albumId);

    // Album tidak ditemukan -> treat seperti mode list (sesuai logika PHP lama:
    // $album_id di-null-kan kalau data tidak ketemu)
    if (!album) {
      const { albums } = await getAlbumList(cari);
      return (
        <>
          <GaleriHero
            title="Galeri Kegiatan"
            description={`Dokumentasi kegiatan dan acara di ${namaSekolah}`}
            showBackButton={false}
          />
          <GaleriContent>
            <AlbumListHeader cari={cari} />
            <AlbumGrid albums={albums} cariActive={cari} />
          </GaleriContent>
        </>
      );
    }

    return (
      <>
        <GaleriHero
          title={album.nama_album}
          description={album.deskripsi || `Dokumentasi kegiatan ${album.nama_album}`}
          showBackButton={true}
        />
        <GaleriContent>
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition font-bold text-sm"
              aria-label="Kembali ke daftar album"
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              <span className="hidden sm:inline">Kembali ke Album</span>
              <span className="sm:hidden">Kembali</span>
            </Link>
          </div>

          <AlbumHeader namaAlbum={album.nama_album} deskripsi={album.deskripsi} jmlFoto={fotos.length} />

          <PhotoGridWithLightbox fotoList={fotos} />
        </GaleriContent>
      </>
    );
  }

  // Mode "Daftar Album"
  const { albums } = await getAlbumList(cari);

  return (
    <>
      <GaleriHero
        title="Galeri Kegiatan"
        description={`Dokumentasi kegiatan dan acara di ${namaSekolah}`}
        showBackButton={false}
      />
      <GaleriContent>
        <AlbumListHeader cari={cari} />
        <AlbumGrid albums={albums} cariActive={cari} />
      </GaleriContent>
    </>
  );
}

function GaleriContent({ children }: { children: React.ReactNode }) {
  return (
    <section
      id="galeri-section"
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-950 min-h-[50vh] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function AlbumListHeader({ cari }: { cari: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div>
        <span
          className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-4 py-2 rounded-full inline-block mb-3"
          aria-hidden="true"
        >
          🎬 Galeri
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Album Kegiatan</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mt-2" aria-hidden="true" />
      </div>

      <AlbumSearch initialCari={cari} />
    </div>
  );
}
