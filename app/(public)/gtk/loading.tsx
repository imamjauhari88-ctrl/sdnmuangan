import GtkSkeleton from "@/components/gtk/GtkSkeleton";

/**
 * Skeleton untuk halaman /gtk.
 * Suspense fallback selagi getPengaturan() + getGtkList() masih
 * berjalan di server. Sama seperti Profil/Berita/Galeri.
 */
export default function GtkLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat halaman guru dan tenaga kependidikan">
      {/* HERO */}
      <section className="relative w-full min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 px-4">
        <div className="relative z-10 max-w-3xl w-full text-center">
          <div className="skeleton h-8 w-40 rounded-full mx-auto mb-6 bg-white/10" />
          <div className="skeleton h-10 sm:h-12 w-full max-w-xl rounded-xl mx-auto mb-6 bg-white/10" />
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-16 w-24 rounded-2xl bg-white/10" />
            ))}
          </div>
        </div>
      </section>

      <GtkSkeleton />
    </div>
  );
}
