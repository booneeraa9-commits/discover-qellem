// Bilingual EN/OM string system (scaffold).
//
// This module is intentionally free of any React dependency and of any
// "use client" directive so it can be imported from both server and client
// components. The React binding (provider, useT hook, <T> component) lives in
// ./i18n-client.
//
// Language rules (see CONTRIBUTING.md):
//   - Afaan Oromoo (om) is the authoritative content language; EN is reviewed.
//   - No Amharic anywhere.
//   - Strings that are not yet translated carry a "[OM] " marker so reviewers
//     can spot untranslated UI at a glance. See TODO(i18n) notes below.

export type Lang = "en" | "om";

/** A string expressed in both supported languages. OM is authoritative; EN is the review copy. */
export interface LocalizedText {
  en: string;
  om: string;
}

/** Resolve a bilingual string for the active language, falling back to English. */
export function localize(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text.en;
}

export const LANGS: readonly Lang[] = ["en", "om"];

export const DEFAULT_LANG: Lang = "en";

export const LANG_STORAGE_KEY = "dq_lang";
export const LANG_COOKIE = "dq_lang";

export const dict: Record<Lang, Record<string, string>> = {
  en: {
    "brand.title": "Discover Qellem",
    "brand.sub": "Kellem Wollega · Oromia",

    "nav.home": "Home",
    "nav.places": "Places",
    "nav.news": "News",
    "nav.history": "History",
    "nav.support": "Support",
    "nav.main": "Primary",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",

    "lang.switch": "Switch language",
    "theme.toggle": "Toggle dark mode",

    "common.readMore": "Read more",

    "lightbox.label": "Photo viewer",
    "lightbox.close": "Close",
    "lightbox.previous": "Previous",
    "lightbox.next": "Next",
    "lightbox.open": "Open photo",

    "footer.about":
      "A verified, living guide to Kellem Wollega Zone — its twelve woredas and town, history, people and places. Built from official zone sources, the Kellem Wollega Zone Communication Office, and community knowledge.",
    "footer.explore": "Explore",
    "footer.resources": "Resources",
    "footer.contact": "Contact",
    "footer.contribute": "Contribute a story",
    "footer.aboutProject": "About",
    "footer.rights": "All rights reserved.",
    "footer.staff": "Staff",
    "footer.sources": "Sources: Zone profile 2015/16 E.C.",
    "footer.contact.location": "Dembi Dolo, Kellem Wollega",
    "footer.social.mail": "Email",
    "footer.social.site": "Website",
    "footer.social.news": "News",

    "home.hero.imageAlt": "Golden highlands sunset over Kellem Wollega",
    "home.hero.kicker": "Kellem Wollega Zone · Oromia",
    "home.hero.title.1": "A land of green horizons,",
    "home.hero.title.2": "deep roots,",
    "home.hero.title.3": "and open skies.",
    "home.hero.tagline":
      "Kellem Wollega is the western frontier of Oromia — coffee, the Dati Walal forests, rivers and living Oromo culture. Twelve woredas and towns, each with a story of its own. Explore verified facts, people, history and the latest projects shaping the zone today.",
    "home.cta.explore": "Explore woredas",
    "home.cta.support": "Support us",

    "home.quickfacts.population.label": "Population",
    "home.quickfacts.population.value": "1,254,817",
    "home.quickfacts.area.label": "Zone area",
    "home.quickfacts.area.value": "≈ 9,857 km²",
    "home.quickfacts.woredas.label": "Woredas & town",
    "home.quickfacts.woredas.value": "12",
    "home.quickfacts.coffee.label": "Coffee produced",
    "home.quickfacts.coffee.value": "134,213 t",

    "home.stats.kicker": "At a glance",
    "home.stats.title": "Zone at a Glance",
    "home.stats.sub": "Key figures from official sources (2015 & 2016 E.C.).",
    "home.stats.population.label": "Population (2023/24)",
    "home.stats.population.sub": "Zone profile projection",
    "home.stats.area.label": "Zone area",
    "home.stats.area.sub": "2.9% of Oromia",
    "home.stats.woredas.label": "Woredas & town",
    "home.stats.woredas.sub": "289 kebeles",
    "home.stats.coffee.label": "Coffee produced",
    "home.stats.coffee.sub": "tonnes / year",
    "home.stats.livestock.label": "Livestock",
    "home.stats.livestock.sub": "incl. 1,634,514 cattle",
    "home.stats.beehives.label": "Beehives",
    "home.stats.beehives.sub": "339,193 in 2016",

    "home.features.kicker": "What defines Kellem",
    "home.features.title": "A zone of remarkable diversity",
    "home.features.sub":
      "From coffee to the Dati Walal forests, from minerals to living markets — Kellem holds extraordinary natural and cultural wealth.",
    "home.features.explore.title": "Explore the Zone",
    "home.features.explore.text":
      "Eleven woredas and one town — each with a dedicated page, its own history, key facts, attractions, notable people and location map.",
    "home.features.history.title": "History & Culture",
    "home.features.history.text": "From Sayyoo to today — a history drawn from named sources.",
    "home.features.visit.title": "Plan Your Visit",
    "home.features.visit.text": "Seasons, routes and respect — make your visit a welcome one.",

    "home.map.kicker": "Map",
    "home.map.title": "Zone Map",
    "home.map.sub": "Tap a place to open its page.",

    "place.breadcrumb": "Breadcrumb",
    "place.type.woreda": "Woreda",
    "place.type.capital": "Capital",
    "place.intro.kicker": "About",
    "place.intro.title": "Know {name} beyond the name.",
    "place.notable.kicker": "People",
    "place.notable.title": "Notable Figures",
    "place.visit.kicker": "Location",
    "place.visit.title": "Plan your visit",
    "place.map.comingSoon": "Interactive map coming soon",
    "place.back": "Back to places",

  },
  om: {
    "brand.title": "Discover Qellem",
    "brand.sub": "Qeellam Wallaggaa · Oromiyaa",

    "nav.home": "Fuula",
    "nav.places": "Bakkaalee",
    "nav.news": "Oduu",
    "nav.history": "Seenaa",
    "nav.support": "Nu Deeggari",
    // TODO(i18n): get reviewed OM for these a11y/action labels from the content agent.
    "nav.main": "[OM] Primary",
    "nav.openMenu": "[OM] Open menu",
    "nav.closeMenu": "[OM] Close menu",

    "lang.switch": "[OM] Switch language",
    "theme.toggle": "[OM] Toggle dark mode",

    "common.readMore": "Dabalataan ilaali",

    // TODO(i18n): get reviewed OM for the lightbox label from the content agent.
    "lightbox.label": "[OM] Photo viewer",
    "lightbox.close": "Cufi",
    "lightbox.previous": "Duraa",
    "lightbox.next": "Itti aanu",
    "lightbox.open": "[OM] Open photo",

    "footer.about":
      "Qajeelfama jiraataa Qeellam Wallaggaa — aanaalee fi magaalota 12, seenaa, namoota fi bakkaalee. Ragaawwan ofiisaalii, Waajjira Oduu Godina Qeellam Wallaggaa fi beekumsa hawaasaa irraa ijaarame.",
    "footer.explore": "Daawwadhuu",
    // TODO(i18n): get reviewed OM for this column heading from the content agent.
    "footer.resources": "[OM] Resources",
    "footer.contact": "Quunnamtii",
    "footer.contribute": "Seenaa ergi",
    "footer.aboutProject": "Waa'ee",
    "footer.rights": "Mirgi dhalaa eegamaadha.",
    "footer.staff": "Hojjettoota",
    "footer.sources": "Madda: Ragaalee Waajjira Godinaa 2015/16 A.L.I.",
    "footer.contact.location": "Dambi Doolloo, Qeellam Wallaggaa",
    "footer.social.mail": "Imeelii",
    // TODO(i18n): get reviewed OM for these social link labels from the content agent.
    "footer.social.site": "[OM] Website",
    "footer.social.news": "Oduu",

    // TODO(i18n): get reviewed OM for the hero image alt text from the content agent.
    "home.hero.imageAlt": "[OM] Golden highlands sunset over Kellem Wollega",
    "home.hero.kicker": "Godina Qeellam Wallaggaa · Oromiyaa",
    "home.hero.title.1": "Lafa Margaa,",
    "home.hero.title.2": "Hundee Gadi Fageessoo,",
    "home.hero.title.3": "Sammii Banaa.",
    "home.hero.tagline":
      "Qeellam Wallaggaa godina Oromiyaa keessaa isa dhihaati — buna, bosona Dhaatii Walaal, lagee fi aadaa Oromoo kan hawwatu. Aanaalee fi magaalota 12 — tokkoon tokkoon isaanii seenaa mataa isaa qaba. Ragaa mirkanaa'e, namoota, seenaa fi pirojektoota haarawa argadhu.",
    "home.cta.explore": "Aanaalee daawwadhuu",
    "home.cta.support": "Nu deeggari",

    "home.quickfacts.population.label": "Uummata",
    "home.quickfacts.population.value": "1,254,817",
    "home.quickfacts.area.label": "Bal'ina Godinaa",
    "home.quickfacts.area.value": "≈ 9,857 km²",
    "home.quickfacts.woredas.label": "Aanaalee & Magaalaa",
    "home.quickfacts.woredas.value": "12",
    "home.quickfacts.coffee.label": "Oomisha Bunaa",
    "home.quickfacts.coffee.value": "134,213 t",

    "home.stats.kicker": "Gabaabinaan",
    "home.stats.title": "Godina Gabaabinaan",
    "home.stats.sub": "Ragaa waliigalaa ragaa ofiisaalii irraa (2015 fi 2016 A.L.I).",
    "home.stats.population.label": "Baay'ina Uummataa (2016 A.L.I)",
    "home.stats.population.sub": "Tilmaama ragaa godinaa",
    "home.stats.area.label": "Bal'ina Godinaa",
    "home.stats.area.sub": "2.9% Oromiyaa",
    "home.stats.woredas.label": "Aanaalee & Magaalaa",
    "home.stats.woredas.sub": "Gandoota 289",
    "home.stats.coffee.label": "Oomisha Bunaa",
    "home.stats.coffee.sub": "toonnii / waggaa",
    "home.stats.livestock.label": "Horii",
    "home.stats.livestock.sub": "Loon 1,634,514 dabalatee",
    "home.stats.beehives.label": "Gaagura dammaa",
    "home.stats.beehives.sub": "339,193 (2016)",

    "home.features.kicker": "Maaltu Qeellam adda taasisu",
    "home.features.title": "Qabeenyaa fi aadaa adda addaa",
    "home.features.sub":
      "Buna irraa hamma bosona Dhaatii Walaal, mineraala irraa hamma gabaa jireessoo — Qeellam ogummaa fi qabeenyaa uumamaa of keessaa qaba.",
    // TODO(i18n): get reviewed OM for these feature titles from the content agent.
    "home.features.explore.title": "[OM] Explore the Zone",
    "home.features.explore.text":
      "Aanaalee 11 fi magaalaa 1 — tokkoon tokkoon isaanii fuula, seenaa, ragaa fi kaartaa mataa isaa qaba.",
    "home.features.history.title": "Seenaa fi Aadaa",
    "home.features.history.text": "Sayyoo irraa hamma har'aa — seenaa madda beekamaa irraa.",
    "home.features.visit.title": "[OM] Plan Your Visit",
    "home.features.visit.text": "Yeroo, karaa fi kabajaa — daawwannaan kee fudhatamaa haa ta'u.",

    "home.map.kicker": "Kaartaa",
    "home.map.title": "Kaartaa Godina",
    "home.map.sub": "Bakka cuqaasi fuula isaa bana.",

    // TODO(i18n): get reviewed OM for these place-page labels from the content agent.
    "place.breadcrumb": "[OM] Breadcrumb",
    "place.type.woreda": "Aanaa",
    "place.type.capital": "Magaalaa Guddoo",
    "place.intro.kicker": "Waa'ee",
    "place.intro.title": "{name} maqaa isaa ol beeki.",
    "place.notable.kicker": "Namoota",
    "place.notable.title": "Namoota Beekkamoo",
    "place.visit.kicker": "Iddoo",
    "place.visit.title": "Daawwannaa qopheessaa",
    "place.map.comingSoon": "[OM] Interactive map coming soon",
    "place.back": "Gara bakkaaleetti deebi'i",

  },
};

/**
 * Translate `key` for `lang`, falling back to English, then to the raw key.
 * A raw key in the UI is always a bug, so it is better to show the key than
 * to render nothing.
 */
export function translate(lang: Lang, key: string): string {
  return dict[lang][key] ?? dict[DEFAULT_LANG][key] ?? key;
}
