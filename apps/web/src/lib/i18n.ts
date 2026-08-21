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

    "lang.switch": "Switch language",
    "theme.toggle": "Toggle dark mode",
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
    "lang.switch": "[OM] Switch language",
    "theme.toggle": "[OM] Toggle dark mode",
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
