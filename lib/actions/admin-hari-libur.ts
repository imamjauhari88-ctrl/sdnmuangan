"use server";

import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { parseIcsEvents } from "@/lib/utils/ics-parser";
import type { HariLibur, HariLiburJenis } from "@/lib/types/database";

export interface HariLiburActionResult {
  success: boolean;
  message: string;
}

export interface HariLiburFormInput {
  tanggal: string;
  nama: string;
  deskripsi: string;
  jenis: HariLiburJenis;
  aktif: boolean;
}

function validateHariLiburInput(input: HariLiburFormInput): string | null {
  if (!input.tanggal) return "Tanggal wajib diisi.";
  if (!input.nama.trim()) return "Nama hari libur wajib diisi.";
  return null;
}

function revalidateHariLiburPaths() {
  revalidatePath("/admin/hari-libur");
  revalidatePath("/"); // kalender beranda menampilkan hari libur
  revalidatePath("/berita"); // kalender agenda di tab Agenda
}

/**
 * Tambah hari libur SECARA MANUAL. Field `sumber` selalu di-set 'manual'
 * di sini — hari libur hasil sinkronisasi Google Calendar (sumber='google_calendar')
 * hanya bisa muncul lewat proses sync terpisah (skrip/cron di luar admin
 * panel ini), bukan lewat form tambah manual, supaya tidak ada data
 * 'manual' yang menyamar sebagai hasil sync.
 */
export async function createHariLibur(input: HariLiburFormInput): Promise<HariLiburActionResult> {
  const validationError = validateHariLiburInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  const payload: Partial<HariLibur> = {
    tanggal: input.tanggal,
    nama: input.nama.trim(),
    deskripsi: input.deskripsi.trim() || null,
    jenis: input.jenis,
    sumber: "manual",
    aktif: input.aktif,
  };

  // Catatan: type assertion `as never` menghindari bug inference pada
  // @supabase/supabase-js@2.108 untuk Database type kustom — lihat catatan
  // detail di lib/actions/kontak.ts.
  const { error } = await supabase.from("hari_libur").insert([payload] as never);

  if (error) {
    console.error("Gagal menambah hari libur:", error.message);
    // Skema punya UNIQUE (tanggal, nama) — beri pesan yang jelas kalau
    // kombinasi itu sudah ada, bukan pesan generik "gagal menyimpan".
    if (error.code === "23505") {
      return { success: false, message: "Hari libur dengan tanggal dan nama yang sama sudah ada." };
    }
    return { success: false, message: "Gagal menyimpan hari libur." };
  }

  revalidateHariLiburPaths();
  return { success: true, message: "Hari libur berhasil ditambahkan." };
}

export async function updateHariLibur(
  id: number,
  input: HariLiburFormInput
): Promise<HariLiburActionResult> {
  const validationError = validateHariLiburInput(input);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const supabase = await createAuthServerClient();

  // sumber & gcal_id/gcal_link TIDAK diubah di sini — kalau baris ini hasil
  // sync Google Calendar, identitas sync-nya tetap dipertahankan walau
  // admin mengedit nama/deskripsi/jenis/status aktifnya secara manual.
  const payload: Partial<HariLibur> = {
    tanggal: input.tanggal,
    nama: input.nama.trim(),
    deskripsi: input.deskripsi.trim() || null,
    jenis: input.jenis,
    aktif: input.aktif,
  };

  const { error } = await supabase.from("hari_libur").update(payload as never).eq("id", id);

  if (error) {
    console.error("Gagal memperbarui hari libur:", error.message);
    if (error.code === "23505") {
      return { success: false, message: "Hari libur dengan tanggal dan nama yang sama sudah ada." };
    }
    return { success: false, message: "Gagal memperbarui hari libur." };
  }

  revalidateHariLiburPaths();
  return { success: true, message: "Hari libur berhasil diperbarui." };
}

export async function deleteHariLibur(id: number): Promise<HariLiburActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("hari_libur").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus hari libur:", error.message);
    return { success: false, message: "Gagal menghapus hari libur." };
  }

  revalidateHariLiburPaths();
  return { success: true, message: "Hari libur berhasil dihapus." };
}

/** Toggle aktif/non-aktif cepat dari tabel, tanpa buka form edit */
export async function toggleAktifHariLibur(id: number, aktif: boolean): Promise<HariLiburActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("hari_libur").update({ aktif } as never).eq("id", id);

  if (error) {
    console.error("Gagal mengubah status hari libur:", error.message);
    return { success: false, message: "Gagal mengubah status." };
  }

  revalidateHariLiburPaths();
  return { success: true, message: "Status berhasil diubah." };
}

/**
 * Feed publik "Hari Libur Nasional Indonesia" milik Google. Calendar ID
 * ini PENTING — sempat salah pakai ID lain di versi PHP lama dan hasilnya
 * cuma kebawa 25 baris (limit default tanpa pagination). Untuk feed .ics
 * publik tidak ada limit/pagination seperti itu, semua event langsung ada
 * dalam satu file.
 */
const GOOGLE_HOLIDAY_ICS_URL =
  "https://calendar.google.com/calendar/ical/en.indonesian.official%23holiday%40group.v.calendar.google.com/public/basic.ics";

export interface SyncGoogleCalendarResult {
  success: boolean;
  message: string;
  ditambah: number;
  diperbarui: number;
  dilewati: number;
}

/**
 * Sinkronisasi hari libur nasional dari Google Calendar (feed publik .ics,
 * tanpa perlu API key). Setara fitur sync di kelola_libur.php versi PHP lama.
 *
 * Strategi pencocokan baris lama vs baru pakai `gcal_id` (UID dari Google),
 * BUKAN tanggal+nama — supaya kalau Google mengubah nama suatu hari libur
 * (cth. redaksi "Cuti Bersama" berubah), baris yang sama tetap ter-update,
 * bukan malah dianggap baris baru.
 *
 * Insert dilakukan satu per satu (bukan bulk) supaya satu baris yang
 * konflik (cth. bentrok dengan entri manual di tanggal+nama yang sama,
 * UNIQUE constraint) tidak menggagalkan seluruh proses sync — baris lain
 * tetap lanjut tersimpan.
 */
export async function syncGoogleCalendarHariLibur(tahun: number): Promise<SyncGoogleCalendarResult> {
  let icsText: string;
  try {
    const res = await fetch(GOOGLE_HOLIDAY_ICS_URL, { cache: "no-store" });
    if (!res.ok) {
      return {
        success: false,
        message: `Gagal mengambil data dari Google Calendar (status ${res.status}).`,
        ditambah: 0,
        diperbarui: 0,
        dilewati: 0,
      };
    }
    icsText = await res.text();
  } catch (err) {
    console.error("Gagal fetch feed Google Calendar:", err);
    return {
      success: false,
      message: "Gagal terhubung ke Google Calendar. Periksa koneksi lalu coba lagi.",
      ditambah: 0,
      diperbarui: 0,
      dilewati: 0,
    };
  }

  const events = parseIcsEvents(icsText).filter((ev) => ev.dtstart.startsWith(String(tahun)));

  if (events.length === 0) {
    return {
      success: false,
      message: `Google Calendar tidak punya data hari libur untuk tahun ${tahun}.`,
      ditambah: 0,
      diperbarui: 0,
      dilewati: 0,
    };
  }

  const supabase = await createAuthServerClient();

  const { data: existingRows, error: fetchError } = await supabase
    .from("hari_libur")
    .select("id, gcal_id, tanggal, nama")
    .eq("sumber", "google_calendar")
    .gte("tanggal", `${tahun}-01-01`)
    .lte("tanggal", `${tahun}-12-31`);

  if (fetchError) {
    console.error("Gagal membaca data hari libur Google Calendar yang sudah ada:", fetchError.message);
    return {
      success: false,
      message: "Gagal membaca data hari libur yang sudah tersimpan.",
      ditambah: 0,
      diperbarui: 0,
      dilewati: 0,
    };
  }

  const existingByGcalId = new Map<string, { id: number; tanggal: string; nama: string }>();
  for (const row of (existingRows ?? []) as { id: number; gcal_id: string | null; tanggal: string; nama: string }[]) {
    if (row.gcal_id) existingByGcalId.set(row.gcal_id, row);
  }

  let ditambah = 0;
  let diperbarui = 0;
  let dilewati = 0;

  for (const ev of events) {
    const existing = existingByGcalId.get(ev.uid);

    if (existing) {
      if (existing.tanggal !== ev.dtstart || existing.nama !== ev.summary) {
        const { error } = await supabase
          .from("hari_libur")
          .update({ tanggal: ev.dtstart, nama: ev.summary } as never)
          .eq("id", existing.id);
        if (error) {
          console.error(`Gagal update hari libur sync id=${existing.id}:`, error.message);
        } else {
          diperbarui++;
        }
      }
      continue;
    }

    const payload: Partial<HariLibur> = {
      tanggal: ev.dtstart,
      nama: ev.summary,
      deskripsi: null,
      jenis: "nasional" as HariLiburJenis,
      sumber: "google_calendar",
      gcal_id: ev.uid,
      gcal_link: null,
      aktif: true,
    };

    const { error } = await supabase.from("hari_libur").insert([payload] as never);
    if (error) {
      // Kode 23505 = bentrok UNIQUE(tanggal, nama), kemungkinan besar baris
      // yang sama sudah ada sebagai entri manual — lewati, jangan dianggap gagal.
      if (error.code === "23505") {
        dilewati++;
      } else {
        console.error("Gagal menambah hari libur dari sync:", error.message);
      }
    } else {
      ditambah++;
    }
  }

  revalidateHariLiburPaths();

  const ringkasan = [
    ditambah > 0 ? `${ditambah} baru` : null,
    diperbarui > 0 ? `${diperbarui} diperbarui` : null,
    dilewati > 0 ? `${dilewati} dilewati (sudah ada)` : null,
  ].filter(Boolean);

  return {
    success: true,
    message:
      ringkasan.length > 0
        ? `Sinkron tahun ${tahun} selesai: ${ringkasan.join(", ")}.`
        : `Sinkron tahun ${tahun} selesai, tidak ada perubahan (data sudah terbaru).`,
    ditambah,
    diperbarui,
    dilewati,
  };
}
