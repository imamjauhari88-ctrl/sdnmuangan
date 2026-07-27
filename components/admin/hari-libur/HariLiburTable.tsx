"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteHariLibur, toggleAktifHariLibur } from "@/lib/actions/admin-hari-libur";
import { formatTanggalLengkap } from "@/lib/utils/format";
import type { HariLibur, HariLiburJenis } from "@/lib/types/database";

interface HariLiburTableProps {
  items: HariLibur[];
}

const JENIS_BADGE: Record<HariLiburJenis, string> = {
  nasional: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  cuti_bersama: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  sekolah: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const JENIS_LABEL: Record<HariLiburJenis, string> = {
  nasional: "Nasional",
  cuti_bersama: "Cuti Bersama",
  sekolah: "Sekolah",
};

export default function HariLiburTable({ items }: HariLiburTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteHariLibur(id);
      setConfirmId(null);
      router.refresh();
    });
  }

  function handleToggle(id: number, currentAktif: boolean) {
    startTransition(async () => {
      await toggleAktifHariLibur(id, !currentAktif);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
        <i className="fa-solid fa-house text-4xl text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada data hari libur.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3 text-center">Jenis</th>
              <th className="px-5 py-3 text-center">Sumber</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {formatTanggalLengkap(h.tanggal)}
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-gray-800 dark:text-white">{h.nama}</p>
                  {h.deskripsi && <p className="text-xs text-gray-400 line-clamp-1">{h.deskripsi}</p>}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${JENIS_BADGE[h.jenis]}`}>
                    {JENIS_LABEL[h.jenis]}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  {h.sumber === "google_calendar" ? (
                    <span className="text-xs text-blue-500" title="Hasil sinkronisasi Google Calendar">
                      <i className="fa-brands fa-google" />
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400" title="Ditambahkan manual">
                      <i className="fa-solid fa-pen" />
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <button
                    onClick={() => handleToggle(h.id, h.aktif)}
                    disabled={isPending}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
                      h.aktif
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {h.aktif ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  {confirmId === h.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Hapus?</span>
                      <button
                        onClick={() => handleDelete(h.id)}
                        disabled={isPending}
                        className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-70"
                      >
                        {isPending ? "..." : "Ya"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg transition"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/hari-libur/${h.id}/edit`}
                        title="Edit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition"
                      >
                        <i className="fa-solid fa-pen text-xs" />
                      </Link>
                      <button
                        onClick={() => setConfirmId(h.id)}
                        title="Hapus"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                      >
                        <i className="fa-solid fa-trash text-xs" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
