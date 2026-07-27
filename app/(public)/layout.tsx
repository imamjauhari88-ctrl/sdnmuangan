import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * Layout khusus untuk halaman PUBLIK (semua route di dalam folder
 * app/(public)/). Navbar & Footer sengaja diletakkan di sini, bukan di
 * RootLayout (app/layout.tsx), supaya halaman admin (app/admin/**) tidak
 * ikut menampilkan Navbar/Footer situs — admin punya shell sendiri
 * (lihat components/admin/AdminShell.tsx).
 *
 * JsonLdSchool (schema Organization/ElementarySchool) TIDAK dipasang di
 * sini lagi — sesuai rekomendasi resmi Google (Organization structured
 * data guidelines): cukup ditaruh di homepage saja, tidak perlu di
 * setiap halaman. Lihat app/(public)/page.tsx.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Menambahkan fallback '|| {}' jika data dari database bernilai null/undefined
  const databasePengaturan = await getPengaturan();
  const pengaturan = databasePengaturan || {};

  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Nama Sekolah");
  const logoSekolah = pengaturanValue(pengaturan, "logo_sekolah", "/assets/img/logo.png");

  return (
    <>
      <Navbar namaSekolah={namaSekolah} logoSekolah={logoSekolah} />
      <main className="flex-1">{children}</main>
      <Footer pengaturan={pengaturan} />
    </>
  );
}