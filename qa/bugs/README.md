# Baseline bug register

Found by QA. Canonical issue numbers live on GitHub; this file is the quick
index for PR reviewers.

## Open bugs (main @ 7ea8e97, 2026-08-22)

| GitHub | Sev | Lane | Title | Status |
|---|---|---|---|---|
| [#60](https://github.com/booneeraa9-commits/discover-qellem/issues/60) | P2 | backend | 11 × `treebeard.E001` warnings | open |
| [#63](https://github.com/booneeraa9-commits/discover-qellem/issues/63) | P1 | backend/docs | README `DATABASE_URL` ignored; no `.env` load for native dev | open |
| [#66](https://github.com/booneeraa9-commits/discover-qellem/issues/66) | P2 | frontend | Touch targets: nav 39px, brand 42px, filter tabs 40px remain (footer/mailto/staff/icon/social/page-btn fixed) | partial |
| [#67](https://github.com/booneeraa9-commits/discover-qellem/issues/67) | P2 | frontend | `.kicker` fixed via `--kicker-accent`; `.tl-year` + `.person-role` + `.story-author` still 4.11–4.24:1 dark | partial |
| [#68](https://github.com/booneeraa9-commits/discover-qellem/issues/68) | P2 | frontend | `next dev` blocks chunks for 127.0.0.1 (`allowedDevOrigins`) | open |
| [#80](https://github.com/booneeraa9-commits/discover-qellem/issues/80) | P1 | frontend | Dark: active-nav 2.54, lang-label 2.54, chip 2.54, `.news-cat`/`.place-stat-chip` 1.41; Light: photo-hero active-nav 1.21 (white on mint) | open |
| [#81](https://github.com/booneeraa9-commits/discover-qellem/issues/81) | P2 | frontend | `/components` ships in prod build (robots/sitemap now exclude it) | open |
| [#82](https://github.com/booneeraa9-commits/discover-qellem/issues/82) | P2 | frontend | Gold `--gold-700` on `--gold-100` = 4.37:1 — sponsor initials + `.chip.gold` ("Coming soon / Chapa") on /support | open (extended) |

## Resolved / verified on main

- **Skip-link contrast (found in #94 review, fixed by PR #101 commit 0baf4c5)** —
  VERIFIED 2026-08-22: white on literal `#0b3d2e` = **12.2:1** in BOTH themes,
  focusable-first, reveals on-screen at 375/768/1280px, `skip.content` key
  present in EN+OM, `#main-content` target on every page. Final sign-off: PASS.
- #59 (pytest/ruff) — PR #65 APPROVED.
- #61 (gallery order) — main uses project13, project6, project3, project1, project2.
- #62 (place slugs) — 12 canonical OM slugs on main, no anglicized slugs.
- #64 (closed drawer tab order) — fixed via `inert`; verified.

## Sprint 3 sweep (main @ 7ea8e97) — confirmed clean

- 34 static routes build; no horizontal scroll at 375/768/1280; no broken
  images; no missing `alt`; 0 console/page errors on all swept routes; drawer
  Esc + lightbox focus-trap pass.
- No emojis, no `any` in TS, no console.log/print.
- `/offline` and `/support` cards: **no new contrast bug classes** (only the
  shared nav-level `.lang-label`/`.active` and the pre-existing #82 gold chip).

## Hard gates for PR review (see qa/PR_REVIEW_TEMPLATE.md)

- 9-category taxonomy: `development, economy, environment, minerals,
  agriculture, health, education, culture, trade`; any other key → block.
- OM labels: `economy = "Dinagdee"`, `minerals = "Mineraala"` (exact).
- 12 canonical OM slugs/names; inauguration gallery order project13→6→3→1→2.
- No new `--brand-400`-on-dark (2.54:1) or white-chip-in-dark (1.41:1) instances.

## Backend chain — hold

Backend PRs #78 → #79 → #89 → #97 → #98 → #100 → #102 are stacked. QA is NOT
signing these until the PM marks them Ready and rebased (#79 NewsCategory
revision pending). Frontend Sprint 3 integration is already on main (PR #99).

## Sprint 4 heads-up (do not re-file)

#83–#87 pivot the i18n to **Afaan Oromoo default + Amharic as a 3rd language**.
This supersedes the "no Amharic" gate and the EN-default behavior once landed.
QA test plan for that is #87.
