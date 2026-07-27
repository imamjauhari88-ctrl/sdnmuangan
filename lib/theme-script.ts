/**
 * Skrip kecil yang disuntik sebagai inline <script> di <head>
 * supaya class "dark" diterapkan ke <html> SEBELUM paint pertama,
 * mencegah flash konten terang sekejap (FOUC) saat tema gelap aktif.
 *
 * Setara dengan script inline di includes/header.php versi lama:
 *   if (localStorage.getItem('theme') === 'dark' || ...) { ... }
 */
export const themeInitScript = `
(function () {
  try {
    var theme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;
