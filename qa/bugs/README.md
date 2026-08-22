# Baseline bug register

Found by QA. Canonical issue numbers live on GitHub; this file is the quick
index for PR reviewers.

## Open bugs (main @ 490c859, Sprint 6, 2026-08-22)

| GitHub | Sev | Lane | Title | Status |
|---|---|---|---|---|
| [#60](https://github.com/booneeraa9-commits/discover-qellem/issues/60) | P2 | backend | 11 × `treebeard.E001` warnings | DEFERRED (PM) |
| [#68](https://github.com/booneeraa9-commits/discover-qellem/issues/68) | P2 | frontend | `next dev` blocks chunks for 127.0.0.1 (`allowedDevOrigins`) | open |
| [#119](https://github.com/booneeraa9-commits/discover-qellem/issues/119) | P1 | frontend/backend | CMS gallery images 404 — `download_url` relative, not rewritten to CMS origin | open (rebaseline trigger) |
| [#129](https://github.com/booneeraa9-commits/discover-qellem/issues/129) | P1 | frontend | Dark `.lang-label` pill regressed to **1.25:1** (brand-200 on brand-100 — e38aec3 used the light-theme value) | NEW Sprint 6 |
| [#136](https://github.com/booneeraa9-commits/discover-qellem/issues/136) | P1 | frontend/content | AM-draft content shows only `[AM draft]` — OM fallback not rendered alongside | NEW Sprint 6 |

## Closed / resolved

- #63 (README `DATABASE_URL`) — closed by #111.
- #106 (person slug) — closed by #115; canonical `jaal-laggasaa-wagii`.
- #80 (dark-mode contrast family) — CLOSED (fixed in #126 + e38aec3); the only
  residual became the new #129 regression.
- #82 (gold initials) — CLOSED (`--gold-ink` token).
- #121 (`.lang-soon` pill) — CLOSED obsolete (AM enabled; pill removed from the
  DOM; dead CSS remains for cleanup).
- #67 (`.tl-year`/`.person-role`/`.story-author`) — fixed in #126, verified.
- #81 (`/components` in prod) — fixed in #126 (prod 404, dev renders).
- #128 (`/support` duplicate key `OG`) — fixed in e38aec3 (keys by OM name).
- #112 (image renditions) — fixed in #118.
- #122/#123 (partner i18n / Amharic category labels) — fixed in #117.
- #59, #61, #62, #64 — Sprint 1–2. Skip-link contrast — PR #101.

## Sprint 6 sweep (main @ 490c859, production build)

- Full harness (`qa-harness.js`) across 11 routes at 375/768/1280 in both
  themes: no horizontal scroll, **0 broken images** (incl. inauguration gallery
  — the FE mock fallback serves local images), 0 real console/page errors (the
  `?_rsc=` prefetch entries are a close-race harness artifact — verified 0
  after letting the page settle), drawer Esc + lightbox focus trap pass.
- Contrast (`contrast-scan.js`): #80/#67/#82 items all clear **except** the new
  `.lang-label` 1.25:1 dark regression (#129). Light-mode photo-hero readings
  are harness false-positives (text over photo/gradient).
- i18n harness: **29/30** — only 7b2 (AM OM-fallback, #136) fails.
- Lighthouse (production build, budgets in `apps/web/lighthouserc.json`):
  - a11y 0.98–1.0 (>=0.95 ok), best-practices 1.0 ok, seo 1.0 ok.
  - **performance 0.68–0.84 (>=0.90 FAIL)** — blocked on #40 responsive images.
  - PWA not measurable (Lighthouse 12 removed the PWA category) — covered by
    the #19 manual checklist.
  - Run: `cd apps/web && npm run build && npm run start` then
    `npm run qa:lighthouse`.

## Rebaseline trigger (pending)

The PM's full Sprint 6 rebaseline (sweep + re-verify of #80/#82/#119 + staff
page) runs **after #119 + #40 + #38 merge**. Not yet merged as of 2026-08-22.

## Hard gates for PR review (see qa/PR_REVIEW_TEMPLATE.md)

- 9-category taxonomy; `economy` OM = "Dinagdee", `minerals` OM = "Mineraala".
- 12 canonical OM slugs/names; inauguration gallery order project13→6→3→1→2.
- `?lang=am` falls back to OM, never EN (strict `FALLBACK_ORDER=("om",)`).
- Absolute image/rendition URLs (`http(s)`), enforced by contract tests.
- No emojis / no `any` / no console.log / no English-only strings.
