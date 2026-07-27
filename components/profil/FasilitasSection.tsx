"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { getWarna } from "@/lib/utils/warna";
import type { FasilitasWithCount } from "@/lib/data/profil";

interface FasilitasSectionProps {
  fasilitasList: FasilitasWithCount[];
}

export default function FasilitasSection({ fasilitasList }: FasilitasSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeFasilitas = activeIndex !== null ? fasilitasList[activeIndex] : null;
  const activeWarna = activeFasilitas ? getWarna(activeFasilitas.color) : null;

  const [mounted, setMounted] = useState(false);

  // Portal butuh document, jadi baru tersedia setelah mount di client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  return (
    <section
      id="fasilitas-section"
      className="py-14 sm:py-20 bg-gray-50 dark:bg-[#070c17] scroll-mt-16 transition-colors duration-300"
      aria-label="Fasilitas sekolah"
    >
      <style jsx global>{`
        /* Hover kartu fasilitas — sama persis dengan kartu ekskul */
        .fasil-card-btn { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .fasil-card-btn:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(0,0,0,0.1); }
        .fasil-card-btn:hover .fasil-icon-wrap { transform: scale(1.15) rotate(-5deg); }
        .fasil-icon-wrap { transition: transform 0.3s; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-4 py-1.5 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            🏫 Sarana &amp; Prasarana
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3">
            Fasilitas Sekolah
          </h2>
          {fasilitasList.length > 0 && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              Fasilitas lengkap untuk menunjang kegiatan belajar mengajar yang nyaman dan berkualitas
              <br />
              <span className="text-xs text-teal-500 dark:text-teal-400 font-bold mt-1.5 inline-block">
                ✨ Klik kartu untuk melihat detail
              </span>
            </p>
          )}
          <div className="h-1 w-12 bg-cyan-400 mx-auto rounded-full mt-3" />
        </div>

        {/* Grid / List Kartu Fasilitas */}
        {fasilitasList.length === 0 ? (
          <div className="text-center py-10">
            <i className="fa-solid fa-building text-4xl text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Data fasilitas belum tersedia.
            </p>
          </div>
        ) : (
          /* Menggunakan flex wrap agar sisa kartu baris kedua otomatis rata tengah */
          <div 
            className="flex flex-wrap justify-center gap-4" 
            role="list" 
            aria-label="Daftar fasilitas sekolah"
          >
            {fasilitasList.map((fas, i) => {
              const w = getWarna(fas.color);
              return (
                <button
                  key={fas.id}
                  type="button"
                  className="fasil-card-btn w-[130px] flex-shrink-0 flex flex-col items-center text-center p-5 px-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  onClick={() => setActiveIndex(i)}
                  role="listitem"
                  aria-label={`Lihat detail fasilitas ${fas.nama}`}
                >
                  {/* Ikon */}
                  <div
                    className={`fasil-icon-wrap w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl mb-[10px] ${w.iconBg}`}
                    aria-hidden="true"
                  >
                    <i className={`fa-solid ${fas.icon}`} />
                  </div>

                  {/* Nama */}
                  <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white leading-snug">
                    {fas.nama}
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
        )}
      </div>

      {/* Modal Detail Fasilitas
          Dirender lewat portal ke document.body supaya "fixed" benar-benar
          relatif ke viewport, tidak kena efek transform dari
          .page-transition (app/(public)/template.tsx) yang bisa bikin
          modal tidak pas di tengah layar. */}
      {mounted && activeFasilitas && activeWarna && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fasilitas-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveIndex(null);
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
          <div className="relative z-10 bg-white dark:bg-[#1a2332] border border-gray-100 dark:border-slate-800/80 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div
              className="h-32 flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${activeWarna.hex.light} 0%, ${activeWarna.hex.bg} 100%)`,
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-xl"
                style={{ color: activeWarna.hex.bg, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
              >
                <i className={`fa-solid ${activeFasilitas.icon} text-4xl`} />
              </div>
              <button
                onClick={() => setActiveIndex(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition"
                aria-label="Tutup detail fasilitas"
              >
                <i className="fa-solid fa-xmark text-white" />
              </button>
            </div>

            <div className="p-6">
              <h3 id="fasilitas-modal-title" className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                {activeFasilitas.nama}
              </h3>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full inline-block"
                style={{ background: activeWarna.hex.light, color: activeWarna.hex.text }}
              >
                <i className={`fa-solid ${activeFasilitas.icon} mr-1`} /> {activeFasilitas.nama}
              </p>

              {activeFasilitas.deskripsi && (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                  {activeFasilitas.deskripsi}
                </p>
              )}

              {activeFasilitas.gambar && (
                <div className="relative mb-5 h-44">
                  <Image
                    src={activeFasilitas.gambar}
                    alt={activeFasilitas.nama}
                    fill
                    sizes="(max-width: 640px) 90vw, 448px"
                    className="object-cover rounded-xl shadow-md"
                  />
                </div>
              )}

              {activeFasilitas.album_id && activeFasilitas.jml_foto > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-images" /> FOTO FASILITAS
                    </p>
                    <Link
                      href={`/galeri?album=${activeFasilitas.album_id}`}
                      className="text-xs font-bold text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition flex items-center gap-1"
                    >
                      Lihat Semua ({activeFasilitas.jml_foto}) <i className="fa-solid fa-arrow-right text-[9px]" />
                    </Link>
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveIndex(null)}
                className="w-full text-white font-bold py-3 rounded-xl transition active:scale-95"
                style={{ background: activeWarna.hex.bg }}
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