"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteTahunAjaran } from "@/lib/actions/admin-ppdb";
import type { AdminTahunAjaranWithCount } from "@/lib/data/admin-ppdb";

interface TahunAjaranTableProps {
  items: AdminTahunAjaranWithCount[];
}

export default function TahunAjaranTable({ items }: TahunAjaranTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleDelete(id: number) {
    startTransition(async () => {
      const result = await deleteTahunAjaran(id);
      if (!result.success) {
        setErrorMsg(result.message);
      } else {
        setErrorMsg(null);
      }
      setConfirmId(null);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
        <i className="fa-solid fa-calendar-days text-4xl text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada data tahun ajaran.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {errorMsg && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation" /> {errorMsg}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3">Tahun Ajaran</th>
                <th className="px-5 py-3 text-center">Kuota</th>
                <th className="px-5 py-3 text-center">Pendaftar</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((t) => {
                const persen = t.kuota ? Math.min(100, Math.round((t.jml_pendaftar / t.kuota) * 100)) : 0;
                return (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-gray-800 dark:text-white">{t.tahun}</td>
                    <td className="px-5 py-3.5 text-center text-gray-500 dark:text-gray-400">{t.kuota}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-gray-700 dark:text-gray-200 font-semibold">{t.jml_pendaftar}</span>
                      <span className="text-xs text-gray-400"> ({persen}%)</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          t.status === "Buka"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {t.status === "Buka" ? "🟢 Buka" : "Tutup"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {confirmId === t.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Hapus?</span>
                          <button
                            onClick={() => handleDelete(t.id)}
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
                            href={`/admin/ppdb/tahun-ajaran/${t.id}/edit`}
                            title="Edit"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition"
                          >
                            <i className="fa-solid fa-pen text-xs" />
                          </Link>
                          <button
                            onClick={() => setConfirmId(t.id)}
                            title="Hapus"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                          >
                            <i className="fa-solid fa-trash text-xs" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
