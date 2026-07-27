"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePesan } from "@/lib/actions/admin-pesan";
import { formatTanggalIndonesia } from "@/lib/utils/format";
import type { Pesan } from "@/lib/types/database";

interface PesanTableProps {
  items: Pesan[];
}

const STATUS_TESTI_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`Rating ${rating} dari 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={`fa-solid fa-star text-[10px] ${i > rating ? "text-gray-200 dark:text-gray-700" : ""}`} />
      ))}
    </div>
  );
}

export default function PesanTable({ items }: PesanTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function handleDelete(id: number) {
    startTransition(async () => {
      await deletePesan(id);
      setConfirmId(null);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
        <i className="fa-solid fa-envelope text-4xl text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada pesan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-5 py-3">Pengirim</th>
              <th className="px-5 py-3">Subjek</th>
              <th className="px-5 py-3 text-center">Jenis</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((p) => (
              <tr
                key={p.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                  p.status === "belum_dibaca" ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                }`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {p.status === "belum_dibaca" && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" aria-label="Belum dibaca" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{p.nama}</p>
                      <p className="text-xs text-gray-400">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-1 max-w-xs">{p.subjek}</p>
                  {p.is_testi && p.rating && <StarRating rating={p.rating} />}
                </td>
                <td className="px-5 py-3.5 text-center">
                  {p.is_testi ? (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        STATUS_TESTI_BADGE[p.status_testi ?? "pending"]
                      }`}
                    >
                      💬 {p.status_testi ?? "pending"}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Pesan biasa</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {p.tanggal ? formatTanggalIndonesia(p.tanggal.slice(0, 10)) : "-"}
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
                        href={`/admin/pesan/${p.id}`}
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
