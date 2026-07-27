import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Gtk } from "@/lib/types/database";

/** Daftar semua GTK, urut sesuai kolom urutan */
export async function getAdminGtkList(): Promise<Gtk[]> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("gtk").select("*").order("urutan", { ascending: true });
  return res.data ?? [];
}

/** Ambil 1 data GTK by id, untuk halaman edit */
export async function getAdminGtkById(id: number): Promise<Gtk | null> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("gtk").select("*").eq("id", id).limit(1);
  const rows: Gtk[] = res.data ?? [];
  return rows[0] ?? null;
}
