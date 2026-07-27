import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import { getBeritaDetail } from "@/lib/data/berita";
import { cldTransform } from "@/lib/utils/cloudinary";
import { aktifkanLinkSafe, KATEGORI_LABEL } from "@/lib/utils/format";
import type { BeritaKategori } from "@/lib/types/database";
import ShareButtons from "@/components/berita/ShareButtons";
import JsonLdArticle from "@/components/seo/JsonLdArticle";
import JsonLdBreadcrumb from "@/components/seo/JsonLdBreadcrumb";

export const revalidate = 60;

const BADGE_CLASS: Record<BeritaKategori, string> = {
  berita: "bg-blue-600",
  pengumuman: "bg-red-600",
  agenda: "bg-green-600",
  prestasi: "bg-amber-600",
};

const TEXT_COLOR_CLASS: Record<BeritaKategori, string> = {
  berita: "text-blue-600",
  pengumuman: "text-red-600",
  agenda: "text-green-600",
  prestasi: "text-amber-600",
};

interface BeritaDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BeritaDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) return {};

  const [pengaturan, { berita }] = await Promise.all([getPengaturan(), getBeritaDetail(idNum)]);
  if (!berita) return {};

  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Sekolah Kami");
  const logoSekolah = pengaturanValue(pengaturan, "logo_sekolah", "");
  const description = (berita.isi ?? "").replace(/<[^>]*>/g, "").slice(0, 160) + "...";

  // Resize Cloudinary ke ukuran standar WhatsApp/OG (600x315, quality 80),
  // porting dari logika di berita_detail.php versi lama.
  const ogImage = berita.gambar
    ? cldTransform(berita.gambar, "c_fill,w_600,h_315,q_80")
    : logoSekolah;

  return {
    title: berita.judul ?? namaSekolah,
    description,
    alternates: {
      canonical: `/berita/${berita.id}`,
    },
    openGraph: {
      type: "article",
      title: berita.judul ?? namaSekolah,
      description,
      images: ogImage ? [{ url: ogImage, width: 600, height: 315 }] : undefined,
      publishedTime: berita.tanggal ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: berita.judul ?? namaSekolah,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BeritaDetailPage({ params }: BeritaDetailPageProps) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const { berita, lainnya } = await getBeritaDetail(idNum);
  if (!berita) notFound();

  const badgeClass = BADGE_CLASS[berita.kategori] ?? "bg-gray-600";
  const textColorClass = TEXT_COLOR_CLASS[berita.kategori] ?? "text-gray-600";
  const kategoriLabel = KATEGORI_LABEL[berita.kategori] ?? berita.kategori;

  const tanggalLengkap = berita.tanggal
    ? new Date(berita.tanggal + "T00:00:00").toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

  const pengaturan = await getPengaturan();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.uptdsdntamansareh2.sch.id").replace(/\/$/, "");
  const shareUrl = `${siteUrl}/berita/${berita.id}`;
  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Sekolah Kami");
  const logoSekolah = pengaturanValue(pengaturan, "logo_sekolah", "");
  const mainImage = berita.gambar || logoSekolah || "https://placehold.co/1200x600/1e40af/ffffff?text=Berita";

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <JsonLdArticle
        judul={berita.judul ?? namaSekolah}
        isi={berita.isi}
        tanggal={berita.tanggal}
        gambar={mainImage}
        namaSekolah={namaSekolah}
        logoSekolah={logoSekolah}
        siteUrl={siteUrl}
        url={shareUrl}
      />
      <JsonLdBreadcrumb
        siteUrl={siteUrl}
        items={[
          { name: "Beranda", url: "/" },
          { name: "Berita", url: "/berita" },
          { name: berita.judul ?? "Detail Berita", url: `/berita/${berita.id}` },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-bold transition-all"
          >
            <i className="fa-solid fa-arrow-left" /> Kembali ke Berita
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* KOLOM KIRI: ISI BERITA */}
          <div className="lg:col-span-2">
            <article className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 overflow-hidden">
              <div className="w-full h-[300px] md:h-[450px] relative">
                <Image
                  src={mainImage}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  alt={berita.judul ?? ""}
                />
                <span
                  className={`absolute bottom-6 left-6 ${badgeClass} text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-xl`}
                >
                  {kategoriLabel}
                </span>
              </div>

              <div className="p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white leading-tight mb-6">
                  {berita.judul}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 dark:text-gray-500 border-b dark:border-gray-800 pb-6 mb-8">
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid fa-calendar-alt ${textColorClass}`} />
                    <time dateTime={berita.tanggal ?? undefined}>{tanggalLengkap}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid fa-user ${textColorClass}`} />
                    Admin Sekolah
                  </div>
                  {berita.kategori === "prestasi" && (berita.tingkat || berita.juara) && (
                    <div className="flex items-center gap-2">
                      <i className={`fa-solid fa-trophy ${textColorClass}`} />
                      {[berita.tingkat, berita.juara].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>

                <div
                  className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-justify mb-10"
                  dangerouslySetInnerHTML={{ __html: aktifkanLinkSafe(berita.isi) }}
                />

                <div className="pt-8 border-t dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <ShareButtons title={berita.judul ?? ""} url={shareUrl} />
                </div>
              </div>
            </article>
          </div>

          {/* KOLOM KANAN: SIDEBAR */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm">
              <h3 className="text-xl font-black mb-6 dark:text-white border-l-4 border-blue-600 pl-4">
                Terbaru
              </h3>

              <div className="space-y-6">
                {lainnya.map((lk) => (
                  <Link key={lk.id} href={`/berita/${lk.id}`} className="flex gap-4 group">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border dark:border-gray-800">
                      <Image
                        src={
                          lk.gambar ||
                          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop"
                        }
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={lk.judul ?? ""}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {lk.judul}
                      </h4>
                      <span className="text-[9px] text-gray-400 mt-2 block uppercase font-black">
                        {lk.tanggal
                          ? new Date(lk.tanggal + "T00:00:00").toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/berita"
                className="block text-center mt-8 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
              >
                Semua Berita
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
