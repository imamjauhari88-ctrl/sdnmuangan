import Link from "next/link";
import type { PesanTabFilter } from "@/lib/data/admin-pesan";

interface PesanTabsProps {
  activeTab: PesanTabFilter;
  jmlBelumDibaca: number;
  jmlTestimoniPending: number;
}

export default function PesanTabs({ activeTab, jmlBelumDibaca, jmlTestimoniPending }: PesanTabsProps) {
  const tabs: { key: PesanTabFilter; label: string; badge?: number }[] = [
    { key: "semua", label: "Semua Pesan", badge: jmlBelumDibaca },
    { key: "testimoni", label: "Testimoni" },
    { key: "pending", label: "Perlu Ditinjau", badge: jmlTestimoniPending },
  ];

  return (
    <div className="flex items-center gap-2 mb-5 overflow-x-auto">
      {tabs.map((tab) => {
        const href = tab.key === "semua" ? "/admin/pesan" : `/admin/pesan?tab=${tab.key}`;
        return (
          <Link
            key={tab.key}
            href={href}
            className={`relative text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300"
            }`}
          >
            {tab.label}
            {Boolean(tab.badge) && (
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.key ? "bg-white/20" : "bg-red-100 text-red-600 dark:bg-red-900/40"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
