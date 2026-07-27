"use client";

import { useState, useTransition } from "react";
import { logoutAdmin } from "@/lib/actions/auth";

interface TopbarProps {
  userEmail: string;
  onMenuClick: () => void;
}

export default function Topbar({ userEmail, onMenuClick }: TopbarProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleLogout() {
    startTransition(async () => {
      await logoutAdmin();
    });
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-500 dark:text-gray-300 text-xl"
        aria-label="Buka menu navigasi"
      >
        <i className="fa-solid fa-bars" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {userEmail}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">Administrator</span>
        </div>
        <div
          className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm"
          aria-hidden="true"
        >
          {userEmail.charAt(0).toUpperCase()}
        </div>

        {confirmOpen ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition disabled:opacity-70"
            >
              {isPending ? "..." : "Ya, Keluar"}
            </button>
            <button
              onClick={() => setConfirmOpen(false)}
              className="text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg transition"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmOpen(true)}
            aria-label="Keluar dari akun admin"
            title="Keluar"
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition p-2"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
          </button>
        )}
      </div>
    </header>
  );
}
