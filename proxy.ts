import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy Next.js 16 (sebelumnya bernama "middleware" — file convention ini
 * di-deprecated di Next.js 16 dan diganti nama jadi "proxy" untuk
 * menghindari kerancuan dengan middleware ala Express.js). Logic di
 * dalamnya tidak berubah dari middleware.ts versi sebelumnya, hanya nama
 * file & nama function yang diganti.
 *
 * Dijalankan di setiap request yang cocok `config.matcher`. Dua tugas:
 * 1. Refresh session Supabase Auth (token expire otomatis diperpanjang)
 * 2. Redirect ke /admin/login jika mengakses /admin/** tanpa session valid
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !data.user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && data.user) {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
