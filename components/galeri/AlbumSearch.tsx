"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface AlbumSearchProps {
  initialCari: string;
}

export default function AlbumSearch({ initialCari }: AlbumSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(initialCari);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue === initialCari) return;
      const params = new URLSearchParams();
      if (searchValue.trim()) {
        params.set("cari", searchValue.trim());
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(`${pathname}${qs ? `?${qs}` : ""}#galeri-section`);
      });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <div className="search-wrap w-full sm:w-72" role="search">
      <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Cari nama album..."
        autoComplete="off"
        aria-label="Cari album"
        className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm text-sm"
      />
    </div>
  );
}
