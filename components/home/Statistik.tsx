"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  icon: string;
  color: string;
  bg: string;
  label: string;
  value: number;
  suffix: string;
}

interface StatistikProps {
  jmlSiswa: number;
  jmlGuru: number;
  jmlRombel: number;
  jmlPrestasi: number;
}

/** Satu kartu statistik dengan counter animation saat masuk viewport */
function StatCard({ stat, delay }: { stat: StatItem; delay: number }) {
  const [count, setCount] = useState(0);
  const [hasCounted, setHasCounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasCounted) {
            setHasCounted(true);
            const target = stat.value;
            if (target === 0) {
              setCount(0);
              return;
            }
            const duration = 2000;
            const incrementMs = 16;
            const increment = target / (duration / incrementMs);
            let current = 0;
            const interval = setInterval(() => {
              current += increment;
              if (current >= target) {
                setCount(target);
                clearInterval(interval);
              } else {
                setCount(Math.floor(current));
              }
            }, incrementMs);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasCounted, stat.value]);

  return (
    <div
      ref={ref}
      className="card-animate card-hover glass-card p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center group"
      style={{ animationDelay: `${delay}s` }}
      role="listitem"
      aria-label={`Jumlah ${stat.label}: ${stat.value}${stat.suffix}`}
    >
      <div
        className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm mb-4 sm:mb-6`}
        aria-hidden="true"
      >
        <i className={`fa-solid ${stat.icon} text-2xl sm:text-3xl`} />
      </div>
      <div className="flex items-end gap-0.5">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-1">
          {count.toLocaleString("id-ID")}
        </h3>
        {stat.suffix && (
          <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">
            {stat.suffix}
          </span>
        )}
      </div>
      <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2">
        {stat.label}
      </p>
    </div>
  );
}

export default function Statistik({ jmlSiswa, jmlGuru, jmlRombel, jmlPrestasi }: StatistikProps) {
  const stats: StatItem[] = [
    {
      icon: "fa-user-graduate",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/50",
      label: "Siswa",
      value: jmlSiswa,
      suffix: "+",
    },
    {
      icon: "fa-chalkboard-user",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/50",
      label: "Guru",
      value: jmlGuru,
      suffix: "",
    },
    {
      icon: "fa-door-open",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/50",
      label: "Rombel",
      value: jmlRombel,
      suffix: "",
    },
    {
      icon: "fa-trophy",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/50",
      label: "Prestasi",
      value: jmlPrestasi,
      suffix: "+",
    },
  ];

  return (
    <section
      id="statistik-quick"
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900 relative scroll-mt-16"
      aria-label="Statistik sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <span
            className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-block mb-3 sm:mb-4"
            aria-hidden="true"
          >
            📊 Statistik
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 dark:text-white mb-2 sm:mb-4">
            Angka-Angka Kami
          </h2>
          <div
            className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full mb-4"
            aria-hidden="true"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" role="list">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} delay={(i + 1) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
