"use client";

import { localize, type LocalizedText } from "@/lib/i18n";
import ResponsiveImage from "@/components/ResponsiveImage";
import type { ImageSource } from "@/lib/cms";
import { useT } from "@/lib/i18n-client";

export type SponsorTint = "brand" | "gold";

export interface SponsorCardData {
  name: LocalizedText;
  href: string;
  /** Two-letter mark shown in the pill when no logo is provided. */
  initials: string;
  tint?: SponsorTint;
  /** Optional logo image (CMS object or URL); falls back to initials. */
  logo?: ImageSource;
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
        <ResponsiveImage
          className="sponsor-logo"
          src={data.logo}
          alt={data.logoAlt ?? name}
          mainRendition="fill-400x300"
        />
      ) : (
        <span className="sponsor-mark" aria-hidden="true">
          {data.initials}
        </span>
      )}
      <span className="sponsor-name">{name}</span>
    </a>
  );
}
