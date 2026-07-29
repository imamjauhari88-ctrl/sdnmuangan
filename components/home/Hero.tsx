import Link from "next/link";

interface HeroBadge {
  label: string;
  icon?: string;
}

interface HeroStat {
  value: string;
  label: string;
}

interface HeroProps {
  namaSekolah: string;
  akreditasi: string;
  npsn: string;
  jmlSiswa: number;
  jmlGuru: number;
  jmlRombel: number;
  jenjang?: string;
  kurikulum?: string;
  deskripsi?: string;
}

/**
 * Hero section — versi restruktur mengikuti referensi desain baru:
 * background solid gelap (teal/navy) tanpa foto, layout dua kolom
 * (kiri: identitas + CTA, kanan: panel "Data Pokok Sekolah"),
 * menggantikan versi sebelumnya yang pakai foto background + blob animasi.
 *
 * Statistik sekolah tetap digabung di sini (bukan section terpisah),
 * tapi sekarang ditampilkan sebagai panel angka polos (bukan kartu glass)
 * dengan garis pembatas di sisi kiri, sejajar referensi.
 */
export default function Hero({
  namaSekolah,
  akreditasi,
  npsn,
  jmlSiswa,
  jmlGuru,
  jmlRombel,
  jenjang = "SD",
  kurikulum = "Kurikulum Merdeka",
  deskripsi = "Menyelenggarakan pendidikan berkualitas dengan dukungan tenaga pendidik berpengalaman dan bersertifikat, untuk mencetak generasi yang cerdas dan berakhlak mulia.",
}: HeroProps) {
  const badges: HeroBadge[] = [
    { label: `Terakreditasi ${akreditasi}`, icon: "fa-solid fa-check" },
    { label: `NPSN ${npsn}` },
    { label: `Jenjang ${jenjang}` },
    { label: kurikulum },
  ];

  const stats: HeroStat[] = [
    { value: jmlSiswa.toLocaleString("id-ID"), label: "Total Siswa" },
    { value: jmlGuru.toLocaleString("id-ID"), label: "Tenaga Pendidik" },
    { value: jmlRombel.toLocaleString("id-ID"), label: "Rombongan Belajar" },
    { value: akreditasi, label: "Akreditasi BAN-SD" },
  ];

  return (
    <section
      className="relative w-full min-h-[calc(100dvh-var(--header-h))] flex items-center overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-black"
      aria-label={`Halaman utama ${namaSekolah}`}
    >
      {/* Grid pattern halus */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;charset=utf8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      />

      {/* Glow halus di sudut */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
          {/* KIRI: identitas sekolah */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-6"
              role="list"
              aria-label="Status akreditasi dan kurikulum sekolah"
            >
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  role="listitem"
                  className="inline-flex items-center gap-1.5 border border-white/25 text-white/90 rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wide"
                >
                  {badge.icon && (
                    <i className={`${badge.icon} text-amber-400 text-[10px]`} aria-hidden="true" />
                  )}
                  {badge.label}
                </span>
              ))}
            </div>

            <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white leading-tight mb-5 drop-shadow-sm">
              {namaSekolah}
            </h1>

            <p className="text-sm sm:text-base text-teal-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              {deskripsi}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 sm:gap-4">
              <Link
                href="/berita"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-teal-950 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20 active:scale-95"
                aria-label="Lihat berita terbaru"
              >
                <span>Berita Terbaru</span>
                <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
              </Link>
              <Link
                href="/profil"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/10 transition-all duration-300 active:scale-95"
                aria-label="Lihat profil sekolah"
              >
                <span>Profil Sekolah</span>
              </Link>
            </div>
          </div>

          {/* KANAN: data pokok sekolah */}
          <div className="lg:pl-12 lg:border-l lg:border-white/15">
            <p className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-4 text-center lg:text-left">
              Data Pokok Sekolah
            </p>
            <div
              className="grid grid-cols-2 gap-x-8 gap-y-6 sm:gap-x-10 sm:gap-y-8"
              role="list"
              aria-label="Statistik sekolah"
            >
              {stats.map((stat) => (
                <div key={stat.label} role="listitem" className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-serif font-black text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-teal-100/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
