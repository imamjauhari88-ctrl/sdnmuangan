interface ProfilKompakProps {
  statusSekolah: string;
  akreditasi: string;
  lokasi: string;
  tahunBerdiri: string;
}

export default function ProfilKompak({
  statusSekolah,
  akreditasi,
  lokasi,
  tahunBerdiri,
}: ProfilKompakProps) {
  const profiles = [
    { icon: "fa-building-columns", label: "Status", value: `Sekolah ${statusSekolah}` },
    { icon: "fa-award", label: "Akreditasi", value: akreditasi },
    { icon: "fa-map-pin", label: "Lokasi", value: lokasi },
    { icon: "fa-calendar-check", label: "Berdiri", value: tahunBerdiri },
  ];

  return (
    <section className="py-12 bg-white dark:bg-gray-950" aria-label="Profil sekolah singkat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" role="list">
          {profiles.map((p, i) => (
            <div
              key={p.label}
              className="card-animate glass-card p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              role="listitem"
            >
              <div
                className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3"
                aria-hidden="true"
              >
                <i className={`fa-solid ${p.icon} text-2xl`} />
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                {p.label}
              </p>
              <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                {p.value}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
