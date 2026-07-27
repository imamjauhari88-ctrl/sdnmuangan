/**
 * Skeleton untuk halaman /galeri.
 *
 * Catatan: halaman ini punya 2 mode di Server Component yang SAMA
 * (app/(public)/galeri/page.tsx) — daftar album (?tanpa album_id)
 * dan foto-dalam-album (?album_id=...). Karena keduanya berbagi satu
 * route segment, loading.tsx ini juga dipakai bersama untuk kedua
 * mode. Skeleton dibuat generik: grid kartu bergambar — cocok untuk
 * cover album maupun thumbnail foto, cuma beda ada tidaknya 2 baris
 * teks di bawah gambar (untuk mode foto, 2 baris itu sekadar tidak
 * kepakai sebentar sebelum foto asli muncul, gak masalah).
 */
export default function GaleriLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat galeri">
      {/* HERO */}
      <section className="relative w-full min-h-[80vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900 px-4">
        <div className="relative z-10 max-w-3xl w-full text-center">
          <div className="skeleton h-8 w-36 rounded-full mx-auto mb-6 bg-white/10" />
          <div className="skeleton h-12 sm:h-14 w-full max-w-lg rounded-xl mx-auto mb-4 bg-white/10" />
          <div className="skeleton h-5 w-2/3 max-w-md rounded-md mx-auto bg-white/10" />
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-950 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER + SEARCH */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="skeleton h-6 w-20 rounded-full mb-3" />
              <div className="skeleton h-9 w-52 rounded-lg" />
            </div>
            <div className="skeleton h-11 w-full sm:w-64 rounded-xl" />
          </div>

          {/* GRID KARTU (album cover / foto) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                <div className="skeleton h-36 sm:h-40 md:h-44 w-full" />
                <div className="p-3.5 sm:p-4 space-y-2">
                  <div className="skeleton h-4 w-full rounded-md" />
                  <div className="skeleton h-3 w-2/3 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
