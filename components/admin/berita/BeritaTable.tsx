"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteBerita } from "@/lib/actions/admin-berita";
import { formatTanggalIndonesia, KATEGORI_LABEL } from "@/lib/utils/format";
import type { Berita, BeritaKategori } from "@/lib/types/database";

interface BeritaTableProps {
  items: Berita[];
}

const KATEGORI_BADGE: Record<BeritaKategori, string> = {
  berita: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pengumuman: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  agenda: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  prestasi: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function BeritaTable({ items }: BeritaTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteBerita(id);
      setConfirmId(null);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
        <i className="fa-solid fa-newspaper text-4xl text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada data berita.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-5 py-3">Judul</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-gray-800 dark:text-white line-clamp-1 max-w-md">
                    {b.judul}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${KATEGORI_BADGE[b.kategori]}`}
                  >
                    {KATEGORI_LABEL[b.kategori] ?? b.kategori}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatTanggalIndonesia(b.tanggal)}
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  {confirmId === b.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Hapus?</span>
                      <button
                        onClick={() => handleDelete(b.id)}
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
                        href={`/berita/${b.id}`}
                        target="_blank"
                        title="Lihat di situs"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                      >
                        <i className="fa-solid fa-eye text-xs" />
                      </Link>
                      <Link
                        href={`/admin/berita/${b.id}/edit`}
                        title="Edit"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition"
                      >
                        <i className="fa-solid fa-pen text-xs" />
                      </Link>
                      <button
                        onClick={() => setConfirmId(b.id)}
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
