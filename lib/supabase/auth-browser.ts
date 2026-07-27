"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

/**
 * Supabase client untuk Client Components dengan dukungan AUTH
 * (login admin), berbeda dari lib/supabase/client.ts yang lama
 * (cuma untuk query publik read-only tanpa session).
 *
 * @supabase/ssr otomatis menyimpan session ke cookie browser,
 * supaya bisa dibaca juga oleh middleware & Server Components.
 */
export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient<Database, "public">(url, anonKey);
}
