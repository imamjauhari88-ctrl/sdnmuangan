"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTahunAjaran,
  updateTahunAjaran,
  type TahunAjaranFormInput,
} from "@/lib/actions/admin-ppdb";
import type { TahunAjaran, TahunAjaranStatus } from "@/lib/types/database";

interface TahunAjaranFormProps {
  mode: "create" | "edit";
  initialData?: TahunAjaran;
}

export default function TahunAjaranForm({ mode, initialData }: TahunAjaranFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [tahun, setTahun] = useState(initialData?.tahun ?? "");
  const [kuota, setKuota] = useState(initialData?.kuota ?? 60);
  const [status, setStatus] = useState<TahunAjaranStatus>(initialData?.status ?? "Tutup");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const input: TahunAjaranFormInput = { tahun, kuota, status };

    const result =
      mode === "create"
        ? await createTahunAjaran(input)
        : await updateTahunAjaran(initialData!.id, input);

    if (result.success) {
      router.push("/admin/ppdb/tahun-ajaran");
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

      {status === "Buka" && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800/50 flex items-center gap-3 text-sm">
          <i className="fa-solid fa-circle-info text-lg flex-shrink-0" />
          <span>
            Membuka tahun ajaran ini akan otomatis <strong>menutup semua tahun ajaran lain</strong>{" "}
            (hanya boleh satu yang dibuka pada satu waktu).
          </span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Tahun Ajaran</label>
          <input
            type="text"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            required
            placeholder="Cth: 2026/2027"
            pattern="\d{4}/\d{4}"
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Format: TAHUN/TAHUN, cth 2026/2027</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Kuota Pendaftar</label>
          <input
            type="number"
            value={kuota}
            onChange={(e) => setKuota(parseInt(e.target.value, 10) || 0)}
            required
            min={1}
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Status Pendaftaran</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStatus("Buka")}
              className={`p-3 rounded-xl border-2 font-bold text-sm transition ${
                status === "Buka"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
              }`}
            >
              <i className="fa-solid fa-lock-open mr-2" /> Buka
            </button>
            <button
              type="button"
              onClick={() => setStatus("Tutup")}
              className={`p-3 rounded-xl border-2 font-bold text-sm transition ${
                status === "Tutup"
                  ? "border-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
              }`}
            >
              <i className="fa-solid fa-lock mr-2" /> Tutup
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
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
          onClick={() => router.push("/admin/ppdb/tahun-ajaran")}
          className="text-gray-500 dark:text-gray-400 font-semibold px-4 py-3 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
