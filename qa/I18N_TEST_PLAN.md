# QA i18n test plan — Afaan Oromoo default + Amharic 3rd language (issue #87)

> Owner: QA. Target state for the #85 flip (OM default) + #86 (Amharic content).
> **This plan tests the flip — it does not implement it.** The flip is the
> frontend's job; QA verifies each item below once the PR lands.
>
> Current state on `main @ 9798162` is recorded per item as
> **CURRENT** (what the code does today) vs **TARGET** (what the flip must do).

---

## 0. Setup

```bash
cd apps/web && npm install && npm run dev   # http://localhost:3000
# Harness:
cd qa/scripts/i18n && npm install puppeteer-core
BASE_URL=http://localhost:3000 node lang-check.js
```

The harness asserts the TARGET behaviour and prints PASS/FAIL per check. Until
#85 lands it is expected to report several FAILs — that is the point.

---

## 1. DEFAULT_LANG = "om" and no first-paint EN flash

- **CURRENT:** `DEFAULT_LANG: Lang = "en"` (`apps/web/src/lib/i18n.ts`). SSR
  `<html lang="en">` in `layout.tsx`. Language is applied only on hydration
  (`langStore.hydrate()`), so even a stored `dq_lang=om` renders an EN flash.
- **TARGET:**
  1. `DEFAULT_LANG` = `"om"`.
  2. The pre-paint script in `layout.tsx` (currently the theme init script)
     also sets `document.documentElement.setAttribute("lang", "om")` by
     default (no stored pref) — mirroring the demo's behaviour. It must run
     before first paint, exactly like the theme init script.
  3. SSR `<html lang="om">` (not `"en"`).
- **Test:** open a fresh incognito profile (no localStorage) → before any
  interaction, `document.documentElement.lang === "om"` and the hero renders
  the OM strings ("Lafa Margaa, …") with no visible EN frame. Harness check:
  `fresh first paint lang == om`.

## 2. `<html lang>` matches the active language

- **TARGET:** `lang` attribute is exactly `om` | `en` | `am` and tracks the
  switcher (and the persisted pref on reload).
- **Test:** for each of om/en/am: click the switcher → assert
  `document.documentElement.lang === <code>`; reload → still `<code>` (cookie/
  localStorage read back). Harness checks per language.

## 3. hreflang tags render om-ET / en / am / x-default on every page

- **CURRENT:** root `layout.tsx` sets `alternates.languages = {"om-ET": "/",
  en: "/", am: "/"}` — three codes, no `x-default`, and all hrefs are `"/"`
  regardless of page.
- **TARGET:** every route emits `<link rel="alternate" hreflang="om-ET">`,
  `hreflang="en"`, `hreflang="am"`, **plus `hreflang="x-default"` pointing at
  the OM default**, each pointing at **that page's own URL** (not all `"/"`).
  Amharic hreflang should be `am` (per PM; flag if it should be `am-ET`).
- **Test:** on `/`, `/places`, `/place/dambi-doolloo`, `/news`, `/history`,
  assert four alternates with the correct codes AND hrefs matching the current
  pathname. Harness checks 3a–3d on `/` + spot routes.
- **CURRENT gap:** no `x-default` (harness `3d` fails until the flip PR adds it).

## 4. Noto Sans Ethiopic only when lang=am

- **CURRENT:** `:lang(om)` and `:lang(am)` font-stack overrides exist in
  `globals.css` (`--sans`/`--serif`); Noto Sans Ethiopic is loaded via
  `next/font` with `subsets: ["ethiopic"]` and no preload. This part already
  looks correct — verify no bleed.
- **TARGET:** computed `--sans` on `<html>` contains `noto`/`ethiopic` only
  when `lang="am"`; for `en`/`om` it is Inter + Fraunces only.
- **Test:** for each language, read
  `getComputedStyle(document.documentElement).getPropertyValue("--sans")` and
  `--serif`; assert ethiopic present iff lang=am. Also spot-check rendered
  glyphs (a Latin "A" must not use the Ethiopic face when en/om). Harness
  check per language.

## 5. "[AM draft]" placeholders are AM-only

- **CURRENT:** the `am` dict is mostly `"[AM draft]"` (except language
  endonyms); EN/OM dicts never contain the marker.
- **TARGET (must not regress):** when `lang=am`, untranslated keys render
  `"[AM draft]"`; when `lang=en` or `lang=om`, **no** `[AM draft]` string
  appears anywhere in the DOM (grep `document.body.innerText`).
- **Test:** switch to am → nav labels show `[AM draft]`; switch to en/om →
  assert `!document.body.innerText.includes("[AM draft]")`. Harness check.
- **Content gate for #86:** once real Amharic lands, a key is "filled" iff its
  value ≠ `"[AM draft]"`; filled keys render Amharic, unfilled keep the marker.
  The content PR must not ship `"[AM draft]"` in the EN/OM dicts.

## 6. Language switcher: AM enabled end-to-end

- **CURRENT:** `LanguageSwitcher` renders AM with `disabled: true` + a
  "Coming soon" hint (`LANG_OPTIONS` in `apps/web/src/components/LanguageSwitcher.tsx`).
- **TARGET:** the AM option is enabled (`aria-disabled` removed), and a click:
  1. sets the store to `am`,
  2. writes `dq_lang=am` to localStorage **and** the `dq_lang` cookie,
  3. re-renders in Amharic (nav shows `[AM draft]` for unfilled keys,
     `አማርኛ` endonym),
  4. activates Noto Sans Ethiopic,
  5. sets `<html lang="am">`.
- **Test:** click AM → assert all five. Then reload → still `am`. Then switch
  back to OM/EN and assert no `[AM draft]`. Harness check.

## 7. Fallback: empty AM falls back to OM (never EN)

- **CURRENT:** `translate(lang, key)` = `dict[lang][key] ?? dict[DEFAULT_LANG][key] ?? key`
  (falls back to `DEFAULT_LANG`, which is `en` today). `localize(text, lang)` =
  `text[lang] ?? text.en` (falls back to EN).
- **TARGET:** with `DEFAULT_LANG="om"`, `translate` falls back OM-first. And
  `localize` must become `text[lang] ?? text.om` (OM-first, per the
  `getTranslatedField` convention) so an empty AM field renders OM, never EN.
- **Test:** unit-level — `localize({om:"X", en:"Y", am:""}, "am") === "X"`.
  Runtime-level — on a CMS-wired page where `title_am` is empty, the rendered
  title is the OM string. (Runtime check is only meaningful after #30 lands;
  the unit check runs now.)

---

## 8. Regression sweep (run after the flip lands)

- No horizontal scroll at 375px in all three languages (Amharic is wider —
  check `.nav-links`, hero, and card titles specifically).
- Dark mode still readable with Ethiopic glyphs (gold/brand tokens unchanged).
- `[AM draft]` never appears in EN/OM; no emojis; `<html lang>` correct;
  hreflang correct; touch targets unchanged.
- The Sprint-3 contrast bugs (#80/#82/#121) must not regress in AM.

## 9. Sign-off bar

The flip PR is APPROVED by QA only when the harness (`qa/scripts/i18n/lang-check.js`,
now 20 checks) reports **20/20**:

- 1a/1b — OM first paint (no EN flash).
- 2a/2b — `<html lang>` tracks the switcher and the pref **persists across reload**.
- 2c — `/404` and `/offline` render in the toggled language.
- 3a–3d — hreflang `om-ET` / `en` / `am` / `x-default` present.
- 4a–4c — Ethiopic font only when lang=am.
- 5a–5c — `[AM draft]` shown in AM only; OM fallback visible where AM is blank;
  no EN leak; never in EN/OM.
- 6a–6f — AM option enabled end-to-end (aria-disabled removed, click → cookie →
  Amharic re-render + Ethiopic).

File bugs (frontend lane) for anything that fails, with the harness line that
caught it. Also confirm the §1 pre-paint script and the §3 `x-default` addition
are part of the flip PR scope.
