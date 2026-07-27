"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCaptionFoto, hapusFoto } from "@/lib/actions/admin-galeri";
import { cldThumb } from "@/lib/utils/cloudinary";
import type { Foto } from "@/lib/types/database";

interface AdminFotoGridProps {
  albumId: number;
  fotoList: Foto[];
}

export default function AdminFotoGrid({ albumId, fotoList }: AdminFotoGridProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [captionDraft, setCaptionDraft] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  function startEdit(foto: Foto) {
    setEditingId(foto.id);
    setCaptionDraft(foto.caption ?? "");
  }

  function saveCaption(fotoId: number) {
    startTransition(async () => {
      await updateCaptionFoto(fotoId, albumId, captionDraft);
      setEditingId(null);
      router.refresh();
    });
  }

  function handleDelete(fotoId: number) {
    startTransition(async () => {
      await hapusFoto(fotoId, albumId);
      setConfirmDeleteId(null);
      router.refresh();
    });
  }

  if (fotoList.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-10 text-center mt-4">
        <i className="fa-regular fa-images text-3xl text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada foto di album ini.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
      {fotoList.map((f) => (
        <div
          key={f.id}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm"
        >
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cldThumb(f.file_foto, 300)}
              alt={f.caption || "Foto galeri"}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-2.5">
            {editingId === f.id ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={captionDraft}
                  onChange={(e) => setCaptionDraft(e.target.value)}
                  placeholder="Caption foto..."
                  autoFocus
                  className="w-full text-xs border rounded-lg px-2 py-1.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => saveCaption(f.id)}
                    disabled={isPending}
                    className="flex-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg transition disabled:opacity-70"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg transition"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : confirmDeleteId === f.id ? (
              <div className="flex gap-1">
                <button
                  onClick={() => handleDelete(f.id)}
                  disabled={isPending}
                  className="flex-1 text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded-lg transition disabled:opacity-70"
                >
                  {isPending ? "..." : "Ya, Hapus"}
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1.5 rounded-lg transition"
                >
                  Batal
                </button>
              </div>
            ) : (
              <>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-1.5 h-4">
                  {f.caption || <span className="italic text-gray-300 dark:text-gray-600">Tanpa caption</span>}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(f)}
                    className="flex-1 text-[10px] font-bold bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30 transition"
                  >
                    <i className="fa-solid fa-pen text-[9px]" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(f.id)}
                    className="flex-1 text-[10px] font-bold bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition"
                  >
                    <i className="fa-solid fa-trash text-[9px]" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
