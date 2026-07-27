import Link from "next/link";
import { selisihHari } from "@/lib/utils/format";
import type { Berita } from "@/lib/types/database";

interface PengumumanBannerProps {
  pengumuman: Berita | null;
}

export default function PengumumanBanner({ pengumuman }: PengumumanBannerProps) {
  if (!pengumuman || !pengumuman.tanggal) return null;

  const selisih = selisihHari(pengumuman.tanggal);
  const tanggalFormatted = new Date(pengumuman.tanggal + "T00:00:00").toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let countdownText = tanggalFormatted;
  let badgeClass = "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400";
  if (selisih > 0) {
    countdownText = selisih === 1 ? "Besok" : `${selisih} hari lagi`;
    badgeClass = "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
  } else if (selisih === 0) {
    countdownText = "Hari ini";
    badgeClass = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }

  return (
    <section
      className="py-8 bg-gray-50 dark:bg-gray-900"
      aria-label="Pengumuman penting sekolah"
      aria-live="polite"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 card-animate">
        <div
          className="glass-card border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:shadow-md transition-all"
          role="alert"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform relative"
              aria-hidden="true"
            >
              <i className="fa-solid fa-bullhorn" />
              <span className="absolute inset-0 rounded-full border-2 border-red-600 animate-ping opacity-75" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-1">
                Pengumuman Penting
              </h3>
              <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                {pengumuman.judul}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <i className="fa-regular fa-calendar mr-1" />
                  <time dateTime={pengumuman.tanggal}>{tanggalFormatted}</time>
                </p>
                {selisih >= 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                    ⏳ {countdownText}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link
            href={`/berita/${pengumuman.id}`}
            className="shrink-0 text-center bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors shadow-sm active:scale-95"
            aria-label={`Lihat detail pengumuman: ${pengumuman.judul}`}
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </section>
  );
}
