"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * Supabase client untuk Client Components (browser).
 * Dipakai untuk fitur interaktif sisi publik, misalnya:
 * - Form kirim pesan/testimoni (kontak.php)
 * - Form pendaftaran PPDB
 * - Cek status PPDB
 *
 * Singleton karena aman dipakai berulang di sisi browser.
 */
let browserClient: SupabaseClient<Database> | undefined;

export function getBrowserSupabaseClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase env belum diset. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY ada di .env.local"
    );
  }

  browserClient = createClient<Database, "public">(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });

  return browserClient;
}
