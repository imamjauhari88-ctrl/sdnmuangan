import Link from "next/link";
import { getWarna } from "@/lib/utils/warna";

interface KontakRingkasProps {
  alamat: string;
  telepon: string;
  email: string;
  jamOperasional: string;
  linkMaps: string;
}

export default function KontakRingkas({
  alamat,
  telepon,
  email,
  jamOperasional,
  linkMaps,
}: KontakRingkasProps) {
  const teleponHref = `tel:${telepon.replace(/[^0-9+]/g, "")}`;
  const jamOperasionalHtml = jamOperasional.replace(/&lt;br&gt;/g, "<br>");

  const kontaks = [
    { icon: "fa-location-dot", warna: "blue" as const, label: "Alamat", val: alamat, href: linkMaps, blank: true, isHtml: false },
    { icon: "fa-phone", warna: "green" as const, label: "Telepon", val: telepon, href: teleponHref, blank: false, isHtml: false },
    { icon: "fa-envelope", warna: "purple" as const, label: "Email", val: email, href: `mailto:${email}`, blank: false, isHtml: false },
    { icon: "fa-calendar-days", warna: "amber" as const, label: "Jam Operasional", val: jamOperasionalHtml, href: null, blank: false, isHtml: true },
  ];

  return (
    <section
      id="kontak-section"
      className="py-14 sm:py-20 bg-white dark:bg-gray-900 scroll-mt-16"
      aria-label="Informasi kontak sekolah"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            📞 Hubungi Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3">
            Informasi Kontak
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-rose-500 to-pink-400 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {kontaks.map((k, i) => {
            const w = getWarna(k.warna);
            return (
              <div
                key={k.label}
                className="card-animate card-hover glass-card p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4 group"
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              >
                <div className={`w-12 h-12 flex-shrink-0 rounded-xl ${w.iconBg} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${k.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                    {k.label}
                  </p>
                  {k.href ? (
                    <a
                      href={k.href}
                      target={k.blank ? "_blank" : undefined}
                      rel={k.blank ? "noopener noreferrer" : undefined}
                      className={`text-sm text-gray-700 dark:text-gray-200 font-semibold ${w.hoverText} transition-colors break-all`}
                    >
                      {k.val}
                    </a>
                  ) : k.isHtml ? (
                    <p
                      className="text-sm text-gray-700 dark:text-gray-200 font-semibold"
                      dangerouslySetInnerHTML={{ __html: k.val }}
                    />
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">{k.val}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95"
            aria-label="Buka halaman kontak untuk kirim pesan"
          >
            <i className="fa-regular fa-paper-plane" aria-hidden="true" />
            Kirim Pesan ke Sekolah
          </Link>
        </div>
      </div>
    </section>
  );
}
