"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Tambahkan import Link dari Next.js
import { loginAdmin } from "@/lib/actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const formData = new FormData(event.currentTarget);
    const result = await loginAdmin(formData);

    if (result.success) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setErrorMsg(result.message ?? "Gagal masuk.");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div
          className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm flex items-center gap-2"
          role="alert"
        >
          <i className="fa-solid fa-circle-exclamation" />
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          placeholder="admin@email.com"
          className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 dark:text-gray-300">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full border rounded-xl p-3 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition focus:outline-none cursor-pointer"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <i className="fa-solid fa-eye-slash" />
            ) : (
              <i className="fa-solid fa-eye" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            Memproses... <i className="fa-solid fa-spinner animate-spin" />
          </>
        ) : (
          <>
            Masuk <i className="fa-solid fa-arrow-right-to-bracket" />
          </>
        )}
      </button>

      {/* --- TOMBOL KEMBALI KE BERANDA --- */}
      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 inline-flex items-center gap-2 transition cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left text-xs" />
          Kembali ke Beranda
        </Link>
      </div>
    </form>
  );
}