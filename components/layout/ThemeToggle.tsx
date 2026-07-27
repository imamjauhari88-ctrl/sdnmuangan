"use client";

import { useState, useEffect } from "react";

interface ThemeToggleProps {
  variant?: "desktop" | "mobile";
}

/**
 * Tombol toggle dark/light mode.
 * Porting dari script theme-toggle-desktop / theme-toggle-mobile
 * di includes/header.php versi lama.
 */
export default function ThemeToggle({ variant = "desktop" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Tunggu sampai komponen ter-mount di client sebelum membaca DOM.
  // Pola standar untuk membaca DOM (class "dark") yang hanya tersedia setelah
  // mount, agar render awal server & client tetap sama (hindari hydration mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const hasDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(hasDarkClass);
  }, []);

  function handleToggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  const baseClass =
    variant === "desktop"
      ? "p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
      : "p-2 rounded-lg text-gray-600 dark:text-yellow-400";

  // Tentukan ikon default saat render pertama kali (sebelum ter-mount)
  const defaultIcon = variant === "desktop" ? "fa-moon" : "fa-circle-half-stroke";

  // Jika belum ter-mount, gunakan defaultIcon agar server & client render awal bernilai sama.
  // Jika sudah ter-mount, gunakan isDark untuk menampilkan ikon yang sesuai.
  const currentIcon = mounted 
    ? (isDark ? "fa-sun" : defaultIcon) 
    : defaultIcon;

  return (
    <button onClick={handleToggle} className={baseClass} aria-label="Ganti tema gelap/terang">
      <i className={`fa-solid ${currentIcon}`} />
    </button>
  );
}