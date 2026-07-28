/**
 * Loading UI untuk seluruh app/admin/** yang belum punya loading.tsx
 * sendiri. Next.js otomatis pakai file ini sebagai fallback Suspense
 * untuk semua route admin (dashboard, berita, galeri, dst) selama
 * page.tsx-nya masih fetch data server.
 *
 * Sidebar & Topbar dari AdminShell (app/admin/layout.tsx) TETAP tampil
 * normal di sekitar skeleton ini — cuma area <main> yang diganti,
 * sama seperti pola error.tsx di app/(public)/.
 *
 * Skeleton digeneralisasi (bukan tabel spesifik) karena file ini jadi
 * fallback bersama untuk banyak modul berbeda (tabel, form, grid galeri,
 * dashboard kartu statistik) — kalau satu modul butuh skeleton yang
 * lebih presisi ke bentuk datanya, tambahkan loading.tsx sendiri di
 * folder route itu (akan otomatis menimpa file ini untuk route tsb).
 */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat data">
      {/* Judul halaman + tombol aksi kanan atas */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="skeleton h-4 w-24 rounded-md mb-2.5" />
          <div className="skeleton h-7 w-48 rounded-lg" />
        </div>
        <div className="skeleton h-10 w-32 rounded-xl" />
      </div>

      {/* Filter/search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="skeleton h-11 w-full sm:w-64 rounded-xl" />
        <div className="skeleton h-11 w-full sm:w-40 rounded-xl" />
      </div>

      {/* Kartu tabel */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-gray-50 dark:bg-gray-800/50">
          <div className="skeleton h-3 w-full max-w-md rounded" />
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4">
              <div className="skeleton h-4 flex-1 rounded" />
              <div className="skeleton h-4 w-20 rounded hidden sm:block" />
              <div className="skeleton h-4 w-24 rounded hidden md:block" />
              <div className="skeleton h-8 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
