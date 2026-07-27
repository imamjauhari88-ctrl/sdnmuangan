"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary, CLOUDINARY_UPLOAD_PRESET } from "@/lib/utils/cloudinary-upload";
import { savePengaturan } from "@/lib/actions/admin-pengaturan";
import type { PengaturanMap } from "@/lib/types/database";

interface PengaturanFormProps {
  initialData: PengaturanMap;
}

type TabKey = "umum" | "profil" | "statistik" | "kontak";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "umum", label: "Info Umum", icon: "fa-circle-info" },
  { key: "profil", label: "Profil", icon: "fa-id-card" },
  { key: "statistik", label: "Statistik", icon: "fa-chart-simple" },
  { key: "kontak", label: "Kontak", icon: "fa-address-book" },
];

/** Kunci-kunci yang dikelola halaman ini, dikelompokkan per tab agar
 *  mudah dilacak field mana yang masuk grup mana. Daftar ini harus
 *  konsisten dengan kunci yang dibaca di lib/data/pengaturan.ts dan
 *  halaman-halaman publik (Beranda, Profil, Kontak, layout).
 */
const DEFAULT_FIELDS: Record<string, string> = {
  // Info Umum
  nama_sekolah: "",
  npsn: "",
  status_sekolah: "Negeri",
  akreditasi: "",
  tahun_berdiri: "",
  lokasi: "",
  logo_sekolah: "",
  foto_sekolah: "",
  // Profil
  profil_singkat: "",
  visi: "",
  misi: "",
  sejarah: "",
  foto_sejarah: "",
  foto_struktur: "",
  sambutan_kepsek: "",
  foto_kepsek: "",
  // Statistik
  jml_siswa: "0",
  jml_guru: "0",
  jml_rombel: "0",
  jml_prestasi: "0",
  // Kontak (Ditambahkan Facebook, Instagram, TikTok)
  alamat_sekolah: "",
  telepon_sekolah: "",
  email_sekolah: "",
  jam_operasional: "",
  koordinat_map: "",
  youtube: "",
  facebook: "",  // Ditambahkan
  instagram: "", // Ditambahkan
  tiktok: "",    // Ditambahkan
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  hint,
  shape = "square",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  shape?: "square" | "wide";
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");
    try {
      const result = await uploadToCloudinary(file, CLOUDINARY_UPLOAD_PRESET, "image");
      onChange(result.secure_url);
    } catch (err) {
      console.error(err);
      setError("Gagal mengunggah gambar. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">{label}</label>
      <div className="flex items-start gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={`Pratinjau ${label}`}
            className={`border dark:border-gray-700 object-cover flex-shrink-0 bg-gray-50 dark:bg-gray-800 ${
              shape === "wide" ? "w-32 h-20 rounded-lg" : "w-20 h-20 rounded-xl"
            }`}
          />
        ) : (
          <div
            className={`border border-dashed dark:border-gray-700 flex items-center justify-center text-gray-300 dark:text-gray-600 flex-shrink-0 ${
              shape === "wide" ? "w-32 h-20 rounded-lg" : "w-20 h-20 rounded-xl"
            }`}
          >
            <i className="fa-solid fa-image text-xl" />
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={isUploading}
            className="w-full text-sm dark:text-gray-300"
          />
          {isUploading && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1.5 flex items-center gap-1.5">
              <i className="fa-solid fa-spinner animate-spin" /> Mengunggah...
            </p>
          )}
          {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
          {hint && !error && !isUploading && (
            <p className="text-xs text-gray-400 mt-1.5">{hint}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Pisahkan teks misi */
function parseListLines(value: string): string[] {
  if (!value) return [""];
  if (value.includes("<li>")) {
    const matches = [...value.matchAll(/<li>([^]*?)<\/li>/g)];
    const lines = matches.map((m) => m[1].replace(/<[^>]*>/g, "").trim()).filter(Boolean);
    return lines.length ? lines : [""];
  }
  const lines = value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines : [""];
}

/** Pisahkan teks jam operasional */
function parseBrLines(value: string): string[] {
  if (!value) return [""];
  const normalized = value.replace(/&lt;br\s*\/?&gt;/gi, "<br>");
  const lines = normalized
    .split(/<br\s*\/?>/i)
    .map((l) => l.replace(/<[^>]*>/g, "").trim())
    .filter(Boolean);
  return lines.length ? lines : [""];
}

function DynamicListField({
  label,
  hint,
  values,
  onChange,
  placeholder,
  addLabel = "Tambah baris",
}: {
  label: string;
  hint?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  function updateLine(i: number, val: string) {
    const next = [...values];
    next[i] = val;
    onChange(next);
  }

  function addLine() {
    onChange([...values, ""]);
  }

  function removeLine(i: number) {
    if (values.length <= 1) {
      onChange([""]);
      return;
    }
    onChange(values.filter((_, idx) => idx !== i));
  }

  function moveLine(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">{label}</label>
      <div className="space-y-2">
        {values.map((val, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-5 text-xs font-bold text-gray-400 flex-shrink-0 text-center">
              {i + 1}.
            </span>
            <input
              type="text"
              value={val}
              onChange={(e) => updateLine(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 border rounded-xl p-2.5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => moveLine(i, -1)}
              disabled={i === 0}
              title="Pindah ke atas"
              className="w-8 h-8 flex-shrink-0 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <i className="fa-solid fa-chevron-up text-xs" />
            </button>
            <button
              type="button"
              onClick={() => moveLine(i, 1)}
              disabled={i === values.length - 1}
              title="Pindah ke bawah"
              className="w-8 h-8 flex-shrink-0 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <i className="fa-solid fa-chevron-down text-xs" />
            </button>
            <button
              type="button"
              onClick={() => removeLine(i)}
              title="Hapus baris"
              className="w-8 h-8 flex-shrink-0 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
            >
              <i className="fa-solid fa-trash text-xs" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addLine}
        className="mt-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
      >
        <i className="fa-solid fa-plus" /> {addLabel}
      </button>
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
      {children}
    </div>
  );
}

export default function PengaturanForm({ initialData }: PengaturanFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("umum");
  const [fields, setFields] = useState<Record<string, string>>({
    ...DEFAULT_FIELDS,
    ...initialData,
  });
  const [misiLines, setMisiLines] = useState<string[]>(() =>
    parseListLines((initialData.misi ?? DEFAULT_FIELDS.misi) || "")
  );
  const [jamLines, setJamLines] = useState<string[]>(() =>
    parseBrLines((initialData.jam_operasional ?? DEFAULT_FIELDS.jam_operasional) || "")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  function set(key: string) {
    return (value: string) => {
      setFields((prev) => ({ ...prev, [key]: value }));
      setStatusMsg(null);
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    const payload: Record<string, string> = {
      ...fields,
      misi: misiLines.map((l) => l.trim()).filter(Boolean).join("\n"),
      jam_operasional: jamLines.map((l) => l.trim()).filter(Boolean).join("<br>"),
    };

    const result = await savePengaturan(payload);

    setIsSubmitting(false);
    setStatusMsg({ type: result.success ? "success" : "error", text: result.message });

    if (result.success) {
      router.refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab nav */}
      <div className="flex gap-1.5 overflow-x-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-1.5 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <i className={`fa-solid ${tab.icon}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            statusMsg.type === "success"
              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50"
              : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50"
          }`}
          role="alert"
        >
          <i
            className={`fa-solid ${
              statusMsg.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"
            } text-lg`}
          />
          {statusMsg.text}
        </div>
      )}

      {/* Tab: Info Umum */}
      {activeTab === "umum" && (
        <Card>
          <div className="grid sm:grid-cols-2 gap-5">
            <TextField
              label="Nama Sekolah"
              value={fields.nama_sekolah}
              onChange={set("nama_sekolah")}
              placeholder="Cth: UPTD SDN Tamansareh 2"
              required
            />
            <TextField label="NPSN" value={fields.npsn} onChange={set("npsn")} placeholder="Cth: 20534xxx" />
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">
                Status Sekolah
              </label>
              <select
                value={fields.status_sekolah}
                onChange={(e) => set("status_sekolah")(e.target.value)}
                className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Negeri">Negeri</option>
                <option value="Swasta">Swasta</option>
              </select>
            </div>
            <TextField
              label="Akreditasi"
              value={fields.akreditasi}
              onChange={set("akreditasi")}
              placeholder="Cth: A"
            />
            <TextField
              label="Tahun Berdiri"
              value={fields.tahun_berdiri}
              onChange={set("tahun_berdiri")}
              placeholder="Cth: 1985"
            />
          </div>

          <TextField
            label="Lokasi"
            value={fields.lokasi}
            onChange={set("lokasi")}
            placeholder="Cth: Tamansareh, Sampang, Jawa Timur"
            hint="Ditampilkan singkat di kartu info sekolah pada halaman Profil."
          />

          <div className="grid sm:grid-cols-2 gap-5 pt-5 border-t border-gray-100 dark:border-gray-800">
            <ImageField
              label="Logo Sekolah"
              value={fields.logo_sekolah}
              onChange={set("logo_sekolah")}
              hint="Dipakai di navbar, favicon, dan loading screen."
            />
            <ImageField
              label="Foto Sekolah"
              value={fields.foto_sekolah}
              onChange={set("foto_sekolah")}
              hint="Foto utama yang tampil di Hero halaman Beranda."
              shape="wide"
            />
          </div>
        </Card>
      )}

      {/* Tab: Profil */}
      {activeTab === "profil" && (
        <Card>
          <TextAreaField
            label="Profil Singkat"
            value={fields.profil_singkat}
            onChange={set("profil_singkat")}
            rows={3}
            placeholder="Ringkasan singkat tentang sekolah (juga dipakai sebagai deskripsi SEO)."
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <TextAreaField
              label="Visi"
              value={fields.visi}
              onChange={set("visi")}
              rows={3}
              placeholder="Visi sekolah dalam satu kalimat."
            />
            <DynamicListField
              label="Misi"
              values={misiLines}
              onChange={setMisiLines}
              placeholder="Cth: Mewujudkan generasi berakhlak mulia"
              addLabel="Tambah poin misi"
              hint="Tiap baris jadi satu poin bernomor di halaman publik."
            />
          </div>

          <TextAreaField
            label="Sejarah Sekolah"
            value={fields.sejarah}
            onChange={set("sejarah")}
            rows={5}
            placeholder="Cerita singkat sejarah berdirinya sekolah."
          />

          <ImageField
            label="Foto Sejarah"
            value={fields.foto_sejarah}
            onChange={set("foto_sejarah")}
            hint="Foto pendukung di bagian Sejarah pada halaman Profil."
            shape="wide"
          />

          <div className="pt-5 border-t border-gray-100 dark:border-gray-800 space-y-5">
            <ImageField
              label="Foto Struktur Organisasi"
              value={fields.foto_struktur}
              onChange={set("foto_struktur")}
              hint="Bagan struktur organisasi sekolah (gambar)."
              shape="wide"
            />

            <TextAreaField
              label="Sambutan Kepala Sekolah"
              value={fields.sambutan_kepsek}
              onChange={set("sambutan_kepsek")}
              rows={4}
              placeholder="Kata sambutan dari kepala sekolah, tampil di halaman Beranda."
            />

            <ImageField
              label="Foto Kepala Sekolah"
              value={fields.foto_kepsek}
              onChange={set("foto_kepsek")}
            />
          </div>
        </Card>
      )}

      {/* Tab: Statistik */}
      {activeTab === "statistik" && (
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400 -mt-1">
            Angka-angka ini tampil di bagian statistik halaman Beranda dan info sekolah di halaman
            Profil.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            <NumberField
              label="Jumlah Siswa"
              value={fields.jml_siswa}
              onChange={set("jml_siswa")}
            />
            <NumberField label="Jumlah Guru" value={fields.jml_guru} onChange={set("jml_guru")} />
            <NumberField
              label="Jumlah Rombel (Rombongan Belajar)"
              value={fields.jml_rombel}
              onChange={set("jml_rombel")}
            />
            <TextField
              label="Jumlah Prestasi"
              value={fields.jml_prestasi}
              onChange={set("jml_prestasi")}
              placeholder="Cth: 50 atau 50+"
              hint="Boleh diisi angka biasa atau dengan tanda + (cth: 50+)."
            />
          </div>
        </Card>
      )}

      {/* Tab: Kontak */}
      {activeTab === "kontak" && (
        <Card>
          <TextAreaField
            label="Alamat Sekolah"
            value={fields.alamat_sekolah}
            onChange={set("alamat_sekolah")}
            rows={2}
            placeholder="Jl. Raya ..., Kecamatan, Kabupaten, Provinsi"
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <TextField
              label="Telepon / WhatsApp"
              value={fields.telepon_sekolah}
              onChange={set("telepon_sekolah")}
              placeholder="Cth: 0812xxxxxxx"
            />
            <TextField
              label="Email Sekolah"
              value={fields.email_sekolah}
              onChange={set("email_sekolah")}
              placeholder="Cth: sekolah@email.com"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <DynamicListField
              label="Jam Operasional"
              values={jamLines}
              onChange={setJamLines}
              placeholder="Cth: Senin–Jumat: 07.00–13.00 WIB"
              addLabel="Tambah baris jam"
              hint="Tiap baris tampil bersusun di halaman Kontak & Profil."
            />
            <TextField
              label="Koordinat Peta (lat, lng)"
              value={fields.koordinat_map}
              onChange={set("koordinat_map")}
              placeholder="Cth: -7.139964092838838, 113.2743876634702"
              hint="Buka lokasi di Google Maps → klik kanan pada titiknya → salin koordinat yang muncul paling atas."
            />
          </div>

          {/* Sub-grup baru untuk Media Sosial */}
          <div className="pt-5 border-t border-gray-100 dark:border-gray-800 space-y-5">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Media Sosial Sekolah
            </h4>
            <div className="grid sm:grid-cols-2 gap-5">
              <TextField
                label="Link Facebook"
                value={fields.facebook}
                onChange={set("facebook")}
                placeholder="Cth: https://facebook.com/sekolah"
              />
              <TextField
                label="Link Instagram"
                value={fields.instagram}
                onChange={set("instagram")}
                placeholder="Cth: https://instagram.com/sekolah"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <TextField
                label="Link TikTok"
                value={fields.tiktok}
                onChange={set("tiktok")}
                placeholder="Cth: https://tiktok.com/@sekolah"
              />
              <TextField
                label="Link YouTube"
                value={fields.youtube}
                onChange={set("youtube")}
                placeholder="Cth: https://youtube.com/@sekolah"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Save bar */}
      <div className="sticky bottom-4 z-10">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg rounded-2xl p-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                Menyimpan... <i className="fa-solid fa-spinner animate-spin" />
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" /> Simpan Semua Perubahan
              </>
            )}
          </button>
          <p className="text-xs text-gray-400 hidden sm:block">
            Perubahan berlaku untuk semua tab, bukan hanya tab yang sedang dibuka.
          </p>
        </div>
      </div>
    </form>
  );
}