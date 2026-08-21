"use client";

import { localize, type LocalizedText } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";

export interface SupporterCardData {
  name: LocalizedText;
  role: LocalizedText;
  /** Two-letter avatar mark. */
  initials: string;
  /** When provided, the card renders as a link. */
  href?: string;
}

export interface SupporterCardProps {
  data: SupporterCardData;
  className?: string;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SupporterCard({ data, className = "" }: SupporterCardProps) {
  const { lang } = useT();
  const name = localize(data.name, lang);
  const role = localize(data.role, lang);
  const initials = data.initials || initialsOf(name);

  const inner = (
    <>
      <div className="supporter-avatar" aria-hidden="true">
        {initials}
      </div>
      <div>
        <h3 className="supporter-name">{name}</h3>
        <p className="supporter-role">{role}</p>
      </div>
    </>
  );

  const baseClass = `supporter-card ${className}`.trim();

  if (data.href) {
    return (
      <a href={data.href} className={baseClass}>
        {inner}
      </a>
    );
  }

  return <div className={baseClass}>{inner}</div>;
}
