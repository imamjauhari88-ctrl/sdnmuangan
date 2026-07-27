import Link from "next/link";
import type { TahunFilter } from "@/lib/data/admin-hari-libur";

interface HariLiburYearFilterProps {
  activeTahun: TahunFilter;
  availableYears: number[];
}

export default function HariLiburYearFilter({ activeTahun, availableYears }: HariLiburYearFilterProps) {
  return (
    <div className="flex items-center gap-2 mb-5 overflow-x-auto">
      <Link
        href="/admin/hari-libur"
        className={`text-xs font-bold px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
          activeTahun === "semua"
            ? "bg-blue-600 text-white"
            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300"
        }`}
      >
        Semua Tahun
      </Link>
      {availableYears.map((y) => (
        <Link
          key={y}
          href={`/admin/hari-libur?tahun=${y}`}
          className={`text-xs font-bold px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTahun === y
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300"
          }`}
        >
          {y}
        </Link>
      ))}
    </div>
  );
}
