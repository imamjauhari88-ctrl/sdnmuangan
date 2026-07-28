import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import { cldTransform } from "@/lib/utils/cloudinary";
import ThemeInit from "@/components/theme/ThemeInit"; // 1. Impor komponen ThemeInit baru

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

// Font serif untuk heading (h1/h2) di seluruh situs — dipasangkan dengan
// Inter (body/nav/label) supaya heading berasa lebih formal/khas sekolah,
// tanpa ganti font utama. Dipakai lewat utility `font-serif` (lihat
// mapping --font-serif di globals.css).
const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-heading",
});

export async function generateMetadata(): Promise<Metadata> {
  const pengaturan = await getPengaturan();
  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Website Sekolah");
  const deskripsi = pengaturanValue(
    pengaturan,
    "profil_singkat",
    "Website resmi sekolah."
  );
  const logoSekolah = pengaturanValue(pengaturan, "logo_sekolah", "");
  const fotoSekolah = pengaturanValue(pengaturan, "foto_sekolah", "");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.uptdsdntamansareh2.sch.id";

  // Preview link (WhatsApp/Facebook/dsb) pakai FOTO sekolah, bukan logo —
  // logo saja kurang menarik & kurang informatif untuk thumbnail share.
  // Di-resize ke ukuran standar OG (1200x630) via Cloudinary supaya ringan
  // dan tidak terpotong aneh di preview. Fallback ke logo kalau foto belum
  // diisi di Pengaturan Situs.
  const ogImageSource = fotoSekolah || logoSekolah;
  const ogImage = ogImageSource
    ? cldTransform(ogImageSource, "c_fill,w_1200,h_630,q_auto,f_auto")
    : "";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: namaSekolah,
      template: `%s | ${namaSekolah}`,
    },
    description: deskripsi,
    alternates: {
    canonical: siteUrl,
  },

  authors: [
    {
      name: namaSekolah,
    },
  ],

  creator: namaSekolah,

  publisher: namaSekolah,
    icons: {
      icon: pengaturanValue(pengaturan, "logo_sekolah", "/favicon.ico"),
    },
    // Default OpenGraph & Twitter Card untuk seluruh halaman. Halaman yang
    // butuh gambar/deskripsi berbeda (mis. detail berita) cukup meng-override
    // field yang relevan lewat generateMetadata masing-masing — field yang
    // tidak di-override tetap mewarisi nilai default di sini.
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: namaSekolah,
      title: namaSekolah,
      description: deskripsi,
      url: siteUrl,
      images: ogImage
  ? [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: namaSekolah,
      },
    ]
  : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: namaSekolah,
      description: deskripsi,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/**
 * RootLayout sengaja diminimalkan: hanya kerangka <html>/<head>/<body>
 * dan hal-hal yang berlaku untuk SEMUA halaman (publik maupun admin),
 * seperti font, dark-mode script, dan favicon. Navbar/Footer situs publik
 * dipindah ke app/(public)/layout.tsx, dan shell admin (sidebar/topbar)
 * ada di app/admin/layout.tsx — supaya keduanya tidak saling "bocor".
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`h-full antialiased ${inter.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />

        {/* Font Awesome (CDN) — dimuat non-blocking (preload lalu di-swap
    jadi stylesheet setelah selesai download), supaya tidak menahan
    render awal halaman */}
<link
  id="fa-css-preload"
  rel="preload"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
  as="style"
/>
<noscript>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
  />
</noscript>
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function () {
        var l = document.getElementById('fa-css-preload');
        if (!l) return;
        var activated = false;
        function activate() {
          if (activated) return;
          activated = true;
          l.rel = 'stylesheet';
        }
        l.addEventListener('load', activate);
        // Jaring pengaman: kalau event 'load' keburu lewat sebelum
        // listener di atas sempat terpasang (misal file sudah ke-cache
        // browser dan selesai download super cepat), paksa aktifkan
        // manual setelah jeda singkat.
        setTimeout(activate, 100);
      })();
    `,
  }}
/>

        {/* 
          2. Anti-flash dark mode menggunakan ThemeInit yang aman dari React 19 warning
        */}
        <ThemeInit />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}