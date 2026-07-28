import React from 'react';
import Image from 'next/image';
import { ParsedGTKMember, GroupedGTK } from './types';
import { getColorMap } from './constants';

interface StafSectionProps {
  isFallback: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  kepalaSekolah?: ParsedGTKMember;
  groupedGtk: GroupedGTK[];
  isSearchEmpty: boolean;
  handleResetSearch: () => void;
  setSelectedGtk: (gtk: ParsedGTKMember) => void;
  stats: {
    total: number;
    guru: number;
    tendik: number;
  };
}

export default function StafSection({
  isFallback,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  kepalaSekolah,
  groupedGtk,
  isSearchEmpty,
  handleResetSearch,
  setSelectedGtk,
  stats,
}: StafSectionProps) {
  return (
    <section id="staf-section" className="py-14 sm:py-20 bg-gray-50 dark:bg-gray-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full inline-block mb-3">👥 Tim Profesional</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-gray-900 dark:text-white mb-3">Tim Profesional Kami</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full mb-4" />
          {isFallback && (
            <p className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800" role="status">
              <i className="fa-solid fa-triangle-exclamation"></i>
              Menampilkan data sementara — pastikan environment Supabase di Vercel sudah terpasang
            </p>
          )}
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-[0.85rem] top-1/2 -translate-y-1/2 text-gray-400 text-[14px]"></i>
            <input
              type="text"
              placeholder="Cari nama atau jabatan..."
              autoComplete="off"
              aria-label="Cari nama atau jabatan"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-[16px]"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-wrap sm:flex-nowrap">
            {[
              { filter: 'semua', label: 'Semua', icon: 'fa-users' },
              { filter: 'guru_kelas', label: 'Guru Kelas', icon: 'fa-chalkboard' },
              { filter: 'guru_mapel', label: 'Guru Mapel', icon: 'fa-book' },
              { filter: 'tendik', label: 'Tendik', icon: 'fa-briefcase' },
            ].map((btn) => (
              <button
                key={btn.filter}
                onClick={() => setActiveFilter(btn.filter)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border border-transparent whitespace-nowrap cursor-pointer ${
                  activeFilter === btn.filter
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                <i className={`fa-solid ${btn.icon} text-xs`}></i> {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* FEATURED: KEPALA SEKOLAH */}
        {kepalaSekolah && (activeFilter === 'semua' || activeFilter === 'pimpinan') && (
          <div className="flex justify-center mb-12">
            <div
              className="card-animate group card-deep-hover w-full max-w-md glass-card rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-7 relative flex flex-col sm:flex-row items-center gap-5 cursor-pointer"
              onClick={() => setSelectedGtk(kepalaSekolah)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedGtk(kepalaSekolah); }}
            >
              <div className="absolute -top-3.5 right-6">
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  <i className="fa-solid fa-crown"></i> Kepala Sekolah
                </span>
              </div>

              <div className="ks-ring flex-shrink-0">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 bg-gray-100">
                  <Image
                    src={kepalaSekolah._path}
                    alt={`Foto ${kepalaSekolah.nama}`}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const el = e.currentTarget.nextElementSibling as HTMLElement;
                      if (el) el.style.display = 'flex';
                    }}
                  />
                  <div className="avatar-local" style={{ '--av-from': '#1d4ed8', '--av-to': '#0891b2', display: 'none' } as React.CSSProperties}>
                    {kepalaSekolah._inisial}
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-left flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-1 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {kepalaSekolah.nama}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-2">
                  {kepalaSekolah.jabatan}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic flex items-center justify-center sm:justify-start gap-1.5">
                  <i className="fa-solid fa-graduation-cap flex-shrink-0"></i>
                  <span className="truncate">{kepalaSekolah.pendidikan}</span>
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 flex items-center justify-center sm:justify-start gap-1">
                  <i className="fa-solid fa-hand-pointer"></i> Klik untuk detail
                </p>
              </div>
            </div>
          </div>
        )}

        {/* GRID PER SEKSI */}
        {groupedGtk.map((grp) => {
          const grpColors = getColorMap(grp.color);
          return (
            <div key={grp.key} className="mb-12">
              <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl mb-4 text-xs font-black uppercase tracking-wider ${grpColors.bg} ${grpColors.text} border ${grpColors.border}`}>
                <i className={`fa-solid ${grp.icon}`}></i>
                <span>{grp.label}</span>
                <span className={`ml-auto text-[10px] font-black opacity-70 px-2.5 py-1 rounded-full ${grpColors.bg}`}>
                  {grp.items.length} orang
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {grp.items.map((g, idx) => {
                  const c = getColorMap(g.warna);
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedGtk(g)}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedGtk(g); }}
                      className="card-animate group glass-card card-deep-hover rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center p-5 cursor-pointer"
                      style={{ animationDelay: `${0.04 * (idx + 1)}s` }}
                    >
                      <div className="relative rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md mb-4 flex-shrink-0 bg-gray-100" style={{ width: 72, height: 72 }}>
                        <Image
                          src={g._path}
                          alt={`Foto ${g.nama}`}
                          fill
                          sizes="72px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const el = e.currentTarget.nextElementSibling as HTMLElement;
                            if (el) el.style.display = 'flex';
                          }}
                        />
                        <div className="avatar-local" style={{ '--av-from': c.from, '--av-to': c.to, display: 'none' } as React.CSSProperties}>
                          {g._inisial}
                        </div>
                      </div>

                      <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white leading-tight mb-2 min-h-[2.5rem] line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {g.nama}
                      </h3>

                      <span className={`inline-block max-w-full px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide truncate w-full text-center ${c.badge}`}>
                        {g.jabatan}
                      </span>

                      <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-700 w-full text-center">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 italic line-clamp-2 min-h-[2rem]">
                          {g.pendidikan}
                        </p>
                      </div>

                      {g._berkas && g._berkas.length > 0 ? (
                        <div className="mt-2 flex items-center justify-center gap-1">
                          <i className="fa-brands fa-google-drive text-blue-400 text-[10px]" />
                          <span className="text-[9px] text-blue-400 font-bold">{g._berkas.length} berkas</span>
                        </div>
                      ) : (
                        <p className="text-[9px] text-gray-300 dark:text-gray-600 mt-2">Klik untuk detail</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* EMPTY STATE */}
        {isSearchEmpty && (
          <div className="flex flex-col items-center justify-center text-center py-20 glass-card rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 mb-8 card-animate">
            <i className="fa-solid fa-magnifying-glass text-5xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-black text-gray-700 dark:text-gray-300 mb-2">Tidak Ditemukan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Coba kata kunci lain atau reset filter pencarian Anda</p>
            <button onClick={handleResetSearch} className="mt-4 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 mx-auto cursor-pointer">
              <i className="fa-solid fa-rotate-left"></i> Reset Pencarian
            </button>
          </div>
        )}

        {/* STATISTIK BAWAH */}
        {stats.total > 0 && (
          <div className="mt-14 pt-10 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: stats.total, lbl: 'Total GTK', icon: 'fa-users', color: 'blue' },
                { val: stats.guru, lbl: 'Guru', icon: 'fa-chalkboard-user', color: 'green' },
                { val: stats.tendik, lbl: 'Tendik', icon: 'fa-briefcase', color: 'purple' },
              ].map((st, idx) => {
                const grpColors = getColorMap(st.color);
                return (
                  <div
                    key={idx}
                    className="glass-card card-deep-hover rounded-2xl p-5 sm:p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm cursor-default"
                    role="listitem"
                    aria-label={`${st.lbl}: ${st.val}`}
                  >
                    <div className={`w-12 h-12 mx-auto rounded-full ${grpColors.bg} ${grpColors.text} flex items-center justify-center text-xl mb-3`}>
                      <i className={`fa-solid ${st.icon}`}></i>
                    </div>
                    <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-1">
                      {st.val}
                    </p>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      {st.lbl}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}