"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { cldThumb } from "@/lib/utils/cloudinary";
import type { EkskulWithPreview } from "@/lib/data/beranda";

interface EkstrakurikulerProps {
  ekskulList: EkskulWithPreview[];
}

// === Warna tema — sesuai PHP (bg_classes & txt_classes) ===
const THEME_COLORS = [
  { bg: "bg-blue-100 dark:bg-blue-900/50",    text: "text-blue-600 dark:text-blue-400",    solid: "#2563eb", solidLight: "#dbeafe" },
  { bg: "bg-green-100 dark:bg-green-900/50",  text: "text-green-600 dark:text-green-400",  solid: "#16a34a", solidLight: "#dcfce7" },
  { bg: "bg-purple-100 dark:bg-purple-900/50",text: "text-purple-600 dark:text-purple-400",solid: "#9333ea", solidLight: "#f3e8ff" },
  { bg: "bg-amber-100 dark:bg-amber-900/50",  text: "text-amber-600 dark:text-amber-400",  solid: "#d97706", solidLight: "#fef3c7" },
  { bg: "bg-pink-100 dark:bg-pink-900/50",    text: "text-pink-600 dark:text-pink-400",    solid: "#db2777", solidLight: "#fce7f3" },
  { bg: "bg-cyan-100 dark:bg-cyan-900/50",    text: "text-cyan-600 dark:text-cyan-400",    solid: "#0891b2", solidLight: "#cffafe" },
  { bg: "bg-red-100 dark:bg-red-900/50",      text: "text-red-600 dark:text-red-400",      solid: "#dc2626", solidLight: "#fee2e2" },
  { bg: "bg-emerald-100 dark:bg-emerald-900/50", text: "text-emerald-600 dark:text-emerald-400", solid: "#059669", solidLight: "#d1fae5" },
];

function getTheme(index: number) {
  return THEME_COLORS[index % THEME_COLORS.length];
}

function getEkskulIcon(nama: string, dbIcon?: string): string {
  const n = nama.toLowerCase();
  if (n.includes("pramuka"))                return "fa-campground";
  if (n.includes("futsal"))                 return "fa-futbol";
  if (n.includes("tari"))                   return "fa-music";
  if (n.includes("gambar") || n.includes("lukis")) return "fa-palette";
  if (n.includes("silat") || n.includes("pencak")) return "fa-shield-halved";
  if (n.includes("komputer") || n.includes("it"))  return "fa-computer";
  if (n.includes("pmr"))                    return "fa-heart-pulse";
  if (n.includes("tahfidz") || n.includes("quran") || n.includes("ummi")) return "fa-book-quran";
  return dbIcon || "fa-star";
}

export default function Ekstrakurikuler({ ekskulList }: EkstrakurikulerProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Portal butuh document, jadi baru tersedia setelah mount di client
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeEkskul = activeIndex !== null ? ekskulList[activeIndex] : null;
  const activeTheme  = activeIndex !== null ? getTheme(activeIndex) : null;
  const activeIcon   = activeIndex !== null
    ? getEkskulIcon(ekskulList[activeIndex].nama, ekskulList[activeIndex].icon ?? "")
    : "";

  // Tutup modal dengan Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  if (ekskulList.length === 0) return null;

  return (
    <section
      className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
      aria-label="Program ekstrakurikuler sekolah"
    >
      <style jsx global>{`
        @keyframes eks-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes eks-zoomIn {
          from { opacity: 0; transform: scale(0.93) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .eks-modal-backdrop { animation: eks-fadeIn 0.2s ease-out forwards; }
        .eks-modal-card     { animation: eks-zoomIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        /* Hover kartu ekskul */
        .ekskul-card-btn { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .ekskul-card-btn:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(0,0,0,0.1); }
        .ekskul-card-btn:hover .ekskul-icon-wrap { transform: scale(1.15) rotate(-5deg); }
        .ekskul-icon-wrap { transition: transform 0.3s; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            🎨 Kegiatan Siswa
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Ekstrakurikuler
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Klik kartu untuk melihat detail kegiatan
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mt-3" aria-hidden="true" />
        </div>

        {/* ── Grid Kartu ── */}
        <div className="flex flex-wrap justify-center gap-4" role="list">
          {ekskulList.map((ek, i) => {
            const theme    = getTheme(i);
            const iconClass = getEkskulIcon(ek.nama, ek.icon ?? "");

            return (
              <button
                key={ek.id ?? i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="ekskul-card-btn w-[130px] flex-shrink-0 flex flex-col items-center text-center p-5 px-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                role="listitem"
                aria-label={`Lihat detail ${ek.nama}`}
              >
                {/* Ikon */}
                <div
                  className={`ekskul-icon-wrap w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl mb-[10px] ${theme.bg} ${theme.text}`}
                  aria-hidden="true"
                >
                  <i className={`fa-solid ${iconClass}`} />
                </div>

                {/* Nama */}
                <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white leading-snug">
                  {ek.nama}
                </p>

                {/* Tautan Detail */}
                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mt-1 flex items-center gap-1">
                  <i className="fa-solid fa-circle-info text-[9px]" aria-hidden="true" />
                  Detail
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Modal Detail ──
          Dirender lewat portal ke document.body supaya "fixed" benar-benar
          relatif ke viewport, tidak kena efek transform dari
          .page-transition (app/(public)/template.tsx) yang bisa bikin
          modal salah posisi / tidak kelihatan di layar kecil. */}
      {mounted && activeEkskul && activeTheme && createPortal(
        <div
          className="eks-modal-backdrop fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.70)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ekskul-modal-title"
          onClick={() => setActiveIndex(null)}
        >
          {/* Kartu Modal */}
          <div
            className="eks-modal-card relative bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── Header Banner (pennant / solid color) ── */}
            <div
              className="relative h-32 flex items-center justify-center flex-shrink-0"
              style={{ background: activeTheme.solid + "22" }}  /* 13% opacity */
            >
              {/* Ikon besar transparan di belakang */}
              <span
                className="absolute text-[120px] leading-none pointer-events-none select-none opacity-10"
                aria-hidden="true"
                style={{ color: activeTheme.solid }}
              >
                <i className={`fa-solid ${activeIcon}`} />
              </span>

              {/* Ikon utama solid */}
              <div
                className="relative z-10 w-20 h-20 rounded-[18px] flex items-center justify-center shadow-xl"
                style={{ background: activeTheme.solid }}
              >
                <i className={`fa-solid ${activeIcon} text-4xl text-white`} />
              </div>

              {/* Tombol Tutup */}
              <button
                onClick={() => setActiveIndex(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white transition hover:opacity-80"
                style={{ background: "rgba(0,0,0,0.20)" }}
                aria-label="Tutup"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* ── Body (scrollable) ── */}
            <div className="p-6 overflow-y-auto flex-1">

              {/* Judul */}
              <h3
                id="ekskul-modal-title"
                className="text-2xl font-black text-gray-900 dark:text-white mb-1"
              >
                {activeEkskul.nama}
              </h3>

              {/* Badge */}
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{
                  background: activeTheme.solid + "22",
                  color: activeTheme.solid,
                }}
              >
                <i className={`fa-solid ${activeIcon} text-[10px]`} aria-hidden="true" />
                {activeEkskul.nama}
              </span>

              {/* Deskripsi */}
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                {activeEkskul.deskripsi || `Kegiatan ekstrakurikuler ${activeEkskul.nama} di sekolah kami.`}
              </p>

              {/* Foto utama (jika ada) */}
              {activeEkskul.foto_preview.length > 0 && (
                <div className="relative mb-5 h-44">
                  <Image
                    src={cldThumb(activeEkskul.foto_preview[0].file_foto, 500)}
                    alt={activeEkskul.foto_preview[0].caption || `Foto kegiatan ${activeEkskul.nama}`}
                    fill
                    sizes="(max-width: 640px) 90vw, 448px"
                    className="object-cover rounded-xl shadow-md"
                  />
                </div>
              )}

              {/* Bar album foto (jika album tersedia) */}
              {activeEkskul.album_id && activeEkskul.jml_foto > 0 && (
                <div className="flex items-center justify-between py-3 px-4 rounded-xl border mb-5"
                  style={{
                    background: activeTheme.solid + "11",
                    borderColor: activeTheme.solid + "33",
                  }}
                >
                  <p className="text-xs font-bold flex items-center gap-1.5"
                    style={{ color: activeTheme.solid }}
                  >
                    <i className="fa-solid fa-images" aria-hidden="true" /> FOTO KEGIATAN
                  </p>
                  <Link
                    href={`/galeri?album=${activeEkskul.album_id}`}
                    className="text-xs font-bold text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition flex items-center gap-1"
                  >
                    Lihat Semua ({activeEkskul.jml_foto}){" "}
                    <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
                  </Link>
                </div>
              )}

              {/* Info — Selalu tampil */}
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 mb-5">
                <i className="fa-solid fa-circle-check text-green-500" aria-hidden="true" />
                <span>Kegiatan aktif dan terbuka untuk semua siswa</span>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-6 pb-6 flex-shrink-0">
              <button
                onClick={() => setActiveIndex(null)}
                className="w-full text-white font-bold py-3 rounded-xl transition active:scale-95 hover:opacity-90"
                style={{ background: "#4f46e5" }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}