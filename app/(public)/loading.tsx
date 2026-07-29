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
 * dibuat representatif untuk section-section utama (Hero — termasuk
 * panel statistiknya, grid berita/prestasi) dan generik untuk sisanya
 * — bukan niru detail semua section satu-satu.
 */
export default function BerandaLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat halaman beranda">
      {/* HERO */}
      <section className="relative w-full min-h-[calc(100dvh-var(--header-h))] flex items-center overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-slate-950">
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
            {/* KIRI: badge, judul, deskripsi, tombol */}
            <div className="flex-1 flex flex-col items-center lg:items-start">
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-7 w-24 sm:w-28 rounded-full bg-white/10" />
                ))}
              </div>
              <div className="skeleton h-9 sm:h-11 w-full max-w-md rounded-xl mb-3 bg-white/10" />
              <div className="skeleton h-9 sm:h-11 w-2/3 max-w-[14rem] rounded-xl mb-5 bg-white/10" />
              <div className="skeleton h-4 w-full max-w-xl rounded-md mb-2 bg-white/10" />
              <div className="skeleton h-4 w-3/4 max-w-md rounded-md mb-8 bg-white/10" />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="skeleton h-12 w-full sm:w-40 rounded-lg bg-white/10" />
                <div className="skeleton h-12 w-full sm:w-40 rounded-lg bg-white/10" />
              </div>
            </div>

            {/* KANAN: panel data pokok sekolah */}
            <div className="lg:pl-12 lg:border-l lg:border-white/15 w-full lg:w-auto">
              <div className="skeleton h-3 w-36 rounded-md mx-auto lg:mx-0 mb-5 bg-white/10" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:gap-x-10 sm:gap-y-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center lg:items-start">
                    <div className="skeleton h-9 w-14 rounded-md mb-2 bg-white/10" />
                    <div className="skeleton h-3 w-20 rounded-md bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
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
