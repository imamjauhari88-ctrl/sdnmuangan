"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { syncGoogleCalendarHariLibur } from "@/lib/actions/admin-hari-libur";

interface SinkronGoogleCalendarButtonProps {
  tahun: number;
}

export default function SinkronGoogleCalendarButton({ tahun }: SinkronGoogleCalendarButtonProps) {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  async function handleSync() {
    setIsSyncing(true);
    setStatusMsg(null);

    const result = await syncGoogleCalendarHariLibur(tahun);

    setIsSyncing(false);
    setStatusMsg({ type: result.success ? "success" : "error", text: result.message });

    if (result.success) {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={handleSync}
        disabled={isSyncing}
        title={`Tarik data hari libur nasional tahun ${tahun} dari Google Calendar`}
        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-70 text-gray-700 dark:text-gray-200 font-bold px-4 py-2.5 rounded-xl transition border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm"
      >
        {isSyncing ? (
          <>
            <i className="fa-solid fa-spinner animate-spin" /> Menyinkron...
          </>
        ) : (
          <>
            <i className="fa-brands fa-google text-blue-500" /> Sinkron {tahun}
          </>
        )}
      </button>
      {statusMsg && (
        <p
          className={`text-xs font-medium max-w-xs text-right ${
            statusMsg.type === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-red-500 dark:text-red-400"
          }`}
        >
          {statusMsg.text}
        </p>
      )}
    </div>
  );
}
