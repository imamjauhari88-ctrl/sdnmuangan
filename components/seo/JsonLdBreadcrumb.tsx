interface BreadcrumbItem {
  name: string;
  /** Boleh path relatif ("/berita") atau URL absolut — otomatis dijadikan absolut. */
  url: string;
}

interface JsonLdBreadcrumbProps {
  items: BreadcrumbItem[];
  siteUrl: string;
}

/**
 * JSON-LD structured data (schema.org) tipe BreadcrumbList.
 * Reusable — dipakai di halaman mana pun yang punya hirarki navigasi
 * lebih dari 1 tingkat (mis. Beranda > Berita > [judul artikel]).
 *
 * Referensi: https://schema.org/BreadcrumbList
 */
export default function JsonLdBreadcrumb({ items, siteUrl }: JsonLdBreadcrumbProps) {
  if (items.length === 0) return null;

  const toAbsolute = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: toAbsolute(item.url),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
