"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary, CLOUDINARY_UPLOAD_PRESET } from "@/lib/utils/cloudinary-upload";
import {
  createEkskul,
  updateEkskul,
  type EkskulFormInput,
} from "@/lib/actions/admin-ekstrakurikuler";
import type { Ekstrakurikuler, Album } from "@/lib/types/database";

interface EkskulFormProps {
  mode: "create" | "edit";
  initialData?: Ekstrakurikuler;
  albumOptions: Pick<Album, "id" | "nama_album">[];
}

/** Daftar icon Font Awesome umum untuk ekstrakurikuler sekolah dasar */
const ICON_OPTIONS = [
  "fa-campground",
  "fa-futbol",
  "fa-music",
  "fa-palette",
  "fa-shield-halved",
  "fa-computer",
  "fa-heart-pulse",
  "fa-book-quran",
  "fa-volleyball",
  "fa-table-tennis-paddle-ball",
  "fa-chess",
  "fa-microphone",
  "fa-drum",
  "fa-paintbrush",
  "fa-dumbbell",
  "fa-star",
];

export default function EkskulForm({ mode, initialData, albumOptions }: EkskulFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [nama, setNama] = useState(initialData?.nama ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? ICON_OPTIONS[0]);
  const [iconCustom, setIconCustom] = useState(
    ICON_OPTIONS.includes(initialData?.icon ?? "") ? "" : initialData?.icon ?? ""
  );
  const [useCustomIcon, setUseCustomIcon] = useState(
    Boolean(initialData?.icon) && !ICON_OPTIONS.includes(initialData?.icon ?? "")
  );
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi ?? "");
  const [gambar, setGambar] = useState(initialData?.gambar ?? "");
  const [urutan, setUrutan] = useState(initialData?.urutan ?? 0);
  const [aktif, setAktif] = useState(initialData?.aktif ?? true);
  const [albumId, setAlbumId] = useState<string>(
    initialData?.album_id ? String(initialData.album_id) : ""
  );

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");
    try {
      const result = await uploadToCloudinary(file, CLOUDINARY_UPLOAD_PRESET, "image");
      setGambar(result.secure_url);
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal mengunggah gambar. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const finalIcon = useCustomIcon ? iconCustom.trim() : icon;

    const input: EkskulFormInput = {
      nama,
      icon: finalIcon,
      deskripsi,
      gambar,
      urutan,
      aktif,
      albumId: albumId ? parseInt(albumId, 10) : null,
    };

    const result =
      mode === "create"
        ? await createEkskul(input)
        : await updateEkskul(initialData!.id, input);

    if (result.success) {
      router.push("/admin/ekstrakurikuler");
      router.refresh();
    } else {
      setErrorMsg(result.message);
      setIsSubmitting(false);
    }
  }

  const previewIcon = useCustomIcon ? iconCustom.trim() || "fa-question" : icon;

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
        {/* Preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-2xl flex-shrink-0">
            <i className={`fa-solid ${previewIcon}`} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pratinjau</p>
            <p className="font-bold text-gray-800 dark:text-white">{nama || "Nama Ekstrakurikuler"}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Nama Ekstrakurikuler</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Cth: Pramuka"
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Icon</label>
          {!useCustomIcon ? (
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {ICON_OPTIONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={iconCustom}
              onChange={(e) => setIconCustom(e.target.value)}
              placeholder="Cth: fa-guitar"
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}
          <button
            type="button"
            onClick={() => setUseCustomIcon((v) => !v)}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1.5 hover:underline"
          >
            {useCustomIcon ? "← Pilih dari daftar" : "Pakai icon custom (cari di fontawesome.com) →"}
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
            placeholder="Deskripsi singkat kegiatan (opsional)"
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">
            Album Foto Dokumentasi
          </label>
          <select
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Tidak ada (belum punya album) --</option>
            {albumOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nama_album}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Foto dari album ini akan ditampilkan saat kartu ekstrakurikuler diklik di halaman
            publik. Kelola foto album di menu Galeri.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Urutan Tampil</label>
            <input
              type="number"
              value={urutan}
              onChange={(e) => setUrutan(parseInt(e.target.value, 10) || 0)}
              min={0}
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Angka lebih kecil tampil lebih dulu.</p>
          </div>

          <div className="flex items-center pt-7">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={aktif}
                onChange={(e) => setAktif(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-600"
              />
              <span className="text-sm font-semibold dark:text-gray-300">
                Tampilkan di halaman publik
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Gambar (opsional)</label>
          <div className="flex items-start gap-4">
            {gambar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gambar}
                alt="Pratinjau gambar"
                className="w-20 h-20 rounded-xl object-cover border dark:border-gray-700 flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
                className="w-full text-sm dark:text-gray-300"
              />
              {isUploading && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1.5 flex items-center gap-1.5">
                  <i className="fa-solid fa-spinner animate-spin" /> Mengunggah...
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
              <i className="fa-solid fa-floppy-disk" /> {mode === "create" ? "Simpan" : "Perbarui"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/ekstrakurikuler")}
          className="text-gray-500 dark:text-gray-400 font-semibold px-4 py-3 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
