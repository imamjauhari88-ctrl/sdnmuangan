/**
 * Color map terpusat untuk kartu fasilitas, info sekolah, dan kontak.
 *
 * PENTING: Tailwind v4 (JIT) hanya menghasilkan CSS untuk class yang
 * muncul SECARA LITERAL di source code. Pola lama di PHP seperti
 * `bg-<?= $color ?>-100` (string interpolation) TIDAK bisa di-porting
 * apa adanya ke className dinamis di React — Tailwind tidak akan
 * mendeteksi class hasil interpolasi runtime. Karena itu setiap
 * kombinasi warna di bawah ditulis lengkap sebagai object literal.
 */

export type WarnaKey =
  | "blue"
  | "indigo"
  | "green"
  | "emerald"
  | "purple"
  | "orange"
  | "cyan"
  | "red"
  | "amber"
  | "pink"
  | "teal"
  | "violet"
  | "yellow"
  | "gray";

interface WarnaClasses {
  /** bg-{c}-100 dark:bg-{c}-900/40 text-{c}-600 dark:text-{c}-400 */
  iconBg: string;
  /** bg-{c}-50 dark:bg-{c}-900/30 (lebih pucat, untuk badge kecil) */
  badgeBg: string;
  /** text-{c}-600 dark:text-{c}-400 */
  text: string;
  /** hover:text-{c}-600 dark:hover:text-{c}-400 (literal, untuk link interaktif) */
  hoverText: string;
  /** bg-{c}-400 (untuk garis kecil aksen) */
  accentLine: string;
  /** Hex untuk dipakai di modal (header gradient, dst) */
  hex: { bg: string; light: string; text: string };
}

export const WARNA_MAP: Record<WarnaKey, WarnaClasses> = {
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    hoverText: "hover:text-blue-600 dark:hover:text-blue-400",
    accentLine: "bg-blue-400",
    hex: { bg: "#2563eb", light: "#eff6ff", text: "#1d4ed8" },
  },
  indigo: {
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-50 dark:bg-indigo-900/30",
    text: "text-indigo-600 dark:text-indigo-400",
    hoverText: "hover:text-indigo-600 dark:hover:text-indigo-400",
    accentLine: "bg-indigo-400",
    hex: { bg: "#4338ca", light: "#eef2ff", text: "#3730a3" },
  },
  green: {
    iconBg: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400",
    badgeBg: "bg-green-50 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
    hoverText: "hover:text-green-600 dark:hover:text-green-400",
    accentLine: "bg-green-400",
    hex: { bg: "#16a34a", light: "#f0fdf4", text: "#15803d" },
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400",
    hoverText: "hover:text-emerald-600 dark:hover:text-emerald-400",
    accentLine: "bg-emerald-400",
    hex: { bg: "#059669", light: "#ecfdf5", text: "#047857" },
  },
  purple: {
    iconBg: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
    hoverText: "hover:text-purple-600 dark:hover:text-purple-400",
    accentLine: "bg-purple-400",
    hex: { bg: "#7c3aed", light: "#f5f3ff", text: "#6d28d9" },
  },
  orange: {
    iconBg: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-50 dark:bg-orange-900/30",
    text: "text-orange-600 dark:text-orange-400",
    hoverText: "hover:text-orange-600 dark:hover:text-orange-400",
    accentLine: "bg-orange-400",
    hex: { bg: "#ea580c", light: "#fff7ed", text: "#c2410c" },
  },
  cyan: {
    iconBg: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400",
    badgeBg: "bg-cyan-50 dark:bg-cyan-900/30",
    text: "text-cyan-600 dark:text-cyan-400",
    hoverText: "hover:text-cyan-600 dark:hover:text-cyan-400",
    accentLine: "bg-cyan-400",
    hex: { bg: "#0891b2", light: "#ecfeff", text: "#0e7490" },
  },
  red: {
    iconBg: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    hoverText: "hover:text-red-600 dark:hover:text-red-400",
    accentLine: "bg-red-400",
    hex: { bg: "#dc2626", light: "#fef2f2", text: "#b91c1c" },
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
    hoverText: "hover:text-amber-600 dark:hover:text-amber-400",
    accentLine: "bg-amber-400",
    hex: { bg: "#d97706", light: "#fffbeb", text: "#b45309" },
  },
  pink: {
    iconBg: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400",
    badgeBg: "bg-pink-50 dark:bg-pink-900/30",
    text: "text-pink-600 dark:text-pink-400",
    hoverText: "hover:text-pink-600 dark:hover:text-pink-400",
    accentLine: "bg-pink-400",
    hex: { bg: "#db2777", light: "#fdf2f8", text: "#be185d" },
  },
  teal: {
    iconBg: "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-50 dark:bg-teal-900/30",
    text: "text-teal-600 dark:text-teal-400",
    hoverText: "hover:text-teal-600 dark:hover:text-teal-400",
    accentLine: "bg-teal-400",
    hex: { bg: "#0f766e", light: "#f0fdfa", text: "#115e59" },
  },
  violet: {
    iconBg: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400",
    badgeBg: "bg-violet-50 dark:bg-violet-900/30",
    text: "text-violet-600 dark:text-violet-400",
    hoverText: "hover:text-violet-600 dark:hover:text-violet-400",
    accentLine: "bg-violet-400",
    hex: { bg: "#6d28d9", light: "#f5f3ff", text: "#5b21b6" },
  },
  yellow: {
    iconBg: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400",
    badgeBg: "bg-yellow-50 dark:bg-yellow-900/30",
    text: "text-yellow-600 dark:text-yellow-400",
    hoverText: "hover:text-yellow-600 dark:hover:text-yellow-400",
    accentLine: "bg-yellow-400",
    hex: { bg: "#ca8a04", light: "#fefce8", text: "#a16207" },
  },
  gray: {
    iconBg: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
    badgeBg: "bg-gray-50 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    hoverText: "hover:text-gray-600 dark:hover:text-gray-400",
    accentLine: "bg-gray-400",
    hex: { bg: "#4b5563", light: "#f9fafb", text: "#374151" },
  },
};

/** Ambil set class warna dengan fallback aman ke 'blue' jika key tidak dikenal */
export function getWarna(key: string | null | undefined): WarnaClasses {
  return WARNA_MAP[(key as WarnaKey) ?? "blue"] ?? WARNA_MAP.blue;
}
