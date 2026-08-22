import type { Metadata } from "next";
import { langToLocale } from "./lang-server";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "./site";
import type { Lang } from "./i18n";

interface BuildMetadataOptions {
  title: string;
  description?: string;
  path: string;
  image?: string;
  /** Active language; drives og:locale. Defaults to OM. */
  lang?: Lang;
  /** hreflang alternates. Defaults to all three pointing at the same URL —
   *  language is cookie-negotiated until /om|/en|/am path routing lands. */
  languages?: Record<string, string>;
}

/** Shared per-page metadata (title, description, canonical, OG, Twitter). */
export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  image = "/hero.jpg",
  lang = "om",
  languages,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languages ?? {
        "x-default": url,
        "om-ET": url,
        en: url,
        am: url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: langToLocale(lang),
      type: "website",
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
