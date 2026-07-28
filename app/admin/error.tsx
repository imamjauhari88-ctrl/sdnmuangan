"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Error boundary untuk semua halaman ADMIN (app/admin/**), sama
 * perannya seperti app/(public)/error.tsx untuk sisi publik — cukup
 * satu file ini yang menangkap error dari seluruh modul admin
 * (Berita, Galeri, Fasilitas, Ekstrakurikuler, GTK, Hari Libur, PPDB,
 * Pesan, Pengaturan) yang belum punya error.tsx sendiri.
 *
 * Sidebar & Topbar dari AdminShell (app/admin/layout.tsx) tetap tampil
 * normal di sekitar boundary ini — cuma bagian <main> yang error yang
 * diganti, staf tidak kehilangan navigasi saat satu modul error.
 *
 * Wajib Client Component ("use client") — aturan Next.js App Router
 * untuk error.tsx, bukan pilihan.
 *
 * Catatan keamanan: `error.message` sengaja TIDAK ditampilkan (bisa
 * bocorin detail query/tabel Supabase). Cuma `error.digest` yang
 * ditampilkan buat referensi log, detail lengkap di-log ke console.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AdminError]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 sm:p-10">
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 flex items-center justify-center text-4xl mx-auto mb-6">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white mb-2">
          Gagal Memuat Data
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Ada masalah saat mengambil data halaman ini. Bukan salah kamu — coba
          muat ulang, atau kembali dulu ke dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-amber-600 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" /> Coba Lagi
          </button>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-gauge-high" aria-hidden="true" /> Ke Dashboard
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
