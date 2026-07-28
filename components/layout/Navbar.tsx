"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { cldTransform } from "@/lib/utils/cloudinary";
import { pengaturanValue } from "@/lib/data/pengaturan";
import type { PengaturanMap } from "@/lib/types/database";

interface NavbarProps {
  namaSekolah: string;
  logoSekolah: string;
  pengaturan: PengaturanMap;
}

interface NavItem {
  label: string;
  href: string;
  activeMatch?: string[];
}

/**
 * Susunan menu SENGAJA dipertahankan sama seperti sebelumnya (flat,
 * tanpa dropdown). Tampilan (warna/font/top info bar/tombol PMB)
 * mengikuti referensi beranda-sekolah.html — sudah dikonfirmasi ok
 * dipertahankan, selama logo tidak dibungkus lingkaran dan menu aktif
 * punya warna beda (lihat isActive + class "active" di bawah).
 * Ikon di tiap menu sengaja dihapus — teks polos lebih pas sama gaya
 * editorial font Fraunces + gold yang sekarang.
 */
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/gtk", label: "GTK" },
  { href: "/galeri", label: "Galeri" },
  {
    href: "/berita",
    label: "Informasi",
    // Halaman yang juga harus membuat menu "Informasi" aktif
    activeMatch: ["/berita", "/agenda-pengumuman"],
  },
  { href: "/kontak", label: "Kontak" },
];

function isActive(pathname: string, item: NavItem): boolean {
  const matches = item.activeMatch ?? (item.href ? [item.href] : []);
  return matches.some((m) => {
    const path = m.split("?")[0];
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  });
}

export default function Navbar({ namaSekolah, logoSekolah, pengaturan }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const telepon = pengaturanValue(pengaturan, "telepon_sekolah", "");
  const email = pengaturanValue(pengaturan, "email_sekolah", "");
  const alamat = pengaturanValue(pengaturan, "alamat_sekolah", "");
  const npsn = pengaturanValue(pengaturan, "npsn", "");
  const akreditasi = pengaturanValue(pengaturan, "akreditasi", "");

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ============ TOP INFO BAR ============ */}
      {(telepon || email || (alamat && alamat !== "-") || (npsn && npsn !== "-")) && (
        <div className="hidden sm:block bg-navy-2 text-paper/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2 font-mono text-[11px] tracking-wide">
            <div className="flex gap-5">
              {telepon && (
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-phone text-[10px]" aria-hidden="true" /> {telepon}
                </span>
              )}
              {email && (
                <span className="hidden md:flex items-center gap-1.5">
                  <i className="fa-solid fa-envelope text-[10px]" aria-hidden="true" /> {email}
                </span>
              )}
              {alamat && alamat !== "-" && (
                <span className="hidden lg:flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-[10px]" aria-hidden="true" /> {alamat}
                </span>
              )}
            </div>
            {((npsn && npsn !== "-") || (akreditasi && akreditasi !== "-")) && (
              <span className="text-gold-light">
                {npsn && npsn !== "-" ? `NPSN ${npsn}` : ""}
                {npsn && npsn !== "-" && akreditasi && akreditasi !== "-" ? " · " : ""}
                {akreditasi && akreditasi !== "-" ? `Terakreditasi ${akreditasi}` : ""}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ============ NAV UTAMA ============ */}
      <nav
        className={`sticky top-0 z-50 bg-paper/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-line dark:border-gray-800 transition-shadow ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[78px]">
            {/* Logo polos, TIDAK dibungkus lingkaran */}
            <Link href="/" className="flex items-center">
              <Image
                src={cldTransform(logoSekolah, "w_160,c_fit,q_auto,f_auto")}
                alt="Logo Sekolah"
                width={40}
                height={40}
                className="w-10 h-10 mr-3 object-contain"
              />
              <div>
                <h1
                  className="font-serif text-base sm:text-base md:text-lg lg:text-xl font-bold text-navy-2 dark:text-white leading-tight truncate"
                  title={namaSekolah}
                >
                  {namaSekolah}
                </h1>
                <p className="font-mono text-[10px] text-ink/60 dark:text-gray-400 tracking-wide">
                  JENJANG SD &middot; KURIKULUM MERDEKA
                </p>
              </div>
            </Link>

           {/* Desktop nav */}
<div className="hidden lg:flex flex-1 items-end justify-end gap-4">
  {NAV_ITEMS.map((item) => {
    const active = isActive(pathname, item);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-2 text-[14.5px] font-semibold py-2 px-1 transition-colors ${
          active
            ? "text-gold"
            : "text-ink dark:text-gray-200 hover:text-gold"
        }`}
      >
        <i className={`fa-solid ${item.icon} text-[13px]`} aria-hidden="true" />
        {item.label}
      </Link>
    );
  })}
</div>

{/* Action kanan */}
<div className="hidden lg:flex items-center gap-3 ml-8 pl-8 border-l border-gray-300 dark:border-gray-700">
  <ThemeToggle variant="desktop" />

  <Link
    href="/admin/login"
    className="font-semibold text-sm text-navy-2 dark:text-gray-200 px-1.5 py-2 hover:text-gold transition-colors"
  >
    Masuk
  </Link>

  <Link
    href="/ppdb"
    className="bg-navy text-paper font-bold text-sm px-5 py-2.5 hover:bg-navy-2 transition-colors"
  >
    Daftar PMB
  </Link>
</div>

            {/* Mobile controls */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle variant="mobile" />
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 text-navy-2 dark:text-gray-300 text-2xl outline-none"
                aria-label="Buka menu"
              >
                <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-paper dark:bg-gray-900 border-t border-line dark:border-gray-800 shadow-inner">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-md font-semibold ${
                      active ? "text-gold" : "text-ink dark:text-gray-200"
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} w-5`} aria-hidden="true" /> {item.label}
                  </Link>
                );
              })}
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-md text-navy-2 dark:text-gray-200 font-bold hover:bg-paper-2 dark:hover:bg-gray-800"
              >
                <i className="fa-solid fa-user-shield w-4" aria-hidden="true" /> Masuk
              </Link>
              <Link
                href="/ppdb"
                onClick={() => setMobileOpen(false)}
                className="block text-center mt-2 bg-navy text-paper font-bold px-3 py-3"
              >
                Daftar PMB
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}