"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary, CLOUDINARY_UPLOAD_PRESET } from "@/lib/utils/cloudinary-upload";
import { createAlbum, updateAlbum, type AlbumFormInput } from "@/lib/actions/admin-galeri";
import type { Album } from "@/lib/types/database";

interface AlbumFormProps {
  mode: "create" | "edit";
  initialData?: Album;
}

export default function AlbumForm({ mode, initialData }: AlbumFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [namaAlbum, setNamaAlbum] = useState(initialData?.nama_album ?? "");
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi ?? "");
  const [cover, setCover] = useState(initialData?.cover ?? "");
  const [tanggalDibuat, setTanggalDibuat] = useState(
    initialData?.tanggal_dibuat ?? new Date().toISOString().slice(0, 10)
  );

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");
    try {
      const result = await uploadToCloudinary(file, CLOUDINARY_UPLOAD_PRESET, "image");
      setCover(result.secure_url);
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal mengunggah cover. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const input: AlbumFormInput = { namaAlbum, deskripsi, cover, tanggalDibuat };

    const result =
      mode === "create" ? await createAlbum(input) : await updateAlbum(initialData!.id, input);

    if (result.success) {
      if (mode === "create" && result.insertedId) {
        router.push(`/admin/galeri/${result.insertedId}`);
      } else {
        router.push("/admin/galeri");
      }
      router.refresh();
    } else {
      setErrorMsg(result.message);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div
          className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/50 flex items-center gap-3 text-sm"
          role="alert"
        >
          <i className="fa-solid fa-circle-exclamation text-lg" />
          {errorMsg}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Nama Album</label>
            <input
              type="text"
              value={namaAlbum}
              onChange={(e) => setNamaAlbum(e.target.value)}
              required
              placeholder="Cth: Peringatan Hari Kemerdekaan"
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Tanggal</label>
            <input
              type="date"
              value={tanggalDibuat}
              onChange={(e) => setTanggalDibuat(e.target.value)}
              required
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
            placeholder="Deskripsi singkat album (opsional)"
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Cover Album</label>
          <div className="flex items-start gap-4">
            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt="Pratinjau cover"
                className="w-24 h-24 rounded-xl object-cover border dark:border-gray-700 flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                disabled={isUploading}
                className="w-full text-sm dark:text-gray-300"
              />
              {isUploading && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1.5 flex items-center gap-1.5">
                  <i className="fa-solid fa-spinner animate-spin" /> Mengunggah cover...
                </p>
              )}
              {!isUploading && !cover && (
                <p className="text-xs text-gray-400 mt-1.5">
                  Opsional. Kalau tidak diisi, akan pakai gambar placeholder.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              Menyimpan... <i className="fa-solid fa-spinner animate-spin" />
            </>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk" /> {mode === "create" ? "Simpan Album" : "Perbarui Album"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/galeri")}
          className="text-gray-500 dark:text-gray-400 font-semibold px-4 py-3 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
