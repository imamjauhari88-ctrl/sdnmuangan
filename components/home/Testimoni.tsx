"use client";

import { useState } from "react";
import type { TestimoniItem } from "@/lib/data/beranda";

interface TestimoniProps {
  testimoni: TestimoniItem[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400" role="img" aria-label={`Rating ${rating} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={`fa-solid fa-star text-xs ${i > rating ? "text-gray-200 dark:text-gray-700" : ""}`} />
      ))}
    </div>
  );
}

const INITIAL_COUNT = 4;

export default function Testimoni({ testimoni }: TestimoniProps) {
  const [showAll, setShowAll] = useState(false);

  if (testimoni.length === 0) return null;

  const visible = showAll ? testimoni : testimoni.slice(0, INITIAL_COUNT);

  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
      aria-label="Testimoni wali murid"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span
            className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            💬 Kata Mereka
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Testimoni Wali Murid
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-rose-500 to-pink-400 mx-auto rounded-full mt-3" />
        </div>

        <div className="testimonial-track" role="list">
          {visible.map((t, i) => (
            <div
              key={i}
              className="testimonial-card card-animate"
              style={{ animationDelay: `${(i % INITIAL_COUNT) * 0.1}s` }}
              role="listitem"
            >
              <StarRating rating={t.rating} />
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed my-4 line-clamp-4">
                &ldquo;{t.pesan}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div
                  className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm flex-shrink-0"
                  aria-hidden="true"
                >
                  {t.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{t.nama}</p>
                  {t.kelompok && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">Wali Kelas {t.kelompok}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimoni.length > INITIAL_COUNT && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
            >
              {showAll ? "Tampilkan Lebih Sedikit" : `Lihat ${testimoni.length - INITIAL_COUNT} Testimoni Lainnya`}
              <i className={`fa-solid fa-chevron-down text-xs transition-transform ${showAll ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
