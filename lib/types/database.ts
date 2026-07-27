/**
 * Tipe data sesuai skema PostgreSQL (Supabase) hasil migrasi dari MySQL.
 * Sumber: skema SQL migrasi 22 Juni 2026 (if0_41504491_sekolah).
 *
 * Catatan:
 * - Semua PK tetap SERIAL (number/int), bukan UUID.
 * - Beberapa kolom pakai PostgreSQL ENUM, direpresentasikan sebagai
 *   union string type di TS.
 */

// ===================== ENUM TYPES =====================

export type BeritaKategori = "berita" | "pengumuman" | "agenda" | "prestasi";
export type HariLiburJenis = "nasional" | "cuti_bersama" | "sekolah";
export type HariLiburSumber = "manual" | "google_calendar";
export type TahunAjaranStatus = "Buka" | "Tutup";
export type PendaftarStatus = "Menunggu" | "Diterima" | "Cadangan" | "Ditolak";
export type PesanStatusTesti = "pending" | "approved" | "rejected";
export type PesanStatus = "belum_dibaca" | "dibaca";

// ===================== TABLE ROW TYPES =====================

export interface Admin {
  id: number;
  username: string | null;
  password: string | null;
}

export interface Album {
  id: number;
  nama_album: string;
  deskripsi: string | null;
  cover: string | null;
  tanggal_dibuat: string | null; // DATE
}

export interface Berita {
  id: number;
  judul: string | null;
  isi: string | null;
  tanggal: string | null; // DATE (YYYY-MM-DD)
  gambar: string | null;
  kategori: BeritaKategori;
  tingkat: string | null; // kecamatan/kabupaten/provinsi/nasional (khusus prestasi)
  peraih: string | null; // nama siswa/tim peraih (khusus prestasi)
  juara: string | null; // Juara 1, Juara 2, dst (khusus prestasi)
}

export interface Ekstrakurikuler {
  id: number;
  nama: string;
  icon: string | null;
  gambar: string | null;
  deskripsi: string | null;
  urutan: number | null;
  aktif: boolean | null;
  created_at: string | null;
  album_id: number | null;
}

export interface Fasilitas {
  id: number;
  nama: string;
  icon: string;
  deskripsi: string | null;
  gambar: string | null;
  color: string | null;
  urutan: number | null;
  aktif: boolean | null;
  album_id: number | null;
}

export interface Foto {
  id: number;
  album_id: number;
  file_foto: string;
  caption: string | null;
}

export interface GtkBerkasItem {
  label: string;
  url: string;
}

export interface Gtk {
  id: number;
  nama: string;
  jabatan: string | null;
  kategori: string | null; // pimpinan | guru_kelas | guru_mapel | tendik
  pendidikan: string | null;
  foto: string | null;
  warna: string | null;
  urutan: number | null;
  wa: string | null;
  berkas: GtkBerkasItem[] | null; // JSONB
}

export interface HariLibur {
  id: number;
  tanggal: string; // DATE
  nama: string;
  deskripsi: string | null;
  jenis: HariLiburJenis;
  sumber: HariLiburSumber;
  gcal_id: string | null;
  gcal_link: string | null;
  aktif: boolean;
  created_at: string;
  updated_at: string;
}

export interface TahunAjaran {
  id: number;
  tahun: string | null;
  kuota: number | null;
  status: TahunAjaranStatus | null;
}

export interface Pendaftar {
  id: number;
  tahun_id: number | null;
  no_daftar: string | null;
  nik: string | null;
  nama: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  agama: string | null;
  alamat: string | null;
  ayah: string | null;
  ibu: string | null;
  hp: string | null;
  kk: string | null;
  akta: string | null;
  foto: string | null;
  status: PendaftarStatus | null;
  tanggal_daftar: string | null;
}

export interface Pengaturan {
  id: number;
  kunci: string | null;
  nilai: string | null;
}

export interface Pesan {
  id: number;
  nama: string | null;
  email: string | null;
  kelompok: string | null;
  subjek: string | null;
  pesan: string | null;
  is_testi: boolean | null;
  status_testi: PesanStatusTesti | null;
  rating: number | null;
  tanggal: string | null;
  status: PesanStatus | null;
}

// ===================== SUPABASE Database GENERIC TYPE =====================
// Supabase JS butuh bentuk { Row, Insert, Update, Relationships } per tabel
// agar query builder (.select/.insert/.update) bisa diinfer dengan benar.
// Untuk sisi PUBLIK kita hanya pernah melakukan SELECT (dan beberapa INSERT
// untuk form kontak/PPDB nanti), jadi Insert/Update dibuat permisif (Partial).

type TableDef<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      admin: TableDef<Admin>;
      album: TableDef<Album>;
      berita: TableDef<Berita>;
      ekstrakurikuler: TableDef<Ekstrakurikuler>;
      fasilitas: TableDef<Fasilitas>;
      foto: TableDef<Foto>;
      gtk: TableDef<Gtk>;
      hari_libur: TableDef<HariLibur>;
      tahun_ajaran: TableDef<TahunAjaran>;
      pendaftar: TableDef<Pendaftar>;
      pengaturan: TableDef<Pengaturan>;
      pesan: TableDef<Pesan>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      berita_kategori: BeritaKategori;
      hari_libur_jenis: HariLiburJenis;
      hari_libur_sumber: HariLiburSumber;
      tahun_ajaran_status: TahunAjaranStatus;
      pendaftar_status: PendaftarStatus;
      pesan_status_testi: PesanStatusTesti;
      pesan_status: PesanStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

// ===================== HELPER TYPE: Pengaturan sebagai key-value map =====================

/**
 * Bentuk yang sudah "diratakan" dari tabel pengaturan,
 * setara dengan $pengaturan[$kunci] = $nilai di PHP lama.
 */
export type PengaturanMap = Record<string, string>;
