"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { cldThumb, cldOptimized } from "@/lib/utils/cloudinary";
import type { AgendaItem, GaleriPreviewItem } from "@/lib/data/beranda";

interface AgendaGaleriPreviewProps {
  agenda: AgendaItem[];
  galeri: GaleriPreviewItem[];
}

const BULAN_SINGKAT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function AgendaDate({ tanggal }: { tanggal: string }) {
  const d = new Date(tanggal + "T00:00:00");
  return (
    <div className="agenda-date" aria-label={`Tanggal ${d.getDate()} ${BULAN_SINGKAT[d.getMonth()]} ${d.getFullYear()}`}>
      <span className="day">{String(d.getDate()).padStart(2, "0")}</span>
      <span className="month">{BULAN_SINGKAT[d.getMonth()]}</span>
    </div>
  );
}

// Grid mengikuti persis .galeri-grid dari versi PHP lama:
// Desktop (>=768px): 4 kolom, grid-auto-rows 180px, foto pertama col-span-2 row-span-2
// Mobile  (<768px) : 2 kolom, grid-auto-rows 140px, foto pertama col-span-2 row-span-1 (full-width, tidak jadi kotak besar)
// Sisanya (foto ke-1 dst) dibiarkan auto-placement grid, sama seperti CSS asli
// (tidak ada rounded-corner per foto — pembulatan sudut cuma di container lewat overflow-hidden)

function getItemClassName(index: number): string {
  const base =
    "relative overflow-hidden cursor-pointer group " +
    "border border-gray-100 dark:border-gray-800 " +
    "transition-all duration-300 hover:scale-[1.01] hover:shadow-md card-animate";

  if (index === 0) {
    return base + " col-span-2 row-span-1 md:row-span-2";
  }
  return base;
}

export default function AgendaGaleriPreview({ agenda, galeri }: AgendaGaleriPreviewProps) {
  const [activeImage, setActiveImage] = useState<GaleriPreviewItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memastikan batas maksimal 8 foto (1 besar, 7 kecil)
  const previewGaleri = galeri.slice(0, 8);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Catatan: layout grid galeri sekarang pakai class Tailwind responsif
  // langsung di JSX (lihat getItemClassName di atas), bukan style object,
  // karena breakpoint mobile perlu diubah kolom & tinggi barisnya.

  return (
    <section
      className="py-12 sm:py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
      aria-label="Agenda dan kalender kegiatan sekolah"
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
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoomIn 0.25s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* ── Agenda List ── */}
          <div className="card-animate" style={{ animationDelay: "0.1s" }}>
            <div className="inline-block mb-3">
              <span
                className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full inline-block"
                aria-hidden="true"
              >
                📅 Kalender
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
              Agenda Mendatang
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mb-6" aria-hidden="true" />

            <div className="space-y-3" role="list" aria-label="Daftar agenda mendatang">
              {agenda.length > 0 ? (
                agenda.map((ag) => {
                  const selisih = ag.selisihHari;
                  const badgeClass =
                    selisih <= 3
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
                  const badgeText =
                    selisih === 0 ? "Hari ini" : selisih === 1 ? "Besok" : `${selisih} hari lagi`;

                  return (
                    <div className="agenda-item card-animate" role="listitem" key={ag.id}>
                      <AgendaDate tanggal={ag.tanggal} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                          {ag.judul}
                        </h3>
                        {ag.lokasi && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <i className="fa-solid fa-location-dot text-green-500" />
                            {ag.lokasi}
                          </p>
                        )}
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${badgeClass}`}>
                        {badgeText}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div role="listitem" className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
  <i className="fa-regular fa-calendar text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Belum ada agenda mendatang
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tambahkan di panel admin</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Galeri Preview ── */}
          <div className="card-animate" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-end justify-between mb-4">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-widest text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-4 py-2 rounded-full inline-block mb-3"
                  aria-hidden="true"
                >
                  📸 Dokumentasi
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  Galeri Kegiatan
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full mt-2" />
              </div>
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
                className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[180px] gap-2 rounded-[20px] overflow-hidden"
                role="list"
                aria-label="Galeri foto kegiatan sekolah"
              >
                {previewGaleri.map((g, i) => (
                  <div
                    key={g.id}
                    onClick={() => setActiveImage(g)}
                    className={getItemClassName(i)}
                    style={{ animationDelay: `${0.1 * (i + 1)}s` }}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setActiveImage(g);
                    }}
                    aria-label={`Buka foto: ${g.judul || 'Foto Kegiatan'}`}
                  >
                    <Image
                      src={cldThumb(g.foto, 400)}
                      alt={g.judul || "Foto Kegiatan"}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/fce7f3/9d174d?text=Foto';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" aria-hidden="true">
                      <i className="fa-solid fa-expand text-white text-xl transform scale-75 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                <i className="fa-regular fa-images text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Belum ada foto galeri</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tambahkan di panel admin</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Lightbox Modal ──
          Dirender lewat portal ke document.body (sama seperti modal detail
          Fasilitas & Ekstrakurikuler) supaya "fixed" benar-benar relatif ke
          viewport, tidak kena efek transform dari .page-transition yang
          bikin elemen fixed di dalamnya jadi "terjebak" relatif ke div itu,
          bukan ke layar (paling kelihatan di HP). */}
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
                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/fce7f3/9d174d?text=Foto';
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