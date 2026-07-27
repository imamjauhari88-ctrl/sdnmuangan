"use client";

import { useState, useTransition } from "react";
import { cekStatusPpdb, type CekStatusResult } from "@/lib/actions/cek-status";
import { formatTanggalIndonesia } from "@/lib/utils/format";

const STATUS_BADGE: Record<string, string> = {
  Menunggu: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Diterima: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cadangan: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Ditolak: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function CekStatusForm() {
  const [nik, setNik] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CekStatusResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      const res = await cekStatusPpdb(nik);
      setResult(res);
    });
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mx-auto mb-3">
            <i className="fa-solid fa-magnifying-glass" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Cek Status Pendaftaran</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Masukkan NIK yang digunakan saat mendaftar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nik}
            onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
            maxLength={16}
            minLength={16}
            inputMode="numeric"
            placeholder="Masukkan NIK (16 digit)"
            required
            className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                Mencari... <i className="fa-solid fa-spinner animate-spin" />
              </>
            ) : (
              "Cek Status"
            )}
          </button>
        </form>

        {result && !result.success && (
          <div className="mt-5 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm text-center">
            <i className="fa-solid fa-circle-exclamation mr-1.5" /> {result.message}
          </div>
        )}

        {result?.success && result.data && (
          <div className="mt-5 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Nama Pendaftar</p>
            <p className="font-bold text-gray-800 dark:text-white mb-3">{result.data.nama}</p>

            <p className="text-xs text-gray-400 uppercase font-bold mb-1">No. Pendaftaran</p>
            <p className="font-mono text-sm text-gray-700 dark:text-gray-200 mb-3 select-all">
              {result.data.no_daftar}
            </p>

            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Status</p>
            <span
              className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold ${
                STATUS_BADGE[result.data.status] ?? STATUS_BADGE.Menunggu
              }`}
            >
              {result.data.status}
            </span>

            {result.data.tanggal_daftar && (
              <p className="text-xs text-gray-400 mt-3">
                Daftar pada {formatTanggalIndonesia(result.data.tanggal_daftar.slice(0, 10))}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
