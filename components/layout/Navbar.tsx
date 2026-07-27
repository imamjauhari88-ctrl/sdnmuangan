"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { cldTransform } from "@/lib/utils/cloudinary";

interface NavbarProps {
  namaSekolah: string;
  logoSekolah: string;
}

const NAV_ITEMS = [
  { href: "/", label: "Beranda", icon: "fa-house" },
  { href: "/profil", label: "Profil", icon: "fa-school" },
  { href: "/gtk", label: "GTK", icon: "fa-chalkboard-user" },
  { href: "/galeri", label: "Galeri", icon: "fa-image" },
  {
    href: "/berita",
    label: "Informasi",
    icon: "fa-circle-info",
    // Halaman yang juga harus membuat menu "Informasi" aktif
    activeMatch: ["/berita", "/agenda-pengumuman"],
  },
  { href: "/kontak", label: "Kontak", icon: "fa-envelope" },
];

function isActive(pathname: string, item: (typeof NAV_ITEMS)[number]): boolean {
  const matches = item.activeMatch ?? [item.href];
  return matches.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
}

export default function Navbar({ namaSekolah, logoSekolah }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors ${
        scrolled ? "navbar-scrolled" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image
  src={cldTransform(logoSekolah, "w_160,c_fit,q_auto,f_auto")}
  alt="Logo Sekolah"
  width={40}
  height={40}
  className="w-10 h-10 mr-3 rounded-lg object-contain"
/>
            <div>
              <h1 
                className="text-base sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-white leading-tight truncate"
                title={namaSekolah}
              >
                {namaSekolah}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">Sekolah Dasar Negeri</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-5 text-sm xl:text-base font-medium">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link flex items-center gap-2 ${
                  isActive(pathname, item) ? "active" : ""
                }`}
              >
                <i className={`fa-solid ${item.icon}`} /> {item.label}
              </Link>
            ))}

            <div className="flex items-center gap-2 border-l pl-4 dark:border-gray-700">
              <ThemeToggle variant="desktop" />
              <Link
  href="/admin/login"
  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
  title="Login Admin"
  aria-label="Login Admin"
>
                <i className="fa-solid fa-user-shield" />
              </Link>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle variant="mobile" />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 text-gray-600 dark:text-gray-300 text-2xl outline-none"
              aria-label="Buka menu"
            >
              <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-inner">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-link flex items-center gap-3 px-3 py-3 rounded-md ${
                  isActive(pathname, item) ? "active bg-blue-50 dark:bg-gray-700" : ""
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5`} /> {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-md text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-gray-700 transition"
            >
              <i className="fa-solid fa-user-shield w-5" /> Login Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
