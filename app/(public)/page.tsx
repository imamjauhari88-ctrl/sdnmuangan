import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import { getBerandaData } from "@/lib/data/beranda";

import JsonLdSchool from "@/components/seo/JsonLdSchool";
import LoadingScreen from "@/components/home/LoadingScreen";
import Hero from "@/components/home/Hero";
import PengumumanBanner from "@/components/home/PengumumanBanner";
import LayananUtama from "@/components/home/LayananUtama";
import Statistik from "@/components/home/Statistik";
import SambutanKepsek from "@/components/home/SambutanKepsek";
import VisiMisi from "@/components/home/VisiMisi";
import ProfilKompak from "@/components/home/ProfilKompak";
import KalenderBulanan from "@/components/home/KalenderBulanan";
import FasilitasPreview from "@/components/home/FasilitasPreview";
import PrestasiGaleri from "@/components/home/PrestasiGaleri";
import Ekstrakurikuler from "@/components/home/Ekstrakurikuler";
import BeritaTabs from "@/components/home/BeritaTabs";
import Testimoni from "@/components/home/Testimoni";
import MapsSection from "@/components/home/MapsSection";
import { cldTransform, cldWide } from "@/lib/utils/cloudinary";

// ISR: data beranda cukup fresh dengan revalidate 60 detik
export const revalidate = 60;

export default async function HomePage() {
  const [pengaturan, beranda] = await Promise.all([getPengaturan(), getBerandaData()]);

  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Nama Sekolah");
  const logoSekolah = pengaturanValue(pengaturan, "logo_sekolah", "/assets/img/logo.png");
  const fotoSekolah = cldWide(pengaturanValue(pengaturan, "foto_sekolah", logoSekolah), 1920);
  const tahunBerdiri = pengaturanValue(pengaturan, "tahun_berdiri", "-");
  const fotoKepsek = pengaturanValue(pengaturan, "foto_kepsek", logoSekolah);
  const sambutanKepsek = pengaturanValue(
    pengaturan,
    "sambutan_kepsek",
    "Sambutan kepala sekolah belum tersedia."
  );
  const visi = pengaturanValue(pengaturan, "visi", "Visi sekolah belum tersedia.");
  const misi = pengaturanValue(pengaturan, "misi", "");
  const statusSekolah = pengaturanValue(pengaturan, "status_sekolah", "Negeri");
  const akreditasi = pengaturanValue(pengaturan, "akreditasi", "-");
  const lokasi = pengaturanValue(pengaturan, "lokasi", "-");
  const alamatSekolah = pengaturanValue(pengaturan, "alamat_sekolah", "-");
  const koordinatMap = pengaturanValue(pengaturan, "koordinat_map", "");
  const jmlSiswa = parseInt(pengaturanValue(pengaturan, "jml_siswa", "0"), 10) || 0;
  const jmlGuru = parseInt(pengaturanValue(pengaturan, "jml_guru", "0"), 10) || 0;
  const jmlRombel = parseInt(pengaturanValue(pengaturan, "jml_rombel", "0"), 10) || 0;
  const jmlPrestasiRaw = pengaturanValue(pengaturan, "jml_prestasi", "0");
  const jmlPrestasi = parseInt(jmlPrestasiRaw.replace(/\D/g, ""), 10) || 0;

  return (
    <>
      <JsonLdSchool />

      <LoadingScreen namaSekolah={namaSekolah} logoUrl={cldTransform(logoSekolah, "w_128,c_fit,q_auto,f_auto")} />

      {/* 1. Hero */}
      <Hero namaSekolah={namaSekolah} tahunBerdiri={tahunBerdiri} fotoSekolah={fotoSekolah} />

      {/* 2. Pengumuman (tampil jika ada data) — info urgent harus terlihat lebih awal */}
      <PengumumanBanner pengumuman={beranda.pengumumanTerbaru} />

      {/* 3. Layanan Utama / Quick Links — PPDB, CBT/Absensi, Kontak: jangan dikubur di bawah */}
      <LayananUtama />

      {/* 4. Statistik */}
      <Statistik
        jmlSiswa={jmlSiswa}
        jmlGuru={jmlGuru}
        jmlRombel={jmlRombel}
        jmlPrestasi={jmlPrestasi}
      />

      {/* 5. Sambutan Kepala Sekolah */}
      <SambutanKepsek
        namaSekolah={namaSekolah}
        namaKepsek={beranda.namaKepsek}
        fotoKepsek={fotoKepsek}
        sambutan={sambutanKepsek}
      />

      {/* 6. Visi & Misi (ringkas) */}
      <VisiMisi visi={visi} misi={misi} />

      {/* 7. Data Profil Kompak */}
      <ProfilKompak
        statusSekolah={statusSekolah}
        akreditasi={akreditasi}
        lokasi={lokasi}
        tahunBerdiri={tahunBerdiri}
      />

      {/* 8. Kalender Agenda — gabungan kalender + daftar agenda, versi calendar-grid interaktif */}
      <KalenderBulanan agenda={beranda.semuaAgenda} hariLibur={beranda.hariLibur} />

      {/* 9. Preview Fasilitas */}
      <FasilitasPreview fasilitasList={beranda.fasilitasPreview} />

      {/* 10. Prestasi + Galeri (digabung) */}
      <PrestasiGaleri prestasi={beranda.prestasiTerbaru} galeri={beranda.galeriPreview} />

      {/* 11. Ekstrakurikuler */}
      <Ekstrakurikuler ekskulList={beranda.ekskulList} />

      {/* 12. Berita & Informasi */}
      <BeritaTabs tabBerita={beranda.tabBerita} />

      {/* 13. Testimoni Wali Murid */}
      <Testimoni testimoni={beranda.testimoni} />

      {/* 14. Maps */}
      <MapsSection namaSekolah={namaSekolah} alamat={alamatSekolah} koordinat={koordinatMap} />
    </>
  );
}
