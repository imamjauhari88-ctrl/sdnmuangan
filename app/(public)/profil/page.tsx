import type { Metadata } from "next";
import { getPengaturan, pengaturanValue } from "@/lib/data/pengaturan";
import { getProfilData } from "@/lib/data/profil";

import ProfilHero from "@/components/profil/ProfilHero";
import AnchorNav from "@/components/profil/AnchorNav";
import ProfilSingkat from "@/components/profil/ProfilSingkat";
import VisiMisiFull from "@/components/profil/VisiMisiFull";
import InfoSekolah from "@/components/profil/InfoSekolah";
import FasilitasSection from "@/components/profil/FasilitasSection";
import StrukturOrganisasi from "@/components/profil/StrukturOrganisasi";
import SejarahSekolah from "@/components/profil/SejarahSekolah";
import KontakRingkas from "@/components/profil/KontakRingkas";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const pengaturan = await getPengaturan();
  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Sekolah Kami");
  const description = pengaturanValue(
    pengaturan,
    "profil_singkat",
    `Profil lengkap ${namaSekolah}: visi, misi, sejarah, fasilitas, dan struktur organisasi.`
  );
  const fotoSekolah = pengaturanValue(pengaturan, "foto_sekolah", "");

  return {
    title: "Profil Sekolah",
    description,
    openGraph: {
      title: `Profil Sekolah | ${namaSekolah}`,
      description,
      images: fotoSekolah ? [{ url: fotoSekolah, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      title: `Profil Sekolah | ${namaSekolah}`,
      description,
      images: fotoSekolah ? [fotoSekolah] : undefined,
    },
  };
}

export default async function ProfilPage() {
  const [pengaturan, profilData] = await Promise.all([getPengaturan(), getProfilData()]);

  const namaSekolah = pengaturanValue(pengaturan, "nama_sekolah", "Nama Sekolah");
  const profilSingkat = pengaturanValue(pengaturan, "profil_singkat", "");
  const visi = pengaturanValue(pengaturan, "visi", "");
  const misi = pengaturanValue(pengaturan, "misi", "");
  const sejarah = pengaturanValue(pengaturan, "sejarah", "");
  const fotoSejarah = pengaturanValue(pengaturan, "foto_sejarah", "");
  const fotoStruktur = pengaturanValue(pengaturan, "foto_struktur", "");
  const npsn = pengaturanValue(pengaturan, "npsn", "-");
  const statusSekolah = pengaturanValue(pengaturan, "status_sekolah", "-");
  const akreditasi = pengaturanValue(pengaturan, "akreditasi", "-");
  const lokasi = pengaturanValue(pengaturan, "lokasi", "-");
  const tahunBerdiri = pengaturanValue(pengaturan, "tahun_berdiri", "-");
  const alamatSekolah = pengaturanValue(pengaturan, "alamat_sekolah", "-");
  const teleponSekolah = pengaturanValue(pengaturan, "telepon_sekolah", "-");
  const emailSekolah = pengaturanValue(pengaturan, "email_sekolah", "-");
  const jamOperasional = pengaturanValue(
    pengaturan,
    "jam_operasional",
    "Senin–Jumat, 07.00–13.00 WIB"
  );
  const koordinatMap = pengaturanValue(pengaturan, "koordinat_map", "");
  const jmlSiswa = parseInt(pengaturanValue(pengaturan, "jml_siswa", "0"), 10) || 0;
  const jmlGuru = parseInt(pengaturanValue(pengaturan, "jml_guru", "0"), 10) || 0;
  const jmlRombel = parseInt(pengaturanValue(pengaturan, "jml_rombel", "0"), 10) || 0;
  const jmlPrestasi = parseInt(pengaturanValue(pengaturan, "jml_prestasi", "0").replace(/\D/g, ""), 10) || 0;

  // link_gmaps tidak ada di skema pengaturan; bangun dari koordinat (konsisten dengan MapsSection beranda)
  const linkMaps = koordinatMap
    ? `https://www.google.com/maps/dir/?api=1&destination=${koordinatMap.replace(/\s/g, "")}`
    : "#";

  return (
    <>
      <ProfilHero
        namaSekolah={namaSekolah}
        akreditasi={akreditasi}
        tahunBerdiri={tahunBerdiri}
        jmlSiswa={String(jmlSiswa)}
      />

      <AnchorNav />

      <ProfilSingkat profilSingkat={profilSingkat} />

      <VisiMisiFull visi={visi} misi={misi} />

      <InfoSekolah
        npsn={npsn}
        statusSekolah={statusSekolah}
        akreditasi={akreditasi}
        lokasi={lokasi}
        tahunBerdiri={tahunBerdiri}
        jmlSiswa={jmlSiswa}
        jmlGuru={jmlGuru}
        jmlRombel={jmlRombel}
        jmlPrestasi={jmlPrestasi}
      />

      <FasilitasSection fasilitasList={profilData.fasilitasList} />

      <StrukturOrganisasi
        namaSekolah={namaSekolah}
        fotoStruktur={fotoStruktur}
        namaKepsek={profilData.namaKepsek}
        fotoKepsek={profilData.fotoKepsek}
        orgChart={profilData.orgChart}
      />

      <SejarahSekolah
        sejarah={sejarah}
        fotoSejarah={fotoSejarah}
        namaSekolah={namaSekolah}
        tahunBerdiri={tahunBerdiri}
        akreditasi={akreditasi}
      />

      <KontakRingkas
        alamat={alamatSekolah}
        telepon={teleponSekolah}
        email={emailSekolah}
        jamOperasional={jamOperasional}
        linkMaps={linkMaps}
      />
    </>
  );
}
