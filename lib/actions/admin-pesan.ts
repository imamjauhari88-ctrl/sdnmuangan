"use server";

import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { PesanStatusTesti } from "@/lib/types/database";

export interface PesanActionResult {
  success: boolean;
  message: string;
}

function revalidatePesanPaths() {
  revalidatePath("/admin/pesan");
  revalidatePath("/admin/dashboard");
  revalidatePath("/"); // beranda menampilkan testimoni yang sudah approved
}

/** Approve testimoni supaya tampil di halaman publik */
export async function approveTestimoni(id: number): Promise<PesanActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase
    .from("pesan")
    .update({ status_testi: "approved" } as never)
    .eq("id", id);

  if (error) {
    console.error("Gagal menyetujui testimoni:", error.message);
    return { success: false, message: "Gagal menyetujui testimoni." };
  }

  revalidatePesanPaths();
  return { success: true, message: "Testimoni disetujui dan akan tampil di halaman publik." };
}

/** Reject testimoni (tidak ditampilkan di halaman publik, tapi data tidak dihapus) */
export async function rejectTestimoni(id: number): Promise<PesanActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase
    .from("pesan")
    .update({ status_testi: "rejected" } as never)
    .eq("id", id);

  if (error) {
    console.error("Gagal menolak testimoni:", error.message);
    return { success: false, message: "Gagal menolak testimoni." };
  }

  revalidatePesanPaths();
  return { success: true, message: "Testimoni ditolak dan tidak akan tampil di halaman publik." };
}

/** Kembalikan testimoni ke status pending (batal approve/reject) */
export async function resetStatusTestimoni(id: number): Promise<PesanActionResult> {
  const supabase = await createAuthServerClient();

  const payload: { status_testi: PesanStatusTesti } = { status_testi: "pending" };
  const { error } = await supabase.from("pesan").update(payload as never).eq("id", id);

  if (error) {
    console.error("Gagal mereset status testimoni:", error.message);
    return { success: false, message: "Gagal mereset status." };
  }

  revalidatePesanPaths();
  return { success: true, message: "Status testimoni dikembalikan ke menunggu." };
}

export async function deletePesan(id: number): Promise<PesanActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("pesan").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus pesan:", error.message);
    return { success: false, message: "Gagal menghapus pesan." };
  }

  revalidatePesanPaths();
  return { success: true, message: "Pesan berhasil dihapus." };
}

export async function tandaiSudahDibaca(id: number): Promise<PesanActionResult> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.from("pesan").update({ status: "dibaca" } as never).eq("id", id);

  if (error) {
    console.error("Gagal menandai pesan:", error.message);
    return { success: false, message: "Gagal menandai pesan sebagai dibaca." };
  }

  revalidatePesanPaths();
  return { success: true, message: "Pesan ditandai sudah dibaca." };
}
