"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "profil-section", icon: "fa-circle-info", label: "Profil" },
  { id: "visimisi-section", icon: "fa-bullseye", label: "Visi & Misi" },
  { id: "info-section", icon: "fa-chart-bar", label: "Info" },
  { id: "fasilitas-section", icon: "fa-building", label: "Fasilitas" },
  { id: "struktur-section", icon: "fa-sitemap", label: "Struktur" },
  { id: "sejarah-section", icon: "fa-clock-rotate-left", label: "Sejarah" },
  { id: "kontak-section", icon: "fa-phone", label: "Kontak" },
];

export default function AnchorNav() {
  const [activeId, setActiveId] = useState("profil-section");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      id="anchor-nav"
      aria-label="Navigasi bagian profil"
      className={`sticky top-16 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-y border-gray-100 dark:border-gray-800 transition-all ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Kontainer Flex dibuat pas di tengah */}
        <div 
          className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 py-3" 
          role="list"
        >
          {SECTIONS.map((s) => {
            const isActive = activeId === s.id;

            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                role="listitem"
                aria-label={`Ke bagian ${s.label}`}
                aria-current={isActive ? "true" : "false"}
                className={`flex items-center gap-2 py-1 px-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors duration-200
                  ${isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
              >
                {/* Ikon yang selalu tampil */}
                <i 
                  className={`fa-solid ${s.icon} text-xs ${
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
                  }`} 
                  aria-hidden="true" 
                />
                
                {/* Teks label yang otomatis tersembunyi jika di layar mobile (< 640px) */}
                <span className="hidden sm:inline">{s.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}