/**
 * Skeleton untuk halaman /berita (list + featured + filter + pagination).
 * Suspense fallback selagi getPengaturan() + getBeritaList() masih
 * berjalan di Server Component app/(public)/berita/page.tsx.
 */
export default function BeritaLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat daftar berita">
      {/* HERO */}
      <section className="relative w-full min-h-[80vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900 px-4">
        <div className="relative z-10 max-w-3xl w-full text-center">
          <div className="skeleton h-8 w-44 rounded-full mx-auto mb-6 bg-white/10" />
          <div className="skeleton h-12 sm:h-14 w-full max-w-xl rounded-xl mx-auto mb-4 bg-white/10" />
          <div className="skeleton h-5 w-2/3 max-w-md rounded-md mx-auto bg-white/10" />
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="skeleton h-6 w-32 rounded-full mx-auto mb-3" />
            <div className="skeleton h-9 w-56 rounded-lg mx-auto" />
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 items-start sm:items-center">
            <div className="skeleton w-full sm:flex-1 h-12 rounded-xl" />
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-9 w-24 rounded-full flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* FEATURED ARTICLE */}
          <div className="mb-10">
            <div className="skeleton h-64 sm:h-80 md:h-96 w-full rounded-2xl mb-4" />
            <div className="skeleton h-3 w-28 rounded-md mb-2.5" />
            <div className="skeleton h-6 w-3/4 rounded-md mb-2.5" />
            <div className="skeleton h-4 w-full max-w-xl rounded-md" />
          </div>

          {/* GRID BERITA */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
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

          {/* PAGINATION */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-9 w-9 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
