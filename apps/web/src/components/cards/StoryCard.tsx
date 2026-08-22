"use client";

import Link from "next/link";
import { BookOpen, CalendarDays, MapPin } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import { localize, type LocalizedText } from "@/lib/i18n";
import type { ImageSource } from "@/lib/cms";
import { useT } from "@/lib/i18n-client";

export interface StoryCardData {
  href: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  author: LocalizedText;
  place: LocalizedText;
  /** ISO date, e.g. "2026-06-20". */
  date: string;
  image: ImageSource;
  imageAlt?: string;
}

export interface StoryCardProps {
  data: StoryCardData;
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

export function StoryCard({ data, className = "" }: StoryCardProps) {
  const { lang, t } = useT();
  const title = localize(data.title, lang);
  const excerpt = localize(data.excerpt, lang);
  const author = localize(data.author, lang);
  const place = localize(data.place, lang);

  return (
    <article className={`story-card ${className}`.trim()}>
      <div className="story-media">
        <ResponsiveImage src={data.image} alt={data.imageAlt ?? title} mainRendition="fill-400x300" />
      </div>
      <div>
        <div className="story-meta">
          <CalendarDays aria-hidden="true" width={13} height={13} />
          {formatDate(data.date)}
          <span className="story-meta-sep" aria-hidden="true">
            ·
          </span>
          <MapPin aria-hidden="true" width={13} height={13} />
          {place}
        </div>
        <h3 className="story-title">{title}</h3>
        <p className="story-excerpt">{excerpt}</p>
        <div className="story-author">{author}</div>
        <Link href={data.href} className="btn btn-sm btn-ghost">
          <BookOpen aria-hidden="true" />
          {t("common.readMore")}
        </Link>
      </div>
    </article>
  );
}
