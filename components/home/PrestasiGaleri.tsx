"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { cldThumb, cldOptimized } from "@/lib/utils/cloudinary";
import { formatTanggalIndonesia } from "@/lib/utils/format";
import type { Berita } from "@/lib/types/database";
import type { GaleriPreviewItem } from "@/lib/data/beranda";

interface PrestasiGaleriProps {
  prestasi: Berita[];
  galeri: GaleriPreviewItem[];
}

const TINGKAT_COLOR: Record<string, string> = {
  nasional: "bg-red-500",
  internasional: "bg-purple-600",
  provinsi: "bg-blue-500",
  kabupaten: "bg-cyan-500",
  kecamatan: "bg-green-500",
  sekolah: "bg-gray-500",
};

// Preview kolom kiri dibatasi 4 kartu agar tingginya seimbang dengan galeri di sebelahnya
const MAKS_PRESTASI_PREVIEW = 4;
// Preview kolom kanan: 1 foto besar + 5 foto kecil (grid 2 kolom di dalam setengah lebar layar)
const MAKS_GALERI_PREVIEW = 8;

// Foto pertama tampil besar, full-width di dalam grid 2 kolom
function getGaleriItemClassName(index: number): string {
  const base =
    "relative overflow-hidden cursor-pointer group " +
    "border border-gray-100 dark:border-gray-800 " +
    "transition-all duration-300 hover:scale-[1.01] hover:shadow-md card-animate";

  if (index === 0) {
    return base + " col-span-2 row-span-1 md:row-span-2";
  }
  return base;
}

export default function PrestasiGaleri({ prestasi, galeri }: PrestasiGaleriProps) {
  const [activeImage, setActiveImage] = useState<GaleriPreviewItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const previewPrestasi = prestasi.slice(0, MAKS_PRESTASI_PREVIEW);
  const previewGaleri = galeri.slice(0, MAKS_GALERI_PREVIEW);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
      aria-label="Prestasi dan dokumentasi kegiatan sekolah"
    >
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-zoom-in { animation: zoomIn 0.25s ease-out forwards; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header gabungan ── */}
        <div className="text-center mb-10 sm:mb-12">
          <span
            className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            🏆 Kebanggaan Kami
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Prestasi &amp; Dokumentasi
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full mt-3 mx-auto" />
        </div>

        {/* ── Prestasi (kiri) & Galeri (kanan) — sejajar horizontal mulai breakpoint lg ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">

          {/* ── Prestasi Terkini ── */}
          <div className="card-animate" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-trophy text-amber-500" /> Prestasi Terkini
              </h3>
              <Link
                href="/berita?kategori=prestasi"
                className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400 hover:underline"
              >
                Lihat Semua <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
            </div>

            {previewPrestasi.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" role="list">
                {previewPrestasi.map((pr, i) => {
                  const tingkatColor = TINGKAT_COLOR[pr.tingkat ?? ""] ?? "bg-amber-500";
                  const img = pr.gambar
  ? cldThumb(pr.gambar, 400)
  : "https://placehold.co/600x400/fef3c7/92400e?text=Prestasi";

                  return (
                    <div
                      key={pr.id}
                      className="card-animate card-hover glass-card rounded-2xl border border-amber-100 dark:border-amber-900/30 shadow-sm overflow-hidden group"
                      style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                      role="listitem"
                    >
                      <div className="relative h-36 overflow-hidden bg-amber-50 dark:bg-gray-800">
                        <Image
                          src={img}
                          alt={`Foto prestasi: ${pr.judul}`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {pr.tingkat && (
                          <span
                            className={`absolute top-2.5 left-2.5 ${tingkatColor} text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow`}
                          >
                            {pr.tingkat}
                          </span>
                        )}
                        {pr.juara && (
                          <span
                            className="absolute top-2.5 right-2.5 bg-amber-400 text-amber-900 text-[9px] font-black px-2.5 py-1 rounded-full shadow"
                            aria-label={`Juara ${pr.juara}`}
                          >
                            🥇 {pr.juara}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1">
                          <i className="fa-regular fa-calendar text-amber-500" />
                          <time dateTime={pr.tanggal ?? undefined}>{formatTanggalIndonesia(pr.tanggal)}</time>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          <Link href={`/berita/${pr.id}`} aria-label={`Baca detail prestasi: ${pr.judul}`}>
                            {pr.judul}
                          </Link>
                        </h3>
                        {pr.peraih && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <i className="fa-solid fa-user text-amber-400" />
                            {pr.peraih}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-14 glass-card rounded-3xl border-2 border-dashed border-amber-200 dark:border-amber-900/40 h-full flex flex-col items-center justify-center">
                <div className="relative inline-block mb-5">
                  <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto shadow-inner">
                    <i className="fa-solid fa-trophy text-4xl text-amber-300 dark:text-amber-700" />
                  </div>
                  <span className="absolute -top-1 -right-1 text-lg animate-bounce">⭐</span>
                  <span className="absolute -bottom-1 -left-1 text-base animate-pulse">✨</span>
                </div>
                <h3 className="text-lg font-black text-gray-800 dark:text-white mb-2">
                  Prestasi Sedang Disiapkan
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 px-6 leading-relaxed">
                  Data prestasi belum tersedia. Segera hadir pencapaian membanggakan! 🌟
                </p>
              </div>
            )}
          </div>

          {/* ── Galeri Kegiatan ── */}
          <div className="card-animate" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-images text-pink-500" /> Galeri Kegiatan
              </h3>
              <Link
                href="/galeri"
                className="text-sm font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
                aria-label="Lihat semua foto galeri"
              >
                Lihat Semua <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
            </div>

            {previewGaleri.length > 0 ? (
              <div
  className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] md:auto-rows-[180px] gap-2 rounded-[20px] overflow-hidden"
  role="list"
  aria-label="Galeri foto kegiatan sekolah"
>
                {previewGaleri.map((g, i) => (
                  <div
                    key={g.id}
                    onClick={() => setActiveImage(g)}
                    className={getGaleriItemClassName(i)}
                    style={{ animationDelay: `${0.1 * (i + 1)}s` }}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setActiveImage(g);
                    }}
                    aria-label={`Buka foto: ${g.judul || "Foto Kegiatan"}`}
                  >
                    <Image
                      src={cldThumb(g.foto, 400)}
                      alt={g.judul || "Foto Kegiatan"}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400/fce7f3/9d174d?text=Foto";
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-expand text-white text-xl transform scale-75 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-14 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl h-full flex flex-col items-center justify-center">
                <i className="fa-regular fa-images text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Belum ada foto galeri</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tambahkan di panel admin</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Lightbox Modal (portal ke document.body) ── */}
      {mounted && activeImage && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Tutup pratinjau"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>

          <div
            className="relative max-w-4xl h-[75vh] sm:h-[80vh] w-full flex items-center justify-center animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={cldOptimized(activeImage.foto)}
              alt={activeImage.judul}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain rounded-2xl shadow-2xl border border-white/10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/fce7f3/9d174d?text=Foto";
              }}
            />
          </div>

          {activeImage.judul && (
            <p className="mt-5 px-5 py-2.5 bg-black/85 dark:bg-gray-900/85 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg border border-white/10 backdrop-blur-sm max-w-max mx-auto tracking-wide animate-zoom-in">
              {activeImage.judul}
            </p>
          )}
        </div>,
        document.body
      )}
    </section>
  );
}
