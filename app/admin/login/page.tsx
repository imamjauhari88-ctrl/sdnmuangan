import type { Metadata } from "next";
import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Login Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const pengaturan = await getPengaturan();
  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Website Sekolah");
  const logoSekolah = pengaturanValue(pengaturan, "logo_sekolah", "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          {logoSekolah && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSekolah}
              alt="Logo Sekolah"
              className="w-16 h-16 mx-auto mb-3 object-contain"
            />
          )}
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">{namaSekolah}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Panel Administrator</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <i className="fa-solid fa-lock" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Masuk ke Dashboard</h2>
          </div>

          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          Khusus untuk admin sekolah. Hubungi pengelola situs jika lupa password.
        </p>
      </div>
    </div>
  );
}
