import MapEmbed from "@/components/ui/MapEmbed";

interface ContactMapProps {
  koordinatMap: string;
  alamat: string;
  linkGmaps: string;
}

export default function ContactMap({ koordinatMap, alamat, linkGmaps }: ContactMapProps) {
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-gray-800 dark:text-white flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
              <i className="fa-solid fa-map-location-dot" />
            </div>
            Lokasi Sekolah
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Temukan kami melalui navigasi Google Maps</p>
        </div>

        {/* Frame Map */}
        <div className="card-animate w-full h-[350px] md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 relative group">
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse -z-10" />
          <MapEmbed
            src={`https://maps.google.com/maps?q=${encodeURIComponent(koordinatMap)}&hl=id&z=17&output=embed`}
            title="Peta Lokasi"
            className="relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>

        {/* Info Alamat Bawah Map */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 glass-card py-4 px-6 md:px-8 rounded-full shadow-lg inline-flex mx-auto w-full md:w-auto relative -top-14 z-20 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium">
            <i className="fa-solid fa-location-dot text-red-500 text-lg" />
            <span className="line-clamp-1 text-center md:text-left">{alamat}</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600" />
          <a 
            href={linkGmaps} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm px-4 py-2 rounded-full transition-colors flex items-center gap-2 shrink-0"
          >
            Buka Maps <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
          </a>
        </div>
        
      </div>
    </section>
  );
}