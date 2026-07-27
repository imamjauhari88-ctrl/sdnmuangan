"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteEkskul, toggleAktifEkskul } from "@/lib/actions/admin-ekstrakurikuler";
import type { AdminEkskulWithAlbum } from "@/lib/data/admin-ekstrakurikuler";

interface EkskulTableProps {
  items: AdminEkskulWithAlbum[];
}

export default function EkskulTable({ items }: EkskulTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteEkskul(id);
      setConfirmId(null);
      router.refresh();
    });
  }

  function handleToggle(id: number, currentAktif: boolean) {
    startTransition(async () => {
      await toggleAktifEkskul(id, !currentAktif);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
        <i className="fa-solid fa-futbol text-4xl text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada data ekstrakurikuler.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-5 py-3">Ekstrakurikuler</th>
              <th className="px-5 py-3">Album Foto</th>
              <th className="px-5 py-3 text-center">Urutan</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-base flex-shrink-0">
                      <i className={`fa-solid ${e.icon || "fa-star"}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{e.nama}</p>
                      {e.deskripsi && (
                        <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{e.deskripsi}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">
                  {e.album_nama ?? <span className="italic text-gray-300 dark:text-gray-600">Belum ada</span>}
                </td>
                <td className="px-5 py-3.5 text-center text-gray-500 dark:text-gray-400">
                  {e.urutan}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <button
                    onClick={() => handleToggle(e.id, e.aktif ?? false)}
                    disabled={isPending}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
                      e.aktif
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {e.aktif ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  {confirmId === e.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Hapus?</span>
                      <button
                        onClick={() => handleDelete(e.id)}
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
                        href={`/admin/ekstrakurikuler/${e.id}/edit`}
                        title="Edit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition"
                      >
                        <i className="fa-solid fa-pen text-xs" />
                      </Link>
                      <button
                        onClick={() => setConfirmId(e.id)}
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
