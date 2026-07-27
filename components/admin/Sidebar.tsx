"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const MENU_GROUPS: {
  label: string;
  items: { href: string; label: string; icon: string }[];
}[] = [
  {
    label: "Utama",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: "fa-gauge-high" }],
  },
  {
    label: "Konten",
    items: [
      { href: "/admin/berita", label: "Berita & Agenda", icon: "fa-newspaper" },
      { href: "/admin/galeri", label: "Galeri", icon: "fa-image" },
      { href: "/admin/gtk", label: "Guru & Tendik", icon: "fa-chalkboard-user" },
      { href: "/admin/fasilitas", label: "Fasilitas", icon: "fa-school" },
      { href: "/admin/ekstrakurikuler", label: "Ekstrakurikuler", icon: "fa-futbol" },
    ],
  },
  {
    label: "PPDB",
    items: [
      { href: "/admin/ppdb/pendaftar", label: "Data Pendaftar", icon: "fa-user-plus" },
      { href: "/admin/ppdb/tahun-ajaran", label: "Tahun Ajaran", icon: "fa-calendar-days" },
    ],
  },
  {
    label: "Lainnya",
    items: [
      { href: "/admin/pesan", label: "Pesan & Testimoni", icon: "fa-envelope" },
      { href: "/admin/hari-libur", label: "Hari Libur", icon: "fa-house" },
      { href: "/admin/pengaturan", label: "Pengaturan Situs", icon: "fa-gear" },
    ],
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <i className="fa-solid fa-school text-sm" />
            </div>
            <span className="font-bold text-gray-800 dark:text-white text-sm">Admin Panel</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
            aria-label="Tutup menu"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Navigasi admin">
          {MENU_GROUPS.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mb-2">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <i className={`fa-solid ${item.icon} w-4 text-center`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <i className="fa-solid fa-arrow-up-right-from-square w-4 text-center" />
            Lihat Situs
          </Link>
        </div>
      </aside>
    </>
  );
}
