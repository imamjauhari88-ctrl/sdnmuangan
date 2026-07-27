export interface Berkas {
  label: string;
  url: string;
}

export interface GTKMember {
  nama: string;
  jabatan: string;
  pendidikan: string;
  foto: string | null | undefined;
  warna: string;
  wa?: string;
  kategori?: string;
  berkas?: string | Berkas[]; 
  urutan?: number;
}

export interface ParsedGTKMember extends GTKMember {
  _inisial: string;
  _path: string;
  _berkas: Berkas[];
}

export interface GroupedGTK {
  key: string;
  label: string;
  icon: string;
  color: string;
  items: ParsedGTKMember[];
}