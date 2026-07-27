import { createAuthServerClient } from "@/lib/supabase/auth-server";
import type { Album, Foto } from "@/lib/types/database";

export interface AdminAlbumWithCount extends Album {
  jml_foto: number;
}

/** Daftar semua album + jumlah foto per album, untuk halaman list admin */
export async function getAdminAlbumList(): Promise<AdminAlbumWithCount[]> {
  const supabase = await createAuthServerClient();

  const [albumRes, fotoRes] = await Promise.all([
    supabase.from("album").select("*").order("tanggal_dibuat", { ascending: false }),
    supabase.from("foto").select("album_id"),
  ]);

  const albumRows: Album[] = albumRes.data ?? [];
  const fotoRows: Pick<Foto, "album_id">[] = fotoRes.data ?? [];

  const countByAlbum = fotoRows.reduce<Record<number, number>>((acc, f) => {
    acc[f.album_id] = (acc[f.album_id] ?? 0) + 1;
    return acc;
  }, {});

  return albumRows.map((a) => ({ ...a, jml_foto: countByAlbum[a.id] ?? 0 }));
}

/** Ambil 1 album + semua fotonya, untuk halaman kelola foto */
export async function getAdminAlbumDetail(albumId: number): Promise<{
  album: Album | null;
  fotoList: Foto[];
}> {
  const supabase = await createAuthServerClient();

  const [albumRes, fotoRes] = await Promise.all([
    supabase.from("album").select("*").eq("id", albumId).limit(1),
    supabase.from("foto").select("*").eq("album_id", albumId).order("id", { ascending: true }),
  ]);

  const albumRows: Album[] = albumRes.data ?? [];
  const fotoList: Foto[] = fotoRes.data ?? [];

  return { album: albumRows[0] ?? null, fotoList };
}

/** Ambil 1 album saja by id, untuk halaman edit info album */
export async function getAdminAlbumById(id: number): Promise<Album | null> {
  const supabase = await createAuthServerClient();
  const res = await supabase.from("album").select("*").eq("id", id).limit(1);
  const rows: Album[] = res.data ?? [];
  return rows[0] ?? null;
}
