import Link from "next/link";
import Image from "next/image";
import { formatTanggalIndonesia, ringkasTeks, KATEGORI_LABEL, KATEGORI_BADGE_BG } from "@/lib/utils/format";
import type { Berita } from "@/lib/types/database";

interface BeritaGridProps {
  items: Berita[];
  cariActive: string;
}

export default function BeritaGrid({ items, cariActive }: BeritaGridProps) {
  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-20 glass-card rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 mb-10">
        <i className="fa-solid fa-folder-open text-5xl text-gray-300 dark:text-gray-600 mb-4" aria-hidden="true" />
        <h3 className="text-xl font-black text-gray-700 dark:text-gray-300 mb-2">Tidak ada hasil</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {cariActive
            ? `Tidak ada berita dengan kata kunci "${cariActive}"`
            : "Belum ada konten di kategori ini"}
        </p>
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-blue-700 transition active:scale-95"
        >
          <i className="fa-solid fa-rotate-right" aria-hidden="true" /> Reset Pencarian
        </Link>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
      role="list"
      aria-label="Daftar berita"
    >
      {items.map((b, i) => {
        const img = b.gambar || "https://placehold.co/600x400/e2e8f0/1e293b?text=Berita";
        const badgeBg = KATEGORI_BADGE_BG[b.kategori] ?? "#6b7280";
        const badgeLabel = KATEGORI_LABEL[b.kategori] ?? b.kategori;

        return (
          <article
            key={b.id}
            className="card-animate card-hover glass-card rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden group relative"
            style={{ animationDelay: `${i * 0.07}s` }}
            role="listitem"
          >
            <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <Image
                src={img}
                alt={b.judul ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span
                className="absolute top-4 right-4 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg"
                style={{ background: badgeBg }}
              >
                {badgeLabel}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-medium mb-2.5">
                <i className="fa-regular fa-calendar-days text-blue-500" aria-hidden="true" />
                <time dateTime={b.tanggal ?? undefined}>{formatTanggalIndonesia(b.tanggal)}</time>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2.5 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <Link href={`/berita/${b.id}`} aria-label={`Baca: ${b.judul}`}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  {b.judul}
                </Link>
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
                {ringkasTeks(b.isi, 200)}
              </p>

              <div className="mt-auto pt-3.5 border-t border-gray-100 dark:border-gray-700/50">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Baca Selengkapnya <i className="fa-solid fa-arrow-right text-xs" />
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
