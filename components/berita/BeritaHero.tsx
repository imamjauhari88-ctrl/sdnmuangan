interface BeritaHeroProps {
  namaSekolah: string;
}

export default function BeritaHero({ namaSekolah }: BeritaHeroProps) {
  return (
    <section
      className="relative w-full min-h-[80vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-10"
      aria-label="Informasi dan berita sekolah"
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900"
        aria-hidden="true"
      />

      {/* 3 Bola Cahaya (Blobs) */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-72 h-72 bg-cyan-400 rounded-full filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-400 rounded-full filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
      </div>

      {/* Background Floating SVGs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* SVG Newspaper */}
        <svg
          className="float-icon float-icon-1"
          style={{ width: "200px", height: "200px", fill: "white" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M96 96c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H80c-44.2 0-80-35.8-80-80V128c0-17.7 14.3-32 32-32s32 14.3 32 32V400c0 8.8 7.2 16 16 16s16-7.2 16-16V96zm64 24v56h224V120H160zm0 120v40h80v-40h-80zm128 0v40h96v-40h-96zm-128 96v40h80v-40h-80zm128 0v40h96v-40h-96z" />
        </svg>
        {/* SVG Bullhorn */}
        <svg
          className="float-icon float-icon-2"
          style={{ width: "200px", height: "200px", fill: "white" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32z" />
        </svg>
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
            <i className="fa-solid fa-newspaper" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl">
            Informasi &amp; Berita
          </h1>
        </div>
        
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Dapatkan informasi terbaru kegiatan, pengumuman, dan agenda di{" "}
          <span className="font-bold text-white">{namaSekolah}</span>
        </p>

        <a
          href="#berita-section"
          className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <i className="fa-solid fa-arrow-down text-sm" aria-hidden="true" /> 
          Jelajahi Berita
        </a>
      </div>

      {/* Gradient Bottom Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}