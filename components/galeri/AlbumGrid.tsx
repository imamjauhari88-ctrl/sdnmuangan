import Link from "next/link";
import Image from "next/image";
import { cldThumb } from "@/lib/utils/cloudinary";
import { formatTanggalIndonesia } from "@/lib/utils/format";
import type { AlbumWithCount } from "@/lib/data/galeri";

interface AlbumGridProps {
  albums: AlbumWithCount[];
  cariActive: string;
}

export default function AlbumGrid({ albums, cariActive }: AlbumGridProps) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <i className="fa-solid fa-folder-open text-5xl text-gray-300 dark:text-gray-600 mb-4" aria-hidden="true" />
        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
          {cariActive ? "Album tidak ditemukan" : "Belum ada album"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {cariActive ? "Coba kata kunci lain" : "Album kegiatan akan segera ditambahkan"}
        </p>
        {cariActive && (
          <Link
            href="/galeri"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <i className="fa-solid fa-rotate-left" aria-hidden="true" /> Lihat semua album
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
      role="list"
      aria-label="Daftar album galeri"
    >
      {albums.map((a, i) => {
        const cover = a.cover ? cldThumb(a.cover, 500) : "https://placehold.co/500x350/e2e8f0/1e293b?text=Album";
        return (
          <Link
            key={a.id}
            href={`/galeri?album_id=${a.id}`}
            className="card-animate card-hover glass-card rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group"
            style={{ animationDelay: `${i * 0.06}s` }}
            role="listitem"
            aria-label={`Album ${a.nama_album}, ${a.jml_foto} foto`}
          >
            {/* Mengurangi tinggi cover: h-36 di HP, h-40 di tablet, h-44 di desktop */}
            <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
              <Image
                src={cover}
                alt={`Cover album ${a.nama_album}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Menyesuaikan ukuran badge jumlah foto */}
              <div
                className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-full"
                aria-label={`${a.jml_foto} foto dalam album ini`}
              >
                <i className="fa-solid fa-image text-[8px] sm:text-[10px]" aria-hidden="true" />
                {a.jml_foto} foto
              </div>

              {/* Menyesuaikan ukuran badge tanggal */}
              <div className="absolute top-2.5 right-2.5 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-full">
                {formatTanggalIndonesia(a.tanggal_dibuat)}
              </div>
            </div>

            {/* Menyesuaikan padding dalam kartu (p-3.5 sm:p-4) */}
            <div className="p-3.5 sm:p-4 flex-1 flex flex-col">
              {/* Menyesuaikan ukuran font judul (text-sm sm:text-base) */}
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {a.nama_album}
              </h3>
              
              {/* Menyesuaikan ukuran font deskripsi (text-[11px] sm:text-xs) */}
              {a.deskripsi ? (
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 flex-1">
                  {a.deskripsi}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              
              <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-gray-100 dark:border-gray-700/50">
                <span className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  Lihat Foto <i className="fa-solid fa-arrow-right text-[10px] sm:text-xs" aria-hidden="true" />
                </span>
                {a.jml_foto > 0 && (
                  <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-semibold">
                    {a.jml_foto} <span className="hidden sm:inline">foto</span>
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}