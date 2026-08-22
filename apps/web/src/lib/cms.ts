// Typed client for the Wagtail v2 API (apps/cms/*/api.py).
//
// - fetchCms<T>() GETs JSON from the CMS with a short timeout.
// - Concrete fetchers mirror the backend endpoints 1:1.
// - When NEXT_PUBLIC_CMS_MOCK === "1" or the fetch fails (e.g. the CMS is not
//   reachable during CI), every fetcher falls back to the local
//   news-data / places-data / timeline-data / zone-data files so the site
//   still builds and renders.
//
// Base URL resolution:
//   NEXT_PUBLIC_CMS_API_URL   -> use verbatim (e.g. "/api/v2" behind a BFF
//                                proxy, or "http://localhost:8000/api/v2")
//   NEXT_PUBLIC_CMS_URL       -> append "/api/v2"
//   (unset)                   -> "/api/v2" (same-origin; server-side fetches
//                                of a relative URL fail -> mock fallback)

import type { Lang, LocalizedText } from "@/lib/i18n";
import { NEWS } from "@/lib/news-data";
import { PLACES } from "@/lib/places-data";
import { TIMELINE } from "@/lib/timeline-data";
import { ZONE_PEOPLE, ZONE_SPONSORS, ZONE_SUPPORTERS } from "@/lib/zone-data";
import type {
  CmsGalleryImage,
  CmsHomePage,
  CmsImage,
  CmsListing,
  CmsNewsArticle,
  CmsPerson,
  CmsPlaceProfile,
  CmsSponsor,
  CmsSupporter,
  CmsTimelineEvent,
  NewsCategoryKey,
} from "./cms/types";

export * from "./cms/types";

const CMS_TIMEOUT_MS = 3000;

export const CMS_MOCK = process.env.NEXT_PUBLIC_CMS_MOCK === "1";

function resolveCmsApiUrl(): string {
  const api = process.env.NEXT_PUBLIC_CMS_API_URL;
  if (api) return api.replace(/\/+$/, "");
  const host = process.env.NEXT_PUBLIC_CMS_URL;
  if (host) return `${host.replace(/\/+$/, "")}/api/v2`;
  return "/api/v2";
}

export const CMS_API_URL = resolveCmsApiUrl();

/** GET JSON from the CMS, aborting after CMS_TIMEOUT_MS. */
export async function fetchCms<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  let base = CMS_API_URL;
  if (base.startsWith("/")) {
    // Relative URLs only work from the browser (BFF proxy). Server-side they
    // cannot be resolved, so surface a controlled error -> mock fallback.
    if (typeof window === "undefined") {
      throw new Error(
        "CMS API base URL is relative; set NEXT_PUBLIC_CMS_API_URL to an absolute URL for server-side fetching.",
      );
    }
    base = `${window.location.origin}${base}`;
  }

  const url = new URL(`${base}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CMS_TIMEOUT_MS);
  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`CMS responded ${response.status} for ${path}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// ---- fetch result cache (listings are static between deploys) --------------
const listingCache = new Map<string, Promise<unknown>>();

function memo<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const hit = listingCache.get(key);
  if (hit) return hit as Promise<T>;
  const pending = loader();
  listingCache.set(key, pending);
  return pending;
}

// ---- mock fallback wiring --------------------------------------------------
async function withFallback<T>(key: string, loader: () => Promise<T>, mock: () => T): Promise<T> {
  if (CMS_MOCK) return mock();
  return memo(key, loader).catch(() => mock());
}

// ---- helpers ---------------------------------------------------------------

/** Pick the right *_om / *_en / *_am field for `lang`, with an OM-first fallback.
 *  An empty Amharic field yields the "[AM draft]" placeholder (the convention
 *  established in the i18n scaffold). */
export function getTranslatedField(
  obj: unknown,
  field: string,
  lang: Lang,
  fallbackLang: Lang = "om",
): string {
  const record = (obj ?? {}) as Record<string, unknown>;
  const pick = (l: Lang): string => {
    const value = record[`${field}_${l}`];
    return typeof value === "string" ? value : "";
  };

  const primary = pick(lang);
  if (primary.trim() !== "") return primary;
  if (lang === "am") return "[AM draft]";

  const fallback = pick(fallbackLang);
  if (fallback.trim() !== "") return fallback;
  if (fallbackLang !== "en") {
    const en = pick("en");
    if (en.trim() !== "") return en;
  }
  return "";
}

/** Build a tri-lingual LocalizedText from a *_om / *_en / *_am field group. */
export function localizedField(obj: unknown, field: string): LocalizedText {
  return {
    om: getTranslatedField(obj, field, "om", "en"),
    en: getTranslatedField(obj, field, "en", "om"),
    am: getTranslatedField(obj, field, "am"),
  };
}

/** Extract a displayable image URL from a Wagtail image object. */
export function imageUrl(image: CmsImage | null | undefined, fallback = ""): string {
  const url = image?.meta?.download_url;
  return url && url.length > 0 ? url : fallback;
}

/** Strip Wagtail rich-text markup down to plain text. */
export function stripRichText(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Split Wagtail rich text into plain-text paragraphs. */
export function richTextParagraphs(html: string | null | undefined): string[] {
  const cleaned = html ?? "";
  const blocks = cleaned.split(/<\/p>/i).map((b) => stripRichText(b)).filter(Boolean);
  if (blocks.length > 1) return blocks;
  const text = stripRichText(cleaned);
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Truncate text to a displayable teaser. */
export function truncateText(text: string, max = 220): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut}…`;
}

/** Two-letter initials from a display name. */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// 9-category taxonomy (apps/cms/archive/models.py NewsCategory).
export const NEWS_CATEGORY_LABELS: Record<NewsCategoryKey, LocalizedText> = {
  development: { en: "Development", om: "Misooma", am: "[AM draft]" },
  economy: { en: "Economy", om: "Dinagdee", am: "[AM draft]" },
  environment: { en: "Environment", om: "Naannoo", am: "[AM draft]" },
  minerals: { en: "Minerals", om: "Mineraala", am: "[AM draft]" },
  agriculture: { en: "Agriculture", om: "Qonna", am: "[AM draft]" },
  health: { en: "Health", om: "Fayyaa", am: "[AM draft]" },
  education: { en: "Education", om: "Barnoota", am: "[AM draft]" },
  culture: { en: "Culture", om: "Aadaa", am: "[AM draft]" },
  trade: { en: "Trade", om: "Daldala", am: "[AM draft]" },
};

// ---- fetchers --------------------------------------------------------------

export async function getAllNews(): Promise<CmsNewsArticle[]> {
  const listing = await withFallback<CmsListing<CmsNewsArticle>>(
    "news",
    () => fetchCms("/pages/", { type: "archive.NewsArticle", fields: "*" }),
    () => ({ meta: { total_count: mockNews().length }, items: mockNews() }),
  );
  return listing.items;
}

export async function getNewsBySlug(slug: string): Promise<CmsNewsArticle | null> {
  const all = await getAllNews();
  return all.find((article) => (article.meta?.slug ?? "") === slug) ?? null;
}

export async function getAllPlaces(): Promise<CmsPlaceProfile[]> {
  const listing = await withFallback<CmsListing<CmsPlaceProfile>>(
    "places",
    () => fetchCms("/pages/", { type: "places.GeographyProfilePage", fields: "*" }),
    () => ({ meta: { total_count: mockPlaces().length }, items: mockPlaces() }),
  );
  return listing.items;
}

export async function getPlaceBySlug(slug: string): Promise<CmsPlaceProfile | null> {
  const all = await getAllPlaces();
  return (
    all.find(
      (place) =>
        (place.meta?.slug ?? "") === slug || (place.geography_slug ?? "") === slug,
    ) ?? null
  );
}

export async function getAllPeople(): Promise<CmsPerson[]> {
  const listing = await withFallback<CmsListing<CmsPerson>>(
    "people",
    () => fetchCms("/people/", { fields: "*" }),
    () => ({ meta: { total_count: mockPeople().length }, items: mockPeople() }),
  );
  return listing.items;
}

export async function getTimeline(): Promise<CmsTimelineEvent[]> {
  const listing = await withFallback<CmsListing<CmsTimelineEvent>>(
    "timeline",
    () => fetchCms("/timeline/", { fields: "*" }),
    () => ({ meta: { total_count: mockTimeline().length }, items: mockTimeline() }),
  );
  return listing.items;
}

export async function getSponsors(): Promise<CmsSponsor[]> {
  const listing = await withFallback<CmsListing<CmsSponsor>>(
    "sponsors",
    () => fetchCms("/sponsors/", { fields: "*" }),
    () => ({ meta: { total_count: mockSponsors().length }, items: mockSponsors() }),
  );
  return listing.items;
}

export async function getSupporters(): Promise<CmsSupporter[]> {
  const listing = await withFallback<CmsListing<CmsSupporter>>(
    "supporters",
    () => fetchCms("/supporters/", { fields: "*" }),
    () => ({ meta: { total_count: mockSupporters().length }, items: mockSupporters() }),
  );
  return listing.items;
}

export async function getHomePage(): Promise<CmsHomePage | null> {
  const listing = await withFallback<CmsListing<CmsHomePage>>(
    "home",
    () => fetchCms("/pages/", { type: "home.HomePage", fields: "*" }),
    () => ({ meta: { total_count: 0 }, items: [] }),
  );
  return listing.items[0] ?? null;
}

// ---- local-data mock mappers -----------------------------------------------

function mockImage(src: string, id: number): CmsImage {
  return { id, title: "", meta: { download_url: src } };
}

function mockNews(): CmsNewsArticle[] {
  return NEWS.map((article, i) => ({
    id: i + 1,
    meta: { slug: article.slug, type: "archive.NewsArticle" },
    title: article.title.om,
    title_om: article.title.om,
    title_en: article.title.en,
    title_am: article.title.am,
    body_om: article.body.map((p) => `<p>${p.om}</p>`).join(""),
    body_en: article.body.map((p) => `<p>${p.en}</p>`).join(""),
    body_am: "[AM draft]",
    category: article.categoryKey as NewsCategoryKey,
    published_date: article.date,
    featured_image: article.image ? mockImage(article.image, i + 1) : null,
    gallery_images: article.gallery.map(
      (g, j): CmsGalleryImage => ({
        image: mockImage(g.src, j + 1),
        caption_om: g.caption ?? "",
        caption_en: g.caption ?? "",
        caption_am: "[AM draft]",
      }),
    ),
  }));
}

function mockPlaces(): CmsPlaceProfile[] {
  return PLACES.map((place, i) => {
    const byKicker = (keyword: string) =>
      place.sections.find((s) => s.kicker.en.toLowerCase().includes(keyword));
    const history = byKicker("history");
    const economy = byKicker("econom");
    const attractions = byKicker("attract");

    return {
      id: i + 1,
      meta: { slug: place.slug, type: "places.GeographyProfilePage" },
      title: place.name.om,
      geography_slug: place.slug,
      geography_name: place.name.om,
      geography_level: place.type === "town" ? "town" : "woreda",
      introduction: "",
      overview: "",
      naming_origin: "",
      history: "",
      area_location: "",
      featured_image: mockImage(place.heroImage, i + 1),
      hero_image: mockImage(place.heroImage, i + 1),
      intro_om: place.intro.map((p) => `<p>${p.om}</p>`).join(""),
      intro_en: place.intro.map((p) => `<p>${p.en}</p>`).join(""),
      intro_am: "[AM draft]",
      history_om: history ? history.paragraphs.map((p) => `<p>${p.om}</p>`).join("") : "",
      history_en: history ? history.paragraphs.map((p) => `<p>${p.en}</p>`).join("") : "",
      history_am: "[AM draft]",
      economy_om: economy ? economy.paragraphs.map((p) => `<p>${p.om}</p>`).join("") : "",
      economy_en: economy ? economy.paragraphs.map((p) => `<p>${p.en}</p>`).join("") : "",
      economy_am: "[AM draft]",
      culture_om: "",
      culture_en: "",
      culture_am: "[AM draft]",
      geography_om: "",
      geography_en: "",
      geography_am: "[AM draft]",
      attractions_om: attractions
        ? attractions.paragraphs.map((p) => `<p>${p.om}</p>`).join("")
        : "",
      attractions_en: attractions
        ? attractions.paragraphs.map((p) => `<p>${p.en}</p>`).join("")
        : "",
      attractions_am: "[AM draft]",
      quick_facts: place.quickFacts.map((fact) => ({
        label_om: fact.label.om,
        label_en: fact.label.en,
        label_am: fact.label.am,
        value: typeof fact.value === "string" ? fact.value : fact.value.en,
      })),
      latitude: place.coords[0],
      longitude: place.coords[1],
      notable_people_list: place.people.map((person) => ({
        slug: person.slug,
        name_om: person.name.om,
        name_en: person.name.en,
        is_zone_notable: false,
      })),
    };
  });
}

function parseYears(years: string): { birth: number | null; death: number | null } {
  const range = years.match(/(\d{3,4})\s*[-–—]\s*(\d{3,4})/);
  if (range) return { birth: parseInt(range[1], 10), death: parseInt(range[2], 10) };
  const open = years.match(/(\d{4})\s*[-–—]\s*$/);
  if (open) return { birth: parseInt(open[1], 10), death: null };
  const died = years.match(/d\.?\s*(\d{4})/i);
  if (died) return { birth: null, death: parseInt(died[1], 10) };
  const approx = years.match(/(\d{4})/);
  if (approx) return { birth: parseInt(approx[1], 10), death: null };
  return { birth: null, death: null };
}

function mockPeople(): CmsPerson[] {
  return ZONE_PEOPLE.map((person, i) => {
    const { birth, death } = parseYears(person.years);
    return {
      id: i + 1,
      name_om: person.name.om,
      name_en: person.name.en,
      name_am: person.name.am,
      slug: person.slug,
      birth_year: birth,
      death_year: death,
      bio_om: person.role.om,
      bio_en: person.role.en,
      bio_am: person.role.am,
      photo: person.image ? mockImage(person.image, i + 1) : null,
      woreda_slugs: [],
      is_zone_notable: true,
    };
  });
}

function mockTimeline(): CmsTimelineEvent[] {
  return TIMELINE.map((event, i) => ({
    id: i + 1,
    year_om: event.year.om,
    year_en: event.year.en,
    year_am: event.year.am,
    year_int: i,
    title_om: event.title.om,
    title_en: event.title.en,
    title_am: event.title.am,
    text_om: event.text.om,
    text_en: event.text.en,
    text_am: event.text.am,
  }));
}

function mockSponsors(): CmsSponsor[] {
  return ZONE_SPONSORS.map((sponsor, i) => ({
    id: i + 1,
    display_name: sponsor.name.om,
    partner_kind: "organization",
    website_url: sponsor.href.startsWith("http") ? sponsor.href : "",
    display_mode: "name_only",
    recognition_text_om: "",
    recognition_text_en: "",
    sponsorship_level: "",
    display_order: i,
  }));
}

function mockSupporters(): CmsSupporter[] {
  return ZONE_SUPPORTERS.map((supporter, i) => ({
    id: i + 1,
    display_name: supporter.name.om,
    partner_kind: "organization",
    website_url: supporter.href ?? "",
    display_mode: "name_only",
    role_om: supporter.role.om,
    role_en: supporter.role.en,
    affiliation_om: "",
    affiliation_en: "",
    contribution_period: "",
    description_om: "",
    description_en: "",
    display_order: i,
  }));
}
