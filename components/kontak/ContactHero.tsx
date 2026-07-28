interface ContactHeroProps {
  namaSekolah: string;
}

export default function ContactHero({ namaSekolah }: ContactHeroProps) {
  return (
    <section className="relative w-full min-h-screen sm:min-h-[70vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900" />
      
      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-64 sm:w-80 h-64 sm:h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 sm:opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-64 sm:w-80 h-64 sm:h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 sm:opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 sm:opacity-15 animate-blob animation-delay-4000" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <i className="fa-solid fa-headset float-icon float-icon-1 text-white" />
        <i className="fa-solid fa-envelope float-icon float-icon-2 text-white" />
        <i className="fa-solid fa-location-dot float-icon float-icon-3 text-white" />
      </div>

      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-20 sm:opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;charset=utf8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-8 sm:py-0">
        <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl sm:text-4xl text-white shadow-lg hover:scale-110 transition-transform duration-300">
            <i className="fa-solid fa-headset" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-serif font-black text-white leading-tight drop-shadow-lg">
            Hubungi Kami
          </h1>
        </div>

        <p className="text-sm sm:text-base md:text-lg text-blue-100 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-6 sm:mb-8">
          Kami siap membantu dan menjawab pertanyaan Anda seputar layanan pendidikan di{" "}
          <span className="font-semibold text-white">{namaSekolah}</span>
        </p>

        <a
          href="#kontak-section"
          className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
        >
          <i className="fa-solid fa-arrow-down text-sm" />
          <span>Kirim Pesan</span>
        </a>
      </div>

      {/* Gradient Bottom Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-transparent to-transparent pointer-events-none" />
    </section>
  );
}