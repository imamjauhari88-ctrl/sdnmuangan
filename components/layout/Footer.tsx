import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/utils/format";
import type { PengaturanMap } from "@/lib/types/database";
import { pengaturanValue } from "@/lib/data/pengaturan";
import { cldTransform } from "@/lib/utils/cloudinary";

interface FooterProps {
  pengaturan?: PengaturanMap;
}

const MENU_CEPAT = [
  { href: "/", label: "Beranda", icon: "fa-house" },
  { href: "/profil", label: "Profil", icon: "fa-school" },
  { href: "/gtk", label: "GTK", icon: "fa-chalkboard-user" },
  { href: "/galeri", label: "Galeri", icon: "fa-image" },
];

/**
 * Footer situs, porting dari includes/footer.php versi lama,
 * termasuk tombol WhatsApp melayang di kanan-bawah.
 */
export default function Footer({ pengaturan = {} }: FooterProps) {
  // Pengaman ekstra agar objek pengaturan tidak null/undefined
  const safePengaturan = pengaturan || {};

  // Gunakan 'safePengaturan' sebagai parameter pertama fungsi pengaturanValue
  const namaSekolah = pengaturanValue(safePengaturan, "nama_sekolah", "Nama Sekolah");
  const logoUrl = pengaturanValue(safePengaturan, "logo_sekolah", "/assets/img/logo.png");
  const alamat = pengaturanValue(safePengaturan, "alamat_sekolah", "-");
  const telepon = pengaturanValue(safePengaturan, "telepon_sekolah", "-");
  const email = pengaturanValue(safePengaturan, "email_sekolah", "-");

  // Membaca URL Media Sosial dari database secara aman
  const facebook = pengaturanValue(safePengaturan, "facebook", "");
  const instagram = pengaturanValue(safePengaturan, "instagram", "");
  const youtube = pengaturanValue(safePengaturan, "youtube", "");
  const tiktok = pengaturanValue(safePengaturan, "tiktok", "");

  const waLink = buildWhatsAppLink(
    telepon !== "-" ? telepon : null,
    `Halo, saya ingin bertanya mengenai informasi di ${namaSekolah}`
  );

  // Menyaring hanya media sosial yang memiliki URL valid (tidak kosong)
  const SOCIAL_MEDIA = [
    { href: facebook, icon: "fa-brands fa-facebook-f", label: "Facebook" },
    { href: instagram, icon: "fa-brands fa-instagram", label: "Instagram" },
    { href: youtube, icon: "fa-brands fa-youtube", label: "YouTube" },
    { href: telepon !== "-" ? waLink : "", icon: "fa-brands fa-whatsapp", label: "WhatsApp" },
    { href: tiktok, icon: "fa-brands fa-tiktok", label: "TikTok" },
  ].filter((soc) => soc.href && soc.href !== "" && soc.href !== "-" && soc.href !== "#");

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white pt-12 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-3 md:gap-8">
          {/* PROFIL */}
          <div>
            <div className="flex items-center mb-4">
              <Image
  src={cldTransform(logoUrl, "w_160,c_fit,q_auto,f_auto")}
  alt="Logo Sekolah"
  width={40}
  height={40}
  className="w-10 h-10 mr-3 object-contain"
/>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{namaSekolah}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Sekolah dasar negeri yang berkomitmen memberikan pendidikan berkualitas untuk
              generasi masa depan.
            </p>

            {/* IKON SOSIAL MEDIA (Dinamis & Responsif) */}
            {SOCIAL_MEDIA.length > 0 && (
              <div className="flex items-center gap-3 mt-5">
                {SOCIAL_MEDIA.map((soc, idx) => (
                  <a
                    key={idx}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.label}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-200/50 dark:bg-white/5 hover:bg-teal-700 hover:text-white dark:hover:bg-teal-700 dark:hover:text-white transition-all text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    <i className={`${soc.icon} text-lg`} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* MENU CEPAT */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Menu Cepat
            </h4>
            <div className="flex flex-col gap-0">
              {MENU_CEPAT.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="flex items-center gap-2 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-teal-700 dark:hover:text-white transition-colors"
                >
                  <i className={`fa-solid ${m.icon} w-4`} /> {m.label}
                </Link>
              ))}
            </div>
          </div>

          {/* KONTAK */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Kontak</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot text-teal-700 dark:text-teal-400 mt-1" />
                <span>{alamat}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-phone text-green-600 dark:text-green-400" />
                <span>{telepon}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-red-600 dark:text-red-400" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-10 py-4 text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-gray-800 dark:text-gray-200">{namaSekolah}</span>
          </p>
          <a
            href="https://wa.me/6285257796187"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 dark:text-teal-400 font-medium"
          >
            Developed by @jeweller85
          </a>
        </div>
      </div>

      {/* WHATSAPP FLOATING BUTTON */}
      <div className="fixed bottom-6 right-6 z-[9999] group">
        <div className="absolute bottom-full right-0 mb-4 flex flex-col items-end w-max opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-800 dark:text-white text-[11px] font-bold px-4 py-2 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 flex items-center gap-2">
            Chat Admin
          </div>
          <div className="w-3 h-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-r border-b border-white/20 dark:border-gray-700 rotate-45 -mt-1.5 mr-5" />
        </div>

        <a
          href={waLink}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chat via WhatsApp"
  className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 transition-all duration-300 group-hover:scale-125"
>
          <div className="absolute inset-0 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-[2px] shadow-sm" />
          <i className="fa-brands fa-whatsapp text-4xl sm:text-5xl text-[#25D366] drop-shadow-[0_0_10px_rgba(37,211,102,0.5)] transition-all group-hover:drop-shadow-[0_0_20px_rgba(37,211,102,0.8)]" />
          <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-40 group-hover:opacity-0" />
        </a>
      </div>
    </footer>
  );
}