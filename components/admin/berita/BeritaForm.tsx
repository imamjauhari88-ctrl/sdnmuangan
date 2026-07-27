"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary, CLOUDINARY_UPLOAD_PRESET } from "@/lib/utils/cloudinary-upload";
import { createBerita, updateBerita, type BeritaFormInput } from "@/lib/actions/admin-berita";
import type { Berita, BeritaKategori } from "@/lib/types/database";

interface BeritaFormProps {
  mode: "create" | "edit";
  initialData?: Berita;
}

const KATEGORI_OPTIONS: { value: BeritaKategori; label: string }[] = [
  { value: "berita", label: "Berita" },
  { value: "pengumuman", label: "Pengumuman" },
  { value: "agenda", label: "Agenda" },
  { value: "prestasi", label: "Prestasi" },
];

const TINGKAT_OPTIONS = ["kecamatan", "kabupaten", "provinsi", "nasional", "internasional"];

export default function BeritaForm({ mode, initialData }: BeritaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [judul, setJudul] = useState(initialData?.judul ?? "");
  const [isi, setIsi] = useState(initialData?.isi ?? "");
  const [tanggal, setTanggal] = useState(initialData?.tanggal ?? new Date().toISOString().slice(0, 10));
  const [gambar, setGambar] = useState(initialData?.gambar ?? "");
  const [kategori, setKategori] = useState<BeritaKategori>(initialData?.kategori ?? "berita");
  const [tingkat, setTingkat] = useState(initialData?.tingkat ?? "");
  const [peraih, setPeraih] = useState(initialData?.peraih ?? "");
  const [juara, setJuara] = useState(initialData?.juara ?? "");

  const isPrestasi = kategori === "prestasi";

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

    const input: BeritaFormInput = {
      judul,
      isi,
      tanggal,
      gambar,
      kategori,
      tingkat: isPrestasi ? tingkat : "",
      peraih: isPrestasi ? peraih : "",
      juara: isPrestasi ? juara : "",
    };

    const result =
      mode === "create"
        ? await createBerita(input)
        : await updateBerita(initialData!.id, input);

    if (result.success) {
      router.push("/admin/berita");
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
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value as BeritaKategori)}
              required
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {KATEGORI_OPTIONS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Judul</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            placeholder="Judul berita/pengumuman/agenda"
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Isi</label>
          <textarea
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            required
            rows={8}
            placeholder="Tuliskan isi lengkap di sini..."
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        {/* Field khusus prestasi */}
        {isPrestasi && (
          <div className="grid sm:grid-cols-3 gap-5 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
            <div>
              <label className="block text-xs font-bold uppercase mb-1.5 text-amber-700 dark:text-amber-400">
                Tingkat
              </label>
              <select
                value={tingkat}
                onChange={(e) => setTingkat(e.target.value)}
                className="w-full border rounded-xl p-2.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="">-- Pilih --</option>
                {TINGKAT_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1.5 text-amber-700 dark:text-amber-400">
                Peraih
              </label>
              <input
                type="text"
                value={peraih}
                onChange={(e) => setPeraih(e.target.value)}
                placeholder="Nama siswa/tim"
                className="w-full border rounded-xl p-2.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1.5 text-amber-700 dark:text-amber-400">
                Juara
              </label>
              <input
                type="text"
                value={juara}
                onChange={(e) => setJuara(e.target.value)}
                placeholder="Cth: Juara 1"
                className="w-full border rounded-xl p-2.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Gambar</label>
          <div className="flex items-start gap-4">
            {gambar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gambar}
                alt="Pratinjau gambar"
                className="w-24 h-24 rounded-xl object-cover border dark:border-gray-700 flex-shrink-0"
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
                  <i className="fa-solid fa-spinner animate-spin" /> Mengunggah gambar...
                </p>
              )}
              {!isUploading && !gambar && (
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
              <i className="fa-solid fa-floppy-disk" /> {mode === "create" ? "Simpan Berita" : "Perbarui Berita"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/berita")}
          className="text-gray-500 dark:text-gray-400 font-semibold px-4 py-3 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
