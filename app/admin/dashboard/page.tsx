import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats } from "@/lib/data/admin-dashboard";
import { formatTanggalIndonesia } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

// Selalu fresh: ini panel kerja admin, bukan halaman publik yang perlu ISR.
export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  Menunggu: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Diterima: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cadangan: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Ditolak: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Berita",
      value: stats.totalBerita,
      icon: "fa-newspaper",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      href: "/admin/berita",
    },
    {
      label: "Guru & Tendik",
      value: stats.totalGtk,
      icon: "fa-chalkboard-user",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
      href: "/admin/gtk",
    },
    {
      label: "Album Galeri",
      value: stats.totalGaleriAlbum,
      icon: "fa-image",
      color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400",
      href: "/admin/galeri",
    },
    {
      label: "Pendaftar Menunggu",
      value: stats.totalPendaftarBaru,
      icon: "fa-user-plus",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
      href: "/admin/ppdb/pendaftar",
      highlight: stats.totalPendaftarBaru > 0,
    },
    {
      label: "Pesan Belum Dibaca",
      value: stats.totalPesanBelumDibaca,
      icon: "fa-envelope",
      color: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
      href: "/admin/pesan",
      highlight: stats.totalPesanBelumDibaca > 0,
    },
    {
      label: "Testimoni Pending",
      value: stats.totalTestimoniPending,
      icon: "fa-comment-dots",
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
      href: "/admin/pesan?tab=testimoni",
      highlight: stats.totalTestimoniPending > 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ringkasan aktivitas website sekolah
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 relative"
          >
            <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center text-xl flex-shrink-0`}>
              <i className={`fa-solid ${card.icon}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{card.label}</p>
            </div>
            {card.highlight && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pendaftar terbaru */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-800 dark:text-white text-sm">Pendaftar PPDB Terbaru</h2>
            <Link href="/admin/ppdb/pendaftar" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {stats.pendaftarTerbaru.length > 0 ? (
              stats.pendaftarTerbaru.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{p.nama ?? "-"}</p>
                    <p className="text-xs text-gray-400 font-mono">{p.no_daftar ?? "-"}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      STATUS_BADGE[p.status ?? ""] ?? STATUS_BADGE.Menunggu
                    }`}
                  >
                    {p.status ?? "-"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 p-6 text-center">Belum ada pendaftar.</p>
            )}
          </div>
        </div>

        {/* Pesan terbaru */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-800 dark:text-white text-sm">Pesan Masuk Terbaru</h2>
            <Link href="/admin/pesan" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {stats.pesanTerbaru.length > 0 ? (
              stats.pesanTerbaru.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{p.nama ?? "-"}</p>
                    <span className="text-[11px] text-gray-400">
                      {p.tanggal ? formatTanggalIndonesia(p.tanggal.slice(0, 10)) : "-"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{p.subjek ?? "-"}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 p-6 text-center">Belum ada pesan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
