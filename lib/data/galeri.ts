import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Album, Foto } from "@/lib/types/database";

export interface AlbumWithCount extends Album {
  jml_foto: number;
}

export interface GaleriListResult {
  albums: AlbumWithCount[];
  cari: string;
}

/** Daftar album (mode list), dengan optional search by nama_album */
export async function getAlbumList(cari: string): Promise<GaleriListResult> {
  const supabase = createServerSupabaseClient();

  let query = supabase.from("album").select("*").order("tanggal_dibuat", { ascending: false });
  if (cari.trim()) {
    query = query.ilike("nama_album", `%${cari.trim()}%`);
  }

  const [albumRes, countRes] = await Promise.all([
    query,
    supabase.from("foto").select("album_id"),
  ]);

  const albumRows: Album[] = albumRes.data ?? [];
  const fotoRows: Pick<Foto, "album_id">[] = countRes.data ?? [];

  const countByAlbum: Record<number, number> = {};
  for (const f of fotoRows) {
    countByAlbum[f.album_id] = (countByAlbum[f.album_id] ?? 0) + 1;
  }

  const albums: AlbumWithCount[] = albumRows.map((a) => ({
    ...a,
    jml_foto: countByAlbum[a.id] ?? 0,
  }));

  return { albums, cari: cari.trim() };
}

export interface AlbumDetailResult {
  album: Album | null;
  fotos: Foto[];
}

/** Detail 1 album + semua foto di dalamnya (mode detail album) */
export async function getAlbumDetail(albumId: number): Promise<AlbumDetailResult> {
  const supabase = createServerSupabaseClient();

  const [albumRes, fotoRes] = await Promise.all([
    supabase.from("album").select("*").eq("id", albumId).limit(1),
    supabase.from("foto").select("*").eq("album_id", albumId).order("id", { ascending: true }),
  ]);

  const albumRows: Album[] = albumRes.data ?? [];
  const fotos: Foto[] = fotoRes.data ?? [];

  return { album: albumRows[0] ?? null, fotos };
}
