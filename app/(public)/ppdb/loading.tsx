/**
 * Skeleton untuk halaman /ppdb.
 *
 * Beda dari halaman lain: PPDB pakai `export const dynamic =
 * "force-dynamic"` (kuota pendaftar harus selalu data terbaru, tidak
 * di-cache ISR). Artinya skeleton ini AKAN kelihatan di **setiap**
 * kunjungan (bukan cuma pas cache kosong seperti Beranda/Berita/dst),
 * jadi worth effort lebih buat niru bentuk form aslinya.
 */
export default function PpdbLoading() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4" aria-busy="true" aria-label="Memuat formulir PPDB">
      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="skeleton h-9 w-full max-w-md rounded-lg mx-auto mb-2" />
        <div className="skeleton h-9 w-2/3 max-w-xs rounded-lg mx-auto mb-3" />
        <div className="skeleton h-4 w-64 rounded-md mx-auto mb-4" />
        <div className="skeleton h-9 w-52 rounded-full mx-auto" />
      </div>

      {/* CARD FORM */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Info banner */}
        <div className="skeleton h-16 w-full rounded-xl mb-6" />

        {/* Section 1: Data Siswa */}
        <div className="mb-8">
          <div className="skeleton h-5 w-40 rounded-md mb-4 pb-2 border-b dark:border-gray-700" />
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="skeleton h-3.5 w-24 rounded-md" />
                <div className="skeleton h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Data Orang Tua */}
        <div className="mb-8">
          <div className="skeleton h-5 w-44 rounded-md mb-4 pb-2 border-b dark:border-gray-700" />
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="skeleton h-3.5 w-24 rounded-md" />
                <div className="skeleton h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Dokumen / Upload */}
        <div className="mb-8">
          <div className="skeleton h-5 w-36 rounded-md mb-4 pb-2 border-b dark:border-gray-700" />
          <div className="grid md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-28 w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Captcha */}
        <div className="skeleton h-24 w-full rounded-2xl mb-6" />

        {/* Submit */}
        <div className="skeleton h-12 w-full rounded-xl" />
      </div>

      <div className="text-center mt-4">
        <div className="skeleton h-4 w-52 rounded-md mx-auto" />
      </div>
    </div>
  );
}
