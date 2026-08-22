// Adapters that map CMS responses (lib/cms) into the existing view/card prop
// types, so cards and views do not need to change their shapes. Translated
// *_om / *_en / *_am fields become tri-lingual LocalizedText for client-side
// language switching.

import type {
  NewsCardData,
  PersonCardData,
  PlaceCardData,
  SponsorCardData,
  SupporterCardData,
} from "@/components/cards";
import { dict, type LocalizedText } from "@/lib/i18n";
import {
  getTranslatedField,
  imageUrl,
  initialsOf,
  localizedField,
  NEWS_CATEGORY_LABELS,
  richTextParagraphs,
  stripRichText,
  truncateText,
} from "@/lib/cms";
import type {
  CmsNewsArticle,
  CmsPerson,
  CmsPlaceProfile,
  CmsQuickFact,
  CmsSponsor,
  CmsSupporter,
  CmsTimelineEvent,
  NewsCategoryKey,
} from "@/lib/cms/types";
import type { NewsArticle } from "@/lib/news-data";
import type {
  Place,
  PlacePerson,
  PlaceQuickFact,
  PlaceSection,
} from "@/lib/places-data";
import type { TimelineEvent } from "@/lib/timeline-data";
import type { GlanceRow } from "@/lib/zone-data";

// ---- small internal helpers ------------------------------------------------

function getStr(obj: unknown, key: string): string {
  const value = (obj as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function zipParagraphs(om: string[], en: string[]): LocalizedText[] {
  const length = Math.max(om.length, en.length, 0);
  const out: LocalizedText[] = [];
  for (let i = 0; i < length; i += 1) {
    out.push({ om: om[i] ?? "", en: en[i] ?? om[i] ?? "", am: "[AM draft]" });
  }
  return out;
}

function sectionLabel(dictKey: string): LocalizedText {
  return {
    om: dict.om[dictKey] ?? "",
    en: dict.en[dictKey] ?? "",
    am: dict.am[dictKey] ?? "[AM draft]",
  };
}

function formatQuickFactValue(fact: CmsQuickFact): string {
  const value =
    typeof fact.value === "number" ? fact.value.toLocaleString("en-US") : String(fact.value);
  return fact.unit ? `${value} ${fact.unit.replace("km2", "km²")}` : value;
}

function yearsLabel(person: CmsPerson): string {
  if (person.birth_year && person.death_year) return `${person.birth_year}–${person.death_year}`;
  if (person.birth_year) return `${person.birth_year}–`;
  if (person.death_year) return `d. ${person.death_year}`;
  return "";
}

function personName(person: Pick<CmsPerson, "name_om" | "name_en">): LocalizedText {
  return {
    om: person.name_om,
    en: person.name_en || person.name_om,
    am: "[AM draft]",
  };
}

const CATEGORY_ORDER: NewsCategoryKey[] = [
  "development",
  "economy",
  "environment",
  "minerals",
  "agriculture",
  "health",
  "education",
  "culture",
  "trade",
];

export interface CategoryOption {
  key: string;
  label: LocalizedText;
}

/** Unique category chips for a news listing, in the canonical taxonomy order. */
export function categoriesFor(articles: CmsNewsArticle[]): CategoryOption[] {
  const seen = new Set(articles.map((article) => article.category));
  return CATEGORY_ORDER.filter((key) => seen.has(key)).map((key) => ({
    key,
    label: NEWS_CATEGORY_LABELS[key],
  }));
}

// ---- card adapters ---------------------------------------------------------

export function cmsToNewsCard(article: CmsNewsArticle): NewsCardData {
  const om = truncateText(stripRichText(article.body_om) || article.title_om, 220);
  const en = truncateText(stripRichText(article.body_en) || article.title_en, 220);
  return {
    href: `/news/${article.meta?.slug ?? ""}`,
    category: NEWS_CATEGORY_LABELS[article.category] ?? {
      en: article.category,
      om: article.category,
      am: "[AM draft]",
    },
    date: article.published_date,
    title: localizedField(article, "title"),
    excerpt: { om: om || article.title_om, en: en || article.title_en, am: "[AM draft]" },
    image: imageUrl(article.featured_image, "/hero.jpg"),
  };
}

export function cmsToPlaceCard(place: CmsPlaceProfile): PlaceCardData {
  const name = place.geography_name ?? place.title;
  const population = place.quick_facts.find((fact) => fact.label_en === "Population");
  return {
    slug: place.geography_slug ?? place.meta?.slug ?? "",
    name: { om: name, en: name, am: "[AM draft]" },
    teaser: {
      om: truncateText(stripRichText(place.intro_om), 200),
      en: truncateText(stripRichText(place.intro_en), 200),
      am: "[AM draft]",
    },
    image: imageUrl(place.hero_image ?? place.featured_image, "/hero.jpg"),
    statLabel: population
      ? localizedField(population, "label")
      : { en: "Population", om: "Uummata", am: "[AM draft]" },
    statValue: population ? formatQuickFactValue(population) : "",
  };
}

export function cmsToPersonCard(person: CmsPerson): PersonCardData {
  const omBio = stripRichText(person.bio_om);
  const enBio = stripRichText(person.bio_en) || omBio;
  return {
    slug: person.slug,
    name: {
      om: person.name_om,
      en: person.name_en || person.name_om,
      am: getTranslatedField(person, "name", "am"),
    },
    years: yearsLabel(person),
    role: { om: omBio, en: enBio, am: "[AM draft]" },
    image: imageUrl(person.photo) || undefined,
  };
}

export function cmsToSponsorCard(sponsor: CmsSponsor): SponsorCardData {
  return {
    name: {
      om: sponsor.display_name,
      en: sponsor.display_name,
      am: "[AM draft]",
    },
    href: sponsor.website_url || "/support",
    initials: initialsOf(sponsor.display_name),
    tint: (sponsor.display_order ?? 0) % 2 === 0 ? "brand" : "gold",
  };
}

export function cmsToSupporterCard(supporter: CmsSupporter): SupporterCardData {
  return {
    name: {
      om: supporter.display_name,
      en: supporter.display_name,
      am: "[AM draft]",
    },
    role: {
      om: supporter.role_om,
      en: supporter.role_en || supporter.role_om,
      am: "[AM draft]",
    },
    initials: initialsOf(supporter.display_name),
    href: supporter.website_url || undefined,
  };
}

// ---- page-level adapters ---------------------------------------------------

export function cmsToTimeline(event: CmsTimelineEvent): TimelineEvent {
  return {
    year: { om: event.year_om, en: event.year_en || event.year_om, am: "[AM draft]" },
    title: localizedField(event, "title"),
    text: localizedField(event, "text"),
  };
}

export function cmsToNewsArticle(article: CmsNewsArticle): NewsArticle {
  const omParas = richTextParagraphs(article.body_om);
  const enParas = richTextParagraphs(article.body_en);
  const omExcerpt = truncateText(stripRichText(article.body_om) || article.title_om, 240);
  const enExcerpt = truncateText(stripRichText(article.body_en) || article.title_en, 240);

  return {
    slug: article.meta?.slug ?? "",
    categoryKey: article.category,
    category: NEWS_CATEGORY_LABELS[article.category] ?? {
      en: article.category,
      om: article.category,
      am: "[AM draft]",
    },
    date: article.published_date,
    // NewsArticle pages do not serialize a place yet (backend Sprint 4);
    // ArticleView hides this row when empty.
    place: { en: "", om: "", am: "[AM draft]" },
    title: localizedField(article, "title"),
    excerpt: { om: omExcerpt, en: enExcerpt, am: "[AM draft]" },
    body: zipParagraphs(omParas, enParas),
    image: imageUrl(article.featured_image, "/hero.jpg"),
    gallery: article.gallery_images.map((item) => ({
      src: imageUrl(item.image, "/hero.jpg"),
      caption: item.caption_en || item.caption_om || undefined,
    })),
  };
}

export function cmsToPlace(
  profile: CmsPlaceProfile,
  peopleById?: Map<string, CmsPerson>,
): Place {
  const name = profile.geography_name ?? profile.title;

  const intro: LocalizedText[] = zipParagraphs(
    richTextParagraphs(profile.intro_om),
    richTextParagraphs(profile.intro_en),
  );

  const section = (dictKey: string, field: string): PlaceSection => ({
    kicker: sectionLabel(dictKey),
    title: sectionLabel(dictKey),
    paragraphs: zipParagraphs(
      richTextParagraphs(getStr(profile, `${field}_om`)),
      richTextParagraphs(getStr(profile, `${field}_en`)),
    ),
  });

  const sections: PlaceSection[] = [];
  for (const [dictKey, field] of [
    ["place.section.history", "history"],
    ["place.section.economy", "economy"],
    ["place.section.culture", "culture"],
    ["place.section.geography", "geography"],
    ["place.section.attractions", "attractions"],
  ] as const) {
    if (
      (getStr(profile, `${field}_om`) + getStr(profile, `${field}_en`)).trim().length > 0
    ) {
      sections.push(section(dictKey, field));
    }
  }

  const quickFacts: PlaceQuickFact[] = profile.quick_facts.map((fact) => ({
    label: localizedField(fact, "label"),
    value: formatQuickFactValue(fact),
  }));

  const people: PlacePerson[] = profile.notable_people_list.map((ref) => {
    const full = peopleById?.get(ref.slug);
    if (full) {
      const omBio = stripRichText(full.bio_om);
      const enBio = stripRichText(full.bio_en) || omBio;
      return {
        slug: full.slug,
        name: personName(full),
        years: yearsLabel(full),
        role: { om: omBio, en: enBio, am: "[AM draft]" },
        image: imageUrl(full.photo) || undefined,
      };
    }
    return {
      slug: ref.slug,
      name: personName(ref),
      years: "",
      role: { en: "", om: "", am: "[AM draft]" },
    };
  });

  return {
    slug: profile.geography_slug ?? profile.meta?.slug ?? "",
    type: profile.geography_level === "town" ? "town" : "woreda",
    name: { om: name, en: name, am: "[AM draft]" },
    tagline: {
      om: stripRichText(profile.intro_om),
      en: stripRichText(profile.intro_en) || stripRichText(profile.intro_om),
      am: "[AM draft]",
    },
    heroImage: imageUrl(profile.hero_image ?? profile.featured_image, "/hero.jpg"),
    heroAlt: { om: name, en: name, am: "[AM draft]" },
    quickFacts,
    intro,
    sections,
    people,
    coords: [profile.latitude ?? 8.5, profile.longitude ?? 34.8],
  };
}

/**
 * Zone-stats rows for the home GlanceTable. The home page API does not expose
 * zone statistics yet (CmsHomePage.quick_facts is absent from the serializer),
 * so this returns null and callers fall back to the locally mirrored
 * ZONE_GLANCE facts. The moment the backend serializes home-page stats, this
 * starts returning them without any page changes.
 */
export function homeGlanceRows(home: unknown): GlanceRow[] | null {
  const facts = (home as { quick_facts?: CmsQuickFact[] } | null | undefined)?.quick_facts;
  if (!facts || facts.length === 0) return null;
  return facts.map((fact) => ({
    label: localizedField(fact, "label"),
    value: formatQuickFactValue(fact),
    note:
      getStr(fact, "note_om") || getStr(fact, "note_en")
        ? { om: getStr(fact, "note_om"), en: getStr(fact, "note_en"), am: "[AM draft]" }
        : undefined,
  }));
}
