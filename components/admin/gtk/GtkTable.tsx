"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteGtk } from "@/lib/actions/admin-gtk";
import { getWarna } from "@/lib/utils/warna";
import type { Gtk } from "@/lib/types/database";

interface GtkTableProps {
  items: Gtk[];
}

const KATEGORI_LABEL: Record<string, string> = {
  pimpinan: "👑 Pimpinan",
  guru_kelas: "🏫 Guru Kelas",
  guru_mapel: "📚 Guru Mapel",
  tendik: "💼 Tendik",
  lainnya: "👥 Lainnya",
};

export default function GtkTable({ items }: GtkTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteGtk(id);
      setConfirmId(null);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
        <i className="fa-solid fa-chalkboard-user text-4xl text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada data GTK.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-5 py-3">Personel</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Pendidikan</th>
              <th className="px-5 py-3 text-center">Berkas</th>
              <th className="px-5 py-3 text-center">Urutan</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((g) => {
              const w = getWarna(g.warna);
              const jumlahBerkas = g.berkas?.length ?? 0;
              return (
                <tr key={g.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {g.foto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={g.foto}
                          alt={g.nama}
                          className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-user text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{g.nama}</p>
                        <p className={`text-xs font-bold uppercase tracking-wide ${w.text}`}>
                          {g.jabatan}
                        </p>
                        {g.wa && (
                          <p className="text-[10px] text-green-500 mt-0.5 flex items-center gap-1">
                            <i className="fa-brands fa-whatsapp" /> {g.wa}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${w.badgeBg} ${w.text}`}
                    >
                      {KATEGORI_LABEL[g.kategori ?? ""] ?? g.kategori}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 italic max-w-[180px] truncate">
                    {g.pendidikan || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {jumlahBerkas > 0 ? (
                      <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full">
                        <i className="fa-brands fa-google-drive text-[10px]" />
                        {jumlahBerkas} file
                      </span>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-center text-gray-500 dark:text-gray-400">
                    #{g.urutan ?? 0}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    {confirmId === g.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Hapus?</span>
                        <button
                          onClick={() => handleDelete(g.id)}
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
                          href={`/admin/gtk/${g.id}/edit`}
                          title="Edit"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition"
                        >
                          <i className="fa-solid fa-pen text-xs" />
                        </Link>
                        <button
                          onClick={() => setConfirmId(g.id)}
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
  );
}
