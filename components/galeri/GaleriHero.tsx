import Link from "next/link";

interface GaleriHeroProps {
  title: string;
  description: string;
  showBackButton: boolean;
}

export default function GaleriHero({ title, description, showBackButton }: GaleriHeroProps) {
  return (
    <section
      className="relative w-full min-h-[calc(100dvh-var(--header-h))] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-950 via-teal-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-black"
      aria-label="Galeri kegiatan sekolah"
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" aria-hidden="true" />

      {/* Background Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <i className="fa-solid fa-camera float-icon float-icon-1 text-white" />
        <i className="fa-solid fa-images float-icon float-icon-2 text-white" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;charset=utf8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex flex-col items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl text-amber-400 shadow-lg"
            aria-hidden="true"
          >
            <i className="fa-solid fa-camera" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-white leading-tight drop-shadow-2xl flex items-center justify-center gap-3">
            {showBackButton && (
              <Link
                href="/galeri"
                className="text-teal-200 hover:text-amber-400 text-3xl transition hover:scale-110 active:scale-95 inline-block mr-1"
                aria-label="Kembali ke daftar album"
              >
                <i className="fa-solid fa-arrow-left" />
              </Link>
            )}
            <span>{title}</span>
          </h1>
        </div>
        
        <p className="text-lg text-teal-100/80 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          {description}
        </p>

        <a
          href="#galeri-section"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-teal-950 px-8 py-4 rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-amber-400/20 transition-all active:scale-95"
          aria-label="Lihat galeri"
        >
          <i className="fa-solid fa-arrow-down text-sm" aria-hidden="true" /> 
          Lihat Galeri
        </a>
      </div>
    </section>
  );
}
