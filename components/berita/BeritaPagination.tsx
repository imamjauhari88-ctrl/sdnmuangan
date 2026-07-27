import Link from "next/link";

interface BeritaPaginationProps {
  page: number;
  totalPages: number;
  totalRows: number;
  cari: string;
  kategori: string;
}

function buildHref(page: number, cari: string, kategori: string): string {
  const params = new URLSearchParams();
  if (cari) params.set("cari", cari);
  if (kategori && kategori !== "semua") params.set("kategori", kategori);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/berita${qs ? `?${qs}` : ""}#berita-section`;
}

export default function BeritaPagination({
  page,
  totalPages,
  totalRows,
  cari,
  kategori,
}: BeritaPaginationProps) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pageNumbers: number[] = [];
  for (let p = start; p <= end; p++) pageNumbers.push(p);

  return (
    <nav className="flex items-center justify-center gap-2 mt-4 flex-wrap" aria-label="Halaman berita">
      {/* Prev */}
      {page > 1 ? (
        <Link href={buildHref(page - 1, cari, kategori)} className="page-btn" aria-label="Halaman sebelumnya">
          <i className="fa-solid fa-chevron-left text-xs" />
        </Link>
      ) : (
        <span className="page-btn disabled" aria-disabled="true">
          <i className="fa-solid fa-chevron-left text-xs" />
        </span>
      )}

      {/* Halaman 1 + ellipsis */}
      {start > 1 && (
        <>
          <Link href={buildHref(1, cari, kategori)} className="page-btn" aria-label="Halaman 1">
            1
          </Link>
          {start > 2 && <span className="text-gray-400 font-bold px-1">...</span>}
        </>
      )}

      {pageNumbers.map((p) => (
        <Link
          key={p}
          href={buildHref(p, cari, kategori)}
          className={`page-btn ${p === page ? "active" : ""}`}
          aria-label={`Halaman ${p}`}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Link>
      ))}

      {/* Ellipsis + halaman terakhir */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400 font-bold px-1">...</span>}
          <Link href={buildHref(totalPages, cari, kategori)} className="page-btn" aria-label={`Halaman ${totalPages}`}>
            {totalPages}
          </Link>
        </>
      )}

      {/* Next */}
      {page < totalPages ? (
        <Link href={buildHref(page + 1, cari, kategori)} className="page-btn" aria-label="Halaman berikutnya">
          <i className="fa-solid fa-chevron-right text-xs" />
        </Link>
      ) : (
        <span className="page-btn disabled" aria-disabled="true">
          <i className="fa-solid fa-chevron-right text-xs" />
        </span>
      )}

      <div className="w-full text-center mt-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong> &middot; {totalRows} artikel
        </p>
      </div>
    </nav>
  );
}
