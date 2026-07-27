import Link from "next/link";

interface PendaftarPaginationProps {
  page: number;
  totalPages: number;
  totalRows: number;
  cari: string;
  status: string;
}

function buildHref(page: number, cari: string, status: string): string {
  const params = new URLSearchParams();
  if (cari) params.set("cari", cari);
  if (status && status !== "semua") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/admin/ppdb/pendaftar${qs ? `?${qs}` : ""}`;
}

export default function PendaftarPagination({ page, totalPages, totalRows, cari, status }: PendaftarPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong> &middot; {totalRows} data
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={buildHref(page - 1, cari, status)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300 transition"
          >
            <i className="fa-solid fa-chevron-left text-[10px]" />
          </Link>
        ) : (
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600">
            <i className="fa-solid fa-chevron-left text-[10px]" />
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={buildHref(page + 1, cari, status)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300 transition"
          >
            <i className="fa-solid fa-chevron-right text-[10px]" />
          </Link>
        ) : (
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600">
            <i className="fa-solid fa-chevron-right text-[10px]" />
          </span>
        )}
      </div>
    </div>
  );
}
