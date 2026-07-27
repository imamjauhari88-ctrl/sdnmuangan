/**
 * Transisi halaman untuk semua route di app/(public)/**.
 *
 * Beda dari layout.tsx: template.tsx SENGAJA di-remount penuh setiap
 * kali pindah halaman (bahkan antar sub-halaman yang masih pakai
 * layout.tsx yang sama) — makanya cocok buat animasi "masuk" yang mau
 * replay tiap navigasi. Navbar & Footer (di app/(public)/layout.tsx)
 * TIDAK ikut ke-remount, jadi tidak ikut flicker.
 *
 * Dipakai konvensi resmi Next.js App Router (bukan experimental),
 * jadi tidak butuh dependency baru (Framer Motion dsb) dan tidak
 * bergantung pada flag experimental.viewTransition yang masih bisa
 * berubah di rilis Next.js berikutnya.
 *
 * Animasi hanya "enter" (fade + geser naik tipis) — App Router belum
 * mendukung animasi "exit" lewat template.tsx (halaman lama langsung
 * di-unmount sebelum animasi bisa jalan). Itu cukup untuk kebutuhan
 * situs ini; kalau nanti mau animasi keluar-masuk yang lebih halus,
 * itu perlu Framer Motion + AnimatePresence (dependency tambahan).
 */
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
