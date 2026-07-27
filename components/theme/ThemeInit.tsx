"use client";

import { useServerInsertedHTML } from "next/navigation";
import { themeInitScript } from "@/lib/theme-script";

export default function ThemeInit() {
  useServerInsertedHTML(() => {
    return (
      <script
        id="theme-init"
        dangerouslySetInnerHTML={{ __html: themeInitScript }}
      />
    );
  });
  return null;
}