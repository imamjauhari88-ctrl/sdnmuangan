"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary, CLOUDINARY_UPLOAD_PRESET } from "@/lib/utils/cloudinary-upload";
import { WARNA_MAP, type WarnaKey } from "@/lib/utils/warna";
import {
  createFasilitas,
  updateFasilitas,
  type FasilitasFormInput,
} from "@/lib/actions/admin-fasilitas";
import type { Fasilitas } from "@/lib/types/database";

interface FasilitasFormProps {
  mode: "create" | "edit";
  initialData?: Fasilitas;
}

const WARNA_KEYS = Object.keys(WARNA_MAP) as WarnaKey[];

/**
 * Daftar icon Font Awesome yang umum dipakai untuk fasilitas sekolah.
 * Dibatasi jadi dropdown (bukan input bebas) supaya admin tidak salah
 * ketik nama class — kalau salah, icon tidak akan muncul sama sekali
 * di halaman publik tanpa pesan error yang jelas.
 */
const ICON_OPTIONS = [
  "fa-book-open-reader",
  "fa-computer",
  "fa-futbol",
  "fa-mosque",
  "fa-microscope",
  "fa-utensils",
  "fa-toilet",
  "fa-shield-halved",
  "fa-school",
  "fa-flask",
  "fa-music",
  "fa-palette",
  "fa-dumbbell",
  "fa-book",
  "fa-chalkboard",
  "fa-restroom",
  "fa-parking",
  "fa-tree",
  "fa-water",
  "fa-bus",
];

export default function FasilitasForm({ mode, initialData }: FasilitasFormProps) {
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
  const [color, setColor] = useState<WarnaKey>((initialData?.color as WarnaKey) ?? "blue");
  const [urutan, setUrutan] = useState(initialData?.urutan ?? 0);
  const [aktif, setAktif] = useState(initialData?.aktif ?? true);

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

    const input: FasilitasFormInput = {
      nama,
      icon: finalIcon,
      deskripsi,
      gambar,
      color,
      urutan,
      aktif,
      albumId: initialData?.album_id ?? null,
    };

    const result =
      mode === "create"
        ? await createFasilitas(input)
        : await updateFasilitas(initialData!.id, input);

    if (result.success) {
      router.push("/admin/fasilitas");
      router.refresh();
    } else {
      setErrorMsg(result.message);
      setIsSubmitting(false);
    }
  }

  const previewWarna = WARNA_MAP[color];
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
          <div className={`w-14 h-14 rounded-2xl ${previewWarna.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}>
            <i className={`fa-solid ${previewIcon}`} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pratinjau</p>
            <p className="font-bold text-gray-800 dark:text-white">{nama || "Nama Fasilitas"}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Nama Fasilitas</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="Cth: Perpustakaan"
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Warna</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value as WarnaKey)}
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none capitalize"
            >
              {WARNA_KEYS.map((w) => (
                <option key={w} value={w} className="capitalize">
                  {w}
                </option>
              ))}
            </select>
          </div>
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
              placeholder="Cth: fa-laptop-code"
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
            placeholder="Deskripsi singkat fasilitas (opsional)"
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
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
              <i className="fa-solid fa-floppy-disk" /> {mode === "create" ? "Simpan Fasilitas" : "Perbarui Fasilitas"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/fasilitas")}
          className="text-gray-500 dark:text-gray-400 font-semibold px-4 py-3 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
