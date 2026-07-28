import Image from "next/image";
import type { OrgChartItem } from "@/lib/data/profil";

interface StrukturOrganisasiProps {
  namaSekolah: string;
  fotoStruktur: string;
  namaKepsek: string;
  fotoKepsek: string;
  orgChart: OrgChartItem[];
}

export default function StrukturOrganisasi({
  namaSekolah,
  fotoStruktur,
  namaKepsek,
  fotoKepsek,
  orgChart,
}: StrukturOrganisasiProps) {
  const fotoKepsekFinal =
    fotoKepsek ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(namaKepsek)}&background=2563eb&color=fff&size=128`;

  return (
    <section
      id="struktur-section"
      className="py-14 sm:py-20 bg-white dark:bg-gray-900 scroll-mt-16"
      aria-label="Struktur organisasi sekolah"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            🏛️ Organisasi
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-gray-900 dark:text-white mb-3">
            Struktur Organisasi
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {fotoStruktur ? (
          <div className="card-animate rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 group">
            <Image
              src={fotoStruktur}
              alt={`Struktur Organisasi ${namaSekolah}`}
              width={1200}
              height={800}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        ) : (
          <div className="card-animate glass-card rounded-3xl p-8 border border-gray-100 dark:border-gray-700 text-center">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mb-3">
                <Image
                  src={fotoKepsekFinal}
                  alt={namaKepsek}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md">
                {namaKepsek}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-wider">
                Kepala Sekolah
              </p>
            </div>

            <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 mx-auto mb-4" aria-hidden="true" />

            {orgChart.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3">
                {orgChart.map((og, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-center shadow-sm"
                  >
                    <p className="text-xs font-bold text-gray-800 dark:text-white">
                      {og.nama.slice(0, 20)}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{og.jabatan}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                Belum ada data struktur organisasi.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
