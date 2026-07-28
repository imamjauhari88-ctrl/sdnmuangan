interface VisiMisiFullProps {
  visi: string;
  misi: string;
}

/** Parse misi: bisa berupa <li>...</li> HTML atau baris terpisah newline */
function parseMisiLines(misi: string): string[] {
  if (!misi) return [];
  if (misi.includes("<li>")) {
    // [^] dipakai sebagai pengganti dotAll flag (kompatibel target ES2017)
    const matches = [...misi.matchAll(/<li>([^]*?)<\/li>/g)];
    return matches.map((m) => m[1].replace(/<[^>]*>/g, "").trim()).filter(Boolean);
  }
  return misi
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function VisiMisiFull({ visi, misi }: VisiMisiFullProps) {
  const misiLines = parseMisiLines(misi);

  return (
    <section
      id="visimisi-section"
      className="py-14 sm:py-20 bg-gray-50 dark:bg-gray-950 scroll-mt-16"
      aria-label="Visi dan Misi Sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            🎯 Komitmen
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-gray-900 dark:text-white mb-3">
            Visi &amp; Misi
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* VISI */}
          <div className="card-animate visi-card p-8 sm:p-10 relative overflow-hidden group" style={{ animationDelay: "0.1s" }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-eye text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Visi</h3>
              </div>
              {visi ? (
                <blockquote className="text-base sm:text-lg text-gray-700 dark:text-gray-200 italic leading-relaxed border-l-4 border-blue-500 pl-5">
                  &ldquo;{visi}&rdquo;
                </blockquote>
              ) : (
                <p className="text-sm text-gray-400 italic">Visi belum diisi.</p>
              )}
            </div>
          </div>

          {/* MISI */}
          <div className="card-animate misi-card p-8 sm:p-10 relative overflow-hidden group" style={{ animationDelay: "0.2s" }}>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400/10 rounded-full translate-y-1/2 -translate-x-1/2" aria-hidden="true" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-list-check text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Misi</h3>
              </div>
              {misiLines.length > 0 ? (
                <ul className="space-y-2.5" role="list">
                  {misiLines.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-200"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">Misi belum diisi.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
