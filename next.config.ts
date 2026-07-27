import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Foto tetap dilayani dari Cloudinary (keputusan migrasi),
        // path dibiarkan terbuka karena tiap cloud account punya
        // banyak folder/public_id acak.
        pathname: "/**",
      },
    ],
    // Pakai custom loader (lib/utils/cloudinaryLoader.ts) supaya next/image
    // TIDAK diproses ulang lewat Vercel Image Optimization (kuotanya
    // terbatas di paket gratis) — gambar sudah dioptimasi Cloudinary
    // sendiri (q_auto,f_auto) lewat helper cldThumb/cldWide/cldOptimized.
    // Dengan loader custom, remotePatterns di atas praktis jadi dokumentasi
    // saja (tidak divalidasi Next untuk sumber yang lewat loader ini).
    loader: "custom",
    loaderFile: "./lib/utils/cloudinaryLoader.ts",
  },
};

export default nextConfig;
