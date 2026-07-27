import React from 'react';

interface HeroSectionProps {
  namaSekolah: string;
  stats: {
    total: number;
    guru: number;
    tendik: number;
  };
  isLoading?: boolean;
}

export default function HeroSection({ namaSekolah, stats, isLoading = false }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen sm:min-h-[70vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-64 sm:w-80 h-64 sm:h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 sm:opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-64 sm:w-80 h-64 sm:h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 sm:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 sm:opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <i className="fa-solid fa-chalkboard-user float-icon float-icon-1 text-white"></i>
        <i className="fa-solid fa-graduation float-icon float-icon-2 text-white"></i>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-0">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-4xl text-white mb-5 shadow-lg">
          <i className="fa-solid fa-chalkboard-user"></i>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
          Guru &amp; Tenaga <br className="sm:hidden" /> Kependidikan
        </h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Tim profesional yang berdedikasi di <span className="font-bold text-white">{namaSekolah}</span>
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-8">
          {[
            { val: stats.total, lbl: 'Total GTK' },
            { val: stats.guru, lbl: 'Guru' },
            { val: stats.tendik, lbl: 'Tendik' },
          ].map((qs, idx) => (
            <div key={idx} className="bg-white/10 border border-white/20 rounded-xl py-3 px-2 text-center backdrop-blur-md">
              {isLoading ? (
                <div className="skeleton h-7 w-10 mx-auto rounded-md" />
              ) : (
                <p className="text-white font-black text-2xl">{qs.val}</p>
              )}
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mt-1.5">{qs.lbl}</p>
            </div>
          ))}
        </div>

        <a href="#staf-section" className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all active:scale-95">
          <i className="fa-solid fa-arrow-down text-sm"></i> Lihat Tim Kami
        </a>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-transparent to-transparent pointer-events-none" />
    </section>
  );
}