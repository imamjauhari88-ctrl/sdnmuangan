"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cldThumb, cldOptimized } from "@/lib/utils/cloudinary";
import type { Foto } from "@/lib/types/database";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface PhotoGridWithLightboxProps {
  fotoList: Foto[];
}

/**
 * Grid foto + lightbox, porting dari #lb di galeri.php versi lama.
 * Fitur dipertahankan: navigasi prev/next, thumbnail strip, swipe touch
 * (mobile), keyboard navigation (Escape/ArrowLeft/ArrowRight), dan
 * slide animation arah kiri/kanan.
 */
export default function PhotoGridWithLightbox({ fotoList }: PhotoGridWithLightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isOpen = openIndex !== null;

  const goTo = useCallback(
    (idx: number, dir: "left" | "right" | null = null) => {
      if (idx < 0 || idx >= fotoList.length) return;
      if (dir) {
        setSlideDir(dir);
        setTimeout(() => {
          setOpenIndex(idx);
          setSlideDir(null);
        }, 200);
      } else {
        setOpenIndex(idx);
      }
    },
    [fotoList.length]
  );

  const navLB = useCallback(
    (dir: 1 | -1) => {
      if (openIndex === null) return;
      const next = openIndex + dir;
      goTo(next, dir > 0 ? "right" : "left");
    },
    [openIndex, goTo]
  );

  function closeLB() {
    setOpenIndex(null);
    setSlideDir(null);
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowRight") navLB(1);
      if (e.key === "ArrowLeft") navLB(-1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, navLB]);

  // Lock body scroll saat lightbox terbuka
  useLockBodyScroll(isOpen);

  // Scroll thumbnail aktif ke tengah
  useEffect(() => {
    if (openIndex !== null) {
      thumbRefs.current[openIndex]?.scrollIntoView({
        inline: "center",
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [openIndex]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      navLB(dx < 0 ? 1 : -1);
    }
    touchStart.current = null;
  }

  if (fotoList.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <i className="fa-regular fa-images text-5xl text-gray-300 dark:text-gray-600 mb-4" aria-hidden="true" />
        <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Belum ada foto di album ini</p>
      </div>
    );
  }

  const current = openIndex !== null ? fotoList[openIndex] : null;

  return (
    <>
      <div
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
  role="list"
  aria-label={`Foto dalam album, ${fotoList.length} foto`}
>
        {fotoList.map((f, i) => (
          <div
            key={f.id}
            className="card-animate group relative rounded-xl overflow-hidden cursor-pointer bg-gray-200 dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow h-40 sm:h-48 md:h-52"
            style={{ animationDelay: `${i * 0.04}s` }}
            role="listitem"
            tabIndex={0}
            aria-label={`Buka foto ${i + 1} dari ${fotoList.length}`}
            onClick={() => goTo(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") goTo(i);
            }}
          >
            <Image
              src={cldThumb(f.file_foto, 400)}
              alt={f.caption || "Foto kegiatan"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                <i className="fa-solid fa-expand text-white text-sm" aria-hidden="true" />
              </div>
            </div>

            {f.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent p-3">
                <p className="text-white text-xs font-semibold truncate">{f.caption}</p>
              </div>
            )}

            <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full" aria-hidden="true">
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {isOpen && current && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan foto besar"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLB();
          }}
        >
          <button
            onClick={closeLB}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Tutup foto"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>

          {openIndex! > 0 && (
            <button
              onClick={() => navLB(-1)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Foto sebelumnya"
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
          )}

          <div
            className="flex-1 flex items-center justify-center p-4 sm:p-10 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-full">
              <Image
                src={cldOptimized(current.file_foto)}
                alt={current.caption || "Foto galeri"}
                fill
                sizes="100vw"
                className={`object-contain rounded-lg shadow-2xl transition-all duration-200 ${
                  slideDir === "left" ? "-translate-x-6 opacity-0" : slideDir === "right" ? "translate-x-6 opacity-0" : ""
                }`}
              />
            </div>
          </div>

          {openIndex! < fotoList.length - 1 && (
            <button
              onClick={() => navLB(1)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Foto berikutnya"
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          )}

          {/* Thumbnail strip */}
          <div
            className="hidden sm:flex items-center gap-2 overflow-x-auto px-4 pb-3 max-w-full justify-center"
            role="list"
            aria-label="Thumbnail foto"
          >
            {fotoList.map((f, i) => (
              <button
                key={f.id}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                onClick={() => goTo(i)}
                role="listitem"
                aria-label={`Lihat foto ${i + 1}`}
                aria-current={i === openIndex}
                className={`flex-shrink-0 relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === openIndex ? "border-white scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={cldThumb(f.file_foto, 100)}
                  alt={f.caption || `Foto ${i + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <div className="text-center pb-4 px-4">
            {current.caption && (
              <p className="text-white text-sm font-medium mb-1">{current.caption}</p>
            )}
            <p className="text-white/60 text-xs" aria-live="polite">
              {openIndex! + 1} / {fotoList.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
