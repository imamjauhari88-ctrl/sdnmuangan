import Link from "next/link";

const LAYANAN = [
  {
    href: "/ppdb",
    icon: "fa-user-plus",
    color: "bg-blue-600",
    title: "PPDB Online",
    desc: "Pendaftaran siswa baru secara online.",
  },
  {
    href: "https://uptdsdntamansareh2-cat.fwh.is/",
    icon: "fa-diagram-project",
    color: "bg-emerald-600",
    title: "Platform Terintegrasi",
    desc: "Akses sistem CBT/ujian online dan Absensi siswa.",
    external: true,
  },
  {
    href: "/kontak",
    icon: "fa-envelope-open-text",
    color: "bg-purple-600",
    title: "Hubungi Kami",
    desc: "Kirim pertanyaan atau pesan ke sekolah.",
  },
];

export default function LayananUtama() {
  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
      aria-label="Layanan utama sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span
            className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            🔗 Akses Cepat
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Layanan Utama
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-blue-400 mx-auto rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" role="list">
          {LAYANAN.map((l, i) => {
            const isExternal = !!l.external;
            const CardComponent = isExternal ? "a" : Link;
            const externalProps = isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};

            return (
              <div key={l.href} role="listitem">
                <CardComponent
                  href={l.href}
                  className="card-animate card-hover glass-card p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col group h-full"
                  style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                  {...externalProps}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${l.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}
                    aria-hidden="true"
                  >
                    <i className={`fa-solid ${l.icon} text-xl`} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                    {l.title}
                    {isExternal && (
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-gray-400" aria-hidden="true" />
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{l.desc}</p>
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-bold mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Selengkapnya <i className="fa-solid fa-arrow-right text-[10px]" />
                  </span>
                </CardComponent>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}