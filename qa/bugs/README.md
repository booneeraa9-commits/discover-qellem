# Baseline bug register

Found by QA. Canonical issue numbers live on GitHub; this file is the quick
index for PR reviewers.

## Open bugs (main @ 8a9e7f3 — Sprint 5, 2026-08-22)

| GitHub | Sev | Lane | Title | Status |
|---|---|---|---|---|
| [#60](https://github.com/booneeraa9-commits/discover-qellem/issues/60) | P2 | backend | 11 × `treebeard.E001` warnings | **DEFERRED** (PM) |
| [#66](https://github.com/booneeraa9-commits/discover-qellem/issues/66) | P2 | frontend | Touch targets: nav 39px, brand 42px, filter tabs 40px remain | open (partial) |
| [#68](https://github.com/booneeraa9-commits/discover-qellem/issues/68) | P2 | frontend | `next dev` blocks chunks for 127.0.0.1 (`allowedDevOrigins`) | open |
| [#80](https://github.com/booneeraa9-commits/discover-qellem/issues/80) | P1 | frontend | **PARTIAL after #126** — dark active-nav/chips/card-chips fixed; residuals: `.lang-label` pill 2.54:1 dark, light photo-hero `.active` 1.21:1 | BLOCKS #126/#127 |
| [#82](https://github.com/booneeraa9-commits/discover-qellem/issues/82) | P2 | frontend | **PARTIAL after #126** — sponsor initials fixed (`--gold-ink`); `.chip.gold` "Coming soon / Chapa" still 4.37:1 light | BLOCKS #126/#127 |
| [#112](https://github.com/booneeraa9-commits/discover-qellem/issues/112) | P2 | backend | `/api/v2/images/` renditions | PR **#118** (verified live) |
| [#119](https://github.com/booneeraa9-commits/discover-qellem/issues/119) | P1 | frontend/backend | CMS gallery images 404 (`/media/` download_url not rewritten to CMS origin) | open |
| [#122](https://github.com/booneeraa9-commits/discover-qellem/issues/122) | P1 | backend/content | Partners `display_name_en/am` + `?lang=` | PR **#117** (verified live) |
| [#123](https://github.com/booneeraa9-commits/discover-qellem/issues/123) | P1 | backend/content | `NewsCategory` Amharic labels | PR **#117** (`NEWS_CATEGORY_LABELS_AM`) |
| [#128](https://github.com/booneeraa9-commits/discover-qellem/issues/128) | P2 | frontend | `/support` duplicate React key `OG` (cards keyed by initials) | **NEW Sprint 5** |

## Resolved / verified

- #63 (README `DATABASE_URL` docs) — **closed by #111**.
- #106 (person slug) — **closed by #115**; canonical slug `jaal-laggasaa-wagii`.
- #67 (`.tl-year`/`.person-role`/`.story-author` 4.2:1) — **FIXED by #126** (verified: gone from the scan).
- #81 (`/components` in prod) — **FIXED by #126** (route absent from prod build; dev still renders).
- #121 (`.lang-soon` pill 3.09/3.49:1) — **MOOTED by #127**: the flip enables AM and removes the "Coming soon" pill from the DOM (verified).
- #59, #61, #62, #64 — Sprint 1–2 resolutions. Skip-link contrast — PR #101, final PASS.

## Sprint 5 sweep results

- **main @ 8a9e7f3 baseline:** no hscroll, no missing alt, 0 console/page
  errors across 25 routes; drawer Esc + lightbox focus trap pass. Contrast
  #80/#67/#82 unchanged (no fix merged yet) + #121 new.
- **PR #126 (pre-flip) re-measure:** #67 fully fixed; #82 sponsor-initials
  fixed; #80 dark items fixed; residuals = `.lang-label` 2.54:1 dark,
  light-hero `.active` 1.21:1, `.chip.gold` 4.37:1 (blocking).
- **i18n flip (#127, stacked on #126):** `qa/scripts/i18n/lang-check.js`
  passes **24/24** on the branch (first-paint OM, toggles, cookie persistence,
  404 + /offline in AM, Ethiopic gating, `[AM draft]` AM-only, hreflang
  om-ET/en/am/x-default). **Held** until the 3 contrast residuals are zero.
- **Contract tests:** 20 active + 7 gated pass on main; all 27 pass against a
  combined #117+#118 branch (verified). Gated tests un-skip when the BE merges.

## Hard gates for PR review (see qa/PR_REVIEW_TEMPLATE.md)

- 9-category taxonomy; `economy` OM = "Dinagdee", `minerals` OM = "Mineraala".
- 12 canonical OM slugs/names; inauguration gallery order project13→6→3→1→2.
- `?lang=am` falls back to OM, never EN (strict `FALLBACK_ORDER=("om",)` once
  #117 lands).
- No new `--brand-400`-on-dark or white-chip-in-dark instances.
- No emojis / no `any` / no console.log / no English-only strings.
