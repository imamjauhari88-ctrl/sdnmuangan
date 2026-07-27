/**
 * Helper Cloudinary.
 *
 * Foto tetap disimpan & dilayani lewat Cloudinary (sesuai keputusan kak Imam),
 * URL aslinya sudah lengkap dan tersimpan langsung di kolom database
 * (misal: berita.gambar, gtk.foto, foto.file_foto), contoh:
 *
 *   https://res.cloudinary.com/dsgkp7jlg/image/upload/v169.../xxxx.jpg
 *
 * Next.js <Image> butuh domain Cloudinary didaftarkan di next.config.ts
 * (lihat remotePatterns), dan kita bisa menyisipkan transformasi
 * (resize, format, quality) dengan menyuntik segmen transformasi
 * setelah "/upload/".
 */

const CLOUDINARY_UPLOAD_MARKER = "/upload/";

/**
 * Menambahkan transformasi Cloudinary ke URL yang sudah ada,
 * misal untuk optimasi ukuran & format otomatis (mirip tujuan
 * cloudinary_helper.php pada versi lama yang mengejar skor Lighthouse).
 *
 * Contoh:
 *   cldTransform(url, "w_400,h_400,c_fill,q_auto,f_auto")
 */
export function cldTransform(url: string | null | undefined, transformation: string): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes(CLOUDINARY_UPLOAD_MARKER)) {
    // Bukan URL Cloudinary (misal placeholder lokal) -> kembalikan apa adanya
    return url;
  }

  return url.replace(
    CLOUDINARY_UPLOAD_MARKER,
    `${CLOUDINARY_UPLOAD_MARKER}${transformation}/`
  );
}

/** Preset umum: thumbnail kotak untuk kartu/list */
export function cldThumb(url: string | null | undefined, size = 400): string {
  return cldTransform(url, `w_${size},h_${size},c_fill,g_auto,q_auto,f_auto`);
}

/** Preset umum: gambar lebar untuk hero/banner */
export function cldWide(url: string | null | undefined, width = 1600): string {
  return cldTransform(url, `w_${width},c_fill,g_auto,q_auto,f_auto`);
}

/** Preset umum: optimasi kualitas & format saja, tanpa resize paksa */
export function cldOptimized(url: string | null | undefined): string {
  return cldTransform(url, "q_auto,f_auto");
}

/** Fallback default jika data gambar kosong (logo sekolah generik) */
export const FALLBACK_IMAGE = "/assets/img/logo-placeholder.png";
