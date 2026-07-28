interface PpdbHeaderProps {
  namaSekolah: string;
  tahunAjaran: string;
  kuota: number | null;
  jmlPendaftar: number;
}

export default function PpdbHeader({ namaSekolah, tahunAjaran, kuota, jmlPendaftar }: PpdbHeaderProps) {
  const tahunSingkat = tahunAjaran.split("/")[0];
  const sisaKuota = kuota !== null ? Math.max(0, kuota - jmlPendaftar) : null;

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-teal-800 dark:text-teal-400">
        PPDB ONLINE
        <br />
        {namaSekolah.toUpperCase()}
        <br />
        TAHUN {tahunSingkat}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Pendaftaran Peserta Didik Baru Sekolah Dasar
      </p>

      {kuota !== null && (
        <div className="inline-flex items-center gap-2 mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm shadow-sm">
          <i className="fa-solid fa-users text-teal-600" />
          <span className="text-gray-600 dark:text-gray-300">
            Kuota: <strong className="text-gray-800 dark:text-white">{jmlPendaftar}</strong> /{" "}
            {kuota} pendaftar
          </span>
          {sisaKuota !== null && sisaKuota <= 5 && sisaKuota > 0 && (
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              (sisa {sisaKuota} kursi!)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
