import Link from "next/link";

interface PpdbClosedProps {
  reason: "closed" | "full";
}

export default function PpdbClosed({ reason }: PpdbClosedProps) {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl mx-auto mb-5">
          <i className={`fa-solid ${reason === "full" ? "fa-users-slash" : "fa-lock"}`} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {reason === "full" ? "Kuota Pendaftaran Penuh" : "PPDB Sedang Ditutup"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {reason === "full"
            ? "Maaf, kuota pendaftaran untuk tahun ajaran ini sudah terpenuhi."
            : "Mohon maaf, pendaftaran peserta didik baru saat ini belum dibuka. Silakan cek kembali nanti."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition"
        >
          <i className="fa-solid fa-house" /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
