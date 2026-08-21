"use client";

import { localize, type LocalizedText } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";

export type SponsorTint = "brand" | "gold";

export interface SponsorCardData {
  name: LocalizedText;
  href: string;
  /** Two-letter mark shown in the pill when no logo is provided. */
  initials: string;
  tint?: SponsorTint;
  /** Optional logo image URL; falls back to the initials mark. */
  logo?: string;
  logoAlt?: string;
}

export interface SponsorCardProps {
  data: SponsorCardData;
  className?: string;
}

export function SponsorCard({ data, className = "" }: SponsorCardProps) {
  const { lang } = useT();
  const name = localize(data.name, lang);
  const tint = data.tint ?? "brand";

  return (
    <a
      href={data.href}
      className={`sponsor-pill sponsor-pill-${tint} ${className}`.trim()}
      target={data.href.startsWith("http") ? "_blank" : undefined}
      rel={data.href.startsWith("http") ? "noreferrer" : undefined}
    >
      {data.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-provided logo; next/image wiring lands in Sprint 3
        <img className="sponsor-logo" src={data.logo} alt={data.logoAlt ?? name} loading="lazy" />
      ) : (
        <span className="sponsor-mark" aria-hidden="true">
          {data.initials}
        </span>
      )}
      <span className="sponsor-name">{name}</span>
    </a>
  );
}
