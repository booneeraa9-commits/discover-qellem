import type { Metadata } from "next";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "./site";

interface BuildMetadataOptions {
  title: string;
  description?: string;
  path: string;
  image?: string;
  /**
   * hreflang alternates. Defaults to pointing all three languages at the same
   * URL — language is negotiated client-side until the ?lang param and the
   * backend *_am fields land (coordinated AM-enable flip).
   */
  languages?: Record<string, string>;
}

/** Shared per-page metadata (title, description, canonical, OG, Twitter). */
export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  image = "/hero.jpg",
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
      locale: "en_US",
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
