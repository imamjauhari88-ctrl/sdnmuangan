"use client";

import React, { useState, useEffect, useMemo } from 'react';

import { GTKMember, ParsedGTKMember, Berkas, GroupedGTK } from '@/components/gtk/types';
import CustomStyles from '@/components/gtk/CustomStyles';
import HeroSection from '@/components/gtk/HeroSection';
import StafSection from '@/components/gtk/StafSection';
import DetailModal from '@/components/gtk/DetailModal';

interface GtkPageClientProps {
  namaSekolah: string;
  listGtk: GTKMember[];
  isFallback: boolean;
}

export default function GtkPageClient({ namaSekolah, listGtk, isFallback }: GtkPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('semua');
  const [selectedGtk, setSelectedGtk] = useState<ParsedGTKMember | null>(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  // Handler scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const pct = (window.scrollY / scrollHeight) * 100;
        setScrollWidth(Math.min(pct, 100));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Kalkulasi statistik reaktif (Aman dari kegagalan hidrasi server)
  const stats = useMemo(() => {
    const total = listGtk.length;
    const guru = listGtk.filter(g => ['guru_kelas', 'guru_mapel'].includes(g.kategori || '')).length;
    const tendik = listGtk.filter(g => ['pimpinan', 'tendik', 'lainnya'].includes(g.kategori || '')).length;
    return { total, guru, tendik };
  }, [listGtk]);

  // Normalisasi data GTK & Proteksi Null/Undefined dari Database
  const parsedGtkList = useMemo<ParsedGTKMember[]>(() => {
    return listGtk.map(g => {
      const namaSafe = g.nama || '';
      const jabatanSafe = g.jabatan || '';
      const pendidikanSafe = g.pendidikan || '';

      const parts = namaSafe.trim().split(' ');
      const inisial = (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');

      const fString = g.foto || '';
      const isExternalUrl = fString.startsWith('http://') || fString.startsWith('https://');
      const path = isExternalUrl ? fString : fString ? `/assets/img/gtk/${fString}` : '';

      let kategori = g.kategori || '';
      if (!kategori) {
        const jab = jabatanSafe.toLowerCase();
        if (jab.includes('kepala')) kategori = 'pimpinan';
        else if (/kelas\s+(i|ii|iii|iv|v|vi)/i.test(jab)) kategori = 'guru_kelas';
        else if (jab.includes('guru')) kategori = 'guru_mapel';
        else if (/penjaga|admin|tata usaha|operator/i.test(jab)) kategori = 'tendik';
        else kategori = 'lainnya';
      }

      let parsedBerkas: Berkas[] = [];
      if (g.berkas) {
        if (typeof g.berkas === 'string') {
          try {
            parsedBerkas = JSON.parse(g.berkas);
          } catch {
            parsedBerkas = [];
          }
        } else if (Array.isArray(g.berkas)) {
          parsedBerkas = g.berkas;
        }
      }

      return {
        ...g,
        nama: namaSafe,
        jabatan: jabatanSafe,
        pendidikan: pendidikanSafe,
        _inisial: inisial.toUpperCase(),
        _path: path,
        kategori,
        _berkas: parsedBerkas,
      };
    });
  }, [listGtk]);

  // Kepala Sekolah (Featured)
  const kepalaSekolah = useMemo(() => {
    return parsedGtkList.find(g =>
      g.kategori === 'pimpinan' ||
      g.jabatan.toLowerCase().includes('kepala') ||
      g.jabatan.toLowerCase().includes('kepsek')
    );
  }, [parsedGtkList]);

  // Filter & Pencarian
  const filteredGtkList = useMemo(() => {
    return parsedGtkList.filter(g => {
      const isKepala = g.kategori === 'pimpinan' ||
                       g.jabatan.toLowerCase().includes('kepala') ||
                       g.jabatan.toLowerCase().includes('kepsek');

      if (isKepala) return false;

      const matchSearch = g.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = activeFilter === 'semua' || g.kategori === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [parsedGtkList, searchTerm, activeFilter]);

  const groupedGtk = useMemo<GroupedGTK[]>(() => {
    const groups = [
      { key: 'guru_kelas', label: 'Guru Kelas', icon: 'fa-chalkboard-user', color: 'blue' },
      { key: 'guru_mapel', label: 'Guru Mata Pelajaran', icon: 'fa-book-open', color: 'green' },
      { key: 'tendik', label: 'Tenaga Kependidikan', icon: 'fa-briefcase', color: 'orange' },
    ];

    return groups.map(grp => {
      const items = filteredGtkList.filter(g => g.kategori === grp.key);
      return { ...grp, items };
    }).filter(g => g.items.length > 0);
  }, [filteredGtkList]);

  const isSearchEmpty = useMemo(() => {
    const ksVisible = kepalaSekolah &&
      (kepalaSekolah.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
       kepalaSekolah.jabatan.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeFilter === 'semua' || activeFilter === 'pimpinan');

    return filteredGtkList.length === 0 && !ksVisible;
  }, [filteredGtkList, kepalaSekolah, searchTerm, activeFilter]);

  const handleResetSearch = () => {
    setSearchTerm('');
    setActiveFilter('semua');
  };

  return (
    <>
      <div
        id="scroll-prog"
        style={{
          width: `${scrollWidth}%`,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          zIndex: 9999,
          background: 'linear-gradient(to right, #2563eb, #06b6d4)',
          transition: 'width 0.1s linear'
        }}
      />

      <CustomStyles />

      <HeroSection
        namaSekolah={namaSekolah}
        stats={stats}
        isLoading={false}
      />

      <StafSection
        isFallback={isFallback}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        kepalaSekolah={kepalaSekolah}
        groupedGtk={groupedGtk}
        isSearchEmpty={isSearchEmpty}
        handleResetSearch={handleResetSearch}
        setSelectedGtk={setSelectedGtk}
        stats={stats}
      />

      <DetailModal
        selectedGtk={selectedGtk}
        onClose={() => setSelectedGtk(null)}
      />
    </>
  );
}
