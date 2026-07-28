"use client";

import { useState } from "react";
import FasilitasPreview from "./FasilitasPreview";
import Ekstrakurikuler from "./Ekstrakurikuler";
import type { FasilitasPreviewItem, EkskulWithPreview } from "@/lib/data/beranda";

interface FasilitasEkskulProps {
  fasilitasList: FasilitasPreviewItem[];
  ekskulList: EkskulWithPreview[];
}

type Tab = "fasilitas" | "ekskul";

/**
 * Gabungan section "Fasilitas" dan "Ekstrakurikuler" — sebelumnya dua
 * section terpisah yang isinya sama-sama tentang "kehidupan di sekolah".
 * Sekarang satu section dengan tab switch, mengurangi jumlah section
 * di beranda tanpa menghilangkan informasi.
 */
export default function FasilitasEkskul({ fasilitasList, ekskulList }: FasilitasEkskulProps) {
  const adaFasilitas = fasilitasList.length > 0;
  const adaEkskul = ekskulList.length > 0;

  const [tab, setTab] = useState<Tab>(adaFasilitas ? "fasilitas" : "ekskul");

  if (!adaFasilitas && !adaEkskul) return null;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    ...(adaFasilitas ? [{ key: "fasilitas" as Tab, label: "Fasilitas", icon: "fa-school-flag" }] : []),
    ...(adaEkskul ? [{ key: "ekskul" as Tab, label: "Ekstrakurikuler", icon: "fa-palette" }] : []),
  ];

  return (
    <section
      className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
      aria-label="Fasilitas dan ekstrakurikuler sekolah"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span
            className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-full inline-block mb-3"
            aria-hidden="true"
          >
            🏫 Kehidupan di Sekolah
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 dark:text-white">
            Fasilitas &amp; Ekstrakurikuler
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-teal-500 to-cyan-400 mx-auto rounded-full mt-3" />
        </div>

        {tabs.length > 1 && (
          <div className="flex justify-center gap-2 mb-10" role="tablist" aria-label="Pilih kategori">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`tab-btn ${tab === t.key ? "active" : ""}`}
              >
                <i className={`fa-solid ${t.icon} mr-1.5`} aria-hidden="true" />
                {t.label}
              </button>
            ))}
          </div>
        )}

        {tab === "fasilitas" && adaFasilitas && <FasilitasPreview fasilitasList={fasilitasList} />}
        {tab === "ekskul" && adaEkskul && <Ekstrakurikuler ekskulList={ekskulList} />}
      </div>
    </section>
  );
}
