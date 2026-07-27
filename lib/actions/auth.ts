"use server";

import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { redirect } from "next/navigation";

export interface LoginResult {
  success: boolean;
  message?: string;
}

export async function loginAdmin(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { success: false, message: "Email dan password wajib diisi." };
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: "Email atau password salah." };
  }

  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
