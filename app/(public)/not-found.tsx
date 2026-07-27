import Link from "next/link";

/**
 * Halaman untuk kasus notFound() di dalam app/(public)/** — misalnya
 * app/(public)/berita/[id]/page.tsx memanggil notFound() kalau ID
 * berita tidak ada di database.
 *
 * Beda dari error.tsx: ini BUKAN Client Component wajib (boleh Server
 * Component biasa), karena notFound() bukan exception JavaScript —
 * ini sinyal routing Next.js sendiri. Karena masih di dalam
 * app/(public)/layout.tsx, Navbar & Footer tetap tampil normal di
 * sekitar pesan ini.
 */
export default function PublicNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full text-center glass-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 sm:p-10">
        <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 flex items-center justify-center text-4xl mx-auto mb-6">
          <i className="fa-solid fa-compass" aria-hidden="true" />
        </div>

        <p className="text-5xl font-black text-gray-200 dark:text-gray-700 mb-2 select-none">404</p>
        <h1 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Konten yang kamu cari mungkin sudah dihapus, dipindahkan, atau
          alamatnya salah ketik.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-house" aria-hidden="true" /> Kembali ke Beranda
          </Link>
          <Link
            href="/berita"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-newspaper" aria-hidden="true" /> Lihat Berita
          </Link>
        </div>
      </div>
    </div>
  );
}
