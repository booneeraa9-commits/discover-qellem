import { cookies } from "next/headers";
import { DEFAULT_LANG, isLang, LANG_COOKIE, type Lang } from "@/lib/i18n";

/**
 * Language preference cookie. Name: `dq_lang` (see LANG_COOKIE in i18n.ts).
 * Possible values: "om" | "en" | "am". Default is "om" (authoritative).
 */

/** Resolve the request language from the `dq_lang` cookie, defaulting to OM. */
export async function resolveRequestLang(): Promise<Lang> {
  try {
    const store = await cookies();
    const raw = store.get(LANG_COOKIE)?.value;
    if (isLang(raw)) return raw;
  } catch {
    // cookies() throws outside a request scope (e.g. during static analysis);
    // fall through to the default.
  }
  return DEFAULT_LANG;
}

const LOCALE_BY_LANG: Record<Lang, string> = {
  om: "om_ET",
  en: "en_US",
  am: "am_ET",
};

export function langToLocale(lang: Lang): string {
  return LOCALE_BY_LANG[lang];
}
