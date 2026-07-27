"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveTestimoni, rejectTestimoni, resetStatusTestimoni } from "@/lib/actions/admin-pesan";
import { formatTanggalIndonesia } from "@/lib/utils/format";
import type { Pesan } from "@/lib/types/database";

interface PesanDetailProps {
  pesan: Pesan;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-amber-400 text-lg" aria-label={`Rating ${rating} dari 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={`fa-solid fa-star ${i > rating ? "text-gray-200 dark:text-gray-700" : ""}`} />
      ))}
    </div>
  );
}

export default function PesanDetail({ pesan }: PesanDetailProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");

  function handleApprove() {
    startTransition(async () => {
      const result = await approveTestimoni(pesan.id);
      setStatusMsg(result.message);
      router.refresh();
    });
  }

  function handleReject() {
    startTransition(async () => {
      const result = await rejectTestimoni(pesan.id);
      setStatusMsg(result.message);
      router.refresh();
    });
  }

  function handleReset() {
    startTransition(async () => {
      const result = await resetStatusTestimoni(pesan.id);
      setStatusMsg(result.message);
      router.refresh();
    });
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white text-lg">{pesan.subjek}</h2>
              <p className="text-xs text-gray-400 mt-1">
                {pesan.tanggal ? formatTanggalIndonesia(pesan.tanggal.slice(0, 10)) : "-"}
              </p>
            </div>
            {pesan.is_testi && pesan.rating && <StarRating rating={pesan.rating} />}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {pesan.pesan}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h3 className="text-xs font-bold uppercase text-gray-400 mb-3">Informasi Pengirim</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">Nama</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{pesan.nama}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">Email</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{pesan.email}</p>
            </div>
            {pesan.kelompok && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">Kelas Anak</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Kelas {pesan.kelompok}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {pesan.is_testi ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3">Status Testimoni</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Testimoni ini{" "}
              <strong>
                {pesan.status_testi === "approved"
                  ? "sudah disetujui dan tampil"
                  : pesan.status_testi === "rejected"
                  ? "ditolak"
                  : "menunggu ditinjau"}
              </strong>{" "}
              di halaman publik.
            </p>

            {pesan.status_testi !== "approved" && (
              <button
                onClick={handleApprove}
                disabled={isPending}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-bold py-2.5 rounded-xl transition mb-2 flex items-center justify-center gap-2 text-sm"
              >
                <i className="fa-solid fa-check" /> Setujui Testimoni
              </button>
            )}
            {pesan.status_testi !== "rejected" && (
              <button
                onClick={handleReject}
                disabled={isPending}
                className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 disabled:opacity-70 text-red-600 dark:text-red-400 font-bold py-2.5 rounded-xl transition mb-2 flex items-center justify-center gap-2 text-sm"
              >
                <i className="fa-solid fa-xmark" /> Tolak Testimoni
              </button>
            )}
            {pesan.status_testi !== "pending" && (
              <button
                onClick={handleReset}
                disabled={isPending}
                className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 disabled:opacity-70 text-gray-600 dark:text-gray-300 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                <i className="fa-solid fa-rotate-left" /> Kembalikan ke Menunggu
              </button>
            )}

            {statusMsg && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-3">
                <i className="fa-solid fa-circle-check mr-1" /> {statusMsg}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 text-center">
            <i className="fa-solid fa-envelope-open-text text-3xl text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ini pesan biasa, bukan testimoni.
            </p>
          </div>
        )}

        <a
          href={`mailto:${pesan.email}?subject=Re: ${pesan.subjek}`}
          className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-sm"
        >
          <i className="fa-solid fa-reply mr-2" /> Balas via Email
        </a>
      </div>
    </div>
  );
}
