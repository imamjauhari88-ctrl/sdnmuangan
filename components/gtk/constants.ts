import { GTKMember } from './types';

export const getColorMap = (color: string) => {
  const maps: Record<string, { bg: string; text: string; border: string; bgHover: string; badge: string; from: string; to: string }> = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900/40', bgHover: 'hover:bg-blue-100 dark:hover:bg-blue-900/50', badge: 'bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400', from: '#1d4ed8', to: '#0891b2' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-100 dark:border-green-900/40', bgHover: 'hover:bg-green-100 dark:hover:bg-green-900/50', badge: 'bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-900/50 text-green-600 dark:text-green-400', from: '#15803d', to: '#0d9488' },
    red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-100 dark:border-red-900/40', bgHover: 'hover:bg-red-100 dark:hover:bg-red-900/50', badge: 'bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400', from: '#dc2626', to: '#db2777' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-900/40', bgHover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/50', badge: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400', from: '#4338ca', to: '#7c3aed' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-900/40', bgHover: 'hover:bg-orange-100 dark:hover:bg-orange-900/50', badge: 'bg-orange-50 dark:bg-orange-900/30 border-orange-100 dark:border-orange-900/50 text-orange-600 dark:text-orange-400', from: '#ea580c', to: '#d97706' },
    yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-100 dark:border-yellow-900/40', bgHover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/50', badge: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-100 dark:border-yellow-900/50 text-yellow-600 dark:text-yellow-400', from: '#ca8a04', to: '#b45309' },
    teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-100 dark:border-teal-900/40', bgHover: 'hover:bg-teal-100 dark:hover:bg-teal-900/50', badge: 'bg-teal-50 dark:bg-teal-900/30 border-teal-100 dark:border-teal-900/50 text-teal-600 dark:text-teal-400', from: '#0f766e', to: '#0369a1' },
    gray: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', border: 'border-gray-100 dark:border-gray-700', bgHover: 'hover:bg-gray-100 dark:hover:bg-gray-800/50', badge: 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400', from: '#4b5563', to: '#374151' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/40', bgHover: 'hover:bg-purple-100 dark:hover:bg-purple-900/50', badge: 'bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-900/50 text-purple-600 dark:text-purple-400', from: '#7c3aed', to: '#a21caf' },
    pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-100 dark:border-pink-900/40', bgHover: 'hover:bg-pink-100 dark:hover:bg-pink-900/50', badge: 'bg-pink-50 dark:bg-pink-900/30 border-pink-100 dark:border-pink-900/50 text-pink-600 dark:text-pink-400', from: '#db2777', to: '#e11d48' },
    cyan: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-100 dark:border-cyan-900/40', bgHover: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/50', badge: 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-100 dark:border-cyan-900/50 text-cyan-600 dark:text-cyan-400', from: '#0891b2', to: '#0284c7' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/40', bgHover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/50', badge: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400', from: '#059669', to: '#0d9488' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/40', bgHover: 'hover:bg-amber-100 dark:hover:bg-amber-900/50', badge: 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400', from: '#d97706', to: '#b45309' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-900/40', bgHover: 'hover:bg-rose-100 dark:hover:bg-rose-900/50', badge: 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400', from: '#e11d48', to: '#be123c' },
    violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-900/40', bgHover: 'hover:bg-violet-100 dark:hover:bg-violet-900/50', badge: 'bg-violet-50 dark:bg-violet-900/30 border-violet-100 dark:border-violet-900/50 text-violet-600 dark:text-violet-400', from: '#6d28d9', to: '#7c3aed' },
  };
  return maps[color] || maps.blue;
};

export const iconMap = [
  { key: 'rpp', icon: 'fa-file-lines', color: 'text-blue-500' },
  { key: 'bank soal', icon: 'fa-layer-group', color: 'text-purple-500' },
  { key: 'promes', icon: 'fa-calendar-days', color: 'text-green-500' },
  { key: 'prota', icon: 'fa-calendar', color: 'text-teal-500' },
  { key: 'silabus', icon: 'fa-list-check', color: 'text-indigo-500' },
  { key: 'modul', icon: 'fa-book-open', color: 'text-orange-500' },
  { key: 'lkpd', icon: 'fa-file-pen', color: 'text-pink-500' },
  { key: 'media', icon: 'fa-photo-film', color: 'text-cyan-500' },
  { key: 'kkm', icon: 'fa-chart-bar', color: 'text-amber-500' },
  { key: 'asesmen', icon: 'fa-clipboard-check', color: 'text-rose-500' },
  { key: 'cp', icon: 'fa-bullseye', color: 'text-emerald-500' },
  { key: 'atp', icon: 'fa-sitemap', color: 'text-violet-500' },
];

export const getBerkasIcon = (label: string) => {
  const l = label.toLowerCase();
  for (const m of iconMap) {
    if (l.includes(m.key)) return { icon: m.icon, color: m.color };
  }
  return { icon: 'fa-file', color: 'text-gray-400' };
};

export const fallbackGtk: GTKMember[] = [
  { nama: 'Redi Kasihan Hanifiani, S.Pd.SD.', jabatan: 'Kepala Sekolah', pendidikan: 'S1-Pendidikan Guru Sekolah Dasar', foto: 'ks.png', warna: 'blue', wa: '', kategori: 'pimpinan', berkas: [] },
  { nama: 'Husnul Hotimah, S.Pd.SD.', jabatan: 'Guru Kelas I', pendidikan: 'S1-Pendidikan Guru Sekolah Dasar', foto: 'g1.png', warna: 'green', wa: '', kategori: 'guru_kelas', berkas: [] },
  { nama: 'Moh. Ilyas Baidhawi, S.Pd.', jabatan: 'Guru Kelas II', pendidikan: 'S1-Pendidikan Guru Sekolah Dasar', foto: 'g2.png', warna: 'indigo', wa: '', kategori: 'guru_kelas', berkas: [] },
  { nama: 'Kurrotul Aini, S.Pd.SD.', jabatan: 'Guru Kelas III', pendidikan: 'S1-Pendidikan Guru Sekolah Dasar', foto: 'g3.png', warna: 'red', wa: '', kategori: 'guru_kelas', berkas: [] },
  { nama: 'Taufiqurrohman, S.Pd.', jabatan: 'Guru Kelas IV', pendidikan: 'S1-Pendidikan Kewarganegaraan', foto: 'g4.png', warna: 'orange', wa: '', kategori: 'guru_kelas', berkas: [] },
  { nama: 'Imam Jauhari, S.Pd.SD.', jabatan: 'Guru Kelas V', pendidikan: 'S1-Pendidikan Guru Sekolah Dasar', foto: 'g5.png', warna: 'yellow', wa: '', kategori: 'guru_kelas', berkas: [] },
  { nama: 'Tri Agustono, S.Pd.SD.', jabatan: 'Guru Kelas VI', pendidikan: 'S1-Pendidikan Guru Sekolah Dasar', foto: 'g6.png', warna: 'indigo', wa: '', kategori: 'guru_kelas', berkas: [] },
  { nama: 'Jony Purnomo Cahyo, S.Pd.', jabatan: 'Guru PJOK', pendidikan: 'S1-Pendidikan Jasmani Kesehatan dan Rekreasi', foto: 'pjok.png', warna: 'teal', wa: '', kategori: 'guru_mapel', berkas: [] },
  { nama: 'Miftahul Jannah, S.Pd., M.Pd.', jabatan: 'Guru PAI', pendidikan: 'S2-Pendidikan Agama Islam', foto: 'pai.png', warna: 'green', wa: '', kategori: 'guru_mapel', berkas: [] },
  { nama: 'Mahfud', jabatan: 'Penjaga Sekolah', pendidikan: 'SMA/Paket C - Ilmu Pengetahuan Sosial', foto: 'penjaga.png', warna: 'gray', wa: '', kategori: 'tendik', berkas: [] },
];