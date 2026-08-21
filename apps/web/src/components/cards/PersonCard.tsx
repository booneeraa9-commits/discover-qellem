"use client";

import { localize, type LocalizedText } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";

export interface PersonCardData {
  slug: string;
  name: LocalizedText;
  /** Lifespan or tenure, e.g. "1943–2019". */
  years: string;
  /** One-line role/bio. */
  role: LocalizedText;
  /** Portrait URL. Falls back to initials when omitted. */
  image?: string;
  imageAlt?: string;
}

export interface PersonCardProps {
  data: PersonCardData;
  className?: string;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word.length > 1)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PersonCard({ data, className = "" }: PersonCardProps) {
  const { lang } = useT();
  const name = localize(data.name, lang);
  const role = localize(data.role, lang);

  return (
    <a href={`/person/${data.slug}`} className={`person-card person-card-link ${className}`.trim()}>
      {data.image ? (
        <div
          className="person-avatar person-photo"
          role="img"
          aria-label={data.imageAlt ?? name}
          style={{ backgroundImage: `url(${data.image})` }}
        />
      ) : (
        <div className="person-avatar" aria-hidden="true">
          {initialsOf(name)}
        </div>
      )}
      <div className="person-body">
        <div className="person-role">{data.years}</div>
        <h4 className="person-name">{name}</h4>
        <p className="person-bio">{role}</p>
      </div>
    </a>
  );
}
