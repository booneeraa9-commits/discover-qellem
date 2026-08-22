"use client";

import { useT } from "@/lib/i18n-client";

/** Visually hidden until focused; jumps keyboard users to the main content. */
export default function SkipLink() {
  const { t } = useT();

  return (
    <a href="#main-content" className="skip-link">
      {t("skip.content")}
    </a>
  );
}
