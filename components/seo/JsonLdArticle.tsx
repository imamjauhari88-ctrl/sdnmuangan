interface JsonLdArticleProps {
  judul: string;
  /** Isi berita mentah (HTML/plain), dipakai untuk potongan description. */
  isi: string | null;
  /** Tanggal publish, format "YYYY-MM-DD" dari kolom `tanggal`. */
  tanggal: string | null;
  /** URL gambar utama (sudah final, boleh relatif atau absolut). */
  gambar: string;
  namaSekolah: string;
  logoSekolah: string;
  siteUrl: string;
  /** URL halaman ini, dipakai untuk mainEntityOfPage. */
  url: string;
}

/**
 * JSON-LD structured data (schema.org) tipe Article, dipasang di tiap
 * halaman detail berita (app/(public)/berita/[id]/page.tsx).
 *
 * Catatan tabel `berita` di database TIDAK punya kolom timestamp
 * created_at/updated_at terpisah — cuma `tanggal` (tanggal publish).
 * Jadi datePublished & dateModified sengaja disamakan, ambil dari
 * `tanggal`. Kalau nanti kolom `updated_at` ditambahkan di database,
 * dateModified bisa dipisah dari sini.
 *
 * Tidak ada penulis bernama per-artikel di sistem ini (semua berita
 * ditulis lewat 1 akun admin) — author & publisher sama-sama memakai
 * entitas sekolah (Organization), bukan Person, sesuai kondisi nyata
 * kontennya (bukan artikel bernarasumber personal).
 *
 * Referensi: https://schema.org/Article
 */
export default function JsonLdArticle({
  judul,
  isi,
  tanggal,
  gambar,
  namaSekolah,
  logoSekolah,
  siteUrl,
  url,
}: JsonLdArticleProps) {
  // Jadikan URL absolut kalau masih relatif (mis. fallback logo lokal "/assets/...")
  const toAbsolute = (src: string) => (src.startsWith("http") ? src : `${siteUrl}${src.startsWith("/") ? "" : "/"}${src}`);

  const description = (isi ?? "").replace(/<[^>]*>/g, "").trim().slice(0, 160);

  // Headline sebaiknya tidak lebih dari ~110 karakter (anjuran Google)
  const headline = judul.length > 110 ? judul.slice(0, 107) + "..." : judul;

  // Kolom `tanggal` cuma DATE ("YYYY-MM-DD"), jadikan ISO 8601 lengkap
  const publishedIso = tanggal ? `${tanggal}T00:00:00+07:00` : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    ...(description && { description }),
    image: [toAbsolute(gambar)],
    ...(publishedIso && { datePublished: publishedIso, dateModified: publishedIso }),
    author: {
      "@type": "Organization",
      name: namaSekolah,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: namaSekolah,
      ...(logoSekolah && {
        logo: {
          "@type": "ImageObject",
          url: toAbsolute(logoSekolah),
        },
      }),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
