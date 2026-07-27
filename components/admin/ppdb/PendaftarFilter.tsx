"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { StatusFilter } from "@/lib/data/admin-ppdb";

interface PendaftarFilterProps {
  initialCari: string;
  activeStatus: StatusFilter;
  statusCounts: Record<StatusFilter, number>;
}

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "Menunggu", label: "Menunggu" },
  { key: "Diterima", label: "Diterima" },
  { key: "Cadangan", label: "Cadangan" },
  { key: "Ditolak", label: "Ditolak" },
];

export default function PendaftarFilter({ initialCari, activeStatus, statusCounts }: PendaftarFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(initialCari);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue === initialCari) return;
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue.trim()) {
        params.set("cari", searchValue.trim());
      } else {
        params.delete("cari");
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  function handleTabClick(key: StatusFilter) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "semua") {
      params.delete("status");
    } else {
      params.set("status", key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
      <div className="relative flex-1 sm:max-w-xs">
        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Cari nama, NIK, no. daftar..."
          className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`text-xs font-bold px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeStatus === tab.key
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300"
            }`}
          >
            {tab.label} ({statusCounts[tab.key] ?? 0})
          </button>
        ))}
      </div>
    </div>
  );
}
