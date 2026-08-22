"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import { localize, type LocalizedText } from "@/lib/i18n";
import type { ImageSource } from "@/lib/cms";
import { useT } from "@/lib/i18n-client";

export interface PlaceCardData {
  /** Canonical slug (qa/CONTENT_FACTS.md §3), e.g. "dambi-doolloo". */
  slug: string;
  name: LocalizedText;
  teaser: LocalizedText;
  image: ImageSource;
  imageAlt?: string;
  /** Quick-stat chip shown over the image, e.g. { label: "Population", value: "59,343" }. */
  statLabel: LocalizedText;
  statValue: string;
}

export interface PlaceCardProps {
  data: PlaceCardData;
  className?: string;
}

export function PlaceCard({ data, className = "" }: PlaceCardProps) {
  const { lang } = useT();
  const name = localize(data.name, lang);
  const teaser = localize(data.teaser, lang);
  const statLabel = localize(data.statLabel, lang);

  return (
    <Link href={`/place/${data.slug}`} className={`place-card ${className}`.trim()}>
      <div className="place-media">
        <ResponsiveImage src={data.image} alt={data.imageAlt ?? name} mainRendition="fill-400x300" />
        <span className="place-stat-chip">
          {statLabel}: {data.statValue}
        </span>
        <span className="place-arrow" aria-hidden="true">
          <ArrowRight />
        </span>
      </div>
      <div className="place-body">
        <h3 className="place-title">{name}</h3>
        <p className="place-sub">{teaser}</p>
      </div>
    </Link>
  );
}
