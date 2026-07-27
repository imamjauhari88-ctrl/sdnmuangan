import Link from "next/link";

/**
 * 404 paling luar (root) — dipakai Next.js untuk URL yang SAMA SEKALI
 * tidak cocok dengan route manapun (mis. typo /berta, link rusak dari
 * luar) di luar cakupan app/(public)/**.
 *
 * Sengaja mandiri (tanpa Navbar/Footer asli, tanpa fetch getPengaturan)
 * supaya tetap ringan & pasti tampil walau data sekolah belum ke-load.
 * Boleh Server Component biasa (bukan exception, jadi tidak wajib
 * "use client" seperti app/error.tsx).
 */
export default function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full text-center">
        <p className="text-6xl font-black text-blue-200 dark:text-blue-900 mb-2 select-none">404</p>
        <h1 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Alamat yang kamu tuju tidak ada di situs ini.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
