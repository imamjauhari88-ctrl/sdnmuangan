/**
 * Upload file langsung dari browser ke Cloudinary (unsigned upload),
 * pengganti proses upload via cURL dari server PHP di proses.php versi lama.
 *
 * Catatan keamanan: ini AMAN karena unsigned upload preset secara desain
 * dibuat untuk dipanggil langsung dari client (tidak butuh API secret).
 * Cloud name & preset adalah informasi publik, bukan kredensial rahasia.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

/**
 * Nama upload preset di Cloudinary akun kak Imam. Berbeda dari asumsi awal
 * (preset_pdf/preset_foto dari pola penamaan di proses.php versi lama),
 * akun ini hanya punya SATU preset unsigned bernama "web_sekolah" yang
 * dipakai untuk semua jenis file (PDF maupun gambar).
 */
export const CLOUDINARY_UPLOAD_PRESET = "web_sekolah";

export type CloudinaryResourceType = "image" | "raw";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export async function uploadToCloudinary(
  file: File,
  uploadPreset: string,
  resourceType: CloudinaryResourceType
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME belum diset di .env.local");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Upload Cloudinary gagal (${res.status}): ${errBody.slice(0, 200)}`);
  }

  const data = await res.json();
  if (!data.secure_url) {
    throw new Error("Upload Cloudinary tidak mengembalikan secure_url");
  }

  return { secure_url: data.secure_url, public_id: data.public_id };
}
