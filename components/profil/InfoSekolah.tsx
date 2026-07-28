"use client";

import { useEffect, useRef, useState } from "react";
import { getWarna, type WarnaKey } from "@/lib/utils/warna";

interface InfoSekolahProps {
  npsn: string;
  statusSekolah: string;
  akreditasi: string;
  lokasi: string;
  tahunBerdiri: string;
  jmlSiswa: number;
  jmlGuru: number;
  jmlRombel: number;
  jmlPrestasi: number;
}

const INFO_COLORS: WarnaKey[] = ["yellow", "blue", "green", "purple", "orange"];

function CounterCard({
  icon,
  warna,
  label,
  value,
}: {
  icon: string;
  warna: WarnaKey;
  label: string;
  value: number;
}) {
  const [count, setCount] = useState(0);
  const [hasCounted, setHasCounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const w = getWarna(warna);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasCounted) {
            setHasCounted(true);
            if (value === 0) {
              setCount(0);
              continue;
            }
            const duration = 1800;
            const incrementMs = 16;
            const increment = value / (duration / incrementMs);
            let current = 0;
            const interval = setInterval(() => {
              current += increment;
              if (current >= value) {
                setCount(value);
                clearInterval(interval);
              } else {
                setCount(Math.floor(current));
              }
            }, incrementMs);
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasCounted, value]);

  return (
    <div
      ref={ref}
      className="card-hover glass-card rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center group"
      role="listitem"
      aria-label={`Jumlah ${label}: ${value}`}
    >
      <div className={`w-14 h-14 rounded-2xl ${w.iconBg} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div className="flex items-end gap-0.5">
        <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">
          {count.toLocaleString("id-ID")}
        </span>
        <span className="text-2xl font-black text-gray-900 dark:text-white mb-1">+</span>
      </div>
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
}

export default function InfoSekolah({
  npsn,
  statusSekolah,
  akreditasi,
  lokasi,
  tahunBerdiri,
  jmlSiswa,
  jmlGuru,
  jmlRombel,
  jmlPrestasi,
}: InfoSekolahProps) {
  const infoItems = [
    { icon: "fa-id-card", warna: INFO_COLORS[0], label: "NPSN", value: npsn },
    { icon: "fa-building-columns", warna: INFO_COLORS[1], label: "Status", value: statusSekolah },
    { icon: "fa-award", warna: INFO_COLORS[2], label: "Akreditasi", value: akreditasi },
    { icon: "fa-map-pin", warna: INFO_COLORS[3], label: "Lokasi", value: lokasi },
    { icon: "fa-calendar-check", warna: INFO_COLORS[4], label: "Berdiri", value: tahunBerdiri },
  ];

  const counters = [
    { icon: "fa-user-graduate", warna: "blue" as WarnaKey, label: "Siswa", value: jmlSiswa },
    { icon: "fa-chalkboard-user", warna: "emerald" as WarnaKey, label: "Guru", value: jmlGuru },
    { icon: "fa-door-open", warna: "purple" as WarnaKey, label: "Rombel", value: jmlRombel },
    { icon: "fa-trophy", warna: "amber" as WarnaKey, label: "Prestasi", value: jmlPrestasi },
  ];

  return (
    <section
      id="info-section"
      className="py-14 sm:py-20 bg-white dark:bg-gray-900 scroll-mt-16"
      aria-label="Informasi dan statistik sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            📊 Data Profil
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-gray-900 dark:text-white mb-3">
            Informasi Sekolah
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" role="list">
          {infoItems.map((item, i) => {
            const w = getWarna(item.warna);
            return (
              <div
                key={item.label}
                className="card-animate card-hover glass-card rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center"
                style={{ animationDelay: `${(i + 1) * 0.08}s` }}
                role="listitem"
                aria-label={`${item.label}: ${item.value}`}
              >
                <div className={`w-12 h-12 rounded-full ${w.iconBg} flex items-center justify-center text-xl mb-3`}>
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                  {item.value}
                </h3>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4" role="list">
          {counters.map((c) => (
            <CounterCard key={c.label} icon={c.icon} warna={c.warna} label={c.label} value={c.value} />
          ))}
        </div>
      </div>
    </section>
  );
}
