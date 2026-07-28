import Link from "next/link";
import Image from "next/image";
import { formatTanggalIndonesia, ringkasTeks, KATEGORI_LABEL } from "@/lib/utils/format";
import type { Berita, BeritaKategori } from "@/lib/types/database";

interface FeaturedArticleProps {
  featured: Berita;
}

const BADGE_BG: Record<BeritaKategori, string> = {
  berita: "#2563eb",
  pengumuman: "#dc2626",
  agenda: "#16a34a",
  prestasi: "#d97706",
};

export default function FeaturedArticle({ featured }: FeaturedArticleProps) {
  const img = featured.gambar || "https://placehold.co/1200x500/1e40af/ffffff?text=Berita+Terbaru";
  const badgeBg = BADGE_BG[featured.kategori] ?? "#6b7280";
  const badgeLabel = KATEGORI_LABEL[featured.kategori] ?? featured.kategori;

  return (
    <div
      className="card-animate featured-card mb-10 shadow-xl group relative overflow-hidden rounded-2xl"
      style={{ animationDelay: "0.1s" }}
      aria-label={`Berita unggulan: ${featured.judul}`}
    >
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-2xl">
        <Image
          src={img}
          alt={featured.judul ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow">
            ⭐ Terbaru
          </span>
          <span
            className="text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow"
            style={{ background: badgeBg }}
          >
            {badgeLabel}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
          <p className="text-white/70 text-xs sm:text-sm font-semibold mb-2 flex items-center gap-2">
            <i className="fa-regular fa-calendar-days" aria-hidden="true" />
            <time dateTime={featured.tanggal ?? undefined}>{formatTanggalIndonesia(featured.tanggal)}</time>
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-white leading-tight mb-4 line-clamp-2">
            {featured.judul}
          </h2>
          <p className="text-white/70 text-sm line-clamp-2 mb-4 hidden sm:block">
            {ringkasTeks(featured.isi, 180)}
          </p>
          <Link
            href={`/berita/${featured.id}`}
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold text-sm px-5 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg active:scale-95"
            aria-label={`Baca berita: ${featured.judul}`}
          >
            Baca Selengkapnya <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
