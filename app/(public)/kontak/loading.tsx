/**
 * Skeleton untuk halaman /kontak.
 * Suspense fallback selagi getPengaturan() masih berjalan di server.
 * Sama seperti Profil, dibuat representatif untuk tiap section.
 */
export default function KontakLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat halaman kontak">
      {/* HERO */}
      <section className="relative w-full min-h-[calc(100dvh-var(--header-h))] flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-slate-950 px-4">
        <div className="relative z-10 max-w-3xl w-full text-center">
          <div className="skeleton w-16 h-16 rounded-2xl mx-auto mb-4 bg-white/10" />
          <div className="skeleton h-12 sm:h-14 w-full max-w-xl rounded-xl mx-auto mb-4 bg-white/10" />
          <div className="skeleton h-5 w-2/3 max-w-sm rounded-md mx-auto mb-8 bg-white/10" />
          <div className="skeleton h-12 w-40 rounded-xl mx-auto bg-white/10" />
        </div>
      </section>

      {/* INFO & FORM */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <div className="skeleton h-6 w-40 rounded-full mx-auto mb-4" />
            <div className="skeleton h-9 w-56 rounded-lg mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Kartu Informasi */}
            <div className="lg:col-span-5 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-20 w-full rounded-2xl" />
              ))}
            </div>

            {/* Formulir */}
            <div className="lg:col-span-7">
              <div className="skeleton h-[420px] w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="py-12 sm:py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <div className="skeleton h-8 w-48 rounded-lg mx-auto mb-2" />
            <div className="skeleton h-4 w-64 rounded-md mx-auto" />
          </div>
          <div className="skeleton w-full h-[350px] md:h-[450px] lg:h-[500px] rounded-3xl" />
        </div>
      </section>
    </div>
  );
}
