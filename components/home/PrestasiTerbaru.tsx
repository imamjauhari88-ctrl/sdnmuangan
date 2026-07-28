import Link from "next/link";
import Image from "next/image";
import { formatTanggalIndonesia } from "@/lib/utils/format";
import type { Berita } from "@/lib/types/database";

interface PrestasiTerbaruProps {
  prestasi: Berita[];
}

const TINGKAT_COLOR: Record<string, string> = {
  nasional: "bg-red-500",
  internasional: "bg-purple-600",
  provinsi: "bg-blue-500",
  kabupaten: "bg-cyan-500",
  kecamatan: "bg-green-500",
  sekolah: "bg-gray-500",
};

export default function PrestasiTerbaru({ prestasi }: PrestasiTerbaruProps) {
  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
      aria-label="Prestasi terkini sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-full inline-block mb-3"
              aria-hidden="true"
            >
              🏆 Kebanggaan Kami
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-gray-900 dark:text-white">
              Prestasi Terkini
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full mt-3" />
          </div>
          <Link
            href="/berita?kategori=prestasi"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Lihat Semua <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
        </div>

        {prestasi.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {prestasi.map((pr, i) => {
              const tingkatColor = TINGKAT_COLOR[pr.tingkat ?? ""] ?? "bg-amber-500";
              const img = pr.gambar || "https://placehold.co/600x400/fef3c7/92400e?text=Prestasi";

              return (
                <div
                  key={pr.id}
                  className="card-animate card-hover glass-card rounded-2xl border border-amber-100 dark:border-amber-900/30 shadow-sm overflow-hidden group"
                  style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                  role="listitem"
                >
                  <div className="relative h-44 overflow-hidden bg-amber-50 dark:bg-gray-800">
                    <Image
                      src={img}
                      alt={`Foto prestasi: ${pr.judul}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {pr.tingkat && (
                      <span
                        className={`absolute top-3 left-3 ${tingkatColor} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow`}
                      >
                        {pr.tingkat}
                      </span>
                    )}
                    {pr.juara && (
                      <span
                        className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-[10px] font-black px-3 py-1 rounded-full shadow"
                        aria-label={`Juara ${pr.juara}`}
                      >
                        🥇 {pr.juara}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <i className="fa-regular fa-calendar text-amber-500" />
                      <time dateTime={pr.tanggal ?? undefined}>{formatTanggalIndonesia(pr.tanggal)}</time>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      <Link href={`/berita/${pr.id}`} aria-label={`Baca detail prestasi: ${pr.judul}`}>
                        {pr.judul}
                      </Link>
                    </h3>
                    {pr.peraih && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <i className="fa-solid fa-user text-amber-400" />
                        {pr.peraih}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 glass-card rounded-3xl border-2 border-dashed border-amber-200 dark:border-amber-900/40 max-w-2xl mx-auto">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto shadow-inner">
                <i className="fa-solid fa-trophy text-5xl text-amber-300 dark:text-amber-700" />
              </div>
              <span className="absolute -top-1 -right-1 text-xl animate-bounce">⭐</span>
              <span className="absolute -bottom-1 -left-1 text-lg animate-pulse">✨</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white mb-2">
              Prestasi Sedang Disiapkan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 px-6 leading-relaxed">
              Data prestasi belum tersedia. Segera hadir pencapaian membanggakan! 🌟
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
