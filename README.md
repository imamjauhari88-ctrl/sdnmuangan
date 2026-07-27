# Website Sekolah — Next.js + Supabase

Migrasi dari PHP native + MySQL (InfinityFree) ke Next.js (App Router) + Supabase + Vercel.
Foto/gambar tetap dilayani lewat Cloudinary.

## Status migrasi (sisi publik)

- [x] **Tahap 1** — Setup project (struktur Next.js + koneksi Supabase)
- [x] **Tahap 2** — Halaman Beranda (index)
- [x] **Tahap 3** — Berita & Detail Berita
- [x] **Tahap 4** — Profil
- [x] **Tahap 5** — GTK *(dibangun di luar sesi ini oleh kak Imam — belum tergabung di project ini)*
- [x] **Tahap 6** — Galeri
- [x] **Tahap 7** — Kontak
- [x] **Tahap 8** — PPDB
- [x] **Tahap 9** — Agenda & Pengumuman *(di-skip — sudah terwakili penuh oleh filter kategori di `/berita`)*

## Sisi Publik: SELESAI ✅

Semua 9 tahapan migrasi sisi publik (Beranda s/d PPDB) sudah selesai. Tahap 9
(Agenda & Pengumuman) sengaja di-skip karena sudah terwakili penuh lewat filter
kategori di halaman `/berita`.

## Sisi Admin (sedang dikerjakan)

| Bagian | Status |
|---|---|
| Auth (login/logout, proteksi route) | ✅ Selesai |
| Dashboard (ringkasan statistik) | ✅ Selesai |
| CRUD Berita | ⬜ Belum |
| CRUD GTK | ⬜ Belum |
| CRUD Galeri (Album + Foto) | ⬜ Belum |
| CRUD Fasilitas & Ekstrakurikuler | ⬜ Belum |
| Kelola Pendaftar PPDB & Tahun Ajaran | ⬜ Belum |
| Kelola Pesan & Testimoni | ⬜ Belum |
| Kelola Hari Libur | ⬜ Belum |
| Pengaturan Situs (edit key-value `pengaturan`) | ⬜ Belum |

### Auth admin: Supabase Auth + `@supabase/ssr` (bukan tabel `admin` lama)

Tabel `admin` di skema lama (password MD5) **tidak dipakai** untuk login di
versi baru — itu tidak aman menurut standar saat ini. Login admin sekarang
memakai **Supabase Auth** asli, dikelola lewat `@supabase/ssr` supaya sesi
tersimpan di cookies dan bisa dibaca baik dari Server Components maupun
`proxy.ts` (lihat catatan di bawah soal penamaan `proxy.ts`, bukan
`middleware.ts`).

**Cara membuat akun admin pertama** (tabel `admin` PHP lama tidak dipakai):
1. Buka Supabase Dashboard → **Authentication** → **Users** → **Add user**
2. Isi email & password untuk akun admin sekolah
3. Set **Auto Confirm User** = ON (supaya tidak perlu verifikasi email)
4. Login di `/admin/login` pakai email & password tersebut

### Struktur folder admin

```
app/admin/
  layout.tsx              # Cek user login, render AdminShell (sidebar+topbar)
  page.tsx                 # Redirect ke /admin/dashboard
  login/
    layout.tsx              # Override: halaman login tanpa sidebar/topbar
    page.tsx
  dashboard/page.tsx       # Ringkasan statistik (selesai)
  berita/, gtk/, galeri/, fasilitas/, ekstrakurikuler/,
  ppdb/pendaftar/, ppdb/tahun-ajaran/, pesan/, hari-libur/, pengaturan/
                            # Folder disiapkan, isi CRUD menyusul

components/admin/
  LoginForm.tsx             # Form login (memanggil Server Action loginAdmin)
  Sidebar.tsx               # Navigasi sidebar (daftar menu ada di MENU_GROUPS)
  Topbar.tsx                # Info user + tombol logout
  AdminShell.tsx            # Client wrapper: state sidebar mobile open/close

lib/
  supabase/
    auth-server.ts          # Client Supabase untuk Server Components di area admin (cookies-aware)
    auth-browser.ts          # Client Supabase untuk Client Components di area admin
  actions/auth.ts            # loginAdmin(), logoutAdmin()
  data/admin-dashboard.ts    # Query ringkasan untuk dashboard

proxy.ts                     # Proteksi route /admin/* + refresh session auth
```

### ⚠️ Catatan penting: `middleware.ts` → `proxy.ts` (Next.js 16)

Next.js 16 men-deprecate file convention `middleware.ts` dan menggantinya
dengan **`proxy.ts`** (nama function juga berubah dari `middleware` jadi
`proxy`) untuk menghindari kerancuan dengan istilah middleware ala Express.js.
Logic-nya identik, hanya rename. **Jangan buat ulang `middleware.ts`** —
kalau perlu menambah proteksi route lain di masa depan, edit `proxy.ts`
yang sudah ada di root project.

### Menambah menu sidebar baru

Saat modul CRUD baru selesai, tambahkan entry-nya ke `MENU_GROUPS` di
`components/admin/Sidebar.tsx` agar muncul di navigasi.


```bash
npm install
cp .env.local.example .env.local
# isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY
# dari Supabase Dashboard > Project Settings > API
npm run dev
```

## Struktur folder

```
app/                  # Routes (App Router)
  layout.tsx          # Root layout: fetch pengaturan, render Navbar/Footer/LoginModal
  page.tsx            # Beranda
  berita/              # Daftar berita + /berita/[id] detail
  profil/, gtk/, galeri/, kontak/, ppdb/, agenda-pengumuman/

components/
  layout/             # Navbar, Footer, ThemeToggle, LoginModal (semua reusable di semua halaman)
  home/               # Seluruh section Beranda (lihat daftar di bawah)
  berita/, profil/, gtk/, galeri/, kontak/, ppdb/, agenda/
                       # Komponen spesifik per halaman (belum dibangun)

lib/
  supabase/
    server.ts          # Client Supabase untuk Server Components (anon key, read-only)
    client.ts           # Client Supabase untuk Client Components (form, dsb)
  types/database.ts    # Tipe TS sesuai skema PostgreSQL (Supabase) hasil migrasi
  data/
    pengaturan.ts       # Helper ambil semua row tabel `pengaturan` sebagai key-value map
    beranda.ts           # Seluruh query Supabase khusus halaman Beranda (getBerandaData)
  utils/
    cloudinary.ts       # Helper transformasi URL Cloudinary (resize/optimize)
    format.ts            # Format tanggal Indonesia, nomor WA, ringkas teks, dll
  theme-script.ts       # Script anti-flash dark mode (dijalankan sebelum paint pertama)
```

## Komponen Beranda (`components/home/`)

| Komponen | Tipe | Catatan |
|---|---|---|
| `LoadingScreen` | Client | Animasi nama sekolah huruf-per-huruf saat load awal |
| `Hero` | Server | Banner utama + CTA PPDB/Profil |
| `Statistik` | Client | Counter animasi pakai IntersectionObserver |
| `VisiMisi` | Server | Parsing misi dari `<li>` HTML atau baris newline |
| `SambutanKepsek` | Client | Toggle baca selengkapnya |
| `ProfilKompak` | Server | 4 kartu info singkat (status, akreditasi, lokasi, tahun) |
| `PengumumanBanner` | Server | Pengumuman terbaru + countdown hari |
| `AgendaGaleriPreview` | Server | Agenda mendatang + 8 foto galeri terbaru |
| `BeritaTabs` | Client | Tab filter (Semua/Berita/Pengumuman/Prestasi) tanpa reload |
| `PrestasiTerbaru` | Server | 6 kartu prestasi terbaru |
| `KalenderBulanan` | Client | Kalender interaktif, navigasi bulan, klik tanggal (agenda + hari libur) |
| `Ekstrakurikuler` | Client | Grid kartu + modal detail dengan foto dari album terkait |
| `Testimoni` | Client | Show more/less, hanya tampil jika ada testimoni approved |
| `LayananUtama` | Server | Quick links ke PPDB/Profil/GTK/Kontak |
| `MapsSection` | Server | Google Maps embed dari `koordinat_map` |

## Halaman & Komponen Berita (`/berita`, `/berita/[id]`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/berita/page.tsx` | Server | Daftar berita: search + filter kategori + pagination, semua via URL params (server-side, bukan client-side seperti versi PHP lama — lihat catatan di bawah) |
| `app/berita/[id]/page.tsx` | Server | Detail berita, `generateMetadata` dengan OG image Cloudinary resize untuk share WhatsApp/Facebook |
| `BeritaSearchFilter` | Client | Input search (debounce 400ms) + tab kategori, update URL via `router.push` |
| `FeaturedArticle` | Server | Berita unggulan, hanya tampil di page 1 tanpa search/filter |
| `KalenderAgendaInline` | Client | Kalender bulanan, hanya dirender saat kategori="agenda" dipilih |
| `BeritaGrid` | Server | Grid kartu berita + empty state |
| `BeritaPagination` | Server | Navigasi halaman via `<Link>`, mempertahankan search/filter di URL |
| `ShareButtons` | Client | Share WhatsApp/Facebook + copy link (clipboard API) |

**Perubahan dari versi lama:** di `berita.php` PHP, search & filter kategori berjalan
**client-side per halaman** — artinya pencarian hanya berlaku pada 9 item yang
sudah di-load untuk halaman itu, bukan ke seluruh data. Di versi Next.js ini,
search/filter/pagination semua dieksekusi di **server** (Supabase query),
sehingga hasilnya selalu akurat ke seluruh data dan URL-nya bisa di-share/bookmark
(`/berita?cari=...&kategori=...&page=...`).

## Halaman & Komponen Profil (`/profil`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/profil/page.tsx` | Server | Statis dengan ISR (bukan dynamic seperti `/berita`, karena tidak ada searchParams) |
| `AnchorNav` | Client | Sticky nav + scrollspy via `IntersectionObserver` (versi lama pakai scroll listener manual) |
| `ProfilSingkat`, `VisiMisiFull`, `KontakRingkas` | Server | Render data statis dari `pengaturan` |
| `InfoSekolah` | Client | Info grid + counter statistik (pola sama seperti `Statistik` di Beranda) |
| `FasilitasSection` | Client | Grid kartu + modal detail; warna kartu dari `lib/utils/warna.ts` |
| `StrukturOrganisasi` | Server | Foto `foto_struktur` jika ada, atau fallback org chart dari tabel `gtk` |
| `SejarahSekolah` | Client | Toggle baca selengkapnya + fallback timeline otomatis dari `tahun_berdiri` |

**Catatan penting — Tailwind JIT & warna dinamis:** versi PHP lama banyak memakai
class warna hasil string interpolation, misal `bg-<?= $color ?>-100`. Pola ini
**tidak bisa langsung diporting** ke React/Tailwind v4, karena compiler Tailwind
(JIT) hanya menghasilkan CSS untuk class yang muncul **literal** di source code —
class yang dibentuk dari variabel runtime tidak akan terdeteksi dan otomatis
tidak bermunculan. Solusinya: semua kombinasi warna (fasilitas, info sekolah,
kontak) didefinisikan lengkap sebagai object literal di `lib/utils/warna.ts`
(`WARNA_MAP`), lalu dipakai via `getWarna(key)` yang mengembalikan className
literal lengkap. Jika menambah warna baru di tabel `fasilitas`, tambahkan juga
entry-nya di `WARNA_MAP` — kalau tidak, akan fallback ke warna `blue`.

**Kolom yang tidak ada di skema Supabase tapi dipakai versi lama:**
- `nama_kepsek` (pengaturan) → diganti: ambil dari tabel `gtk` kategori `pimpinan`
- `link_gmaps` (pengaturan) → diganti: dibangun otomatis dari `koordinat_map`

## Halaman & Komponen Galeri (`/galeri`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/galeri/page.tsx` | Server | Dua mode di satu route: daftar album (`/galeri`) dan lihat foto (`/galeri?album_id=X`) |
| `AlbumSearch` | Client | Search album dengan debounce 400ms, update URL |
| `AlbumGrid` | Server | Grid kartu album + cover, jumlah foto, tanggal |
| `AlbumHeader` | Server | Info ringkas album saat mode lihat foto |
| `PhotoGridWithLightbox` | Client | Grid foto + lightbox lengkap: navigasi prev/next, thumbnail strip, swipe touch (mobile), keyboard (Esc/←/→) |

**Catatan URL params:** link ke album tertentu memakai `?album_id=<id>` (bukan `?album=`).
Komponen lain yang menautkan ke galeri album spesifik (misalnya kartu Fasilitas di
halaman Profil) harus konsisten memakai `album_id`.

**Fallback album tidak ditemukan:** jika `album_id` di URL tidak cocok dengan
data manapun, halaman otomatis menampilkan mode daftar album (bukan 404),
mengikuti perilaku `galeri.php` versi lama.

## Halaman & Komponen Kontak (`/kontak`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/kontak/page.tsx` | Server | Statis dengan ISR |
| `lib/actions/kontak.ts` | Server Action | Submit form via `insert` ke tabel `pesan`, validasi di server |
| `KontakForm` | Client | Form + rating bintang interaktif (muncul hanya jika "Kirim Sebagai" = testimoni) |
| `InfoKontakList` | Server | Alamat, telepon, YouTube (opsional), email, jam operasional |
| `MapsKontak` | Server | Google Maps embed + kartu alamat melayang |

**Perubahan dari versi lama:** form di `kontak.php` submit via POST tradisional
(reload halaman penuh). Di Next.js, form ini memakai **Server Action** —
submit tanpa reload, dengan state loading/sukses/error dikelola di client
lewat `useTransition`, tapi validasi & insert tetap terjadi di server (aman,
tidak bisa dilewati dari sisi client).

**⚠️ Catatan penting — bug `@supabase/supabase-js@2.108`:** method `.insert()`
pada Database type kustom (bukan hasil generate Supabase CLI) salah meng-infer
parameter sebagai `never`, walau `.select()` dengan Database yang sama berjalan
normal. Ini bug inference di package itu sendiri, bukan kesalahan skema. Solusi
sementara di `lib/actions/kontak.ts`: payload divalidasi penuh oleh TypeScript
sebagai `Partial<Pesan>` lebih dulu, baru di-assert `as never` tepat saat
dipanggil ke `.insert()`. Pola yang sama dipakai lagi di `lib/actions/ppdb.ts`.

## Halaman & Komponen PPDB (`/ppdb`, `/ppdb/cek-status`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/ppdb/page.tsx` | Server, `force-dynamic` | Kuota & status PPDB harus selalu data terbaru, tidak di-cache ISR |
| `app/ppdb/cek-status/page.tsx` | Server (statis) | Shell halaman; data fetch terjadi di Server Action saat submit |
| `lib/actions/ppdb.ts` | Server Action | `daftarPpdb()` — validasi, generate no. pendaftaran, insert ke `pendaftar` |
| `lib/actions/cek-status.ts` | Server Action | `cekStatusPpdb()` — query status berdasarkan NIK |
| `lib/actions/captcha.ts` | Server Action | `getNewCaptcha()` — generate ulang soal saat tombol refresh diklik |
| `lib/utils/captcha.ts` | Util | Captcha matematika **stateless** berbasis HMAC (lihat catatan di bawah) |
| `lib/utils/cloudinary-upload.ts` | Util (client) | Upload file langsung dari browser ke Cloudinary (unsigned preset) |
| `PpdbForm` | Client | Form lengkap: data siswa, ortu, upload 3 dokumen, captcha, submit |
| `PpdbHeader` | Server | Judul + info kuota real-time |
| `PpdbClosed` | Server | Tampilan saat PPDB ditutup atau kuota penuh |
| `CekStatusForm` | Client | Form cek status by NIK, versi proper dari `cek-status.php` lama (yang masih tanpa styling) |

**Perubahan signifikan dari versi lama — alasan teknis:**

1. **Captcha tanpa session.** PHP lama menyimpan jawaban captcha di `$_SESSION`.
   Next.js Server Actions bersifat stateless antar request (tidak ada session
   server bawaan untuk kasus sederhana ini), sehingga captcha diganti dengan
   skema **HMAC-signed token**: soal dibuat di server, jawaban benar di-hash
   bersama secret (`CAPTCHA_SECRET` di `.env.local`) dan dikirim balik ke
   client sebagai token tersembunyi. Saat submit, server menghitung ulang HMAC
   dari jawaban user dan membandingkan dengan token — tanpa perlu menyimpan
   apapun di server. **Wajib isi `CAPTCHA_SECRET`** di `.env.local` dengan
   string acak (`openssl rand -hex 32`) untuk keamanan produksi.

2. **Upload file langsung dari browser ke Cloudinary.** `proses.php` lama
   menerima file di server (`$_FILES`) lalu di-forward ke Cloudinary lewat
   cURL. Next.js App Router (khususnya saat dideploy ke Vercel) punya limit
   ukuran body request yang lebih ketat untuk Server Actions, sehingga upload
   dilakukan **langsung dari client ke Cloudinary** (unsigned upload preset:
   **`web_sekolah`** — satu preset untuk semua jenis file, baik PDF maupun
   gambar; lihat `CLOUDINARY_UPLOAD_PRESET` di
   `lib/utils/cloudinary-upload.ts`). Preset ini **harus** bertipe Unsigned
   di Cloudinary Dashboard. Hasil `secure_url` dari Cloudinary baru dikirim
   ke Server Action untuk disimpan ke Supabase.

3. **Validasi kuota & status PPDB tetap di server**, dicek ulang saat submit
   (bukan hanya saat render halaman) — meniru perilaku `proses.php` yang juga
   re-validasi `status` dan `kuota` sebelum insert, supaya tidak race condition
   kalau banyak orang mendaftar bersamaan.

## Area Admin (`/admin/*`)

Panel admin terpisah total dari sisi publik, dengan auth berbasis **Supabase Auth**
(bukan tabel `admin` MD5 lama — sudah tidak dipakai sama sekali untuk area ini).

### Struktur folder

```
app/
  (public)/                  # Route group: SEMUA halaman publik (tidak muncul di URL)
    layout.tsx                # Navbar + Footer khusus halaman publik
    page.tsx, berita/, profil/, galeri/, kontak/, ppdb/, gtk/, agenda-pengumuman/
  admin/
    layout.tsx                 # Cek user login, render AdminShell (sidebar+topbar)
    login/
      layout.tsx                # Passthrough, supaya TIDAK ikut AdminShell
      page.tsx                  # Form login
    dashboard/page.tsx          # Statistik ringkas (modul CRUD menyusul tahap berikutnya)
    page.tsx                    # Redirect ke /admin/dashboard
  layout.tsx                  # RootLayout minimal: <html>/<head>/<body>, font, dark-mode script

proxy.ts                      # Proteksi /admin/**, refresh session (lihat catatan di bawah)

lib/
  supabase/
    auth-server.ts             # Client Supabase dengan auth, untuk Server Components/Actions
    auth-browser.ts             # Client Supabase dengan auth, untuk Client Components
  actions/
    auth.ts                     # loginAdmin(), logoutAdmin()
  data/
    admin-dashboard.ts          # Query ringkasan statistik dashboard

components/admin/
  LoginForm.tsx                # Form login (Client Component)
  Sidebar.tsx                  # Navigasi sidebar (menu modul CRUD, masih banyak yang kosong)
  Topbar.tsx                   # Info user + tombol logout
  AdminShell.tsx                # Pembungkus Sidebar+Topbar, kelola state mobile menu
```

### Mengapa direstrukturisasi pakai Route Group `(public)`

Awalnya Navbar/Footer dipasang langsung di `app/layout.tsx` (RootLayout), tapi
karena RootLayout membungkus SELURUH route termasuk `/admin/**`, itu membuat
Navbar/Footer publik ikut nempel di atas/bawah halaman admin. Solusinya: folder
`app/(public)/` adalah **Route Group** Next.js (nama dalam kurung tidak muncul
di URL) — Navbar/Footer dipindah ke `app/(public)/layout.tsx`, dan RootLayout
hanya berisi kerangka HTML murni. Jadi `/admin/**` (yang berada di luar
`(public)`) tidak ikut mewarisi Navbar/Footer itu.

### `proxy.ts` (bukan `middleware.ts`)

Next.js 16 men-deprecate **file convention** `middleware.ts` dan menggantinya
dengan `proxy.ts` (cuma rename, isi logic identik — lihat
https://nextjs.org/docs/messages/middleware-to-proxy). Project ini sudah pakai
`proxy.ts` dari awal. **Jangan buat ulang `middleware.ts`** — kalau ada
keduanya, salah satu akan diabaikan dan proteksi auth bisa diam-diam tidak
berjalan.

`proxy.ts` punya dua tugas: (1) refresh token sesi Supabase Auth di setiap
request ke `/admin/**`, (2) redirect ke `/admin/login` jika belum login, atau
redirect ke `/admin/dashboard` jika sudah login tapi mencoba akses
`/admin/login`.

### Cara membuat akun admin pertama

Karena auth pakai Supabase Auth (bukan tabel `admin` lama), kak Imam perlu buat
user secara manual di Supabase Dashboard:

1. Buka **Supabase Dashboard > Authentication > Users**
2. Klik **Add user** → **Create new user**
3. Isi email & password, lalu **centang "Auto Confirm User"** (supaya tidak
   perlu verifikasi email dulu)
4. Login di `/admin/login` pakai email & password tersebut

### Status pengembangan admin panel

| Modul | Status |
|---|---|
| Auth (login/logout, proteksi route) | ✅ Selesai |
| Dashboard (statistik ringkas) | ✅ Selesai |
| **Berita & Agenda** | ✅ **CRUD lengkap** (list+search+filter+pagination, tambah, edit, hapus) |
| **Galeri (Album + Foto)** | ✅ **CRUD lengkap** (album: tambah/edit/hapus; foto: multi-upload, edit caption, hapus) |
| **Fasilitas** | ✅ **CRUD lengkap** (tambah, edit, hapus, toggle aktif/nonaktif cepat) |
| **Ekstrakurikuler** | ✅ **CRUD lengkap** (tambah, edit, hapus, toggle aktif/nonaktif, pilih album foto terkait) |
| **PPDB (Data Pendaftar, Tahun Ajaran)** | ✅ **CRUD lengkap** (lihat detail+dokumen pendaftar, ubah status, kelola tahun ajaran & kuota) |
| **Pesan & Testimoni** | ✅ **CRUD lengkap** (lihat pesan, approve/reject testimoni, hapus, tandai dibaca otomatis) |
| **Hari Libur** | ✅ **CRUD lengkap** (tambah manual, edit, hapus, toggle aktif, filter per tahun) |
| GTK | ⬜ Belum dibangun |
| Pengaturan Situs | ⬜ Belum dibangun |

Menu-menu yang belum dibangun di Sidebar saat ini akan menampilkan 404 jika
diklik — akan menyusul satu per satu di tahap berikutnya.

### Detail modul Berita & Agenda (`/admin/berita`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/admin/berita/page.tsx` | Server, `force-dynamic` | List + search + filter kategori + pagination (server-side, sama filosofi dengan halaman publik) |
| `app/admin/berita/tambah/page.tsx` | Server | Form tambah |
| `app/admin/berita/[id]/edit/page.tsx` | Server | Form edit, 404 jika id tidak ditemukan |
| `lib/data/admin-berita.ts` | — | Query list & getById, pakai `createAuthServerClient` (bukan client publik anon) |
| `lib/actions/admin-berita.ts` | Server Actions | `createBerita()`, `updateBerita()`, `deleteBerita()` — semua memanggil `revalidatePath()` ke halaman publik terkait (`/berita`, `/`, `/berita/[id]`) supaya perubahan langsung terlihat di situs publik tanpa perlu redeploy |
| `BeritaForm` | Client | Form tambah/edit (mode dibedakan via prop), upload gambar langsung ke Cloudinary (preset `web_sekolah`, pola sama dengan PPDB), field khusus muncul otomatis saat kategori = Prestasi |
| `BeritaTable` | Client | Tabel dengan tombol Lihat/Edit/Hapus, konfirmasi hapus inline (bukan modal/alert browser) |
| `AdminBeritaFilter` | Client | Search (debounce) + tab kategori, update URL |
| `AdminPagination` | Server | Navigasi halaman sederhana |

### Detail modul Galeri (`/admin/galeri`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/admin/galeri/page.tsx` | Server, `force-dynamic` | Grid daftar album + jumlah foto per album |
| `app/admin/galeri/tambah/page.tsx` | Server | Form tambah album baru, redirect ke halaman kelola foto setelah berhasil |
| `app/admin/galeri/[id]/page.tsx` | Server | **Halaman utama kelola foto**: multi-upload + grid foto dengan edit caption/hapus |
| `app/admin/galeri/[id]/edit/page.tsx` | Server | Edit info album (nama, deskripsi, cover, tanggal) |
| `lib/data/admin-galeri.ts` | — | Query list album+count, detail album+foto, getById |
| `lib/actions/admin-galeri.ts` | Server Actions | `createAlbum()`, `updateAlbum()`, `deleteAlbum()` (otomatis hapus foto di dalamnya dulu — lihat catatan FK di bawah), `tambahFoto()` (terima array URL, untuk multi-upload), `updateCaptionFoto()`, `hapusFoto()` |
| `AlbumForm` | Client | Form tambah/edit album, upload cover ke Cloudinary |
| `AdminAlbumGrid` | Client | Grid kartu album dengan tombol Kelola Foto/Edit/Hapus |
| `MultiUploadFoto` | Client | Upload beberapa foto sekaligus (loop sekuensial dengan progress, bukan `Promise.all`, supaya tidak membanjiri koneksi & bisa nampilkan progress per file) |
| `AdminFotoGrid` | Client | Grid foto dengan edit caption inline dan hapus per foto |

**Catatan penting — tidak ada FK CASCADE di skema:** komentar di skema SQL
asli menyebutkan `-- Foreign Keys (opsional, aktifkan jika diperlukan)` —
artinya constraint FK antara `foto.album_id` dan `album.id` **tidak aktif**.
Karena itu `deleteAlbum()` secara eksplisit menghapus semua foto dalam album
**dulu**, baru album-nya, supaya tidak ada baris `foto` yang "nyantol" ke
`album_id` yang sudah tidak ada (orphaned rows).

### Detail modul Fasilitas (`/admin/fasilitas`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/admin/fasilitas/page.tsx` | Server, `force-dynamic` | Tabel semua fasilitas (termasuk nonaktif), urut sesuai kolom `urutan` |
| `app/admin/fasilitas/tambah/page.tsx` | Server | Form tambah |
| `app/admin/fasilitas/[id]/edit/page.tsx` | Server | Form edit |
| `lib/data/admin-fasilitas.ts` | — | Query list & getById |
| `lib/actions/admin-fasilitas.ts` | Server Actions | `createFasilitas()`, `updateFasilitas()`, `deleteFasilitas()`, `toggleAktifFasilitas()` (toggle cepat dari tabel tanpa buka form edit) |
| `FasilitasForm` | Client | Dropdown warna (bukan input bebas — lihat catatan di bawah), icon picker dengan daftar umum + opsi custom, preview real-time |
| `FasilitasTable` | Client | Tabel dengan toggle status aktif/nonaktif langsung (klik badge), tombol edit/hapus |

**Catatan penting — kenapa warna harus dropdown, bukan input bebas:** halaman
publik (`FasilitasSection.tsx` di Tahap 4) merender kartu fasilitas dengan
className Tailwind yang diambil dari `lib/utils/warna.ts` (`WARNA_MAP`)
berdasarkan nilai kolom `color`. Tailwind v4 (JIT) hanya menghasilkan CSS
untuk class yang ditulis **literal** di source code — kalau admin mengetik
nama warna sembarangan di kolom `color` (misal "maroon" yang tidak ada di
`WARNA_MAP`), kartu itu akan fallback ke warna `blue` (lihat `getWarna()`)
alih-alih error, tapi tidak akan menampilkan warna yang dimaksud admin. Form
ini sengaja membatasi pilihan jadi dropdown berisi 14 key yang sudah pasti
ada di `WARNA_MAP`, supaya hasilnya selalu sesuai ekspektasi.

### Detail modul Ekstrakurikuler (`/admin/ekstrakurikuler`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/admin/ekstrakurikuler/page.tsx` | Server, `force-dynamic` | Tabel semua ekstrakurikuler + nama album foto terkait |
| `app/admin/ekstrakurikuler/tambah/page.tsx` | Server | Form tambah, fetch daftar album untuk dropdown |
| `app/admin/ekstrakurikuler/[id]/edit/page.tsx` | Server | Form edit |
| `lib/data/admin-ekstrakurikuler.ts` | — | Query list+nama album (join manual via Map, bukan join SQL — konsisten dengan pola di seluruh project ini karena tidak ada FK aktif), getById, daftar opsi album |
| `lib/actions/admin-ekstrakurikuler.ts` | Server Actions | `createEkskul()`, `updateEkskul()`, `deleteEkskul()`, `toggleAktifEkskul()` |
| `EkskulForm` | Client | Icon picker (daftar umum + custom), **dropdown pilih album** foto dokumentasi (bukan ketik manual album_id) |
| `EkskulTable` | Client | Tabel dengan kolom nama album terkait, toggle status, edit/hapus |

**Hubungan dengan modul Galeri:** field `album_id` di ekstrakurikuler menaut ke
tabel `album` (dikelola di `/admin/galeri`) — saat kartu ekstrakurikuler diklik
di halaman publik (Beranda), foto-foto dari album tersebut ditampilkan di
modal detail. Form ini menyediakan dropdown nama album (bukan input ID manual)
supaya admin tidak perlu tahu/menebak `album_id` numerik secara langsung.

### Detail modul PPDB (`/admin/ppdb/pendaftar`, `/admin/ppdb/tahun-ajaran`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/admin/ppdb/pendaftar/page.tsx` | Server, `force-dynamic` | List + search (nama/NIK/no. daftar) + filter status + pagination |
| `app/admin/ppdb/pendaftar/[id]/page.tsx` | Server | Detail lengkap: data siswa, ortu, link dokumen (KK/Akta), pas foto, ubah status |
| `app/admin/ppdb/tahun-ajaran/page.tsx` | Server, `force-dynamic` | Tabel tahun ajaran + jumlah pendaftar + persentase kuota terisi |
| `app/admin/ppdb/tahun-ajaran/tambah/page.tsx`, `[id]/edit/page.tsx` | Server | Form tambah/edit |
| `lib/data/admin-ppdb.ts` | — | Query list pendaftar (dengan status count untuk badge tab), getById, list+getById tahun ajaran |
| `lib/actions/admin-ppdb.ts` | Server Actions | `updateStatusPendaftar()`, `deletePendaftar()`, `createTahunAjaran()`, `updateTahunAjaran()`, `deleteTahunAjaran()` |
| `PendaftarTable` | Client | Dropdown ubah status langsung dari tabel (tanpa buka detail) |
| `PendaftarFilter` | Client | Search (debounce) + tab status dengan count |
| `PendaftarDetail` | Client | Tampilan lengkap 1 pendaftar: field data, link dokumen, foto, tombol ubah status |
| `TahunAjaranForm` | Client | Form dengan validasi format `YYYY/YYYY`, peringatan saat status diset "Buka" |
| `TahunAjaranTable` | Client | Tabel dengan progress kuota, cegah hapus jika masih ada pendaftar terkait |

**Catatan penting — hanya satu tahun ajaran boleh "Buka" sekaligus:** halaman
publik PPDB (`lib/data/ppdb.ts`: `getTahunAjaranAktif()`) mengambil tahun
ajaran aktif dengan `.eq("status", "Buka").limit(1)` — kalau ada lebih dari
satu baris berstatus "Buka" di waktu yang sama, baris mana yang dipakai jadi
tidak terjamin urutannya. Untuk mencegah ini, `createTahunAjaran()` dan
`updateTahunAjaran()` di sisi admin **otomatis menutup semua tahun ajaran
lain** setiap kali satu tahun ajaran di-set "Buka" — meniru constraint
"hanya satu yang aktif" tanpa perlu mengubah skema database itu sendiri.

**Catatan penting — proteksi hapus tahun ajaran:** sama seperti kasus
album/foto, tidak ada FK CASCADE antara `pendaftar.tahun_id` dan
`tahun_ajaran.id`. `deleteTahunAjaran()` mengecek dulu apakah masih ada
pendaftar yang menaut ke tahun ajaran tersebut — jika ada, penghapusan
ditolak dengan pesan jelas (bukan membiarkan baris `pendaftar` jadi orphaned).

### Detail modul Pesan & Testimoni (`/admin/pesan`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/admin/pesan/page.tsx` | Server, `force-dynamic` | List dengan 3 tab: Semua Pesan, Testimoni, Perlu Ditinjau (`status_testi='pending'`) |
| `app/admin/pesan/[id]/page.tsx` | Server | Detail pesan; **otomatis menandai `status='dibaca'`** saat halaman dibuka (lihat `getAdminPesanByIdAndMarkRead`) |
| `lib/data/admin-pesan.ts` | — | Query list per tab + count badge (belum dibaca, testimoni pending) |
| `lib/actions/admin-pesan.ts` | Server Actions | `approveTestimoni()`, `rejectTestimoni()`, `resetStatusTestimoni()` (kembalikan ke pending), `deletePesan()`, `tandaiSudahDibaca()` |
| `PesanTable` | Client | Baris pesan belum dibaca diberi highlight + titik biru; badge status testimoni |
| `PesanTabs` | Server | Navigasi tab via `<Link>` (bukan Client Component — tidak perlu search, jadi cukup link biasa) |
| `PesanDetail` | Client | Isi pesan lengkap + rating bintang (jika testimoni) + tombol approve/reject/reset + tombol balas via email (`mailto:`) |

**Hubungan dengan halaman publik:** komponen `Testimoni.tsx` di Beranda
(Tahap 2) hanya menampilkan pesan dengan `is_testi=true` **dan**
`status_testi='approved'`. Testimoni baru yang masuk dari form Kontak
(Tahap 7) selalu berstatus `pending` dan **tidak akan tampil** di halaman
publik sampai admin menyetujuinya di sini — ini mencegah testimoni asal/spam
langsung muncul tanpa moderasi.

### Detail modul Hari Libur (`/admin/hari-libur`)

| Route / Komponen | Tipe | Catatan |
|---|---|---|
| `app/admin/hari-libur/page.tsx` | Server, `force-dynamic` | Tabel hari libur, filter per tahun (dropdown tahun dinamis dari data yang ada) |
| `app/admin/hari-libur/tambah/page.tsx`, `[id]/edit/page.tsx` | Server | Form tambah/edit |
| `lib/data/admin-hari-libur.ts` | — | Query list (filter tahun), daftar tahun unik untuk dropdown, getById |
| `lib/actions/admin-hari-libur.ts` | Server Actions | `createHariLibur()`, `updateHariLibur()`, `deleteHariLibur()`, `toggleAktifHariLibur()` |
| `HariLiburForm` | Client | Peringatan khusus jika data berasal dari sinkronisasi Google Calendar |
| `HariLiburTable` | Client | Badge ikon sumber (Google/manual), toggle aktif, edit/hapus |
| `HariLiburYearFilter` | Server | Navigasi filter tahun via `<Link>` |

**Catatan penting — data sinkronisasi Google Calendar dilindungi sebagian:**
skema tabel `hari_libur` punya kolom `sumber` (`'manual'` atau
`'google_calendar'`), `gcal_id`, dan `gcal_link` — sisa dari fitur sinkronisasi
otomatis di versi PHP lama (`kelola_libur.php`, belum diporting ulang di
Next.js). Form admin ini:
- **Selalu** men-set `sumber='manual'` saat menambah data baru lewat form
  (tidak mungkin membuat entri palsu yang menyamar sebagai hasil sync)
- **Tidak pernah mengubah** `sumber`, `gcal_id`, atau `gcal_link` saat
  mengedit — kalau baris itu hasil sync, identitas sync-nya tetap
  dipertahankan walau admin mengubah nama/jenis/status aktifnya
- Menampilkan **peringatan visual** di form edit kalau data yang sedang
  diedit berasal dari Google Calendar, supaya admin sadar sebelum mengubah
  tanggal (yang berisiko bertentangan dengan sync berikutnya)

Constraint `UNIQUE (tanggal, nama)` di skema juga ditangani dengan pesan error
yang jelas (`error.code === "23505"`) alih-alih pesan generik "gagal menyimpan".

## Catatan teknis penting

- **Rendering**: ISR (`export const revalidate = 60`) per halaman publik — data cukup
  fresh tanpa perlu render ulang di setiap request. Halaman yang butuh data real-time
  (misal cek status PPDB) akan pakai dynamic rendering di tahap PPDB.
- **Dark mode**: class-based (`.dark` di `<html>`), bukan `prefers-color-scheme` murni,
  supaya pengguna bisa toggle manual dan tersimpan di `localStorage` (sama seperti versi lama).
- **Gambar**: semua foto tetap URL Cloudinary penuh yang tersimpan langsung di kolom
  database (`berita.gambar`, `gtk.foto`, dll). Domain `res.cloudinary.com` sudah
  didaftarkan di `next.config.ts` (`images.remotePatterns`) supaya bisa dipakai
  dengan `next/image`.
- **Skema Supabase**: nama tabel & kolom identik dengan MySQL lama, PK tetap
  `SERIAL` (integer, bukan UUID). Lihat `lib/types/database.ts` untuk tipe lengkapnya.
- **Login admin**: sementara masih berupa modal iframe ke panel admin PHP lama
  (`adminLoginUrl` di `app/layout.tsx`) — akan diganti setelah panel admin
  juga dimigrasi.
- **Pola query Supabase**: anotasikan tipe row secara eksplisit sebelum melakukan
  loop/map atas hasil `.select()` (lihat contoh di `lib/data/pengaturan.ts`).
  Ini menghindari kasus TypeScript meng-infer `never` saat ada banyak layer
  generic (client wrapper + opsi `auth`).

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Import project di Vercel, set Environment Variables sesuai `.env.local.example`.
3. Build command & output default Next.js sudah otomatis terdeteksi Vercel.
