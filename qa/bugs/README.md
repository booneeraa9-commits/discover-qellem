# Baseline bug register

Found by QA. Canonical issue numbers live on GitHub; this file is the quick
index. (Issue-ready `gh` bodies for #63+ are on the issues themselves.)

## Open bugs (as of 2026-08-22, Sprint 2 merged @ e6cec87)

| GitHub | Severity | Lane(s) | Title |
|---|---|---|---|
| [#60](https://github.com/booneeraa9-commits/discover-qellem/issues/60) | P2 | backend | 11 × `treebeard.E001` forward-compat warnings |
| [#63](https://github.com/booneeraa9-commits/discover-qellem/issues/63) | P1 | backend/docs | README `DATABASE_URL` ignored; no `.env` loading for native dev |
| [#66](https://github.com/booneeraa9-commits/discover-qellem/issues/66) | P2 | frontend | Touch targets <44px — nav 39, drawer/footer 32, Staff 19, mailto 22 (icon-btn/social/page-btn fixed) |
| [#67](https://github.com/booneeraa9-commits/discover-qellem/issues/67) | P2 | frontend | `--brand-400`-on-paper 4.24:1 — kicker, `.tl-year`, `.person-role` |
| [#68](https://github.com/booneeraa9-commits/discover-qellem/issues/68) | P2 | frontend | `next dev` blocks chunks for 127.0.0.1 (`allowedDevOrigins`) |
| [#80](https://github.com/booneeraa9-commits/discover-qellem/issues/80) | P1 | frontend | Dark-mode contrast: active nav 2.54:1, chips 2.54:1, card stat/news chips 1.41:1 |
| [#81](https://github.com/booneeraa9-commits/discover-qellem/issues/81) | P2 | frontend | Dev-only `/components` page ships in production build |
| [#82](https://github.com/booneeraa9-commits/discover-qellem/issues/82) | P2 | frontend | Gold sponsor initials 4.37:1 light mode |

## Resolved (verified on main)

- #59 (pytest/ruff) — PR #65, QA APPROVED.
- #61 (inauguration gallery order) — main uses project13, project6, project3, project1, project2.
- #62 (place slugs) — main uses canonical OM slugs.
- #64 (closed drawer in tab order) — fixed via `inert` (commit db09f8e); verified.
- #47–#51 — Sprint 1 baseline (closed; superseded by #59–#62 + Sprint 1 fixes).

## PR-review quick gates (Sprint 3)

- No emojis (grep Unicode ranges over `apps/web/src` and `apps/cms`).
- Canonical OM woreda names exactly per `qa/CONTENT_FACTS.md`; canonical slugs only.
- Inauguration gallery order (#61): project13, project6, project3, project1, project2.
- Dark mode: no new `--brand-400`-on-dark or white-chip-in-dark instances (#67/#80).
- 375px no horizontal scroll; touch targets >= 44px on new controls (#66).
- `alt` on images; no `any`; no console.log/print.

## Already tracked on GitHub (do NOT re-file)

- Wagtail API v2 not wired — `/api/v2/` 404 → issue #22.
- Dark-mode hero overlays → #43 (overlay tokens landed; readability re-verify).
- Lightbox → #42 (landed + verified); SVG map → #14 (landed); OSM → #33 (pending).
