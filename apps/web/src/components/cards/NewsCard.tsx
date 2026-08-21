"use client";

import Link from "next/link";
import { localize, type LocalizedText } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";

export interface NewsCardData {
  href: string;
  category: LocalizedText;
  /** ISO date, e.g. "2026-08-21". */
  date: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  image: string;
  imageAlt?: string;
}

export interface NewsCardProps {
  data: NewsCardData;
  className?: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function NewsCard({ data, className = "" }: NewsCardProps) {
  const { lang } = useT();
  const title = localize(data.title, lang);
  const excerpt = localize(data.excerpt, lang);
  const category = localize(data.category, lang);

  return (
    <article className={`news-card ${className}`.trim()}>
      <Link href={data.href} className="news-media" aria-label={title}>
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS-provided image; next/image wiring lands in Sprint 3 */}
        <img src={data.image} alt={data.imageAlt ?? title} loading="lazy" />
        <span className="news-cat">{category}</span>
      </Link>
      <div className="news-body">
        <div className="news-date">{formatDate(data.date)}</div>
        <h3 className="news-title">
          <Link href={data.href}>{title}</Link>
        </h3>
        <p className="news-excerpt">{excerpt}</p>
      </div>
    </article>
  );
}
