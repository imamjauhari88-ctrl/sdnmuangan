import Link from "next/link";
import { getWarna } from "@/lib/utils/warna";
import type { FasilitasPreviewItem } from "@/lib/data/beranda";

interface FasilitasPreviewProps {
  fasilitasList: FasilitasPreviewItem[];
}

/** Preview beranda hanya menampilkan sebagian — daftar lengkap ada di halaman Profil */
const MAKS_PREVIEW = 4;

export default function FasilitasPreview({ fasilitasList }: FasilitasPreviewProps) {
  if (fasilitasList.length === 0) return null;

  const preview = fasilitasList.slice(0, MAKS_PREVIEW);

  return (
    <section
      className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
      aria-label="Preview fasilitas sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header terpusat — konsisten dengan pola section Ekstrakurikuler & Visi Misi */}
        <div className="text-center mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            🏫 Sarana &amp; Prasarana
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Fasilitas Sekolah
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
            Sebagian fasilitas unggulan sekolah kami
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-teal-500 to-cyan-400 mx-auto rounded-full mt-3" />
        </div>

        <div className="flex flex-wrap justify-center gap-4" role="list" aria-label="Daftar fasilitas sekolah">
          {preview.map((fas, i) => {
            const w = getWarna(fas.color);
            return (
              <Link
                key={fas.id}
                href="/profil#fasilitas-section"
                className="group w-[130px] flex-shrink-0 flex flex-col items-center text-center p-5 px-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.1)]"
                style={{ animationDelay: `${0.05 * (i + 1)}s` }}
                role="listitem"
                aria-label={`Lihat detail fasilitas ${fas.nama}`}
              >
                <div
                  className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl mb-[10px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${w.iconBg}`}
                  aria-hidden="true"
                >
                  <i className={`fa-solid ${fas.icon}`} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white leading-snug">
                  {fas.nama}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Tombol lihat selengkapnya — konsisten dengan pola tombol di VisiMisi */}
        <div className="text-center mt-8">
          <Link
            href="/profil#fasilitas-section"
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-1 transition-all active:scale-95"
          >
            Lihat Semua Fasilitas <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}
