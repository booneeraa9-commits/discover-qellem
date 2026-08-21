"use client";

// Client-side React binding for the EN/OM string system.
//
// Language state lives in a small external store and is consumed through
// useSyncExternalStore. This keeps the server markup (always EN) identical to
// the first client render (no hydration mismatch), lets the persisted
// preference hydrate right after mount, and satisfies the
// react-hooks/set-state-in-effect rule by never calling setState in an effect.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANG,
  LANG_COOKIE,
  LANG_STORAGE_KEY,
  translate,
  type Lang,
} from "./i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => undefined,
  toggleLang: () => undefined,
  t: (key: string) => translate(DEFAULT_LANG, key),
});

function isLang(value: unknown): value is Lang {
  return value === "en" || value === "om";
}

function readStoredLang(): Lang {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (isLang(stored)) return stored;
    const cookie = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${LANG_COOKIE}=`));
    if (cookie) {
      const value = cookie.slice(LANG_COOKIE.length + 1);
      if (isLang(value)) return value;
    }
  } catch {
    // Storage may be unavailable (privacy mode); fall through to default.
  }
  return DEFAULT_LANG;
}

// Module-level store so the snapshot reference is stable across renders.
const langStore = {
  lang: DEFAULT_LANG as Lang,
  listeners: new Set<() => void>(),

  subscribe(listener: () => void): () => void {
    langStore.listeners.add(listener);
    return () => {
      langStore.listeners.delete(listener);
    };
  },

  getSnapshot(): Lang {
    return langStore.lang;
  },

  apply(next: Lang): void {
    // Mirror the language onto <html lang> and persist it (best-effort).
    document.documentElement.setAttribute("lang", next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // Persistence is best-effort; in-memory state still works.
    }
    if (langStore.lang !== next) {
      langStore.lang = next;
      langStore.listeners.forEach((listener) => listener());
    }
  },

  /** Pull the persisted preference into the store once, after hydration. */
  hydrate(): void {
    langStore.apply(readStoredLang());
  },
};

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore<Lang>(
    langStore.subscribe,
    langStore.getSnapshot,
    () => DEFAULT_LANG,
  );

  useEffect(() => {
    langStore.hydrate();
  }, []);

  const setLang = useCallback((next: Lang) => langStore.apply(next), []);
  const toggleLang = useCallback(
    () => langStore.apply(langStore.getSnapshot() === "en" ? "om" : "en"),
    [],
  );
  const t = useCallback((key: string) => translate(lang, key), [lang]);

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/** Access the active language and a `t()` translator from any client component. */
export function useT(): LangContextValue {
  return useContext(LangContext);
}

/** Renders a dictionary entry, e.g. <T k="nav.home" />. */
export function T({ k }: { k: string }) {
  const { t } = useT();
  return <>{t(k)}</>;
}
