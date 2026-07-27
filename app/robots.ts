import type { MetadataRoute } from "next";

/**
 * Menghasilkan /robots.txt secara otomatis (fitur bawaan Next.js App Router).
 * Halaman admin & API internal disembunyikan dari crawler, sisanya (situs
 * publik) boleh diindeks. sitemap.xml juga dirujuk di sini agar mesin
 * pencari langsung menemukannya.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.uptdsdntamansareh2.sch.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
