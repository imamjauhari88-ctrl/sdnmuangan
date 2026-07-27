"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AgendaKalenderItem } from "@/lib/data/berita";
import type { HariLibur } from "@/lib/types/database";

interface KalenderAgendaInlineProps {
  visible: boolean;
  agenda: AgendaKalenderItem[];
  hariLibur: Pick<HariLibur, "tanggal" | "nama">[];
}

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const NAMA_HARI_PENDEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function KalenderAgendaInline({ visible, agenda, hariLibur }: KalenderAgendaInlineProps) {
  const today = useMemo(() => new Date(), []);

  const initial = useMemo(() => {
    const todayIso = today.toISOString().slice(0, 10);
    const mendatang = agenda.find((a) => a.tanggal >= todayIso);
    if (mendatang) {
      const [y, m] = mendatang.tanggal.split("-");
      return { year: parseInt(y, 10), month: parseInt(m, 10) - 1 };
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  }, [agenda, today]);

  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const agendaByDate = useMemo(() => {
    const map: Record<string, AgendaKalenderItem[]> = {};
    for (const a of agenda) {
      (map[a.tanggal] ??= []).push(a);
    }
    return map;
  }, [agenda]);

  const liburByDate = useMemo(() => {
    const map: Record<string, string> = {};
    for (const h of hariLibur) {
      map[h.tanggal] = h.nama;
    }
    return map;
  }, [hariLibur]);

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const calendarCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

    const cells: { day: number; isCurrentMonth: boolean; key: string }[] = [];

    for (let i = startWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      cells.push({ day, isCurrentMonth: false, key: toDateKey(prevYear, prevMonth, day) });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ day, isCurrentMonth: true, key: toDateKey(viewYear, viewMonth, day) });
    }
    let nextDay = 1;
    while (cells.length < 42) {
      cells.push({ day: nextDay, isCurrentMonth: false, key: toDateKey(nextYear, nextMonth, nextDay) });
      nextDay++;
    }

    return cells;
  }, [viewYear, viewMonth]);

  const bulanIniGabungan = useMemo(() => {
    const list: { tanggal: string; tipe: "agenda" | "libur"; nama: string; id?: string }[] = [];

    for (const a of agenda) {
      const [y, m] = a.tanggal.split("-");
      if (parseInt(y, 10) === viewYear && parseInt(m, 10) - 1 === viewMonth) {
        list.push({ tanggal: a.tanggal, tipe: "agenda", nama: a.judul, id: String(a.id) });
      }
    }

    for (const h of hariLibur) {
      const [y, m] = h.tanggal.split("-");
      if (parseInt(y, 10) === viewYear && parseInt(m, 10) - 1 === viewMonth) {
        list.push({ tanggal: h.tanggal, tipe: "libur", nama: h.nama });
      }
    }

    return list.sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  }, [agenda, hariLibur, viewYear, viewMonth]);

  if (!visible) return null;

  function goPrevMonth() {
    setSelectedDate(null);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goNextMonth() {
    setSelectedDate(null);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const selectedAgenda = selectedDate ? agendaByDate[selectedDate] ?? [] : [];
  const selectedLibur = selectedDate ? liburByDate[selectedDate] : undefined;
  const selectedLabel = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* KIRI: Kalender Visual */}
        <div className="lg:col-span-2 bg-white border border-gray-200 dark:bg-[#1a2332] dark:border-slate-700/40 shadow-sm dark:shadow-xl rounded-2xl overflow-hidden">
          
          {/* Header Kalender */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-slate-700/40 bg-gray-50/50 dark:bg-[#1e293b]/20">
            <button
              onClick={goPrevMonth}
              aria-label="Bulan sebelumnya"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-[#202938] dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-[#2b374a] transition"
            >
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <div className="text-center">
              <div className="font-extrabold text-gray-800 dark:text-white text-base tracking-wide leading-tight">
                {NAMA_BULAN[viewMonth]} {viewYear}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-slate-400">Klik tanggal untuk lihat agenda</div>
            </div>
            <button
              onClick={goNextMonth}
              aria-label="Bulan berikutnya"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-[#202938] dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-[#2b374a] transition"
            >
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>

          {/* Grid Tanggal */}
          <div className="px-5 pb-3 pt-3">
            {/* Header Nama Hari */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {NAMA_HARI_PENDEK.map((h, i) => (
                <div
                  key={h}
                  className={`text-center text-[10px] font-black uppercase tracking-wider py-1 ${
                    i === 0 ? "text-red-500" : "text-gray-400 dark:text-slate-400"
                  }`}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Cell Tanggal */}
            <div className="grid grid-cols-7 gap-x-1 gap-y-1.5">
              {calendarCells.map((cell, idx) => {
                if (!cell.isCurrentMonth) {
                  return <div key={idx} className="h-8" />;
                }

                const isToday = cell.key === todayKey;
                const isSelected = cell.key === selectedDate;
                const isPast = cell.key < todayKey;
                const hasAgenda = Boolean(agendaByDate[cell.key]?.length);
                const hasLibur = Boolean(liburByDate[cell.key]);
                const isSunday = idx % 7 === 0;

                let cellClass = "text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700/30";
                let dotClass = "";

                if (isToday) {
                  cellClass = "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/10 dark:bg-[#5046e5] dark:text-white dark:hover:bg-[#4338ca] dark:shadow-indigo-500/20";
                } else if (hasLibur) {
                  cellClass = "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-[#221c17] dark:border-[#4a3520] dark:text-amber-500 dark:hover:bg-[#34271a]";
                  dotClass = "bg-amber-500 dark:bg-amber-400";
                } else if (hasAgenda) {
                  cellClass = "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-[#14231c] dark:border-[#1f3a2b] dark:text-emerald-400 dark:hover:bg-[#1a2f23]";
                  dotClass = "bg-emerald-500";
                } else if (isSunday) {
                  cellClass = "text-red-500 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-slate-700/30";
                } else if (isPast) {
                  cellClass = "text-gray-400 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700/30";
                }

                if (isSelected && !isToday) {
                  cellClass += " ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-[#1a2332]";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(isSelected ? null : cell.key)}
                    aria-label={`Tanggal ${cell.day}`}
                    aria-pressed={isSelected}
                    className={`relative h-8 w-full rounded-lg flex flex-col items-center justify-center text-[11px] md:text-xs font-bold transition-all ${cellClass}`}
                  >
                    <span className="leading-none">{cell.day}</span>
                    {dotClass && (
                      <span className={`w-1 h-1 rounded-full mt-0.5 ${isToday ? "bg-white" : dotClass}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend Indikator (Footer) */}
          <div className="px-5 py-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-200 dark:border-slate-700/40 bg-gray-50/50 dark:bg-[#1e293b]/10">
            <div className="flex items-center gap-1.5 text-[9.5px] text-gray-500 dark:text-slate-400 font-extrabold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ada Agenda
            </div>
            <div className="flex items-center gap-1.5 text-[9.5px] text-gray-500 dark:text-slate-400 font-extrabold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-[#5046e5]" /> Hari Ini
            </div>
            <div className="flex items-center gap-1.5 text-[9.5px] text-gray-500 dark:text-slate-400 font-extrabold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" /> Libur Nasional
            </div>
            <div className="flex items-center gap-1.5 text-[9.5px] text-gray-500 dark:text-slate-400 font-extrabold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Sudah Lewat
            </div>
          </div>
        </div>

        {/* KANAN: Panel Detail Agenda */}
        <div className="bg-white border border-gray-200 dark:bg-[#1a2332] dark:border-slate-700/40 shadow-sm dark:shadow-xl p-5 lg:sticky lg:top-24 rounded-2xl">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-slate-700/30">
                <h3 className="text-xs font-black text-gray-700 dark:text-slate-300 flex items-center gap-2">
                  <i className="fa-solid fa-calendar-day text-emerald-500" />
                  <span>{selectedLabel}</span>
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 flex items-center justify-center transition text-xs"
                  aria-label="Tutup detail"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div className="space-y-3">
                {selectedLibur && (
                  <div className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-[#221c17] dark:border-[#443022] transition group">
                    <div className="w-12 h-12 rounded-lg bg-amber-600 dark:bg-[#d97706] text-white flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-base font-black leading-none">
                        {new Date(selectedDate + "T00:00:00").getDate()}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
                        {NAMA_BULAN[new Date(selectedDate + "T00:00:00").getMonth()].slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-amber-800 dark:text-[#f59e0b] leading-tight group-hover:text-amber-900 dark:group-hover:text-amber-400 transition">
                        {selectedLibur}
                      </h4>
                      <p className="text-[11px] text-amber-600 dark:text-amber-600/80 font-semibold mt-1">Hari Libur Nasional</p>
                    </div>
                  </div>
                )}

                {selectedAgenda.length > 0 ? (
                  selectedAgenda.map((a) => (
                    <Link
                      key={a.id}
                      href={`/berita/${a.id}`}
                      className="flex gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/50 dark:bg-[#14231c] dark:border-[#1f3a2b] dark:hover:bg-[#1a2f23] transition group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-base font-black leading-none">
                          {new Date(a.tanggal + "T00:00:00").getDate()}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
                          {NAMA_BULAN[new Date(a.tanggal + "T00:00:00").getMonth()].slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 leading-tight group-hover:text-emerald-900 dark:group-hover:text-emerald-300 transition line-clamp-2">
                          {a.judul}
                        </h4>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-600/80 font-semibold mt-1">Agenda Sekolah</p>
                      </div>
                    </Link>
                  ))
                ) : !selectedLibur ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-4">
                    Tidak ada agenda pada tanggal ini.
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-sm font-black text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <i className="fa-regular fa-calendar text-emerald-500" />
                <span>Agenda {NAMA_BULAN[viewMonth]} {viewYear}</span>
              </h3>

              <div className="space-y-3">
                {bulanIniGabungan.length > 0 ? (
                  bulanIniGabungan.map((item, idx) => {
                    const d = new Date(item.tanggal + "T00:00:00");
                    const dayNumber = d.getDate();
                    const monthNameShort = NAMA_BULAN[d.getMonth()].slice(0, 3).toUpperCase();

                    if (item.tipe === "libur") {
                      return (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-[#221c17] dark:border-[#443022] transition group">
                          <div className="w-12 h-12 rounded-lg bg-amber-600 dark:bg-[#d97706] text-white flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-base font-black leading-none">{dayNumber}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{monthNameShort}</span>
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="text-sm font-bold text-amber-800 dark:text-[#f59e0b] leading-tight group-hover:text-amber-900 dark:group-hover:text-amber-400 transition">
                              {item.nama}
                            </h4>
                            <p className="text-[11px] text-amber-600 dark:text-amber-600/80 font-semibold mt-1">Hari Libur Nasional</p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <Link
                          key={item.id}
                          href={`/berita/${item.id}`}
                          className="flex gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/50 dark:bg-[#14231c] dark:border-[#1f3a2b] dark:hover:bg-[#1a2f23] transition group"
                        >
                          <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-base font-black leading-none">{dayNumber}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{monthNameShort}</span>
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 leading-tight group-hover:text-emerald-900 dark:group-hover:text-emerald-300 transition line-clamp-2">
                              {item.nama}
                            </h4>
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-600/80 font-semibold mt-1">Agenda Sekolah</p>
                          </div>
                        </Link>
                      );
                    }
                  })
                ) : (
                  <p className="text-xs text-gray-400 dark:text-slate-500 italic text-center py-4">
                    Tidak ada agenda di bulan ini.
                  </p>
                )}
              </div>

              <Link
                href="/agenda"
                className="mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-600/30 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-[#14231c] text-xs font-bold transition w-full"
              >
                <span>Lihat Semua Agenda</span>
                <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
            </>
          )}
        </div>

      </div>
    </div>
  );
}