"use server";

import { getStatusPendaftarByNik, type StatusPendaftarResult } from "@/lib/data/ppdb";

export interface CekStatusResult {
  success: boolean;
  message?: string;
  data?: StatusPendaftarResult;
}

export async function cekStatusPpdb(nik: string): Promise<CekStatusResult> {
  const nikTrim = nik.trim();

  if (!/^[0-9]{16}$/.test(nikTrim)) {
    return { success: false, message: "NIK harus 16 digit angka." };
  }

  const data = await getStatusPendaftarByNik(nikTrim);

  if (!data) {
    return { success: false, message: "Data pendaftaran dengan NIK tersebut tidak ditemukan." };
  }

  return { success: true, data };
}
