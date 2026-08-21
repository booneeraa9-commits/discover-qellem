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
