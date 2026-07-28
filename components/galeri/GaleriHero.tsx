import Link from "next/link";

interface GaleriHeroProps {
  title: string;
  description: string;
  showBackButton: boolean;
}

export default function GaleriHero({ title, description, showBackButton }: GaleriHeroProps) {
  return (
    <section
      className="relative w-full min-h-[80vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-10"
      aria-label="Galeri kegiatan sekolah"
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900" 
        aria-hidden="true"
      />

      {/* 3 Bola Cahaya (Blobs) */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
      </div>

      {/* Background Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <i className="fa-solid fa-camera float-icon float-icon-1 text-white" />
        <i className="fa-solid fa-images float-icon float-icon-2 text-white" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;charset=utf8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex flex-col items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-4xl text-white shadow-lg"
            aria-hidden="true"
          >
            <i className="fa-solid fa-camera" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-white leading-tight drop-shadow-2xl flex items-center justify-center gap-3">
            {showBackButton && (
              <Link
                href="/galeri"
                className="text-blue-200 hover:text-white text-3xl transition hover:scale-110 active:scale-95 inline-block mr-1"
                aria-label="Kembali ke daftar album"
              >
                <i className="fa-solid fa-arrow-left" />
              </Link>
            )}
            <span>{title}</span>
          </h1>
        </div>
        
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          {description}
        </p>

        <a
          href="#galeri-section"
          className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all active:scale-95"
          aria-label="Lihat galeri"
        >
          <i className="fa-solid fa-arrow-down text-sm" aria-hidden="true" /> 
          Lihat Galeri
        </a>
      </div>

      {/* Gradient Bottom Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}