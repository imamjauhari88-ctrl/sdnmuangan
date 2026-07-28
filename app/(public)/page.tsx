import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import { getBerandaData } from "@/lib/data/beranda";

import JsonLdSchool from "@/components/seo/JsonLdSchool";
import Hero from "@/components/home/Hero";
import PengumumanBanner from "@/components/home/PengumumanBanner";
import LayananUtama from "@/components/home/LayananUtama";
import ProfilSingkat from "@/components/home/ProfilSingkat";
import AgendaRingkas from "@/components/home/AgendaRingkas";
import FasilitasEkskul from "@/components/home/FasilitasEkskul";
import PrestasiGaleri from "@/components/home/PrestasiGaleri";
import BeritaTabs from "@/components/home/BeritaTabs";
import MapsSection from "@/components/home/MapsSection";

/**
 * Struktur beranda dirampingkan dari 14 section jadi 9:
 * - Statistik dilebur ke Hero (strip angka, bukan section sendiri)
 * - Sambutan Kepsek + Visi Misi + Profil Kompak digabung -> ProfilSingkat
 *   (3 section yang isinya tumpang tindih "identitas sekolah" jadi 1)
 * - KalenderBulanan (grid kalender penuh) diganti AgendaRingkas (list 4
 *   agenda terdekat) di beranda; kalender penuh tetap ada di
 *   /berita?kategori=agenda untuk yang butuh tampilan bulanan
 * - Fasilitas + Ekstrakurikuler digabung jadi 1 section bertab
 * - Testimoni dihapus dari beranda: untuk sekolah negeri, kredibilitas
 *   lebih pas ditopang data resmi (akreditasi/NPSN/prestasi) daripada
 *   pola testimoni ala produk komersial
 */

// ISR: data beranda cukup fresh dengan revalidate 60 detik
export const revalidate = 60;

export default async function HomePage() {
  const [pengaturan, beranda] = await Promise.all([getPengaturan(), getBerandaData()]);

  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Nama Sekolah");
  const logoSekolah = pengaturanValue(pengaturan, "logo_sekolah", "/assets/img/logo.png");
  const tahunBerdiri = pengaturanValue(pengaturan, "tahun_berdiri", "-");
  const npsn = pengaturanValue(pengaturan, "npsn", "-");
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

  return (
    <>
      <JsonLdSchool />

      {/* 1. Hero (statistik sekolah sudah termasuk di dalamnya) */}
      <Hero
        namaSekolah={namaSekolah}
        akreditasi={akreditasi}
        npsn={npsn}
        jmlSiswa={jmlSiswa}
        jmlGuru={jmlGuru}
        jmlRombel={jmlRombel}
      />

      {/* 2. Pengumuman (tampil jika ada data) — info urgent harus terlihat lebih awal */}
      <PengumumanBanner pengumuman={beranda.pengumumanTerbaru} />

      {/* 3. Layanan Utama / Quick Links — PPDB, CBT/Absensi, Kontak: jangan dikubur di bawah */}
      <LayananUtama />

      {/* 4. Profil Singkat — gabungan Sambutan Kepsek + Visi Misi + data pokok sekolah */}
      <ProfilSingkat
        namaSekolah={namaSekolah}
        namaKepsek={beranda.namaKepsek}
        fotoKepsek={fotoKepsek}
        sambutan={sambutanKepsek}
        visi={visi}
        misi={misi}
        statusSekolah={statusSekolah}
        akreditasi={akreditasi}
        lokasi={lokasi}
        tahunBerdiri={tahunBerdiri}
      />

      {/* 5. Agenda terdekat — versi ringkas, kalender penuh ada di /berita?kategori=agenda */}
      <AgendaRingkas agenda={beranda.semuaAgenda} />

      {/* 6. Fasilitas & Ekstrakurikuler — satu section bertab */}
      <FasilitasEkskul fasilitasList={beranda.fasilitasPreview} ekskulList={beranda.ekskulList} />

      {/* 7. Prestasi + Galeri (digabung) */}
      <PrestasiGaleri prestasi={beranda.prestasiTerbaru} galeri={beranda.galeriPreview} />

      {/* 8. Berita & Informasi */}
      <BeritaTabs tabBerita={beranda.tabBerita} />

      {/* 9. Maps & Kontak — penutup beranda */}
      <MapsSection namaSekolah={namaSekolah} alamat={alamatSekolah} koordinat={koordinatMap} />
    </>
  );
}
