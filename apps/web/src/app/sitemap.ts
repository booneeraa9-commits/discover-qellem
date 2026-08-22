import type { MetadataRoute } from "next";
import { getAllNews, getAllPlaces } from "@/lib/cms";
import { SITE_URL } from "@/lib/site";

// /staff (disallowed in robots) and /offline (utility) are intentionally
// excluded. Slugs come from the CMS with the local mock fallback.
const STATIC_ROUTES = ["", "/places", "/news", "/history", "/support", "/contribute", "/about"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, places] = await Promise.all([getAllNews(), getAllPlaces()]);
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const placeEntries: MetadataRoute.Sitemap = places.map((place) => ({
    url: `${SITE_URL}/place/${place.geography_slug ?? place.meta?.slug ?? ""}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const newsEntries: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${SITE_URL}/news/${article.meta?.slug ?? ""}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...placeEntries, ...newsEntries];
}
