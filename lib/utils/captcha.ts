import { createHmac } from "crypto";

/**
 * Captcha matematika sederhana tanpa session server (Next.js Server Actions
 * bersifat stateless antar request, beda dari PHP yang punya $_SESSION).
 *
 * Pola: soal dibuat di server, jawaban benar di-hash (HMAC) bersama soal
 * dan dikirim balik ke client sebagai token tersembunyi di form. Saat
 * submit, server menghitung ulang HMAC dari (soal, jawaban_user) dan
 * membandingkan dengan token — tanpa perlu menyimpan apapun di server.
 *
 * Secret memakai env var biasa (bukan NEXTAUTH_SECRET dkk yang belum ada
 * di project ini); fallback string statis tetap lebih baik dari tanpa
 * captcha sama sekali, tapi sebaiknya kak Imam set CAPTCHA_SECRET di
 * .env.local untuk keamanan produksi yang lebih baik.
 */

const SECRET = process.env.CAPTCHA_SECRET ?? "ppdb-captcha-fallback-secret-tamansareh2";

export interface CaptchaChallenge {
  soalText: string; // contoh: "4 + 7"
  token: string; // HMAC dari hasil yang benar
}

function signAnswer(answer: number): string {
  return createHmac("sha256", SECRET).update(String(answer)).digest("hex");
}

/** Buat soal captcha baru + token HMAC dari jawaban yang benar */
export function generateCaptcha(): CaptchaChallenge {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const correctAnswer = num1 + num2;

  return {
    soalText: `${num1} + ${num2}`,
    token: signAnswer(correctAnswer),
  };
}

/** Verifikasi jawaban user terhadap token HMAC yang dikirim balik dari form */
export function verifyCaptcha(userAnswer: number, token: string): boolean {
  if (!token || isNaN(userAnswer)) return false;
  const expectedToken = signAnswer(userAnswer);
  return expectedToken === token;
}
