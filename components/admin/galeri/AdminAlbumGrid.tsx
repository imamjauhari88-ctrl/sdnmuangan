"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteAlbum } from "@/lib/actions/admin-galeri";
import { cldThumb } from "@/lib/utils/cloudinary";
import { formatTanggalIndonesia } from "@/lib/utils/format";
import type { AdminAlbumWithCount } from "@/lib/data/admin-galeri";

interface AlbumGridProps {
  albums: AdminAlbumWithCount[];
}

export default function AdminAlbumGrid({ albums }: AlbumGridProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteAlbum(id);
      setConfirmId(null);
      router.refresh();
    });
  }

  if (albums.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
        <i className="fa-solid fa-image text-4xl text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada album.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {albums.map((a) => {
        const cover = a.cover ? cldThumb(a.cover, 400) : "https://placehold.co/400x300/e2e8f0/1e293b?text=Album";
        return (
          <div
            key={a.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="relative h-36 bg-gray-100 dark:bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={a.nama_album} className="w-full h-full object-cover" />
              <span className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                {a.jml_foto} foto
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-800 dark:text-white text-sm line-clamp-1">
                {a.nama_album}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{formatTanggalIndonesia(a.tanggal_dibuat)}</p>

              {confirmId === a.id ? (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Hapus album ini?</span>
                  <button
                    onClick={() => handleDelete(a.id)}
                    disabled={isPending}
                    className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-70 ml-auto"
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
                <div className="flex items-center gap-1.5 mt-3">
                  <Link
                    href={`/admin/galeri/${a.id}`}
                    className="flex-1 text-center text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                  >
                    <i className="fa-solid fa-images mr-1" /> Kelola Foto
                  </Link>
                  <Link
                    href={`/admin/galeri/${a.id}/edit`}
                    title="Edit info album"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition"
                  >
                    <i className="fa-solid fa-pen text-xs" />
                  </Link>
                  <button
                    onClick={() => setConfirmId(a.id)}
                    title="Hapus album"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                  >
                    <i className="fa-solid fa-trash text-xs" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
