"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cldTransform } from "@/lib/utils/cloudinary";

interface ProfilSingkatProps {
  namaSekolah: string;
  namaKepsek: string;
  fotoKepsek: string;
  sambutan: string;
  visi: string;
  misi: string;
  statusSekolah: string;
  akreditasi: string;
  lokasi: string;
  tahunBerdiri: string;
}

/** Parse misi: bisa berupa <li>...</li> HTML atau baris terpisah newline */
function parseMisiLines(misi: string): string[] {
  if (!misi) return [];
  if (misi.includes("<li>")) {
    const matches = [...misi.matchAll(/<li>([^]*?)<\/li>/g)];
    return matches.map((m) => m[1].replace(/<[^>]*>/g, "").trim()).filter(Boolean);
  }
  return misi
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Gabungan 3 section lama (Sambutan Kepsek + Visi Misi + Profil Kompak)
 * jadi satu section "Profil Singkat". Sebelumnya ketiganya berurutan
 * sendiri-sendiri dan isinya saling tumpang tindih (sama-sama identitas
 * sekolah) — sekarang dilebur supaya beranda lebih ringkas.
 */
export default function ProfilSingkat({
  namaSekolah,
  namaKepsek,
  fotoKepsek,
  sambutan,
  visi,
  misi,
  statusSekolah,
  akreditasi,
  lokasi,
  tahunBerdiri,
}: ProfilSingkatProps) {
  const [expanded, setExpanded] = useState(false);
  const misiLines = parseMisiLines(misi);
  const misiPreview = misiLines.slice(0, 3);
  const adaLebih = misiLines.length > 3;

  const profiles = [
    { icon: "fa-building-columns", label: "Status", value: `Sekolah ${statusSekolah}` },
    { icon: "fa-award", label: "Akreditasi", value: akreditasi },
    { icon: "fa-map-pin", label: "Lokasi", value: lokasi },
    { icon: "fa-calendar-check", label: "Berdiri", value: tahunBerdiri },
  ];

  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800"
      aria-label="Profil singkat sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-block mb-3 sm:mb-4">
            🏫 Mengenal Kami
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 dark:text-white mb-2 sm:mb-4">
            Profil Sekolah
          </h2>
          <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-teal-600 to-amber-500 mx-auto rounded-full" />
        </div>

        {/* Data pokok — dulu section ProfilKompak sendiri */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12" role="list">
          {profiles.map((p) => (
            <div
              key={p.label}
              className="glass-card p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
              role="listitem"
            >
              <div
                className="w-12 h-12 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3"
                aria-hidden="true"
              >
                <i className={`fa-solid ${p.icon} text-2xl`} />
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                {p.label}
              </p>
              <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">{p.value}</h3>
            </div>
          ))}
        </div>

        {/* Sambutan Kepsek + Visi Misi berdampingan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-start">
          {/* Foto & Sambutan Kepsek */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-xs">
              <div
                className="absolute inset-0 bg-gradient-to-br from-teal-500 to-amber-400 rounded-3xl transform rotate-3 scale-105 opacity-20 group-hover:rotate-6 transition-all duration-500"
                aria-hidden="true"
              />
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-gray-700">
                <Image
                  src={cldTransform(fotoKepsek, "w_500,h_667,c_fill,g_face,q_auto,f_auto")}
                  alt={`Foto ${namaKepsek}, Kepala ${namaSekolah}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] glass-card rounded-2xl p-3.5 shadow-xl flex items-center gap-3 border border-white/20 dark:border-slate-700/50">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <i className="fa-solid fa-crown text-base" aria-hidden="true" />
                </div>
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

            {/* Jarak ekstra (mt-12) supaya badge nama tidak "dempet" dengan kartu sambutan */}
            <div className="glass-card border border-gray-100 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-sm relative w-full mt-12">
              <i
                className="fa-solid fa-quote-left absolute top-4 left-4 text-3xl text-teal-500/10 dark:text-white/5"
                aria-hidden="true"
              />
              <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400 mb-3 relative z-10">
                Sambutan
              </p>
              <div
                className="relative overflow-hidden transition-all duration-500"
                style={{ maxHeight: expanded ? "1000px" : "6.5rem" }}
              >
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed relative z-10 font-medium whitespace-pre-line">
                  {sambutan}
                </p>
              </div>
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-4 font-bold text-sm text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors flex items-center gap-2"
              >
                <span>{expanded ? "Tutup" : "Baca Sambutan Selengkapnya"}</span>
                <i
                  className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* Visi & Misi — satu kartu, tanpa header "Visi"/"Misi" terpisah
              (sudah terwakili oleh eyebrow label + ukuran teks kutipan) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="glass-card border border-gray-100 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm flex-1">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-5 h-px bg-teal-600 dark:bg-teal-400" aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
                  Visi &amp; Misi Sekolah
                </p>
              </div>

              <p className="text-xl sm:text-2xl font-serif font-black text-gray-900 dark:text-white leading-snug mb-6">
                &ldquo;{visi}&rdquo;
              </p>

              {misiPreview.length > 0 ? (
                <ul className="space-y-3" role="list">
                  {misiPreview.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-200"
                    >
                      <span className="flex-shrink-0 font-mono text-xs font-bold text-teal-700 dark:text-teal-400 mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {line}
                    </li>
                  ))}
                  {adaLebih && (
                    <li className="text-xs text-gray-400 dark:text-gray-500 italic pl-8">
                      + {misiLines.length - 3} poin lainnya...
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">Data misi belum tersedia.</p>
              )}
            </div>

            <div className="text-center sm:text-left mt-6">
              <Link
                href="/profil#profil-section"
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-1 transition-all active:scale-95"
              >
                Lihat Profil Lengkap Sekolah <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
