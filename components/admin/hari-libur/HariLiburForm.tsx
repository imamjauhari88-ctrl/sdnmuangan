"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createHariLibur,
  updateHariLibur,
  type HariLiburFormInput,
} from "@/lib/actions/admin-hari-libur";
import type { HariLibur, HariLiburJenis } from "@/lib/types/database";

interface HariLiburFormProps {
  mode: "create" | "edit";
  initialData?: HariLibur;
}

const JENIS_OPTIONS: { value: HariLiburJenis; label: string }[] = [
  { value: "nasional", label: "Libur Nasional" },
  { value: "cuti_bersama", label: "Cuti Bersama" },
  { value: "sekolah", label: "Libur Sekolah" },
];

export default function HariLiburForm({ mode, initialData }: HariLiburFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [tanggal, setTanggal] = useState(initialData?.tanggal ?? new Date().toISOString().slice(0, 10));
  const [nama, setNama] = useState(initialData?.nama ?? "");
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi ?? "");
  const [jenis, setJenis] = useState<HariLiburJenis>(initialData?.jenis ?? "nasional");
  const [aktif, setAktif] = useState(initialData?.aktif ?? true);

  const isFromGoogleCalendar = initialData?.sumber === "google_calendar";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const input: HariLiburFormInput = { tanggal, nama, deskripsi, jenis, aktif };

    const result =
      mode === "create"
        ? await createHariLibur(input)
        : await updateHariLibur(initialData!.id, input);

    if (result.success) {
      router.push("/admin/hari-libur");
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

      {isFromGoogleCalendar && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-800/50 flex items-start gap-3 text-sm">
          <i className="fa-brands fa-google text-lg flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Data dari Google Calendar</p>
            <p className="text-xs mt-0.5 opacity-90">
              Hari libur ini berasal dari sinkronisasi otomatis. Kakak masih bisa mengubah nama,
              deskripsi, jenis, dan statusnya — tapi sebaiknya pertimbangkan dulu sebelum mengubah
              tanggal, supaya tidak bertentangan dengan data sinkronisasi berikutnya.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
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

          <div>
            <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Jenis</label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value as HariLiburJenis)}
              className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {JENIS_OPTIONS.map((j) => (
                <option key={j.value} value={j.value}>
                  {j.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Nama Hari Libur</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Cth: Hari Raya Idul Fitri"
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5 dark:text-gray-300">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={2}
            placeholder="Keterangan tambahan (opsional)"
            className="w-full border rounded-xl p-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={aktif}
              onChange={(e) => setAktif(e.target.checked)}
              className="w-5 h-5 rounded accent-blue-600"
            />
            <span className="text-sm font-semibold dark:text-gray-300">
              Tampilkan di kalender publik
            </span>
          </label>
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
          onClick={() => router.push("/admin/hari-libur")}
          className="text-gray-500 dark:text-gray-400 font-semibold px-4 py-3 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
