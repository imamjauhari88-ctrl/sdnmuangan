"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStatusPendaftar } from "@/lib/actions/admin-ppdb";
import { formatTanggalIndonesia } from "@/lib/utils/format";
import type { Pendaftar, PendaftarStatus } from "@/lib/types/database";

interface PendaftarDetailProps {
  pendaftar: Pendaftar;
}

const STATUS_OPTIONS: PendaftarStatus[] = ["Menunggu", "Diterima", "Cadangan", "Ditolak"];

const STATUS_BADGE: Record<PendaftarStatus, string> = {
  Menunggu: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Diterima: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cadangan: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Ditolak: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value || "-"}</p>
    </div>
  );
}

export default function PendaftarDetail({ pendaftar }: PendaftarDetailProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");

  function handleStatusChange(status: PendaftarStatus) {
    startTransition(async () => {
      const result = await updateStatusPendaftar(pendaftar.id, status);
      setStatusMsg(result.message);
      router.refresh();
    });
  }

  const dokumen = [
    { label: "Kartu Keluarga", url: pendaftar.kk, icon: "fa-file-pdf" },
    { label: "Akta Kelahiran", url: pendaftar.akta, icon: "fa-file-pdf" },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Data Siswa */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-user-graduate text-blue-500" /> Data Calon Siswa
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FieldRow label="Nama Lengkap" value={pendaftar.nama ?? "-"} />
            <FieldRow label="NIK" value={pendaftar.nik ?? "-"} />
            <FieldRow label="Tempat Lahir" value={pendaftar.tempat_lahir ?? "-"} />
            <FieldRow
              label="Tanggal Lahir"
              value={pendaftar.tanggal_lahir ? formatTanggalIndonesia(pendaftar.tanggal_lahir) : "-"}
            />
            <FieldRow label="Jenis Kelamin" value={pendaftar.jenis_kelamin ?? "-"} />
            <FieldRow label="Agama" value={pendaftar.agama ?? "-"} />
          </div>
          <div className="mt-4">
            <FieldRow label="Alamat" value={pendaftar.alamat ?? "-"} />
          </div>
        </div>

        {/* Data Orang Tua */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-users text-purple-500" /> Data Orang Tua
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FieldRow label="Nama Ayah" value={pendaftar.ayah ?? "-"} />
            <FieldRow label="Nama Ibu" value={pendaftar.ibu ?? "-"} />
            <FieldRow label="No. WhatsApp" value={pendaftar.hp ?? "-"} />
          </div>
        </div>

        {/* Dokumen */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-file-arrow-up text-amber-500" /> Dokumen
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {dokumen.map((d) => (
              <a
                key={d.label}
                href={d.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                  d.url
                    ? "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    : "border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                  <i className={`fa-solid ${d.icon}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{d.label}</p>
                  <p className="text-xs text-gray-400">{d.url ? "Lihat dokumen" : "Tidak ada"}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar status & foto */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">Pas Foto</h2>
          {pendaftar.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pendaftar.foto}
              alt={pendaftar.nama ?? "Foto pendaftar"}
              className="w-full aspect-square object-cover rounded-xl border dark:border-gray-700"
            />
          ) : (
            <div className="w-full aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300 dark:text-gray-600">
              <i className="fa-solid fa-image text-3xl" />
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 dark:text-white mb-3">Status Pendaftaran</h2>
          <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-3 select-all">
            {pendaftar.no_daftar}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={isPending}
                className={`text-xs font-bold px-3 py-2 rounded-lg transition ${
                  (pendaftar.status ?? "Menunggu") === s
                    ? STATUS_BADGE[s] + " ring-2 ring-offset-1 ring-current"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {statusMsg && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              <i className="fa-solid fa-circle-check mr-1" /> {statusMsg}
            </p>
          )}

          {pendaftar.tanggal_daftar && (
            <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              Daftar pada {formatTanggalIndonesia(pendaftar.tanggal_daftar.slice(0, 10))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
