import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * Supabase client untuk Server Components / Route Handlers.
 *
 * Untuk halaman PUBLIK (beranda, berita, profil, dst) kita hanya
 * melakukan operasi READ, jadi cukup pakai anon key + RLS policy
 * "allow select" di Supabase. Tidak perlu service role key di sini.
 *
 * Dibuat sebagai function (bukan singleton di top-level module)
 * supaya aman dipanggil ulang di tiap request pada Server Components,
 * sesuai rekomendasi Next.js App Router.
 */
export function createServerSupabaseClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase env belum diset. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY ada di .env.local"
    );
  }

  return createClient<Database, "public">(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}
