"use server";

import { generateCaptcha, type CaptchaChallenge } from "@/lib/utils/captcha";

/** Server Action untuk minta soal captcha baru, dipanggil dari client saat refresh */
export async function getNewCaptcha(): Promise<CaptchaChallenge> {
  return generateCaptcha();
}
