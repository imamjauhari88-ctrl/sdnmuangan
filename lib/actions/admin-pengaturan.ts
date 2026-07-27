"use server";

import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

export interface PengaturanActionResult {
  success: boolean;
  message: string;
}

/**
 * Server Action untuk menyimpan banyak pasangan kunci-nilai sekaligus dari
 * form Pengaturan Situs (tabnya: Info Umum, Profil, Statistik, Kontak).
 * Setara dengan blok `UPDATE pengaturan SET nilai=? WHERE kunci=?` yang
 * di-loop per field di pengaturan.php versi lama.
 *
 * Tabel `pengaturan` tidak selalu punya unique constraint di kolom `kunci`
 * (skema lama hanya punya primary key `id`), jadi di sini kita TIDAK pakai
 * `.upsert(..., { onConflict: "kunci" })` karena itu butuh constraint yang
 * mungkin belum ada. Sebagai gantinya: cek dulu kunci mana yang sudah ada
 * baris-nya (UPDATE), sisanya yang belum ada baris-nya (INSERT).
 */
export async function savePengaturan(
  values: Record<string, string>
): Promise<PengaturanActionResult> {
  const entries = Object.entries(values);
  if (entries.length === 0) {
    return { success: true, message: "Tidak ada perubahan." };
  }

  const supabase = await createAuthServerClient();
  const keys = entries.map(([kunci]) => kunci);

  const { data: existingRows, error: fetchError } = await supabase
    .from("pengaturan")
    .select("kunci")
    .in("kunci", keys);

  if (fetchError) {
    console.error("Gagal membaca data pengaturan saat ini:", fetchError.message);
    return { success: false, message: "Gagal membaca data pengaturan saat ini." };
  }

  const existingKeys = new Set(
    (existingRows ?? []).map((row: { kunci: string | null }) => row.kunci)
  );

  const toUpdate = entries.filter(([kunci]) => existingKeys.has(kunci));
  const toInsert = entries
    .filter(([kunci]) => !existingKeys.has(kunci))
    .map(([kunci, nilai]) => ({ kunci, nilai }));

  // Catatan: type assertion `as never` menghindari bug inference pada
  // @supabase/supabase-js@2.108 untuk Database type kustom — sama seperti
  // workaround di lib/actions/admin-fasilitas.ts.
  const updateResults = await Promise.all(
    toUpdate.map(([kunci, nilai]) =>
      supabase.from("pengaturan").update({ nilai } as never).eq("kunci", kunci)
    )
  );

  const updateError = updateResults.find((r) => r.error)?.error;
  if (updateError) {
    console.error("Gagal memperbarui pengaturan:", updateError.message);
    return { success: false, message: "Gagal memperbarui sebagian pengaturan." };
  }

  if (toInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("pengaturan")
      .insert(toInsert as never);

    if (insertError) {
      console.error("Gagal menambah pengaturan baru:", insertError.message);
      return { success: false, message: "Gagal menyimpan sebagian pengaturan baru." };
    }
  }

  // Pengaturan dipakai hampir di semua halaman publik (header, footer,
  // beranda, profil, kontak), jadi revalidate dari root layout ke bawah
  // supaya semuanya ikut ter-refresh, bukan cuma halaman tertentu.
  revalidatePath("/", "layout");
  revalidatePath("/admin/pengaturan");

  return { success: true, message: "Pengaturan berhasil disimpan." };
}
