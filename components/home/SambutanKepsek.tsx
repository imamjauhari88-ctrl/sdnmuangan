"use client";

import { useState } from "react";
import Image from "next/image";
import { cldTransform } from "@/lib/utils/cloudinary";

interface SambutanKepsekProps {
  namaSekolah: string;
  namaKepsek: string;
  fotoKepsek: string;
  sambutan: string;
}

export default function SambutanKepsek({
  namaSekolah,
  namaKepsek,
  fotoKepsek,
  sambutan,
}: SambutanKepsekProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 relative overflow-hidden"
      aria-label="Sambutan Kepala Sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Photo Section */}
<div className="md:col-span-5 flex justify-center card-animate">
  {/* Ditambahkan padding bawah (pb-6) agar floating badge tidak menutupi elemen di bawahnya */}
  <div className="relative group w-full max-w-sm pb-6">
    
    {/* Background Glow */}
    <div
      className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl transform rotate-3 scale-105 opacity-20 group-hover:rotate-6 transition-all duration-500"
      aria-hidden="true"
    />
    
    {/* Container Foto - Diubah dari aspect-auto menjadi aspect-[3/4] agar memiliki tinggi di mobile */}
    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-gray-700">
      <Image
  src={cldTransform(fotoKepsek, "w_500,h_667,c_fill,g_face,q_auto,f_auto")}
  alt={`Foto ${namaKepsek}, Kepala ${namaSekolah}`}
  fill
  sizes="(max-width: 768px) 90vw, 400px"
  className="object-cover group-hover:scale-105 transition-transform duration-700"
/>
    </div>

    {/* Badge Nama Kepala Sekolah */}
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[85%] glass-card rounded-2xl p-3.5 shadow-xl flex items-center gap-3 border border-white/20 dark:border-slate-700/50">
      {/* Lingkaran Ikon Mahkota */}
      <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
        <i className="fa-solid fa-crown text-base" aria-hidden="true" />
      </div>
      {/* Informasi Nama & Jabatan */}
      <div className="text-left min-w-0 flex-1">
        {namaKepsek && (
          <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white leading-tight break-words">
            {namaKepsek}
          </h3>
        )}
        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mt-1">
          Kepala Sekolah
        </p>
      </div>
    </div>

  </div>
</div>

          {/* Content Section */}
          <div className="md:col-span-7 card-animate" style={{ animationDelay: "0.2s" }}>
            <div className="inline-block mb-3 sm:mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                👋 Sambutan
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-6 text-gray-900 dark:text-white">
              Pesan Kepala Sekolah
            </h2>
            <div className="glass-card border border-gray-100 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm relative">
              <i
                className="fa-solid fa-quote-left absolute top-4 left-4 text-4xl text-blue-500/10 dark:text-white/5"
                aria-hidden="true"
              />
              <div
                className="relative overflow-hidden transition-all duration-500"
                style={{ maxHeight: expanded ? "1000px" : "8rem" }}
              >
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed relative z-10 font-medium whitespace-pre-line">
                  {sambutan}
                </p>
              </div>
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls="sambutan-konten"
                className="mt-4 font-bold text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-2"
              >
                <span>{expanded ? "Tutup" : "Baca Selengkapnya"}</span>
                <i
                  className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}