import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  namaSekolah: string;
  tahunBerdiri: string;
  fotoSekolah: string;
}

/**
 * Hero section, porting dari blok HERO SECTION di index.php versi lama.
 * Background image, gradient overlay, animated blobs, floating icons,
 * dan CTA "Jelajahi Profil" + "Daftar PPDB" dipertahankan.
 */
export default function Hero({ namaSekolah, tahunBerdiri, fotoSekolah }: HeroProps) {
  return (
    <section
      className="relative min-h-screen sm:min-h-[90vh] w-full flex items-center justify-center overflow-hidden px-4 sm:px-0"
      aria-label={`Halaman utama ${namaSekolah}`}
    >
      {/* GAMBAR BACKGROUND SEKOLAH */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={fotoSekolah}
          alt=""
          role="presentation"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* GRADIENT OVERLAY */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-cyan-900/85 via-blue-900/90 to-indigo-950/95 dark:from-slate-900/95 dark:via-slate-900/95 dark:to-gray-950/95 mix-blend-multiply"
        aria-hidden="true"
      />

      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-64 sm:w-80 h-64 sm:h-80 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 sm:opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-64 sm:w-80 h-64 sm:h-80 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 sm:opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 sm:opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <i className="fa-solid fa-school float-icon float-icon-1 text-white opacity-20" />
        <i className="fa-solid fa-book-open float-icon float-icon-2 text-white opacity-20" />
        <i className="fa-solid fa-graduation-cap float-icon float-icon-3 text-white opacity-20" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20 sm:opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;charset=utf8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center py-12 sm:py-0">
        <div
          className="inline-flex items-center gap-2 sm:gap-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg text-xs sm:text-sm mb-6 sm:mb-8"
          aria-label="Tahun berdiri sekolah"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" aria-hidden="true" />
          <span className="font-semibold text-white/90 tracking-wide">
            Telah Berdiri Sejak {tahunBerdiri}
          </span>
        </div>

        <p className="text-sm sm:text-base md:text-lg font-bold text-cyan-200 uppercase tracking-[0.2em] mb-2 sm:mb-3 drop-shadow-md">
          Selamat Datang di
        </p>

        {/* UKURAN FONT DI HP DIUBAH DARI text-3xl MENJADI text-2xl */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
          {namaSekolah}
        </h1>

        <p className="text-base sm:text-lg md:text-2xl text-blue-100 dark:text-gray-200 mb-3 sm:mb-4 font-semibold drop-shadow-md">
          Pendidikan Berkualitas &amp; Berakhlak Mulia
        </p>

        <p className="text-xs sm:text-sm md:text-base text-blue-100/80 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 font-light">
          Dengan fasilitas modern, kurikulum terkini, dan tenaga pendidik berpengalaman untuk
          menciptakan masa depan cerah bagi anak Anda.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 sm:mb-12">
          <a
            href="#statistik-quick"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
            aria-label="Jelajahi profil sekolah"
          >
            <i className="fa-solid fa-arrow-down text-sm" aria-hidden="true" />
            <span>Jelajahi Profil</span>
          </a>
          <Link
            href="/ppdb"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 backdrop-blur-md bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-white/20 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
            aria-label="Daftar Penerimaan Peserta Didik Baru"
          >
            <i className="fa-solid fa-user-plus text-sm" aria-hidden="true" />
            <span>Daftar PPDB</span>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="flex flex-col items-center gap-1 text-white/70">
          <span className="text-xs font-semibold tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-9 border-2 border-white/40 rounded-full flex justify-center pt-1.5">
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Gradient bottom fade */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}