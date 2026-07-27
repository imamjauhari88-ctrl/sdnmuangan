interface AlbumHeaderProps {
  namaAlbum: string;
  deskripsi: string | null;
  jmlFoto: number;
}

export default function AlbumHeader({ namaAlbum, deskripsi, jmlFoto }: AlbumHeaderProps) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-7 border border-cyan-100 dark:border-cyan-900/30 mb-10 bg-gradient-to-r from-cyan-50 dark:from-cyan-900/10 to-blue-50 dark:to-blue-900/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-1">
            {namaAlbum}
          </h3>
          {deskripsi && (
            <p className="text-sm text-gray-600 dark:text-gray-300">{deskripsi}</p>
          )}
        </div>
        <div
          className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-sm flex items-center gap-2"
          aria-label="Total foto dalam album"
        >
          <i className="fa-solid fa-image" aria-hidden="true" />
          {jmlFoto} Foto
        </div>
      </div>
    </div>
  );
}
