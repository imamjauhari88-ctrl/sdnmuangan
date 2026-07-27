"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AgendaItem } from "@/lib/data/beranda";
import type { HariLibur } from "@/lib/types/database";

interface KalenderBulananProps {
  agenda: AgendaItem[];
  hariLibur: Pick<HariLibur, "tanggal" | "nama">[];
}

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const BULAN_SINGKAT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const NAMA_HARI_PENDEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

interface DayEvent {
  type: "agenda" | "libur";
  nama: string;
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function KalenderBulanan({ agenda, hariLibur }: KalenderBulananProps) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

// Dedup hari libur: kalau 1 tanggal punya lebih dari 1 entri (biasanya
  // hasil sync ganda EN + ID dari Google Calendar), pertahankan yang
  // TERAKHIR saja — berdasarkan urutan data, versi Bahasa Indonesia selalu
  // ada di belakang versi Inggrisnya.
  const hariLiburDedup = useMemo(() => {
    const map = new Map<string, Pick<HariLibur, "tanggal" | "nama">>();
    for (const h of hariLibur) {
      map.set(h.tanggal.slice(0, 10), h);
    }
    return Array.from(map.values());
  }, [hariLibur]);

  // Map tanggal -> daftar event (agenda + libur), key format YYYY-MM-DD
  const eventMap = useMemo(() => {
    const map: Record<string, DayEvent[]> = {};
    for (const a of agenda) {
      if (!a.tanggal) continue;
      const key = a.tanggal.slice(0, 10);
      (map[key] ??= []).push({ type: "agenda", nama: a.judul });
    }
    for (const h of hariLiburDedup) {          // ← ganti dari hariLibur
      const key = h.tanggal.slice(0, 10);
      (map[key] ??= []).push({ type: "libur", nama: h.nama });
    }
    return map;
  }, [agenda, hariLiburDedup]);                // ← ganti dependency-nya juga

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const calendarCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstDay.getDay(); // 0 = Minggu
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

    const cells: { day: number; isCurrentMonth: boolean; key: string }[] = [];

    // Tanggal sisa dari bulan sebelumnya (pengisi awal grid)
    for (let i = startWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      cells.push({ day, isCurrentMonth: false, key: toDateKey(prevYear, prevMonth, day) });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ day, isCurrentMonth: true, key: toDateKey(viewYear, viewMonth, day) });
    }

    // Sisa grid dinamis ke kelipatan 7 berikutnya (bisa 35 sel / 5 baris atau 42 sel / 6 baris)
    const totalRequiredCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;
    let nextDay = 1;
    while (cells.length < totalRequiredCells) {
      cells.push({ day: nextDay, isCurrentMonth: false, key: toDateKey(nextYear, nextMonth, nextDay) });
      nextDay++;
    }

    return cells;
  }, [viewYear, viewMonth]);

  // Semua event pada bulan aktif
  const activeMonthEvents = useMemo(() => {
    const list: { day: number; monthShort: string; type: "agenda" | "libur"; nama: string; key: string }[] = [];
    
    for (const a of agenda) {
      if (!a.tanggal) continue;
      const d = new Date(a.tanggal + "T00:00:00");
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        list.push({
          day: d.getDate(),
          monthShort: BULAN_SINGKAT[viewMonth].toUpperCase(),
          type: "agenda",
          nama: a.judul,
          key: a.tanggal.slice(0, 10),
        });
      }
    }

    for (const h of hariLiburDedup) {          // ← ganti dari hariLibur
      const d = new Date(h.tanggal + "T00:00:00");
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        list.push({
          day: d.getDate(),
          monthShort: BULAN_SINGKAT[viewMonth].toUpperCase(),
          type: "libur",
          nama: h.nama,
          key: h.tanggal.slice(0, 10),
        });
      }
    }

    return list.sort((a, b) => a.day - b.day);
  }, [agenda, hariLiburDedup, viewMonth, viewYear]);   // ← ganti dependency-nya juga

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

  const selectedEvents = selectedDate ? eventMap[selectedDate] ?? [] : [];
  const selectedDateLabel = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section
      className="py-10 sm:py-12 bg-slate-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
      aria-label="Kalender akademik sekolah"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Title & Badge Header ── */}
        <div className="text-center mb-6">
          <span
            className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-4 py-2 rounded-full inline-block mb-2"
            aria-hidden="true"
          >
            📅 KALENDER SEKOLAH
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white leading-tight">
            Kalender Akademik
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
            Agenda kegiatan dan hari libur nasional
          </p>
          <div className="h-0.5 w-12 bg-emerald-500 mx-auto rounded-full mt-2" />
        </div>

        {/* ── Container Grid Utama (2 Kolom di Desktop) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          
          {/* Kolom Kiri: Kartu Kalender Bulanan */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden card-animate">
            
            {/* Navigasi Bulan / Header Kalender */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 px-5 py-3 flex items-center justify-between border-b border-emerald-100/50 dark:border-emerald-900/20">
              <button
                onClick={goPrevMonth}
                aria-label="Bulan sebelumnya"
                className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-all cursor-pointer"
              >
                <i className="fa-solid fa-chevron-left text-[10px]" />
              </button>
              
              <div className="text-center">
                <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white leading-tight">
                  {NAMA_BULAN[viewMonth]} {viewYear}
                </h3>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                  Klik tanggal untuk lihat detail
                </p>
              </div>

              <button
                onClick={goNextMonth}
                aria-label="Bulan berikutnya"
                className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-all cursor-pointer"
              >
                <i className="fa-solid fa-chevron-right text-[10px]" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              {/* Nama Hari */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {NAMA_HARI_PENDEK.map((h, i) => (
                  <div
                    key={h}
                    className={`text-center text-[10px] sm:text-xs font-black uppercase py-1 ${
                      i === 0 ? "text-red-500" : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Grid Angka Tanggal */}
              <div className="grid grid-cols-7 gap-1" role="group" aria-label="Kalender tanggal">
                {calendarCells.map((cell, idx) => {
                  const events = eventMap[cell.key] ?? [];
                  const isToday = cell.key === todayKey;
                  const isSelected = cell.key === selectedDate;
                  const hasLibur = events.some((e) => e.type === "libur");
                  const hasAgenda = events.some((e) => e.type === "agenda");

                  // ✅ PERBAIKAN: Gunakan tinggi tetap h-9 / h-10 untuk sel kosong agar baris tidak melar
                  if (!cell.isCurrentMonth) {
                    return <div key={idx} className="h-9 sm:h-10 w-full" />;
                  }

                  const cellDate = new Date(cell.key + "T00:00:00");
                  const isSunday = cellDate.getDay() === 0;

                  // ✅ PERBAIKAN: Gunakan h-9 / h-10 yang konsisten untuk semua tombol tanggal aktif
                  let dateStyles = "relative h-9 sm:h-10 w-full rounded-xl flex flex-col items-center justify-center text-xs sm:text-sm font-black transition-all cursor-pointer ";
                  
                  if (isSelected) {
                    dateStyles += "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none hover:bg-indigo-600";
                  } else if (isToday) {
                    dateStyles += "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/30";
                  } else if (hasLibur) {
                    dateStyles += "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100/70";
                  } else {
                    dateStyles += `${isSunday ? "text-red-500" : "text-gray-700 dark:text-gray-300"} hover:bg-gray-100/70 dark:hover:bg-gray-800/50`;
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(cell.key)}
                      className={dateStyles}
                      aria-label={`Tanggal ${cell.day}`}
                    >
                      <span className="leading-none">{cell.day}</span>
                      
                      {/* Indikator titik di bawah angka */}
                      {(hasAgenda || hasLibur) && (
                        <span className="absolute bottom-1 sm:bottom-1.5 flex gap-0.5 justify-center" aria-hidden="true">
                          {hasLibur && (
                            <span className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-amber-500"}`} />
                          )}
                          {hasAgenda && (
                            <span className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`} />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legenda (Mencocokkan Gambar) */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 text-[9px] sm:text-[10px] font-bold text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Agenda
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Libur Nasional
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> Hari Ini
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Lewat
                </span>
              </div>

            </div>
          </div>

          {/* Kolom Kanan: Daftar Detail / Hari Libur */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 sm:p-5 card-animate">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-800 pb-2.5">
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-calendar-day text-emerald-500 text-xs" />
                <h3 className="text-[10px] sm:text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  {selectedDate ? `Detail: ${selectedDateLabel}` : `Agenda ${NAMA_BULAN[viewMonth]} ${viewYear}`}
                </h3>
              </div>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Lihat Semua
                </button>
              )}
            </div>

            {/* Jika ada Tanggal Terpilih */}
            {selectedDate ? (
              <div className="space-y-2 min-h-[140px]">
                {selectedEvents.length > 0 ? (
                  selectedEvents.map((ev, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2.5 p-2.5 rounded-2xl border ${
                        ev.type === "libur"
                          ? "bg-amber-50/50 border-amber-100/60 dark:bg-amber-950/10 dark:border-amber-900/30 text-amber-700 dark:text-amber-400"
                          : "bg-emerald-50/50 border-emerald-100/60 dark:bg-emerald-950/10 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      }`}
                    >
                      <i className={`fa-solid mt-0.5 text-[10px] ${ev.type === "libur" ? "fa-circle-exclamation" : "fa-calendar-check"}`} />
                      <div className="flex-1">
                        <p className="text-xs font-black leading-tight text-gray-800 dark:text-gray-200">{ev.nama}</p>
                        <p className="text-[8px] font-bold mt-0.5 uppercase tracking-wider opacity-85">
                          {ev.type === "libur" ? "Hari Libur Nasional" : "Agenda Kegiatan"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <i className="fa-regular fa-calendar-minus text-2xl text-gray-300 dark:text-gray-600 mb-1.5" />
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 italic">Tidak ada agenda pada tanggal ini</p>
                  </div>
                )}
              </div>
            ) : (
              /* Menampilkan Semua Kegiatan Bulan Ini Secara Default */
              <div className="space-y-2.5 min-h-[160px]">
                {activeMonthEvents.length > 0 ? (
                  activeMonthEvents.slice(0, 4).map((ev, i) => (
                    <div
                      key={i}
                      className={`flex items-stretch gap-3 p-2.5 rounded-2xl border transition-all ${
                        ev.type === "libur"
                          ? "bg-amber-50/50 border-amber-100/60 dark:bg-amber-950/10 dark:border-amber-900/30"
                          : "bg-emerald-50/50 border-emerald-100/60 dark:bg-emerald-950/10 dark:border-emerald-900/30"
                      }`}
                    >
                      {/* Badge Tanggal */}
                      <div
                        className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl text-center min-w-[44px] ${
                          ev.type === "libur"
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        <span className="text-sm font-black leading-none">{ev.day}</span>
                        <span className="text-[8px] font-black uppercase mt-0.5 tracking-wider">{ev.monthShort}</span>
                      </div>

                      {/* Detail Informasi */}
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h4 className="text-xs font-black text-gray-800 dark:text-gray-200 leading-tight line-clamp-2">
                          {ev.nama}
                        </h4>
                        <p
                          className={`text-[8px] font-black mt-0.5 uppercase tracking-wider ${
                            ev.type === "libur" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {ev.type === "libur" ? "Hari Libur Nasional" : "Agenda Kegiatan"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <i className="fa-regular fa-calendar-xmark text-3xl text-gray-300 dark:text-gray-600 mb-1.5" />
                    <p className="text-xs text-gray-400 dark:text-gray-500 italic">Tidak ada agenda bulan ini</p>
                  </div>
                )}
              </div>
            )}

            {/* Tombol Lihat Semua di bagian bawah */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800">
              <Link
                href="/berita?kategori=agenda#berita-section"
                className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-black transition-colors"
              >
                Lihat Semua Agenda <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}