"use client";

import { useEffect } from "react";

/**
 * useLockBodyScroll
 *
 * Mengunci scroll pada <body> selama `locked` bertahan true — dipakai
 * saat modal, lightbox, atau overlay lain sedang terbuka. Otomatis
 * mengembalikan scroll seperti semula saat `locked` jadi false atau
 * komponen unmount.
 *
 * Diekstrak dari duplikasi logic yang sebelumnya ada di:
 * - components/gtk/DetailModal.tsx
 * - components/home/Ekstrakurikuler.tsx
 * - components/profil/FasilitasSection.tsx
 * - components/galeri/PhotoGridWithLightbox.tsx
 *
 * @param locked true = body tidak bisa di-scroll
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
