/**
 * Parser .ics (iCalendar) minimal — cukup untuk membaca event dari feed
 * publik Google Calendar (https://calendar.google.com/calendar/ical/.../public/basic.ics).
 *
 * Sengaja ditulis manual tanpa library eksternal (cth: ical.js) karena
 * kebutuhannya sederhana: event hari libur itu semuanya all-day, tidak
 * berulang (no RRULE), jadi tidak perlu parser RFC 5545 yang lengkap.
 */

export interface IcsEvent {
  /** UID unik dari Google Calendar, dipakai sebagai gcal_id di tabel hari_libur */
  uid: string;
  /** Nama event/hari libur */
  summary: string;
  /** Tanggal mulai, format YYYY-MM-DD */
  dtstart: string;
}

/** "Unfold" baris ICS: baris panjang dipotong RFC 5545 dengan lanjutan
 *  berawalan spasi/tab di baris berikutnya — gabungkan kembali jadi satu baris.
 */
function unfoldIcsLines(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rawLines = normalized.split("\n");

  const lines: string[] = [];
  for (const line of rawLines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

/** Hilangkan escape karakter standar ICS (\, \; \n \\) dari teks SUMMARY/DESCRIPTION */
function unescapeIcsText(value: string): string {
  return value
    .replace(/\\n/gi, " ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

/** Ambil bagian tanggal (YYYYMMDD) dari nilai DTSTART, lalu format jadi YYYY-MM-DD.
 *  Mendukung format all-day (DTSTART;VALUE=DATE:20260101) maupun datetime
 *  (DTSTART:20260101T000000Z) — untuk hari libur, biasanya selalu all-day.
 */
function parseIcsDate(value: string): string | null {
  const match = value.match(/(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  const [, y, m, d] = match;
  return `${y}-${m}-${d}`;
}

export function parseIcsEvents(icsText: string): IcsEvent[] {
  const lines = unfoldIcsLines(icsText);
  const events: IcsEvent[] = [];
  let current: Partial<IcsEvent> | null = null;

  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      current = {};
      continue;
    }
    if (line.startsWith("END:VEVENT")) {
      if (current?.uid && current.summary && current.dtstart) {
        events.push(current as IcsEvent);
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx); // bisa ada parameter, cth "DTSTART;VALUE=DATE"
    const value = line.slice(colonIdx + 1);

    if (key === "UID") {
      current.uid = value.trim();
    } else if (key === "SUMMARY") {
      current.summary = unescapeIcsText(value);
    } else if (key.startsWith("DTSTART")) {
      const parsed = parseIcsDate(value);
      if (parsed) current.dtstart = parsed;
    }
  }

  return events;
}
