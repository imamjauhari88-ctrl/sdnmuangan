interface ProfilSingkatProps {
  profilSingkat: string;
}

export default function ProfilSingkat({ profilSingkat }: ProfilSingkatProps) {
  return (
    <section
      id="profil-section"
      className="py-14 sm:py-20 bg-white dark:bg-gray-900 scroll-mt-16"
      aria-label="Profil singkat sekolah"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            📋 Tentang Kami
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3">
            Profil Singkat
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="card-animate glass-card rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <i
            className="fa-solid fa-quote-left absolute top-6 left-6 text-6xl text-blue-500/5 dark:text-white/5"
            aria-hidden="true"
          />
          {profilSingkat ? (
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-line relative z-10">
              {profilSingkat}
            </p>
          ) : (
            <div className="text-center py-10">
              <i className="fa-solid fa-file-pen text-4xl text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Profil singkat belum diisi.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
