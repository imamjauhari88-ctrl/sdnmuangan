/**
 * Skeleton untuk halaman /berita/[id] (detail artikel).
 * Suspense fallback selagi getBeritaDetail() + getPengaturan() masih
 * berjalan di Server Component app/(public)/berita/[id]/page.tsx.
 */
export default function BeritaDetailLoading() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen" aria-busy="true" aria-label="Memuat artikel berita">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="skeleton h-5 w-40 rounded-md" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* KOLOM KIRI: ARTIKEL */}
          <div className="lg:col-span-2">
            <article className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 overflow-hidden">
              <div className="skeleton w-full h-[300px] md:h-[450px]" />

              <div className="p-6 md:p-10">
                <div className="skeleton h-9 w-full rounded-md mb-2.5" />
                <div className="skeleton h-9 w-2/3 rounded-md mb-6" />

                <div className="flex flex-wrap items-center gap-6 border-b dark:border-gray-800 pb-6 mb-8">
                  <div className="skeleton h-4 w-32 rounded-md" />
                  <div className="skeleton h-4 w-28 rounded-md" />
                </div>

                <div className="space-y-3.5 mb-10">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={`skeleton h-4 rounded-md ${i === 5 ? "w-2/3" : "w-full"}`} />
                  ))}
                </div>

                <div className="pt-8 border-t dark:border-gray-800 flex items-center gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton h-9 w-9 rounded-full" />
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* KOLOM KANAN: SIDEBAR "TERBARU" */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm">
              <div className="skeleton h-6 w-24 rounded-md mb-6" />

              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="skeleton w-20 h-20 flex-shrink-0 rounded-2xl" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="skeleton h-3 w-full rounded-md" />
                      <div className="skeleton h-3 w-2/3 rounded-md" />
                      <div className="skeleton h-2.5 w-16 rounded-md mt-2" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="skeleton h-11 w-full rounded-xl mt-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
