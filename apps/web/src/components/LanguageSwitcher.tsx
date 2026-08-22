"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Globe } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { useT } from "@/lib/i18n-client";

interface LangOption {
  code: Lang;
  labelKey: string;
}

// Language endonyms live in the dict ("lang.name.*") so every UI string stays
// routed through i18n; they render identically in every language.
const LANG_OPTIONS: LangOption[] = [
  { code: "om", labelKey: "lang.name.om" },
  { code: "en", labelKey: "lang.name.en" },
  { code: "am", labelKey: "lang.name.am" },
];

function langCode(lang: Lang): string {
  return lang === "om" ? "OM" : lang === "en" ? "EN" : "AM";
}

/**
 * Compact language dropdown for the nav action cluster. Keeps the existing
 * Globe + code-pill button shape; expands into a 3-option menu (OM/EN/AM).
 * Choosing a language sets the dq_lang cookie (via the i18n store) and calls
 * router.refresh() so server components re-render in the new language.
 */
export function LangMenu() {
  const { t, lang, setLang } = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const choose = useCallback(
    (code: Lang) => {
      setLang(code);
      close();
      router.refresh();
    },
    [setLang, close, router],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open, close]);

  return (
    <div className="lang-menu" ref={rootRef}>
      <button
        type="button"
        className="icon-btn lang-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t("lang.menu")}
        title={t("lang.switch")}
      >
        <Globe aria-hidden="true" width={18} height={18} />
        <span className="lang-label">{langCode(lang)}</span>
      </button>

      {open ? (
        <div className="lang-menu-panel">
          {LANG_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              className="lang-menu-item"
              data-active={lang === option.code ? "true" : undefined}
              onClick={() => choose(option.code)}
            >
              <span>{t(option.labelKey)}</span>
              {lang === option.code ? (
                <Check aria-hidden="true" width={14} height={14} />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Vertical 3-option language list for the mobile drawer. Same behaviour as
 * the dropdown: sets the cookie and refreshes server components.
 */
export function LangList({ onSelect }: { onSelect?: () => void }) {
  const { t, lang, setLang } = useT();
  const router = useRouter();

  return (
    <div className="drawer-langs">
      {LANG_OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          className={`drawer-lang-item${lang === option.code ? " active" : ""}`}
          onClick={() => {
            setLang(option.code);
            onSelect?.();
            router.refresh();
          }}
        >
          <span>{t(option.labelKey)}</span>
        </button>
      ))}
    </div>
  );
}
