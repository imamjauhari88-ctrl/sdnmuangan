import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Menghasilkan /sitemap.xml secara otomatis (fitur bawaan Next.js App Router).
 *
 * Berisi:
 * 1. Halaman statis situs publik (beranda, profil, berita, galeri, dst).
 * 2. Halaman detail berita (dinamis, diambil langsung dari Supabase),
 *    supaya setiap artikel baru otomatis ikut ter-index tanpa perlu
 *    update manual.
 *
 * Halaman admin (/admin/**) sengaja TIDAK dimasukkan — sudah diblokir
 * juga lewat robots.ts.
 */
export const revalidate = 3600; // sitemap cukup di-refresh tiap 1 jam

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.uptdsdntamansareh2.sch.id").replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/profil`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/berita`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/galeri`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/gtk`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/ppdb`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/kontak`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  // Ambil daftar berita untuk halaman detail (/berita/[id]).
  // Dibatasi 1000 baris terbaru agar sitemap tidak membengkak tanpa batas;
  // cukup untuk kebutuhan situs sekolah.
  let beritaRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("berita")
      .select("id, tanggal")
      .order("tanggal", { ascending: false })
      .limit(1000);

    // Anotasi tipe eksplisit diperlukan di sini karena keterbatasan inferensi
    // tipe @supabase/supabase-js@2.108 pada hasil .select() dengan kolom
    // spesifik (pola yang sama dipakai di lib/data/berita.ts).
    const rows: { id: number; tanggal: string | null }[] = data ?? [];

    beritaRoutes = rows.map((row) => ({
      url: `${siteUrl}/berita/${row.id}`,
      lastModified: row.tanggal ? new Date(row.tanggal) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Jika Supabase gagal diakses saat build, tetap kembalikan sitemap
    // statis daripada membuat build gagal total.
    beritaRoutes = [];
  }

  return [...staticRoutes, ...beritaRoutes];
}
