import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Fasilitas } from "@/lib/types/database";

/** Daftar semua fasilitas (termasuk yang non-aktif), urut sesuai kolom urutan */
export async function getAdminFasilitasList(): Promise<Fasilitas[]> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("fasilitas").select("*").order("urutan", { ascending: true });
  return res.data ?? [];
}

/** Ambil 1 fasilitas by id, untuk halaman edit */
export async function getAdminFasilitasById(id: number): Promise<Fasilitas | null> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("fasilitas").select("*").eq("id", id).limit(1);
  const rows: Fasilitas[] = res.data ?? [];
  return rows[0] ?? null;
}
