"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface LoadingScreenProps {
  namaSekolah: string;
  logoUrl: string;
}

/**
 * Loading screen dengan animasi nama sekolah muncul huruf-per-huruf,
 * porting persis dari blok <script> di awal index.php versi lama.
 *
 * Font-size responsif berdasarkan panjang nama sekolah (logic asli
 * dipertahankan: <=15 / <=22 / <=30 / lainnya).
 *
 * Dirender lewat portal ke document.body (sama seperti modal detail
 * Fasilitas & Ekstrakurikuler) supaya "fixed" benar-benar relatif ke
 * viewport, tidak kena efek transform dari .page-transition
 * (app/(public)/template.tsx) yang bikin elemen fixed di dalamnya
 * jadi "terjebak" relatif ke div itu, bukan ke layar.
 */
function getFontSizes(namaLen: number): { desktop: string; mobile: string } {
  if (namaLen <= 15) return { desktop: "32px", mobile: "24px" };
  if (namaLen <= 22) return { desktop: "26px", mobile: "20px" };
  if (namaLen <= 30) return { desktop: "22px", mobile: "16px" };
  return { desktop: "18px", mobile: "13px" };
}

function getLetterColor(i: number, total: number): string {
  const pct = i / total;
  if (pct < 0.25) return "#93c5fd";
  if (pct < 0.5) return "#60a5fa";
  if (pct < 0.85) return "#2563eb";
  return "#1d4ed8";
}

export default function LoadingScreen({ namaSekolah, logoUrl }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [removed, setRemoved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  // Portal butuh document, jadi baru tersedia setelah mount di client
  useEffect(() => {
    setMounted(true);
  }, []);

  const fontSizes = getFontSizes(namaSekolah.length);
  const letters = namaSekolah.split("");

  useEffect(() => {
    // Hitung durasi animasi dinamis: delay huruf terakhir + 0.4s animasi + 0.8s jeda,
    // minimal 2 detik (logic asli)
    const lastDelay = 0.3 + (letters.length - 1) * 0.07;
    const totalDuration = Math.round((lastDelay + 0.4 + 0.8) * 1000);
    const waitMs = Math.max(totalDuration, 2000);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      const removeTimer = setTimeout(() => setRemoved(true), 650);
      return () => clearTimeout(removeTimer);
    }, waitMs);

    return () => clearTimeout(hideTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (removed || !mounted) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(37,99,235,0.05)",
          top: -80,
          left: -80,
          animation: "lsBlob 9s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "rgba(14,165,233,0.05)",
          bottom: -60,
          right: -60,
          animation: "lsBlob 11s ease-in-out infinite reverse",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          position: "relative",
          zIndex: 2,
          width: "100%",
          padding: "0 20px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt="Logo Sekolah"
          style={{
            width: 64,
            height: 64,
            objectFit: "contain",
            borderRadius: 14,
            opacity: 0,
            animation: "lsPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s forwards",
          }}
        />

        <div
          ref={rowRef}
          style={{
            display: "flex",
            alignItems: "baseline",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 0,
            maxWidth: "100%",
            textAlign: "center",
          }}
        >
          {letters.map((ch, i) => {
            const delay = 0.3 + i * 0.07;
            const isSpace = ch === " ";
            return (
              <span
                key={i}
                className="ls-letter"
                style={{
                  fontFamily: "sans-serif",
                  fontWeight: 800,
                  letterSpacing: "0.10em",
                  opacity: 0,
                  display: "inline-block",
                  width: isSpace ? "0.4em" : undefined,
                  color: isSpace ? undefined : getLetterColor(i, letters.length),
                  animation: `lsLetterIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards`,
                }}
              >
                {isSpace ? "\u00A0" : ch}
              </span>
            );
          })}
        </div>

        <div
          style={{
            width: 160,
            height: 3,
            background: "#e2e8f0",
            borderRadius: 99,
            overflow: "hidden",
            opacity: 0,
            animation: "lsFadeUp 0.4s ease 2.2s forwards",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "0%",
              background: "linear-gradient(90deg,#2563eb,#38bdf8)",
              borderRadius: 99,
              animation: "lsBar 2s ease 2.4s forwards",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            opacity: 0,
            animation: "lsFadeUp 0.4s ease 2.3s forwards",
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#bfdbfe",
              animation: "lsDot 1.2s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#93c5fd",
              animation: "lsDot 1.2s ease-in-out 0.2s infinite",
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#60a5fa",
              animation: "lsDot 1.2s ease-in-out 0.4s infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes lsBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(16px, -16px) scale(1.07); }
        }
        @keyframes lsPop {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes lsLetterIn {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes lsFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lsBar {
          0% { width: 0%; }
          60% { width: 75%; }
          100% { width: 100%; }
        }
        @keyframes lsDot {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.6); opacity: 1; }
        }
        .ls-letter {
          font-size: ${fontSizes.desktop} !important;
        }
        @media (max-width: 640px) {
          .ls-letter {
            font-size: ${fontSizes.mobile} !important;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
