"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatTanggalIndonesia } from "@/lib/utils/format";
import type { Berita, BeritaKategori } from "@/lib/types/database";
import type { BerandaData } from "@/lib/data/beranda";

interface BeritaTabsProps {
  tabBerita: BerandaData["tabBerita"];
}

const TABS: { id: keyof BerandaData["tabBerita"]; label: string; emoji: string }[] = [
  { id: "semua", label: "Semua", emoji: "📋" },
  { id: "berita", label: "Berita", emoji: "📰" },
  { id: "pengumuman", label: "Pengumuman", emoji: "📣" },
  { id: "prestasi", label: "Prestasi", emoji: "🏆" },
];

const KATEGORI_BADGE_COLOR: Record<BeritaKategori, string> = {
  berita: "bg-blue-600",
  pengumuman: "bg-red-600",
  prestasi: "bg-amber-500",
  agenda: "bg-gray-600",
};

function BeritaCard({ b, delay }: { b: Berita; delay: number }) {
  const imgSrc = b.gambar || "https://placehold.co/600x400/e2e8f0/1e293b?text=Berita";
  const badgeColor = KATEGORI_BADGE_COLOR[b.kategori] ?? "bg-gray-600";

  return (
    <article
      className="card-animate card-hover glass-card rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden group h-full relative"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
        <Image
          src={imgSrc}
          alt={`Gambar artikel: ${b.judul}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className={`absolute top-4 right-4 ${badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg`}
        >
          {b.kategori}
        </div>
      </div>
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3 flex items-center gap-2">
          <i className="fa-regular fa-calendar-days text-blue-500" />
          <time dateTime={b.tanggal ?? undefined}>{formatTanggalIndonesia(b.tanggal)}</time>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link href={`/berita/${b.id}`} aria-label={`Baca artikel: ${b.judul}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {b.judul}
          </Link>
        </h3>
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <span className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
            Baca Selengkapnya <i className="fa-solid fa-arrow-right text-xs" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function BeritaTabs({ tabBerita }: BeritaTabsProps) {
  const [activeTab, setActiveTab] = useState<keyof BerandaData["tabBerita"]>("semua");
  const beritaList = tabBerita[activeTab] ?? [];

  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
      aria-label="Berita dan informasi sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-block mb-3 sm:mb-4"
            aria-hidden="true"
          >
            📰 Informasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2 sm:mb-4">
            Berita &amp; Informasi
          </h2>
          <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full mb-6" />
        </div>

        {/* Tab Filter */}
        <div
          className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 justify-center flex-wrap"
          role="tablist"
          aria-label="Filter kategori berita"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tab-${tab.id}`}
              id={`tabBtn-${tab.id}`}
            >
              <span aria-hidden="true">{tab.emoji}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10"
          role="tabpanel"
          id={`tab-${activeTab}`}
          aria-labelledby={`tabBtn-${activeTab}`}
        >
          {beritaList.length > 0 ? (
            beritaList.map((b, i) => <BeritaCard key={b.id} b={b} delay={(i + 1) * 0.1} />)
          ) : (
            <div className="col-span-full text-center py-16 glass-card rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
              <i className="fa-solid fa-newspaper text-5xl text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                Belum ada konten di kategori ini
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-1 transition-all active:scale-95"
            aria-label="Lihat semua berita dan informasi sekolah"
          >
            Lihat Semua Berita <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}
