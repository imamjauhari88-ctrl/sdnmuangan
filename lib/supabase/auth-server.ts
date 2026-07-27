import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

/**
 * Supabase client untuk Server Components / Server Actions / Route Handlers
 * yang butuh tahu SESSION LOGIN admin (beda dari lib/supabase/server.ts yang
 * lama, yang anonim/read-only untuk halaman publik).
 *
 * Dipakai di seluruh halaman admin (app/admin/**) untuk:
 * - Mengecek apakah admin sedang login (di middleware & layout)
 * - Melakukan query/insert/update/delete sebagai user yang terautentikasi
 *   (tunduk pada Row Level Security policy di Supabase, bukan full akses
 *   seperti service role key)
 */
export async function createAuthServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database, "public">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Dipanggil dari Server Component (bukan Server Action/Route
            // Handler) tidak bisa set cookie — aman diabaikan karena
            // middleware sudah menangani refresh session.
          }
        },
      },
    }
  );
}
