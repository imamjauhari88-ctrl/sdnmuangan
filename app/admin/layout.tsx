import { createAuthServerClient } from "@/lib/supabase/auth-server";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAuthServerClient();
  const { data } = await supabase.auth.getUser();

  // Halaman /admin/login punya layout sendiri (tanpa sidebar/topbar) lewat
  // app/admin/login/layout.tsx, jadi di sini middleware sudah memastikan
  // request yang sampai ke layout ini (selain /login) pasti sudah login.
  // Tapi tetap dijaga: kalau somehow user null di sini (race condition saat
  // logout), tampilkan children polos tanpa shell daripada crash.
  if (!data.user) {
    return <>{children}</>;
  }

  return <AdminShell userEmail={data.user.email ?? "Admin"}>{children}</AdminShell>;
}
