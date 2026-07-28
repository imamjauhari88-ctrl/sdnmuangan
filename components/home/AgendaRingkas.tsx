import Link from "next/link";
import { formatTanggalIndonesia } from "@/lib/utils/format";
import type { AgendaItem } from "@/lib/data/beranda";

interface AgendaRingkasProps {
  agenda: AgendaItem[];
}

const NAMA_BULAN_SINGKAT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

/**
 * Versi ringkas dari agenda mendatang — menampilkan 4 agenda terdekat
 * dalam bentuk list, bukan kalender bulanan penuh. Kalender interaktif
 * lengkap (KalenderAgendaInline) tetap tersedia di /berita?kategori=agenda
 * untuk yang butuh tampilan bulanan; beranda cukup menonjolkan yang
 * terdekat saja supaya tidak berat.
 */
export default function AgendaRingkas({ agenda }: AgendaRingkasProps) {
  const mendatang = agenda
    .filter((a) => a.selisihHari >= 0)
    .sort((a, b) => a.selisihHari - b.selisihHari)
    .slice(0, 4);

  return (
    <section
      className="py-12 sm:py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
      aria-label="Agenda mendatang"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-block mb-3">
              🗓️ Agenda
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 dark:text-white">
              Agenda Mendatang
            </h2>
          </div>
          <Link
            href="/berita?kategori=agenda"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Lihat Kalender Lengkap <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
          </Link>
        </div>

        {mendatang.length > 0 ? (
          <div className="flex flex-col gap-3" role="list">
            {mendatang.map((a) => {
              const d = new Date(a.tanggal + "T00:00:00");
              return (
                <div key={a.id} className="agenda-item" role="listitem">
                  <div className="agenda-date" aria-hidden="true">
                    <span className="day">{isNaN(d.getTime()) ? "-" : d.getDate()}</span>
                    <span className="month">
                      {isNaN(d.getTime()) ? "" : NAMA_BULAN_SINGKAT[d.getMonth()]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                      {a.judul}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatTanggalIndonesia(a.tanggal)}
                      {a.selisihHari === 0 && " · Hari ini"}
                      {a.selisihHari === 1 && " · Besok"}
                      {a.selisihHari > 1 && ` · ${a.selisihHari} hari lagi`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center bg-gray-50 dark:bg-gray-900">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
              — Belum Ada Agenda —
            </p>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
              Kalender akademik untuk periode ini belum dijadwalkan
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Agenda kegiatan sekolah akan tampil di sini begitu admin menambahkannya.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
