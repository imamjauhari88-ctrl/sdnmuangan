"use client";

import { useEffect } from "react";

/**
 * Error boundary paling luar (root). Menangkap error yang TIDAK
 * tertangkap oleh app/(public)/error.tsx — spesifiknya error yang
 * terjadi di app/(public)/layout.tsx itu sendiri (mis. getPengaturan()
 * di layout gagal total), karena error.tsx sebuah segment tidak
 * menangkap error dari layout.tsx di segment YANG SAMA, hanya dari
 * children di bawahnya.
 *
 * Sengaja dibuat SANGAT sederhana & mandiri (tanpa Navbar/Footer, tanpa
 * fetch data) — ini "jaring pengaman terakhir", harus tetap bisa
 * tampil walau database/pengaturan situs lagi bermasalah total.
 *
 * root error.tsx WAJIB me-render tag <html>/<body> sendiri, karena ini
 * menggantikan RootLayout yang mungkin ikut gagal.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="id">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
              background: "#fff",
              borderRadius: 24,
              border: "1px solid #f1f5f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              padding: "2.5rem 2rem",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#1e293b", margin: "0 0 8px" }}>
              Situs Sedang Bermasalah
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 24px" }}>
              Terjadi kesalahan yang gak biasa. Silakan coba muat ulang
              beberapa saat lagi.
            </p>
            <button
              onClick={reset}
              style={{
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
              }}
            >
              Coba Lagi
            </button>
            {error.digest && (
              <p style={{ marginTop: 20, fontSize: 11, color: "#cbd5e1", fontFamily: "monospace" }}>
                Kode referensi: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
