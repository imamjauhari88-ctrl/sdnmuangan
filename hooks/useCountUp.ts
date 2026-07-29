"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useCountUp
 *
 * Animasi angka menghitung naik dari 0 ke `target`, dipicu otomatis
 * begitu elemen yang di-ref masuk viewport (pakai IntersectionObserver).
 * Hanya jalan sekali (tidak mengulang saat scroll keluar-masuk lagi).
 *
 * Diekstrak dari duplikasi logic yang sebelumnya ada di:
 * - components/home/Statistik.tsx (StatCard)
 * - components/profil/InfoSekolah.tsx (CounterCard)
 *
 * @param target Angka tujuan
 * @param options.duration Lama animasi dalam ms (default 2000)
 * @param options.threshold Ambang batas visibilitas elemen (default 0.5)
 * @returns { count, ref } — pasang `ref` ke elemen pembungkus, tampilkan `count`
 */
export function useCountUp<T extends HTMLElement = HTMLDivElement>(
  target: number,
  options?: { duration?: number; threshold?: number }
) {
  const duration = options?.duration ?? 2000;
  const threshold = options?.threshold ?? 0.5;

  const [count, setCount] = useState(0);
  const [hasCounted, setHasCounted] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasCounted) {
            setHasCounted(true);

            if (target === 0) {
              setCount(0);
              continue;
            }

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
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasCounted, target, duration, threshold]);

  return { count, ref };
}
