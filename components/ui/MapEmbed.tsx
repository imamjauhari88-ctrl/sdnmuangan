"use client";

import { useState } from "react";

interface MapEmbedProps {
  src: string;
  title: string;
  className?: string;
}

/**
 * Facade "klik untuk tampilkan peta" untuk embed Google Maps.
 *
 * Google Maps (bahkan versi iframe "output=embed" yang ringan sekalipun)
 * memuat aplikasi peta penuh milik Google DI DALAM iframe tersebut
 * (places.js, main.js, controls.js, dll — total ~400 KB, di luar kendali
 * kode kita karena itu konten cross-origin dari domain Google).
 * `loading="lazy"` di elemen <iframe> saja tidak cukup kalau section
 * peta ada tidak jauh dari initial viewport.
 *
 * Solusinya: JANGAN render <iframe> sama sekali sampai user benar-benar
 * mengklik untuk menampilkan peta. Placeholder ringan (tombol + ikon)
 * ditampilkan dulu; iframe (dan semua beban Google di dalamnya) baru
 * dimuat setelah interaksi. Pola yang sama dipakai untuk facade embed
 * YouTube.
 */
export default function MapEmbed({ src, title, className = "" }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        aria-label={title}
        className={className}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className={`w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 hover:from-teal-100 hover:to-cyan-100 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-colors group cursor-pointer ${className}`}
      aria-label={`Tampilkan ${title}`}
    >
      <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
        <i className="fa-solid fa-map-location-dot text-2xl" aria-hidden="true" />
      </div>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
        Klik untuk tampilkan peta
      </span>
    </button>
  );
}
