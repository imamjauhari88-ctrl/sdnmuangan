import Link from "next/link";

interface VisiMisiProps {
  visi: string;
  misi: string;
}

/** Parse misi: bisa berupa <li>...</li> HTML atau baris terpisah newline */
function parseMisiLines(misi: string): string[] {
  if (!misi) return [];
  if (misi.includes("<li>")) {
    // [^] dipakai sebagai pengganti ".": cocok dengan karakter apapun termasuk newline,
    // setara regex dotAll (/s) tapi kompatibel dengan target ES2017 project ini.
    const matches = [...misi.matchAll(/<li>([^]*?)<\/li>/g)];
    return matches.map((m) => m[1].replace(/<[^>]*>/g, "").trim()).filter(Boolean);
  }
  return misi
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function VisiMisi({ visi, misi }: VisiMisiProps) {
  const misiLines = parseMisiLines(misi);
  const misiPreview = misiLines.slice(0, 3);
  const adaLebih = misiLines.length > 3;

  return (
    <section
      className="py-12 sm:py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
      aria-label="Visi dan Misi Sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-full inline-block mb-3">
            🎯 Arah Sekolah
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Visi &amp; Misi
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visi */}
          <div className="visi-misi-card card-animate" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-eye text-white text-xl" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Visi</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed font-medium line-clamp-3">
              &ldquo;{visi}&rdquo;
            </p>
          </div>

          {/* Misi */}
          <div className="visi-misi-card card-animate" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-rocket text-white text-xl" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Misi</h3>
            </div>
            {misiPreview.length > 0 ? (
              <ul className="space-y-2" role="list">
                {misiPreview.map((line, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-200"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    {line}
                  </li>
                ))}
                {adaLebih && (
                  <li className="text-xs text-gray-400 dark:text-gray-500 italic pl-7">
                    + {misiLines.length - 3} poin lainnya...
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Data misi belum tersedia.
              </p>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/profil#profil-section"
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-1 transition-all active:scale-95"
          >
            Lihat Visi &amp; Misi Lengkap <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}
