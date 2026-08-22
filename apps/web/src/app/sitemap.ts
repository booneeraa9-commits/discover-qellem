import type { MetadataRoute } from "next";
import { newsSlugs } from "@/lib/news-data";
import { placeSlugs } from "@/lib/places-data";
import { SITE_URL } from "@/lib/site";

// /staff (disallowed in robots) and /offline (utility) are intentionally
// excluded. Rebuilt from the CMS in #30.
const STATIC_ROUTES = ["", "/places", "/news", "/history", "/support", "/contribute", "/about"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const placeEntries: MetadataRoute.Sitemap = placeSlugs.map((slug) => ({
    url: `${SITE_URL}/place/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const newsEntries: MetadataRoute.Sitemap = newsSlugs.map((slug) => ({
    url: `${SITE_URL}/news/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...placeEntries, ...newsEntries];
}
