import React from "react";

/**
 * Skeleton untuk konten di bawah Hero halaman GTK.
 *
 * Halaman GTK adalah Server Component (getGtkList() di
 * app/(public)/gtk/page.tsx berjalan di server), jadi komponen ini
 * dipakai sebagai bagian dari app/(public)/gtk/loading.tsx (Suspense
 * fallback saat navigasi/fetch berjalan). Struktur & className di
 * bawah sengaja dibuat semirip mungkin dengan StafSection.tsx supaya
 * tidak ada "loncatan" tata letak (layout shift) saat data asli masuk.
 */
export default function GtkSkeleton() {
  return (
    <section
      className="py-14 sm:py-20 bg-gray-50 dark:bg-gray-900"
      aria-busy="true"
      aria-label="Memuat data guru dan tenaga kependidikan"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search & filter bar (dummy, non-interaktif) */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 items-start sm:items-center">
          <div className="skeleton w-full sm:flex-1 h-12 rounded-xl" />
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-9 w-24 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Featured: Kepala Sekolah */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md glass-card rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-7 flex flex-col sm:flex-row items-center gap-5">
            <div className="skeleton w-24 h-24 rounded-full flex-shrink-0" />
            <div className="w-full flex-1 min-w-0 space-y-2.5 flex flex-col items-center sm:items-start">
              <div className="skeleton h-5 w-40 rounded-md" />
              <div className="skeleton h-4 w-28 rounded-md" />
              <div className="skeleton h-3 w-32 rounded-md" />
            </div>
          </div>
        </div>

        {/* Grid staf (2 seksi dummy) */}
        {Array.from({ length: 2 }).map((_, sec) => (
          <div key={sec} className="mb-12">
            <div className="skeleton h-9 w-48 rounded-xl mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: sec === 0 ? 10 : 5 }).map((_, i) => (
                <div
                  key={i}
                  className="glass-card rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center p-5"
                >
                  <div className="skeleton rounded-full mb-4 flex-shrink-0" style={{ width: 72, height: 72 }} />
                  <div className="skeleton h-3.5 w-full max-w-[85%] rounded-md mb-2" />
                  <div className="skeleton h-3.5 w-2/3 rounded-md mb-3" />
                  <div className="skeleton h-5 w-4/5 rounded-full mb-3" />
                  <div className="pt-2.5 border-t border-gray-100 dark:border-gray-700 w-full">
                    <div className="skeleton h-2.5 w-full rounded-md mt-2.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
