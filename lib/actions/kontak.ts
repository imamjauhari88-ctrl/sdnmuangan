"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Pesan } from "@/lib/types/database";

export interface KirimPesanResult {
  success: boolean;
  message: string;
}

/**
 * Server Action untuk submit form kontak, porting dari blok
 * `if (isset($_POST['kirim_pesan']))` di kontak.php versi lama.
 *
 * Validasi dilakukan di server (bukan hanya client) untuk keamanan,
 * sesuai praktik yang sama dengan versi PHP lama.
 */
export async function kirimPesan(formData: FormData): Promise<KirimPesanResult> {
  const nama = String(formData.get("nama") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subjek = String(formData.get("subjek") ?? "").trim();
  const pesan = String(formData.get("pesan") ?? "").trim();
  const kelompok = String(formData.get("kelompok") ?? "").trim();
  const isTesti = formData.get("is_testi") === "1";
  const ratingRaw = parseInt(String(formData.get("rating") ?? "5"), 10);
  const rating = Math.max(1, Math.min(5, isNaN(ratingRaw) ? 5 : ratingRaw));

  if (!nama || !email || !subjek || !pesan) {
    return { success: false, message: "Semua field wajib diisi!" };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { success: false, message: "Format email tidak valid!" };
  }

  const supabase = createServerSupabaseClient();

  const payload: Partial<Pesan> = {
    nama,
    email,
    kelompok: kelompok || null,
    subjek,
    pesan,
    is_testi: isTesti,
    status_testi: isTesti ? "pending" : null,
    rating: isTesti ? rating : null,
    status: "belum_dibaca",
  };

  // Catatan: @supabase/supabase-js@2.108 punya bug inference conditional type
  // pada generic Database kustom (non-CLI-generated) yang membuat parameter
  // .insert() ter-infer sebagai `never`, walau .select() dengan Database yang
  // sama berfungsi normal. Type assertion di sini aman karena `payload` sudah
  // divalidasi sesuai shape Partial<Pesan> oleh TypeScript pada baris di atas.
  const { error } = await supabase
    .from("pesan")
    .insert([payload] as never);

  if (error) {
    console.error("Gagal menyimpan pesan:", error.message);
    return { success: false, message: "Pesan gagal dikirim. Coba lagi." };
  }

  return { success: true, message: "Pesan Anda telah kami terima dan akan segera diproses." };
}
