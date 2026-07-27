"use client";

interface CloudinaryLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Custom loader untuk next/image.
 *
 * Semua gambar publik di situs ini sudah dilayani lewat Cloudinary dan
 * sudah dioptimasi lewat helper cldThumb/cldWide/cldOptimized (lib/utils/
 * cloudinary.ts) — resize, crop, q_auto (kualitas otomatis), f_auto
 * (format otomatis webp/avif) sudah dipasang di URL sebelum sampai ke
 * komponen <Image>.
 *
 * Kalau loader ini TIDAK didaftarkan, next/image akan memproses ULANG
 * gambar yang sudah dioptimasi itu lewat Vercel Image Optimization API
 * (endpoint /_next/image) — dobel proses, dan paling penting: kuota
 * Image Optimization di paket Vercel gratis terbatas (1.000 sumber unik/
 * bulan). Dengan loader custom ini, next/image cukup dipakai untuk
 * manfaat non-optimasi-byte-nya saja: lazy-loading native, mencegah
 * layout shift (CLS) lewat width/height terkunci, dan atribut
 * priority/fetchPriority untuk gambar LCP (mis. Hero) — browser tetap
 * request LANGSUNG ke Cloudinary, bukan lewat server Next/Vercel.
 *
 * PENTING: loader ini TETAP menghormati `width` yang diminta next/image
 * untuk tiap breakpoint/DPR di srcset. Sebelumnya loader cuma
 * mengembalikan `src` apa adanya (ukuran w_ yang "dibekukan" oleh
 * cldWide/cldThumb, misal w_1920 untuk Hero) untuk SEMUA kandidat
 * srcset — akibatnya HP kecil pun tetap mendownload gambar ukuran
 * desktop penuh (ini penyebab utama temuan "Improve image delivery"
 * di Lighthouse/PageSpeed). Di sini kita ganti nilai w_ (dan h_ kalau
 * ada, supaya rasio tetap terjaga untuk thumbnail persegi) di segmen
 * transformasi Cloudinary dengan `width` yang diminta next/image,
 * dibatasi supaya tidak melebihi ukuran asli (mencegah upscale).
 *
 * Untuk src non-Cloudinary (mis. placeholder placehold.co, fallback
 * ui-avatars.com) URL juga dikembalikan apa adanya — aman karena loader
 * custom tidak divalidasi lewat images.remotePatterns.
 */
const UPLOAD_MARKER = "/upload/";

export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderProps): string {
  if (!src.includes("res.cloudinary.com") || !src.includes(UPLOAD_MARKER)) {
    return src;
  }

  const [before, after] = src.split(UPLOAD_MARKER);
  const afterSlash = after.indexOf("/");
  if (afterSlash === -1) return src; // format tidak dikenali, aman kembalikan apa adanya

  const transformSegment = after.slice(0, afterSlash);
  const rest = after.slice(afterSlash);

  const widthMatch = transformSegment.match(/w_(\d+)/);
  if (!widthMatch) {
    // Tidak ada w_ (mis. hasil cldOptimized tanpa resize paksa) -> jangan diutak-atik
    return src;
  }

  const originalWidth = parseInt(widthMatch[1], 10);
  // Jangan pernah upscale melebihi ukuran yang sudah "dibekukan" di URL
  const targetWidth = Math.min(width, originalWidth);

  let newSegment = transformSegment.replace(/w_\d+/, `w_${targetWidth}`);

  const heightMatch = transformSegment.match(/h_(\d+)/);
  if (heightMatch) {
    const originalHeight = parseInt(heightMatch[1], 10);
    const targetHeight = Math.round((originalHeight * targetWidth) / originalWidth);
    newSegment = newSegment.replace(/h_\d+/, `h_${targetHeight}`);
  }

  if (quality) {
    newSegment = newSegment.replace(/q_[a-z0-9]+/, `q_${quality}`);
  }

  return `${before}${UPLOAD_MARKER}${newSegment}${rest}`;
}
