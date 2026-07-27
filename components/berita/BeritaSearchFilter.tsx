"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { KategoriFilter } from "@/lib/data/berita";

interface BeritaSearchFilterProps {
  initialCari: string;
  activeKategori: KategoriFilter;
  kategoriCounts: Record<KategoriFilter, number>;
}

const TABS: { key: KategoriFilter; label: string; emoji: string }[] = [
  { key: "semua", label: "Semua", emoji: "📋" },
  { key: "berita", label: "Berita", emoji: "📰" },
  { key: "pengumuman", label: "Pengumuman", emoji: "📣" },
  { key: "agenda", label: "Agenda", emoji: "📅" },
  { key: "prestasi", label: "Prestasi", emoji: "🏆" },
];

export default function BeritaSearchFilter({
  initialCari,
  activeKategori,
  kategoriCounts,
}: BeritaSearchFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(initialCari);

  // Debounce: update URL 400ms setelah user berhenti mengetik
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue === initialCari) return;
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue.trim()) {
        params.set("cari", searchValue.trim());
      } else {
        params.delete("cari");
      }
      params.delete("page"); // reset ke page 1 saat search berubah
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}#berita-section`);
      });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  function handleTabClick(key: KategoriFilter) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "semua") {
      params.delete("kategori");
    } else {
      params.set("kategori", key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}#berita-section`);
    });
  }

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative" role="search">
          <i
            className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Cari judul berita, pengumuman..."
            autoComplete="off"
            aria-label="Cari berita"
            className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
          />
        </div>

        {/* Tab Filter */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap sm:flex-nowrap"
          role="tablist"
          aria-label="Filter kategori berita"
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`tab-btn ${activeKategori === tab.key ? "active" : ""}`}
              role="tab"
              aria-selected={activeKategori === tab.key}
            >
              <span aria-hidden="true">{tab.emoji}</span> {tab.label}
              <span className="ml-1 opacity-70 font-black">({kategoriCounts[tab.key] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
