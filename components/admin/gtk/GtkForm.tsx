"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary, CLOUDINARY_UPLOAD_PRESET } from "@/lib/utils/cloudinary-upload";
import { WARNA_MAP, type WarnaKey } from "@/lib/utils/warna";
import { createGtk, updateGtk, type GtkFormInput } from "@/lib/actions/admin-gtk";
import type { Gtk, GtkBerkasItem } from "@/lib/types/database";

interface GtkFormProps {
  mode: "create" | "edit";
  initialData?: Gtk;
}

const WARNA_KEYS = Object.keys(WARNA_MAP) as WarnaKey[];

const KATEGORI_OPTIONS = [
  { value: "pimpinan", label: "👑 Kepala Sekolah / Pimpinan" },
  { value: "guru_kelas", label: "🏫 Guru Kelas" },
  { value: "guru_mapel", label: "📚 Guru Mata Pelajaran" },
  { value: "tendik", label: "💼 Tenaga Kependidikan" },
  { value: "lainnya", label: "👥 Staf Lainnya" },
];

function emptyBerkas(): GtkBerkasItem {
  return { label: "", url: "" };
}

export default function GtkForm({ mode, initialData }: GtkFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [nama, setNama] = useState(initialData?.nama ?? "");
  const [jabatan, setJabatan] = useState(initialData?.jabatan ?? "");
  const [kategori, setKategori] = useState(initialData?.kategori ?? "guru_kelas");
  const [pendidikan, setPendidikan] = useState(initialData?.pendidikan ?? "");
  const [foto, setFoto] = useState(initialData?.foto ?? "");
  const [warna, setWarna] = useState<WarnaKey>((initialData?.warna as WarnaKey) ?? "blue");
  const [urutan, setUrutan] = useState(initialData?.urutan ?? 0);
  const [wa, setWa] = useState(initialData?.wa ?? "");
  const [berkas, setBerkas] = useState<GtkBerkasItem[]>(
    initialData?.berkas && initialData.berkas.length > 0 ? initialData.berkas : [emptyBerkas()]
  );

  async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");
    try {
      const result = await uploadToCloudinary(file, CLOUDINARY_UPLOAD_PRESET, "image");
      setFoto(result.secure_url);
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal mengunggah foto. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  }

  function updateBerkasRow(index: number, field: keyof GtkBerkasItem, value: string) {
    setBerkas((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  }

  function tambahBerkas() {
    setBerkas((prev) => [...prev, emptyBerkas()]);
  }

  function hapusBerkas(index: number) {
    setBerkas((prev) => {
      if (prev.length <= 1) {
        // Jangan hapus baris terakhir, kosongkan saja
        return [emptyBerkas()];
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const input: GtkFormInput = {
      nama,
      jabatan,
      kategori,
      pendidikan,
      foto,
      warna,
      urutan,
      wa,
      berkas,
    };

    const result =
      mode === "create" ? await createGtk(input) : await updateGtk(initialData!.id, input);

    if (result.success) {
      router.push("/admin/gtk");
      router.refresh();
    } else {
      setErrorMsg(result.message);
      setIsSubmitting(false);
    }
  }

  const previewWarna = WARNA_MAP[warna];

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
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={foto}
              alt="Pratinjau foto"
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-400 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-user text-gray-400 text-xl" />
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pratinjau</p>
            <p className="font-bold text-gray-800 dark:text-white">{nama || "Nama Personel"}</p>
            <span
              className={`inline-block mt-1 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${previewWarna.iconBg}`}
            >
              {jabatan || "Jabatan"}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">
              Nama Lengkap &amp; Gelar
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="Contoh: Redi Kasihan, S.Pd."
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Jabatan</label>
            <input
              type="text"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              required
              placeholder="Contoh: Guru Kelas I"
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Pendidikan</label>
            <input
              type="text"
              value={pendidikan}
              onChange={(e) => setPendidikan(e.target.value)}
              placeholder="Contoh: S1-PGSD"
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {KATEGORI_OPTIONS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Warna Label</label>
            <select
              value={warna}
              onChange={(e) => setWarna(e.target.value as WarnaKey)}
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none capitalize"
            >
              {WARNA_KEYS.map((w) => (
                <option key={w} value={w} className="capitalize">
                  {w}
                </option>
              ))}
            </select>
          </div>

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
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">
            <i className="fa-brands fa-whatsapp text-green-500" /> Nomor WhatsApp{" "}
            <span className="text-gray-400 font-normal">(opsional)</span>
          </label>
          <input
            type="text"
            value={wa}
            onChange={(e) => setWa(e.target.value)}
            placeholder="Contoh: 08123456789"
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">
            Foto Profil (opsional)
          </label>
          <div className="flex items-start gap-4">
            {foto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={foto}
                alt="Pratinjau foto"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
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

        {/* Berkas & Perangkat Ajar */}
        <div className="border dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold flex items-center gap-2 dark:text-gray-300">
              <i className="fa-brands fa-google-drive text-blue-500" />
              Berkas &amp; Perangkat Ajar
            </label>
            <span className="text-[10px] text-gray-400 bg-white dark:bg-gray-700 border dark:border-gray-600 px-2.5 py-1 rounded-full font-semibold">
              {berkas.filter((b) => b.label.trim() || b.url.trim()).length} berkas
            </span>
          </div>

          <div className="hidden sm:grid grid-cols-[140px_1fr_40px] gap-2 mb-2 px-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Nama Berkas
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Link Google Drive
            </span>
            <span />
          </div>

          <div className="space-y-2">
            {berkas.map((b, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[140px_1fr_40px] gap-2 items-center"
              >
                <input
                  type="text"
                  value={b.label}
                  onChange={(e) => updateBerkasRow(index, "label", e.target.value)}
                  placeholder="RPP / Bank Soal..."
                  className="w-full border dark:border-gray-600 dark:bg-gray-800 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
                <input
                  type="url"
                  value={b.url}
                  onChange={(e) => updateBerkasRow(index, "url", e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full border dark:border-gray-600 dark:bg-gray-800 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => hapusBerkas(index)}
                  className="w-9 h-9 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition flex-shrink-0"
                  title="Hapus baris ini"
                >
                  <i className="fa-solid fa-trash text-xs" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={tambahBerkas}
            className="mt-3 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition px-1"
          >
            <i className="fa-solid fa-circle-plus text-base" /> Tambah Berkas
          </button>

          <p className="text-[11px] text-gray-400 mt-2 flex items-start gap-1.5 px-1">
            <i className="fa-solid fa-circle-info mt-0.5 flex-shrink-0" />
            Pastikan link Google Drive sudah diset &quot;Siapa saja yang punya link&quot; agar bisa
            dibuka.
          </p>
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
              <i className="fa-solid fa-floppy-disk" /> {mode === "create" ? "Simpan Personel" : "Perbarui Personel"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/gtk")}
          className="text-gray-500 dark:text-gray-400 font-semibold px-4 py-3 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
