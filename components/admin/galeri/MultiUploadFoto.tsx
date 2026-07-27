"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary, CLOUDINARY_UPLOAD_PRESET } from "@/lib/utils/cloudinary-upload";
import { tambahFoto } from "@/lib/actions/admin-galeri";

interface MultiUploadFotoProps {
  albumId: number;
}

export default function MultiUploadFoto({ albumId }: MultiUploadFotoProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setErrorMsg("");
    setIsUploading(true);
    setProgress({ done: 0, total: files.length });

    const uploadedUrls: string[] = [];
    const failedFiles: string[] = [];

    // Upload satu per satu (bukan Promise.all) supaya progress bisa
    // ditampilkan bertahap dan tidak membanjiri koneksi pengguna dengan
    // banyak request besar sekaligus saat upload puluhan foto.
    for (const file of files) {
      try {
        const result = await uploadToCloudinary(file, CLOUDINARY_UPLOAD_PRESET, "image");
        uploadedUrls.push(result.secure_url);
      } catch (err) {
        console.error(`Gagal upload ${file.name}:`, err);
        failedFiles.push(file.name);
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    if (uploadedUrls.length > 0) {
      const result = await tambahFoto({ albumId, fotoUrls: uploadedUrls });
      if (!result.success) {
        setErrorMsg(result.message);
      }
    }

    if (failedFiles.length > 0) {
      setErrorMsg(`${failedFiles.length} foto gagal diunggah: ${failedFiles.join(", ")}`);
    }

    setIsUploading(false);
    setProgress({ done: 0, total: 0 });
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-xs text-left">
          <i className="fa-solid fa-circle-exclamation mr-1.5" /> {errorMsg}
        </div>
      )}

      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mx-auto mb-3">
        <i className="fa-solid fa-cloud-arrow-up" />
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
        Unggah Foto ke Album Ini
      </p>
      <p className="text-xs text-gray-400 mb-4">Bisa pilih beberapa foto sekaligus (JPG/PNG)</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelected}
        disabled={isUploading}
        className="hidden"
        id="multi-upload-input"
      />
      <label
        htmlFor="multi-upload-input"
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition ${
          isUploading
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isUploading ? (
          <>
            <i className="fa-solid fa-spinner animate-spin" /> Mengunggah {progress.done}/{progress.total}...
          </>
        ) : (
          <>
            <i className="fa-solid fa-plus" /> Pilih Foto
          </>
        )}
      </label>
    </div>
  );
}
