/**
 * Helper umum dipakai di banyak komponen.
 * Porting dari logika yang sebelumnya tersebar di PHP/JS index.php lama.
 */

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const NAMA_HARI = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
];

/** Format tanggal DB (YYYY-MM-DD) jadi "27 Januari 2026" */
export function formatTanggalIndonesia(tanggal: string | null | undefined): string {
  if (!tanggal) return "-";
  const d = new Date(tanggal + (tanggal.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return tanggal;
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/** Format tanggal + nama hari, misal "Senin, 27 Januari 2026" */
export function formatTanggalLengkap(tanggal: string | null | undefined): string {
  if (!tanggal) return "-";
  const d = new Date(tanggal + (tanggal.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return tanggal;
  return `${NAMA_HARI[d.getDay()]}, ${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/** Hitung selisih hari dari hari ini ke tanggal target (untuk badge "3 hari lagi") */
export function selisihHari(tanggal: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(tanggal + "T00:00:00");
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

/**
 * Bersihkan & normalisasi nomor telepon ke format WhatsApp internasional (62...),
 * setara logika di footer.php lama.
 */
export function toWhatsAppNumber(nomor: string | null | undefined): string {
  if (!nomor) return "";
  let bersih = nomor.replace(/[^0-9]/g, "");
  if (bersih.startsWith("0")) {
    bersih = "62" + bersih.slice(1);
  }
  return bersih;
}

/** Buat link wa.me lengkap dengan pesan default */
export function buildWhatsAppLink(nomor: string | null | undefined, pesan: string): string {
  const waNumber = toWhatsAppNumber(nomor);
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(pesan)}`;
}

/** Potong teks panjang jadi ringkasan (untuk card berita), aman terhadap tag HTML sederhana */
export function ringkasTeks(teks: string | null | undefined, maxLength = 150): string {
  if (!teks) return "";
  const plain = teks.replace(/<[^>]*>/g, "");
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + "...";
}

/** Label kategori berita untuk badge */
export const KATEGORI_LABEL: Record<string, string> = {
  berita: "Berita",
  pengumuman: "Pengumuman",
  agenda: "Agenda",
  prestasi: "Prestasi",
};

/** Warna badge kategori berita — dipakai di card berita beranda & halaman /berita */
export const KATEGORI_BADGE_BG: Record<string, string> = {
  berita: "#2563eb",
  pengumuman: "#dc2626",
  agenda: "#16a34a",
  prestasi: "#d97706",
};

/** Warna badge per kategori berita (Tailwind classes) */
export const KATEGORI_COLOR: Record<string, string> = {
  berita: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pengumuman: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  agenda: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  prestasi: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

/**
 * Escape karakter HTML berbahaya, lalu ubah URL polos (http/https) jadi
 * tag <a> yang aman untuk dirender via dangerouslySetInnerHTML.
 * Porting dari fungsi aktifkan_link() di berita_detail.php versi lama,
 * dengan tambahan escaping agar tidak rawan XSS dari isi database.
 */
export function aktifkanLinkSafe(text: string | null | undefined): string {
  if (!text) return "";

  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-bold break-all">${url}</a>`
  );
}
