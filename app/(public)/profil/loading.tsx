/**
 * Skeleton untuk halaman /profil.
 * Suspense fallback selagi getPengaturan() + getProfilData() masih
 * berjalan. Sama seperti Beranda, halaman ini punya banyak section —
 * skeleton dibuat representatif untuk section utama, generik untuk
 * sisanya.
 */
export default function ProfilLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat profil sekolah">
      {/* HERO */}
      <section className="relative w-full min-h-[80vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900 px-4">
        <div className="relative z-10 max-w-3xl w-full text-center">
          <div className="skeleton h-8 w-40 rounded-full mx-auto mb-6 bg-white/10" />
          <div className="skeleton h-12 sm:h-14 w-full max-w-xl rounded-xl mx-auto mb-4 bg-white/10" />
          <div className="skeleton h-5 w-1/2 max-w-sm rounded-md mx-auto bg-white/10" />
        </div>
      </section>

      {/* ANCHOR NAV */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton h-8 w-24 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* PROFIL SINGKAT (teks) */}
      <section className="py-14 sm:py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="skeleton h-6 w-32 rounded-full mx-auto mb-4" />
          <div className="skeleton h-4 w-full rounded-md" />
          <div className="skeleton h-4 w-full rounded-md" />
          <div className="skeleton h-4 w-2/3 rounded-md mx-auto" />
        </div>
      </section>

      {/* VISI MISI */}
      <section className="py-14 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-6">
          <div className="skeleton h-40 rounded-2xl" />
          <div className="skeleton h-40 rounded-2xl" />
        </div>
      </section>

      {/* INFO SEKOLAH (grid statistik) */}
      <section className="py-14 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="skeleton h-6 w-24 rounded-full mx-auto mb-3" />
            <div className="skeleton h-9 w-44 rounded-lg mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
                <div className="skeleton w-12 h-12 rounded-full mb-3" />
                <div className="skeleton h-3 w-14 rounded-md mb-2" />
                <div className="skeleton h-5 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FASILITAS */}
      <section className="py-14 sm:py-20 bg-gray-50 dark:bg-[#070c17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="skeleton h-6 w-36 rounded-full mx-auto mb-3" />
            <div className="skeleton h-9 w-52 rounded-lg mx-auto" />
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton w-[140px] sm:w-[180px] h-[180px] sm:h-[210px] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      {/* STRUKTUR ORGANISASI (gambar) */}
      <section className="py-14 sm:py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-6 w-40 rounded-full mx-auto mb-3" />
          <div className="skeleton h-9 w-56 rounded-lg mx-auto mb-8" />
          <div className="skeleton w-full aspect-[4/3] rounded-3xl" />
        </div>
      </section>

      {/* SEJARAH (foto + teks) */}
      <section className="py-14 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-10 items-center">
          <div className="skeleton h-72 sm:h-96 rounded-3xl" />
          <div className="space-y-3">
            <div className="skeleton h-6 w-40 rounded-md" />
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-4 w-3/4 rounded-md" />
          </div>
        </div>
      </section>

      {/* KONTAK RINGKAS */}
      <section className="py-14 sm:py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-40 w-full rounded-2xl" />
        </div>
      </section>
    </div>
  );
}
