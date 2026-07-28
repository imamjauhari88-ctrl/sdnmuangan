import MapEmbed from "@/components/ui/MapEmbed";

interface MapsSectionProps {
  namaSekolah: string;
  alamat: string;
  koordinat: string;
}

/** Parse "lat, lng" jadi {lat, lng}; fallback ke koordinat default jika gagal */
function parseKoordinat(koordinat: string): { lat: number; lng: number } {
  const parts = koordinat.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] };
  }
  return { lat: -6.2, lng: 106.816666 }; // fallback Jakarta, hanya jika data kosong/invalid
}

export default function MapsSection({ namaSekolah, alamat, koordinat }: MapsSectionProps) {
  const { lat, lng } = parseKoordinat(koordinat);
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
      aria-label="Lokasi sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            📍 Lokasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 dark:text-white">
            Temukan Kami
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-teal-500 to-cyan-400 mx-auto rounded-full mt-3" />
        </div>

        <div className="glass-card rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden card-animate">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-2 h-72 sm:h-96">
              <MapEmbed src={mapSrc} title={`Peta lokasi ${namaSekolah}`} />
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div
                className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-4 shadow-md"
                aria-hidden="true"
              >
                <i className="fa-solid fa-location-dot text-xl" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white text-lg mb-2">{namaSekolah}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{alamat}</p>
              <a
                href={directionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm active:scale-95"
              >
                <i className="fa-solid fa-diamond-turn-right" /> Lihat Rute
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
