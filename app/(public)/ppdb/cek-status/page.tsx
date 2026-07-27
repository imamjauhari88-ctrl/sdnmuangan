import type { Metadata } from "next";
import CekStatusForm from "@/components/ppdb/CekStatusForm";

export const metadata: Metadata = {
  title: "Cek Status Pendaftaran PPDB",
  description: "Cek status pendaftaran peserta didik baru menggunakan NIK.",
};

export default function CekStatusPage() {
  return <CekStatusForm />;
}
