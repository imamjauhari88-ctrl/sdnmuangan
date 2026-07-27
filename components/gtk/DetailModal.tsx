import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ParsedGTKMember, Berkas } from './types';
import { getColorMap, getBerkasIcon } from './constants';

interface DetailModalProps {
  selectedGtk: ParsedGTKMember | null;
  onClose: () => void;
}

export default function DetailModal({ selectedGtk, onClose }: DetailModalProps) {
  const [mounted, setMounted] = useState(false);

  // Portal butuh document, jadi baru tersedia setelah mount di client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = selectedGtk ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedGtk]);

  if (!selectedGtk || !mounted) return null;

  const c = getColorMap(selectedGtk.warna);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[9990] bg-black/65 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-7 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto card-animate"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
          aria-label="Tutup detail"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Header info */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white dark:border-slate-700 shadow-xl bg-gray-100">
            <Image
              src={selectedGtk._path}
              alt={`Foto ${selectedGtk.nama}`}
              fill
              sizes="96px"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const el = e.currentTarget.nextElementSibling as HTMLElement;
                if (el) el.style.display = 'flex';
              }}
            />
            <div className="avatar-local" style={{ '--av-from': c.from, '--av-to': c.to, display: 'none', fontSize: '1.5rem' } as React.CSSProperties}>
              {selectedGtk._inisial}
            </div>
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-1">{selectedGtk.nama}</h2>
          <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${c.badge}`}>
            {selectedGtk.jabatan}
          </span>
        </div>

        {/* List Detail */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <i className="fa-solid fa-graduation-cap text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pendidikan</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">{selectedGtk.pendidikan}</p>
            </div>
          </div>

          {selectedGtk.wa && (
            <div>
              <a
                href={`https://wa.me/${selectedGtk.wa.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(selectedGtk.jabatan)}%20${encodeURIComponent(selectedGtk.nama)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-100/50 dark:border-green-900/50 rounded-xl transition-colors w-full"
              >
                <i className="fa-brands fa-whatsapp text-green-500 text-xl flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">WhatsApp</p>
                  <p className="text-sm text-green-700 dark:text-green-400 font-bold">{selectedGtk.wa}</p>
                </div>
              </a>
            </div>
          )}

          {selectedGtk._berkas && selectedGtk._berkas.length > 0 && (
            <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <i className="fa-brands fa-google-drive text-blue-500" />
                Berkas &amp; Perangkat Ajar
              </p>
              <div className="space-y-1.5">
                {selectedGtk._berkas.map((b: Berkas, bIdx: number) => {
                  const bIcon = getBerkasIcon(b.label);
                  return (
                    <a
                      key={bIdx}
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="berkas-item"
                    >
                      <i className={`fa-solid ${bIcon.icon} ${bIcon.color} text-sm flex-shrink-0`} />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex-1 truncate">{b.label}</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-gray-300 dark:text-gray-500 text-xs flex-shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}