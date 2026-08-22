# Baseline bug register

Found by QA. Canonical issue numbers live on GitHub; this file is the quick
index for PR reviewers.

## Open bugs (main @ 8a9e7f3, Sprint 5, 2026-08-22)

| GitHub | Sev | Lane | Title | Status |
|---|---|---|---|---|
| [#60](https://github.com/booneeraa9-commits/discover-qellem/issues/60) | P2 | backend | 11 × `treebeard.E001` warnings | **DEFERRED** (PM) |
| [#66](https://github.com/booneeraa9-commits/discover-qellem/issues/66) | P2 | frontend | Touch targets: nav 39px, brand 42px, filter tabs 40px remain | open (partial) |
| [#67](https://github.com/booneeraa9-commits/discover-qellem/issues/67) | P2 | frontend | `.tl-year` 4.24:1, `.person-role`/`.story-author` 4.11:1 dark | open |
| [#68](https://github.com/booneeraa9-commits/discover-qellem/issues/68) | P2 | frontend | `next dev` blocks chunks for 127.0.0.1 (`allowedDevOrigins`) | open |
| [#80](https://github.com/booneeraa9-commits/discover-qellem/issues/80) | P1 | frontend | Dark: active-nav 2.54, lang-label 2.54, chip 2.54, `.news-cat`/`.place-stat-chip` 1.41; Light: photo-hero active-nav 1.21 | open |
| [#81](https://github.com/booneeraa9-commits/discover-qellem/issues/81) | P2 | frontend | `/components` ships in prod build | open |
| [#82](https://github.com/booneeraa9-commits/discover-qellem/issues/82) | P2 | frontend | Gold `--gold-700` on `--gold-100` 4.37:1 — sponsor initials + `.chip.gold` | open |
| [#112](https://github.com/booneeraa9-commits/discover-qellem/issues/112) | P2 | backend | `/api/v2/images/` exposes no rendition URLs | open (contract test skipped) |
| [#119](https://github.com/booneeraa9-commits/discover-qellem/issues/119) | P1 | frontend/backend | CMS gallery images 404: `/media/` download_url not rewritten to CMS origin (regression from #114) | **NEW Sprint 5** |
| [#121](https://github.com/booneeraa9-commits/discover-qellem/issues/121) | P2 | frontend | `.lang-soon` "Coming soon" pill 3.09:1 light / 3.49:1 dark | **NEW Sprint 5** |
| [#122](https://github.com/booneeraa9-commits/discover-qellem/issues/122) | P1 | backend/content | Partners missing `display_name_en/am` + `?lang=` projection | **NEW (Sprint 5 BE pending)** |
| [#123](https://github.com/booneeraa9-commits/discover-qellem/issues/123) | P1 | backend/content | `NewsCategory` labels missing Amharic | **NEW (Sprint 5 BE pending)** |

## Resolved / verified

- #63 (README `DATABASE_URL` docs) — **closed by #111** (fix/docs/issue-63-env-vars).
- #106 (person slug `jaal-laggasaa-wagii-*` inconsistency) — **closed by #115**;
  canonical slug is `jaal-laggasaa-wagii` (full name Jaal Laggasaa Wagii Meettaa).
- #59, #61, #62, #64 — Sprint 1–2 resolutions (see history).
- Skip-link contrast (found in #94 review) — fixed via PR #101, final PASS.

## Sprint 5 sweep (main @ 8a9e7f3, CMS-wired)

- All 25 swept routes: no horizontal scroll at 375/768/1280; no broken images
  **except** the inauguration article's 5 gallery images (#119); no missing
  `alt`; 0 console/page errors elsewhere; drawer Esc + lightbox focus trap pass.
- Contrast re-measure (#80/#67/#82): **unchanged — no contrast-fix PR merged**.
  New: `.lang-soon` (#121). Hero quick-fact `.qf-hero` white-on-white readings
  are a harness false-positive (translucent glass over the photo hero).
- `/contribute` FE form is still a stub (toast only); backend endpoint landed
  (#108). Test plan in `qa/CONTRIBUTE_TEST_PLAN.md` (gaps G1–G6 flagged).

## i18n flip status (issue #85 — NOT yet landed)

- `DEFAULT_LANG` still `en`; no pre-paint lang script; AM switcher disabled.
- Harness (`qa/scripts/i18n/lang-check.js`, now 20 checks): **12/20** on main.
  The 8 failures map exactly to the flip work items. Sign-off requires 20/20.

## Hard gates for PR review (see qa/PR_REVIEW_TEMPLATE.md)

- 9-category taxonomy; `economy` OM = "Dinagdee", `minerals` OM = "Mineraala".
- 12 canonical OM slugs/names; inauguration gallery order project13→6→3→1→2.
- `?lang=am` must fall back to OM (never EN) — contract test active.
- No new `--brand-400`-on-dark or white-chip-in-dark contrast instances.
- Sprint 5 BE additions gated by skipped contract tests in
  `qellem_cms/tests/test_api_contract.py` (partners `_en/_am`, NewsCategory
  Amharic labels, image renditions) — the BE PRs must remove the skips.
