"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateStatusPendaftar, deletePendaftar } from "@/lib/actions/admin-ppdb";
import { formatTanggalIndonesia } from "@/lib/utils/format";
import type { Pendaftar, PendaftarStatus } from "@/lib/types/database";

interface PendaftarTableProps {
  items: Pendaftar[];
}

const STATUS_OPTIONS: PendaftarStatus[] = ["Menunggu", "Diterima", "Cadangan", "Ditolak"];

const STATUS_BADGE: Record<PendaftarStatus, string> = {
  Menunggu: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Diterima: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cadangan: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Ditolak: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function PendaftarTable({ items }: PendaftarTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function handleStatusChange(id: number, status: PendaftarStatus) {
    startTransition(async () => {
      await updateStatusPendaftar(id, status);
      router.refresh();
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deletePendaftar(id);
      setConfirmId(null);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
        <i className="fa-solid fa-user-plus text-4xl text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada data pendaftar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-5 py-3">No. Daftar</th>
              <th className="px-5 py-3">Nama Siswa</th>
              <th className="px-5 py-3">Tanggal Daftar</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-mono text-xs text-gray-600 dark:text-gray-300">{p.no_daftar}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-gray-800 dark:text-white">{p.nama}</p>
                  <p className="text-xs text-gray-400">{p.nik}</p>
                </td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {p.tanggal_daftar ? formatTanggalIndonesia(p.tanggal_daftar.slice(0, 10)) : "-"}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <select
                    value={p.status ?? "Menunggu"}
                    onChange={(e) => handleStatusChange(p.id, e.target.value as PendaftarStatus)}
                    disabled={isPending}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer ${
                      STATUS_BADGE[p.status ?? "Menunggu"]
                    }`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  {confirmId === p.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Hapus?</span>
                      <button
                        onClick={() => handleDelete(p.id)}
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
                        href={`/admin/ppdb/pendaftar/${p.id}`}
                        title="Lihat detail"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                      >
                        <i className="fa-solid fa-eye text-xs" />
                      </Link>
                      <button
                        onClick={() => setConfirmId(p.id)}
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
