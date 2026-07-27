/**
 * Skeleton untuk halaman Beranda ("/").
 *
 * File ini otomatis dipakai Next.js App Router sebagai fallback
 * Suspense selagi Server Component di app/(public)/page.tsx masih
 * nunggu data (getPengaturan + getBerandaData). Beranda pakai ISR
 * (revalidate 60 detik), jadi skeleton ini biasanya cuma kelihatan
 * pas cache kosong/lagi di-refresh — bukan tiap kali halaman dibuka.
 *
 * Karena Beranda punya banyak sekali section, skeleton di bawah
 * dibuat representatif untuk section-section utama (Hero, Statistik,
 * grid berita/prestasi) dan generik untuk sisanya — bukan niru
 * detail semua 14 section satu-satu.
 */
export default function BerandaLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat halaman beranda">
      {/* HERO */}
      <section className="relative min-h-screen sm:min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950">
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center py-12 sm:py-0 px-4">
          <div className="skeleton h-8 w-56 rounded-full mx-auto mb-8 bg-white/10" />
          <div className="skeleton h-4 w-40 rounded-md mx-auto mb-3 bg-white/10" />
          <div className="skeleton h-12 sm:h-16 w-full max-w-2xl rounded-xl mx-auto mb-6 bg-white/10" />
          <div className="skeleton h-6 w-2/3 max-w-lg rounded-md mx-auto mb-4 bg-white/10" />
          <div className="skeleton h-4 w-full max-w-xl rounded-md mx-auto mb-12 bg-white/10" />
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="skeleton h-14 w-full sm:w-48 rounded-xl bg-white/10" />
            <div className="skeleton h-14 w-full sm:w-48 rounded-xl bg-white/10" />
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <div className="skeleton h-6 w-28 rounded-full mx-auto mb-4" />
            <div className="skeleton h-9 w-64 rounded-lg mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="glass-card p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center"
              >
                <div className="skeleton w-14 sm:w-16 h-14 sm:h-16 rounded-2xl mb-4 sm:mb-6" />
                <div className="skeleton h-9 w-16 rounded-md mb-2" />
                <div className="skeleton h-3 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISI MISI (blok teks 2 kolom) */}
      <section className="py-14 sm:py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="skeleton h-6 w-24 rounded-full mx-auto mb-4" />
            <div className="skeleton h-9 w-52 rounded-lg mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="skeleton h-40 rounded-2xl" />
            <div className="skeleton h-40 rounded-2xl" />
          </div>
        </div>
      </section>

      {/* SAMBUTAN KEPSEK (foto + teks) */}
      <section className="py-14 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-10 items-center">
          <div className="skeleton aspect-[3/4] max-w-sm mx-auto w-full rounded-3xl" />
          <div className="space-y-3">
            <div className="skeleton h-6 w-40 rounded-md" />
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-4 w-3/4 rounded-md" />
          </div>
        </div>
      </section>

      {/* BERITA TERBARU (grid kartu) */}
      <section className="py-14 sm:py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="skeleton h-6 w-28 rounded-full mx-auto mb-4" />
            <div className="skeleton h-9 w-56 rounded-lg mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="skeleton h-48 w-full" />
                <div className="p-5 space-y-2.5">
                  <div className="skeleton h-3 w-24 rounded-md" />
                  <div className="skeleton h-4 w-full rounded-md" />
                  <div className="skeleton h-4 w-2/3 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESTASI (grid kartu, sama pola dengan berita) */}
      <section className="py-14 sm:py-20 bg-amber-50/40 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="skeleton h-6 w-28 rounded-full mx-auto mb-4" />
            <div className="skeleton h-9 w-56 rounded-lg mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="skeleton h-44 w-full" />
                <div className="p-5 space-y-2.5">
                  <div className="skeleton h-4 w-full rounded-md" />
                  <div className="skeleton h-3 w-1/2 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION GENERIK: sisanya (Kalender, Ekstrakurikuler, Testimoni,
          Layanan, Maps) — cukup blok generik biar gak berlebihan, karena
          skeleton ini biasanya cuma kelihatan sekilas */}
      <section className="py-14 sm:py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="skeleton h-9 w-64 rounded-lg mx-auto" />
          <div className="skeleton h-72 w-full rounded-2xl" />
        </div>
      </section>
    </div>
  );
}
