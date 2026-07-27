import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Ekstrakurikuler, Album } from "@/lib/types/database";

export interface AdminEkskulWithAlbum extends Ekstrakurikuler {
  album_nama: string | null;
}

/** Daftar semua ekstrakurikuler (termasuk non-aktif) + nama album terkait, urut sesuai kolom urutan */
export async function getAdminEkskulList(): Promise<AdminEkskulWithAlbum[]> {
  const supabase = await createAuthServerClient();

  const [ekskulRes, albumRes] = await Promise.all([
    supabase.from("ekstrakurikuler").select("*").order("urutan", { ascending: true }),
    supabase.from("album").select("id, nama_album"),
  ]);

  const ekskulRows: Ekstrakurikuler[] = ekskulRes.data ?? [];
  const albumRows: Pick<Album, "id" | "nama_album">[] = albumRes.data ?? [];
  const albumNameMap = new Map(albumRows.map((a) => [a.id, a.nama_album]));

  return ekskulRows.map((e) => ({
    ...e,
    album_nama: e.album_id ? albumNameMap.get(e.album_id) ?? null : null,
  }));
}

/** Ambil 1 ekstrakurikuler by id, untuk halaman edit */
export async function getAdminEkskulById(id: number): Promise<Ekstrakurikuler | null> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("ekstrakurikuler").select("*").eq("id", id).limit(1);
  const rows: Ekstrakurikuler[] = res.data ?? [];
  return rows[0] ?? null;
}

/** Daftar semua album, untuk dropdown pilihan album foto di form ekskul */
export async function getAlbumOptionsForEkskul(): Promise<Pick<Album, "id" | "nama_album">[]> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("album").select("id, nama_album").order("nama_album", { ascending: true });
  return res.data ?? [];
}
