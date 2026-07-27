/**
 * Layout ini sengaja kosong (cuma passthrough children) — tujuannya
 * adalah override implisit Next.js terhadap layout induk (app/admin/layout.tsx)
 * TIDAK terjadi secara otomatis di App Router (children selalu dibungkus
 * parent layout berlapis). Karena itu app/admin/layout.tsx sendiri yang
 * mendeteksi user null/halaman login dan melewati AdminShell.
 *
 * File ini tetap diletakkan di sini untuk kejelasan struktur folder dan
 * sebagai tempat menambah metadata khusus halaman login di masa depan.
 */
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
