// Typed mirror of the Wagtail v2 API responses (apps/cms/*/api.py serializers).
//
// Field names map 1:1 to the backend serializer fields. Translated fields use
// the *_om / *_en / *_am convention; *_am is optional while the backend
// Amharic content is finalized — getTranslatedField() falls back to OM and
// fieldNeedsTranslation() flags the gap for QA.
//
// Wagtail wraps pages in a "meta" object (slug, type, detail_url) and returns
// listings as { meta: { total_count }, items: [...] }. Snippets (people,
// timeline, sponsors, supporters) are flat objects with an id.

export interface CmsImageMeta {
  type?: string;
  detail_url?: string;
  download_url?: string;
  width?: number;
  height?: number;
}

export interface CmsImage {
  id: number;
  title: string;
  meta: CmsImageMeta;
  /** Present on /api/v2/images/ responses (issue #112): pre-sized variants.
   *  Page serializers do not embed these yet, so the client enriches images
   *  from the images endpoint via getAllImageRenditions(). */
  renditions?: Record<string, string>;
}

export interface CmsGalleryImage {
  image: CmsImage | null;
  caption_om: string;
  caption_en: string;
  caption_am?: string;
}

export type NewsCategoryKey =
  | "development"
  | "economy"
  | "environment"
  | "minerals"
  | "agriculture"
  | "health"
  | "education"
  | "culture"
  | "trade";

export interface CmsPageMeta {
  type?: string;
  slug?: string;
  detail_url?: string;
  locale?: string;
  [key: string]: unknown;
}

/** archive.NewsArticle (apps/cms/archive/models.py). */
export interface CmsNewsArticle {
  id: number;
  meta: CmsPageMeta;
  title: string; // Wagtail page title (authoritative OM)
  title_om: string;
  title_en: string;
  title_am?: string;
  body_om: string;
  body_en: string;
  body_am?: string;
  category: NewsCategoryKey;
  published_date: string; // ISO 8601
  featured_image: CmsImage | null;
  gallery_images: CmsGalleryImage[];
}

export interface CmsQuickFact {
  label_en: string;
  label_om: string;
  label_am?: string;
  value: string | number;
  unit?: string;
  note_en?: string;
  note_om?: string;
  note_am?: string;
}

export interface CmsNotablePersonRef {
  slug: string;
  name_om: string;
  name_en: string;
  is_zone_notable: boolean;
}

/** places.GeographyProfilePage (apps/cms/places/models.py). */
export interface CmsPlaceProfile {
  id: number;
  meta: CmsPageMeta;
  title: string; // page title = canonical OM name
  geography_slug: string | null;
  geography_name: string | null;
  geography_level: "woreda" | "town" | null;
  introduction: string;
  overview: string;
  naming_origin: string;
  history: string;
  area_location: string;
  featured_image: CmsImage | null;
  hero_image: CmsImage | null;
  intro_om: string;
  intro_en: string;
  intro_am?: string;
  history_om: string;
  history_en: string;
  history_am?: string;
  economy_om: string;
  economy_en: string;
  economy_am?: string;
  culture_om: string;
  culture_en: string;
  culture_am?: string;
  geography_om: string;
  geography_en: string;
  geography_am?: string;
  attractions_om: string;
  attractions_en: string;
  attractions_am?: string;
  quick_facts: CmsQuickFact[];
  latitude: number | null;
  longitude: number | null;
  notable_people_list: CmsNotablePersonRef[];
}

/** archive.Person (apps/cms/archive/models.py). */
export interface CmsPerson {
  id: number;
  name_om: string;
  name_en: string;
  name_am?: string;
  slug: string;
  birth_year: number | null;
  death_year: number | null;
  bio_om: string;
  bio_en: string;
  bio_am?: string;
  photo: CmsImage | null;
  woreda_slugs: string[];
  is_zone_notable: boolean;
}

/** archive.TimelineEvent (apps/cms/archive/models.py). */
export interface CmsTimelineEvent {
  id: number;
  year_om: string;
  year_en: string;
  year_am?: string;
  year_int: number | null;
  title_om: string;
  title_en: string;
  title_am?: string;
  text_om: string;
  text_en: string;
  text_am?: string;
}

/** partners.Sponsor (apps/cms/partners/models.py). */
export interface CmsSponsor {
  id: number;
  display_name: string;
  /** Bilingual display names (issue #117). */
  display_name_en: string;
  display_name_am: string;
  partner_kind: string;
  website_url: string;
  display_mode: "name_only" | "image_and_name";
  recognition_text_om: string;
  recognition_text_en: string;
  sponsorship_level: string;
  display_order: number;
}

/** partners.Collaborator (apps/cms/partners/models.py). */
export interface CmsSupporter {
  id: number;
  display_name: string;
  /** Bilingual display names (issue #117). */
  display_name_en: string;
  display_name_am: string;
  partner_kind: string;
  website_url: string;
  display_mode: string;
  role_om: string;
  role_en: string;
  affiliation_om: string;
  affiliation_en: string;
  contribution_period: string;
  description_om: string;
  description_en: string;
  display_order: number;
}

/** home.HomePage (apps/cms/home/models.py). */
export interface CmsHomePage {
  id: number;
  meta: CmsPageMeta;
  title: string;
  geography_slug: string | null;
  geography_name: string | null;
  introduction: string;
  overview: string;
  naming_summary: string;
  history_summary: string;
  culture_summary: string;
  contribute_summary: string;
  hero_image: CmsImage | null;
  /** Not exposed by the API yet (backend Sprint 4) — kept so the GlanceTable
   *  can start consuming zone stats the moment the home page serializes them. */
  quick_facts?: CmsQuickFact[];
}

export interface CmsListing<T> {
  meta: { total_count: number };
  items: T[];
}
