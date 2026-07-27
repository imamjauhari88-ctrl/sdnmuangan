"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyCaptcha } from "@/lib/utils/captcha";
import type { Pendaftar } from "@/lib/types/database";

export interface DaftarPpdbInput {
  tahunId: number;
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  alamat: string;
  ayah: string;
  ibu: string;
  hp: string;
  kkUrl: string;
  aktaUrl: string;
  fotoUrl: string;
  captchaAnswer: number;
  captchaToken: string;
}

export interface DaftarPpdbResult {
  success: boolean;
  message: string;
  noDaftar?: string;
}

/**
 * Server Action submit pendaftaran PPDB, porting dari ppdb/proses.php.
 * File (KK, Akta, Foto) sudah diupload ke Cloudinary di sisi client
 * SEBELUM action ini dipanggil — action ini hanya menerima URL hasil
 * upload dan menyimpan record pendaftar ke Supabase.
 */
export async function daftarPpdb(input: DaftarPpdbInput): Promise<DaftarPpdbResult> {
  // 1. Validasi captcha (stateless, lihat lib/utils/captcha.ts)
  if (!verifyCaptcha(input.captchaAnswer, input.captchaToken)) {
    return { success: false, message: "Jawaban keamanan (captcha) salah!" };
  }

  // 2. Validasi NIK
  if (!/^[0-9]{16}$/.test(input.nik)) {
    return { success: false, message: "NIK harus 16 digit angka." };
  }

  if (
    !input.nama.trim() ||
    !input.tempatLahir.trim() ||
    !input.tanggalLahir ||
    !input.jenisKelamin ||
    !input.agama ||
    !input.alamat.trim() ||
    !input.ayah.trim() ||
    !input.ibu.trim() ||
    !input.hp.trim()
  ) {
    return { success: false, message: "Semua field wajib diisi." };
  }

  if (!input.kkUrl || !input.aktaUrl || !input.fotoUrl) {
    return { success: false, message: "Semua dokumen (KK, Akta, Foto) wajib diunggah." };
  }

  const supabase = createServerSupabaseClient();

  // 3. Cek tahun ajaran masih 'Buka' + cek kuota (re-validasi di server,
  // jangan percaya state dari client meski sudah dicek saat render halaman)
  const tahunRes = await supabase
    .from("tahun_ajaran")
    .select("*")
    .eq("id", input.tahunId)
    .limit(1);
  const tahunRows = tahunRes.data ?? [];
  const tahun = tahunRows[0] as { id: number; tahun: string | null; kuota: number | null; status: string | null } | undefined;

  if (!tahun || tahun.status !== "Buka") {
    return { success: false, message: "Maaf, PPDB sudah ditutup." };
  }

  const countRes = await supabase
    .from("pendaftar")
    .select("id", { count: "exact", head: true })
    .eq("tahun_id", input.tahunId);
  const totalSaatIni = countRes.count ?? 0;

  if (tahun.kuota !== null && totalSaatIni >= tahun.kuota) {
    return { success: false, message: "Maaf, kuota pendaftaran sudah penuh." };
  }

  // 4. Generate nomor pendaftaran otomatis: PPDB-SDN-<tahun>-<urutan>
  const urutan = totalSaatIni + 1;
  const tahunSlug = (tahun.tahun ?? "").replace(/\//g, "-");
  const noDaftar = `PPDB-SDN-${tahunSlug}-${String(urutan).padStart(4, "0")}`;

  // 5. Insert ke tabel pendaftar
  const payload: Partial<Pendaftar> = {
    tahun_id: input.tahunId,
    no_daftar: noDaftar,
    nik: input.nik,
    nama: input.nama.trim(),
    tempat_lahir: input.tempatLahir.trim(),
    tanggal_lahir: input.tanggalLahir,
    jenis_kelamin: input.jenisKelamin,
    agama: input.agama,
    alamat: input.alamat.trim(),
    ayah: input.ayah.trim(),
    ibu: input.ibu.trim(),
    hp: input.hp.trim(),
    kk: input.kkUrl,
    akta: input.aktaUrl,
    foto: input.fotoUrl,
    status: "Menunggu",
  };

  // Catatan: type assertion `as never` di sini menghindari bug inference
  // pada @supabase/supabase-js@2.108 untuk Database type kustom (lihat
  // catatan detail di lib/actions/kontak.ts). Payload sudah divalidasi
  // sesuai Partial<Pendaftar> oleh TypeScript pada baris di atas.
  const { error } = await supabase.from("pendaftar").insert([payload] as never);

  if (error) {
    console.error("Gagal menyimpan pendaftar PPDB:", error.message);
    return { success: false, message: "Gagal menyimpan data ke database." };
  }

  return { success: true, message: "Pendaftaran berhasil!", noDaftar };
}
