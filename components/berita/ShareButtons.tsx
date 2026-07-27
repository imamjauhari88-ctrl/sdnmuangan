"use client";

import { useState, useEffect } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  // Mengubah path relatif menjadi URL absolut setelah komponen dimuat di browser.
  // window.location hanya tersedia di client, jadi URL absolut memang wajib
  // dihitung setelah mount.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin; // Menghasilkan: https://uptdsdntamansareh2.vercel.app
      
      // Jika url bawaan sudah lengkap (diawali http), gunakan langsung.
      // Jika masih relatif (misal: /berita/13), gabungkan dengan domain asal.
      const absoluteUrl = url.startsWith("http") ? url : `${origin}${url}`;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullUrl(absoluteUrl);
    }
  }, [url]);

  // Menggunakan fullUrl untuk link WhatsApp dan Facebook
  const waText = encodeURIComponent(`${title} \n\nBaca selengkapnya di: ${fullUrl}`);
  const fbUrl = encodeURIComponent(fullUrl);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl); // Menyalin fullUrl
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API mungkin tidak tersedia (non-HTTPS/browser lama); abaikan secara senyap
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span className="font-black text-sm uppercase tracking-wider dark:text-gray-400">Bagikan:</span>

      <a
        href={`https://api.whatsapp.com/send?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 rounded-full bg-green-500 text-white flex items-center justify-center hover:scale-110 transition shadow-lg shadow-green-500/30"
        aria-label="Bagikan ke WhatsApp"
      >
        <i className="fa-brands fa-whatsapp text-xl" />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${fbUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition shadow-lg shadow-blue-600/30"
        aria-label="Bagikan ke Facebook"
      >
        <i className="fa-brands fa-facebook-f text-lg" />
      </a>

      <button
        onClick={handleCopy}
        className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition font-bold text-xs flex items-center gap-2"
      >
        <i className={`fa-solid ${copied ? "fa-check text-green-600" : "fa-link"}`} />
        {copied ? "Tersalin!" : "Salin Link"}
      </button>
    </div>
  );
}