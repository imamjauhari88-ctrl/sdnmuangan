import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";

/**
 * JSON-LD structured data (schema.org) untuk identitas sekolah.
 *
 * Dipasang di HOMEPAGE saja (app/(public)/page.tsx) — bukan di semua
 * halaman — sesuai rekomendasi resmi Google (Organization structured
 * data guidelines: "We recommend placing this information on your
 * home page... You don't need to include it on every page of your
 * site").
 *
 * @type dibuat array ["EducationalOrganization", "ElementarySchool"]:
 * ElementarySchool sendiri sebenarnya sudah mewarisi EducationalOrganization
 * di hierarki schema.org (ElementarySchool -> School ->
 * EducationalOrganization -> Organization), jadi secara semantik ini
 * sudah otomatis kebaca sebagai EducationalOrganization oleh Google.
 * Array ini cuma bikin itu eksplisit, sambil tetap pakai subtype paling
 * spesifik (ElementarySchool) sesuai anjuran Google.
 *
 * Data diambil dari tabel `pengaturan` yang sama dengan yang dipakai
 * halaman lain (getPengaturan sudah dibungkus React `cache()`, jadi
 * tidak menambah query baru di request yang sama).
 *
 * Referensi tipe: https://schema.org/ElementarySchool
 */
export default async function JsonLdSchool() {
  const pengaturan = await getPengaturan();

  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "");
  if (!namaSekolah) return null; // Data pengaturan belum diisi -> jangan render schema kosong

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.uptdsdntamansareh2.sch.id").replace(/\/$/, "");
  const logoSekolah = pengaturanValue(pengaturan, "logo_sekolah", "");
  const fotoSekolah = pengaturanValue(pengaturan, "foto_sekolah", "");
  const alamatSekolah = pengaturanValue(pengaturan, "alamat_sekolah", "");
  const teleponSekolah = pengaturanValue(pengaturan, "telepon_sekolah", "");
  const emailSekolah = pengaturanValue(pengaturan, "email_sekolah", "");
  const npsn = pengaturanValue(pengaturan, "npsn", "");
  const profilSingkat = pengaturanValue(pengaturan, "profil_singkat", "");
  const koordinatMap = pengaturanValue(pengaturan, "koordinat_map", "");

  // koordinat_map disimpan sebagai string "lat,lng" (lihat form Pengaturan Situs)
  let geo: { latitude: number; longitude: number } | null = null;
  if (koordinatMap) {
    const [latStr, lngStr] = koordinatMap.split(",").map((s) => s.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng)) {
      geo = { latitude: lat, longitude: lng };
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "ElementarySchool"],
    name: namaSekolah,
    url: siteUrl,
    ...(logoSekolah && { logo: logoSekolah }),
    ...(fotoSekolah && { image: fotoSekolah }),
    ...(profilSingkat && { description: profilSingkat }),
    ...(npsn && { identifier: npsn }),
    ...(alamatSekolah && {
      address: {
        "@type": "PostalAddress",
        streetAddress: alamatSekolah,
        addressCountry: "ID",
      },
    }),
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    ...(teleponSekolah && { telephone: teleponSekolah }),
    ...(emailSekolah && { email: emailSekolah }),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify data internal (bukan HTML dari input bebas pengguna),
      // aman dirender lewat dangerouslySetInnerHTML untuk keperluan JSON-LD.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
