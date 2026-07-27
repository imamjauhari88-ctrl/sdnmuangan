"use client";

import { useState } from "react";
import Image from "next/image";

interface SejarahSekolahProps {
  sejarah: string;
  fotoSejarah: string;
  namaSekolah: string;
  tahunBerdiri: string;
  akreditasi: string;
}

export default function SejarahSekolah({
  sejarah,
  fotoSejarah,
  namaSekolah,
  tahunBerdiri,
  akreditasi,
}: SejarahSekolahProps) {
  const [expanded, setExpanded] = useState(false);

  const tahunNum = parseInt(tahunBerdiri, 10);
  const currentYear = new Date().getFullYear();
  const milestones: [string, string][] = !isNaN(tahunNum)
    ? [
        [String(tahunNum), "Sekolah didirikan dan mulai beroperasi"],
        [String(tahunNum + 5), "Penambahan ruang belajar dan fasilitas"],
        ["2010", `Raih akreditasi ${akreditasi || "A"}`],
        [String(currentYear - 3), "Peluncuran website & sistem digital sekolah"],
        [String(currentYear), "Terus berinovasi untuk pendidikan terbaik"],
      ]
    : [];

  return (
    <section
      id="sejarah-section"
      className="py-14 sm:py-20 bg-gray-50 dark:bg-gray-950 scroll-mt-16"
      aria-label="Sejarah sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            📚 Perjalanan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3">
            Sejarah Sekolah
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-yellow-400 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Foto / Timeline fallback */}
          <div className="card-animate" style={{ animationDelay: "0.1s" }}>
            {fotoSejarah ? (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 group h-72 sm:h-96">
                <Image
                  src={fotoSejarah}
                  alt={`Foto sejarah ${namaSekolah}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : milestones.length > 0 ? (
              <div className="glass-card rounded-3xl p-8 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">
                  Jejak Perjalanan
                </h3>
                <div className="timeline" aria-label="Timeline sejarah sekolah">
                  {milestones.map((m, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-dot" aria-hidden="true" />
                      <p className="text-xs font-black text-blue-600 dark:text-blue-400 mb-1">{m[0]}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{m[1]}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Konten sejarah */}
          <div className="card-animate" style={{ animationDelay: "0.2s" }}>
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-amber-100 dark:border-amber-900/30 shadow-sm relative">
              <i
                className="fa-solid fa-quote-left absolute top-5 right-5 text-5xl text-amber-400/10"
                aria-hidden="true"
              />

              {sejarah ? (
                <>
                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{ maxHeight: expanded ? "none" : "10rem" }}
                  >
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-line">
                      {sejarah}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpanded((v) => !v)}
                    aria-expanded={expanded}
                    className="mt-5 text-amber-600 dark:text-amber-400 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all hover:underline"
                  >
                    <span>{expanded ? "Tutup Sejarah" : "Baca Selengkapnya"}</span>
                    <i className={`fa-solid ${expanded ? "fa-chevron-up" : "fa-arrow-right"}`} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <i className="fa-solid fa-clock-rotate-left text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                    Sejarah sekolah belum diisi.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
