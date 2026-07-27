"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Error boundary untuk semua halaman PUBLIK (app/(public)/**).
 *
 * Wajib Client Component ("use client") — ini aturan Next.js App
 * Router, bukan pilihan. Karena Client Component, di sini TIDAK bisa
 * fetch data server (getPengaturan dsb), makanya kontennya statis
 * (tidak pakai nama sekolah dinamis).
 *
 * Boundary ini otomatis menangkap error dari SEMUA halaman di dalam
 * app/(public)/ yang tidak punya error.tsx sendiri (Beranda, Berita,
 * Galeri, Profil, GTK, Kontak, PPDB) — cukup satu file untuk semuanya.
 * Navbar & Footer dari app/(public)/layout.tsx tetap tampil normal di
 * sekitar boundary ini (cuma bagian halaman yang error yang diganti).
 *
 * Catatan keamanan: `error.message` sengaja TIDAK ditampilkan ke
 * pengunjung (bisa bocorin detail internal/query database). Cuma
 * `error.digest` (kode referensi log Vercel) yang ditampilkan, dan
 * detail lengkapnya di-log ke console lewat useEffect untuk debugging.
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[PublicError]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full text-center glass-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 sm:p-10">
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 flex items-center justify-center text-4xl mx-auto mb-6">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white mb-2">
          Ups, Ada yang Salah
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Halaman ini gagal dimuat. Ini bukan salah kamu — coba muat ulang,
          atau kembali dulu ke beranda.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" /> Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-house" aria-hidden="true" /> Kembali ke Beranda
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-[11px] text-gray-300 dark:text-gray-600 font-mono select-all">
            Kode referensi: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
