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
    <section className="relative w-full min-h-screen sm:min-h-[70vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 bg-gradient-to-br from-teal-950 via-teal-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-black">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;charset=utf8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      />

      <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <i className="fa-solid fa-chalkboard-user float-icon float-icon-1 text-white"></i>
        <i className="fa-solid fa-graduation float-icon float-icon-2 text-white"></i>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-0">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl text-amber-400 mb-5 shadow-lg">
          <i className="fa-solid fa-chalkboard-user"></i>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-white mb-4 leading-tight drop-shadow-2xl">
          Guru &amp; Tenaga <br className="sm:hidden" /> Kependidikan
        </h1>
        <p className="text-lg text-teal-100/80 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
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
                <p className="font-serif text-white font-black text-2xl">{qs.val}</p>
              )}
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mt-1.5">{qs.lbl}</p>
            </div>
          ))}
        </div>

        <a href="#staf-section" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-teal-950 px-8 py-4 rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-amber-400/20 transition-all active:scale-95">
          <i className="fa-solid fa-arrow-down text-sm"></i> Lihat Tim Kami
        </a>
      </div>
    </section>
  );
}
