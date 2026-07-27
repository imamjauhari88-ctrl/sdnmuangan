"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadToCloudinary, CLOUDINARY_UPLOAD_PRESET } from "@/lib/utils/cloudinary-upload";
import { daftarPpdb } from "@/lib/actions/ppdb";
import { getNewCaptcha } from "@/lib/actions/captcha";
import type { CaptchaChallenge } from "@/lib/utils/captcha";

interface PpdbFormProps {
  tahunId: number;
  initialCaptcha: CaptchaChallenge;
}

type SubmitStage = "idle" | "uploading" | "saving" | "success" | "error";

const AGAMA_OPTIONS = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];

export default function PpdbForm({ tahunId, initialCaptcha }: PpdbFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [captcha, setCaptcha] = useState<CaptchaChallenge>(initialCaptcha);
  const [stage, setStage] = useState<SubmitStage>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState<{ noDaftar: string } | null>(null);
  const [fileNames, setFileNames] = useState<{ kk?: string; akta?: string; foto?: string }>({});

  async function handleRefreshCaptcha() {
    const fresh = await getNewCaptcha();
    setCaptcha(fresh);
  }

  function handleNikInput(e: React.FormEvent<HTMLInputElement>) {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
  }

  function handleFileChange(field: "kk" | "akta" | "foto", e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileNames((prev) => ({ ...prev, [field]: file?.name }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const nik = String(formData.get("nik") ?? "");
    if (nik.length !== 16) {
      setErrorMsg("NIK harus 16 digit!");
      return;
    }

    const captchaAnswer = parseInt(String(formData.get("captcha_user") ?? ""), 10);
    if (isNaN(captchaAnswer)) {
      setErrorMsg("Mohon isi jawaban keamanan.");
      return;
    }

    const kkFile = (formData.get("kk") as File | null) ?? null;
    const aktaFile = (formData.get("akta") as File | null) ?? null;
    const fotoFile = (formData.get("foto") as File | null) ?? null;

    if (!kkFile?.size || !aktaFile?.size || !fotoFile?.size) {
      setErrorMsg("Semua dokumen (KK, Akta, Foto) wajib diunggah.");
      return;
    }

    try {
      setStage("uploading");

      // Upload paralel ke Cloudinary langsung dari browser
      const [kkRes, aktaRes, fotoRes] = await Promise.all([
        uploadToCloudinary(kkFile, CLOUDINARY_UPLOAD_PRESET, "raw"),
        uploadToCloudinary(aktaFile, CLOUDINARY_UPLOAD_PRESET, "raw"),
        uploadToCloudinary(fotoFile, CLOUDINARY_UPLOAD_PRESET, "image"),
      ]);

      setStage("saving");

      const result = await daftarPpdb({
        tahunId,
        nik,
        nama: String(formData.get("nama") ?? ""),
        tempatLahir: String(formData.get("tempat_lahir") ?? ""),
        tanggalLahir: String(formData.get("tanggal_lahir") ?? ""),
        jenisKelamin: String(formData.get("jenis_kelamin") ?? ""),
        agama: String(formData.get("agama") ?? ""),
        alamat: String(formData.get("alamat") ?? ""),
        ayah: String(formData.get("ayah") ?? ""),
        ibu: String(formData.get("ibu") ?? ""),
        hp: String(formData.get("hp") ?? ""),
        kkUrl: kkRes.secure_url,
        aktaUrl: aktaRes.secure_url,
        fotoUrl: fotoRes.secure_url,
        captchaAnswer,
        captchaToken: captcha.token,
      });

      if (result.success && result.noDaftar) {
        setSuccessInfo({ noDaftar: result.noDaftar });
        setStage("success");
        formRef.current?.reset();
        setFileNames({});
      } else {
        setErrorMsg(result.message);
        setStage("error");
        await handleRefreshCaptcha();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan saat mengunggah dokumen. Coba lagi.");
      setStage("error");
    }
  }

  const isSubmitting = stage === "uploading" || stage === "saving";

  if (stage === "success" && successInfo) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center text-3xl mx-auto mb-4">
          <i className="fa-solid fa-circle-check" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Pendaftaran Berhasil!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Simpan nomor pendaftaran Anda:</p>
        <p className="text-3xl font-black text-blue-600 dark:text-blue-400 my-4 select-all">
          {successInfo.noDaftar}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Gunakan nomor ini untuk cek status pendaftaran kapan saja.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/ppdb/cek-status")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition"
          >
            <i className="fa-solid fa-magnifying-glass mr-2" /> Cek Status
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-6 py-3 rounded-xl transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
      <div className="bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 p-4 rounded-xl mb-6">
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          <i className="fa-solid fa-circle-info mr-2" /> Pastikan NIK sesuai KK dan semua dokumen PDF
          maksimal 1MB.
        </p>
      </div>

      {errorMsg && (
        <div
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/50 flex items-center gap-3"
          role="alert"
        >
          <i className="fa-solid fa-circle-exclamation text-xl" />
          <span className="text-sm">{errorMsg}</span>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        {/* Data Calon Siswa */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-gray-200 flex items-center gap-2">
            <i className="fa-solid fa-user-graduate" /> Data Calon Siswa
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1 dark:text-gray-300">NIK (16 Digit)</label>
              <input
                type="text"
                name="nik"
                required
                maxLength={16}
                minLength={16}
                inputMode="numeric"
                onInput={handleNikInput}
                placeholder="Contoh: 352703..."
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 dark:text-gray-300">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                required
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 dark:text-gray-300">Tempat Lahir</label>
              <input
                type="text"
                name="tempat_lahir"
                required
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 dark:text-gray-300">Tanggal Lahir</label>
              <input
                type="date"
                name="tanggal_lahir"
                required
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 dark:text-gray-300">Jenis Kelamin</label>
              <select
                name="jenis_kelamin"
                required
                defaultValue=""
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>
                  Pilih
                </option>
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 dark:text-gray-300">Agama</label>
              <select
                name="agama"
                required
                defaultValue="Islam"
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {AGAMA_OPTIONS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm mb-1 dark:text-gray-300">Alamat Lengkap (Sesuai KK)</label>
            <textarea
              name="alamat"
              required
              rows={3}
              className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Data Orang Tua */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-gray-200 flex items-center gap-2">
            <i className="fa-solid fa-users" /> Data Orang Tua
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="ayah"
              placeholder="Nama Ayah"
              required
              className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              name="ibu"
              placeholder="Nama Ibu"
              required
              className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="mt-6">
            <input
              type="text"
              name="hp"
              placeholder="No WhatsApp (Aktif)"
              required
              className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Upload Dokumen */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-gray-200 flex items-center gap-2">
            <i className="fa-solid fa-file-arrow-up" /> Upload Dokumen
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-xl dark:border-gray-700">
              <label className="text-xs font-bold uppercase dark:text-gray-400">
                Kartu Keluarga (PDF, maks. 1MB)
              </label>
              <input
                type="file"
                name="kk"
                accept="application/pdf"
                required
                onChange={(e) => handleFileChange("kk", e)}
                className="mt-2 w-full text-xs dark:text-white"
              />
              {fileNames.kk && (
                <p className="text-[10px] mt-1 text-gray-400">Terpilih: {fileNames.kk}</p>
              )}
            </div>
            <div className="p-4 border rounded-xl dark:border-gray-700">
              <label className="text-xs font-bold uppercase dark:text-gray-400">
                Akta Kelahiran (PDF, maks. 1MB)
              </label>
              <input
                type="file"
                name="akta"
                accept="application/pdf"
                required
                onChange={(e) => handleFileChange("akta", e)}
                className="mt-2 w-full text-xs dark:text-white"
              />
              {fileNames.akta && (
                <p className="text-[10px] mt-1 text-gray-400">Terpilih: {fileNames.akta}</p>
              )}
            </div>
            <div className="p-4 border rounded-xl dark:border-gray-700">
              <label className="text-xs font-bold uppercase dark:text-gray-400">Pas Foto (JPG/PNG)</label>
              <input
                type="file"
                name="foto"
                accept="image/*"
                required
                onChange={(e) => handleFileChange("foto", e)}
                className="mt-2 w-full text-xs dark:text-white"
              />
              {fileNames.foto && (
                <p className="text-[10px] mt-1 text-gray-400">Terpilih: {fileNames.foto}</p>
              )}
            </div>
          </div>
        </div>

        {/* Captcha */}
        <div className="bg-blue-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-dashed border-blue-200 dark:border-gray-600">
          <label className="block text-sm font-bold mb-3 dark:text-blue-300 text-blue-700 uppercase tracking-wider">
            Keamanan: Bukan Robot
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-2xl shadow-lg flex items-center gap-3">
              <span>{captcha.soalText} = ?</span>
              <button
                type="button"
                onClick={handleRefreshCaptcha}
                aria-label="Ganti soal captcha"
                className="text-blue-200 hover:text-white text-base transition"
              >
                <i className="fa-solid fa-rotate" />
              </button>
            </div>
            <div className="flex-1 min-w-[150px]">
              <input
                type="number"
                name="captcha_user"
                required
                placeholder="Input hasil hitung"
                className="w-full border-2 border-blue-200 rounded-xl p-3 text-xl font-bold dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3"
          >
            <span>
              {stage === "uploading"
                ? "Mengunggah Dokumen..."
                : stage === "saving"
                ? "Menyimpan Data..."
                : "Kirim Pendaftaran"}
            </span>
            {isSubmitting && <i className="fa-solid fa-spinner animate-spin" />}
          </button>
          <Link
            href="/"
            className="w-full text-center py-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition"
          >
            Batal dan Kembali
          </Link>
        </div>
      </form>
    </div>
  );
}
