# Baseline bug register

Found by QA. Each file is an issue-ready body. Newest bugs (#63+) are filed
directly on GitHub; the `gh` bodies below are kept in the issue itself.

## Current open bugs (filed on GitHub)

| GitHub | Severity | Lane(s) | Title |
|---|---|---|---|
| [#59](https://github.com/booneeraa9-commits/discover-qellem/issues/59) | P1 | backend | pytest + ruff documented but not installed/configured (PR #65, QA APPROVED) |
| [#60](https://github.com/booneeraa9-commits/discover-qellem/issues/60) | P2 | backend | 11 × `treebeard.E001` forward-compat warnings |
| [#61](https://github.com/booneeraa9-commits/discover-qellem/issues/61) | P1 | content | Inauguration gallery order — verified is project13,6,3,1,2 |
| [#62](https://github.com/booneeraa9-commits/discover-qellem/issues/62) | P1 | content/frontend | Place slug divergence (canonical OM vs demo) |
| [#63](https://github.com/booneeraa9-commits/discover-qellem/issues/63) | P1 | backend/docs | README `DATABASE_URL` ignored; no `.env` loading for native dev |
| [#64](https://github.com/booneeraa9-commits/discover-qellem/issues/64) | P1 | frontend | Closed mobile drawer stays in Tab order (focus on off-screen links) |
| [#66](https://github.com/booneeraa9-commits/discover-qellem/issues/66) | P2 | frontend | Touch targets <44px: nav 39, drawer/footer 32, Staff 19, mailto 22 |
| [#67](https://github.com/booneeraa9-commits/discover-qellem/issues/67) | P2 | frontend | `.kicker` dark-mode contrast 4.24:1 < 4.5:1 |
| [#68](https://github.com/booneeraa9-commits/discover-qellem/issues/68) | P2 | frontend | `next dev` blocks chunks for 127.0.0.1 (`allowedDevOrigins`) |

## Closed (Sprint 1)

- #47 (tsc `LayoutProps`) — fixed in PR #57; verified on fresh install.
- #48 → dup of #59; #49 → dup of #60; #50 → dup of #61; #51 → dup of #62
  (PM re-filed with updated titles; the PM set is canonical).

## Note for PR reviewers

- The inauguration gallery order gate is #61 — **project13, project6, project3,
  project1, project2**. Block any PR that ships another order.
- Woreda names/slugs must match the canonical 12 in `qa/CONTENT_FACTS.md`.

## Already tracked on GitHub (do NOT re-file)

- Wagtail API v2 not wired — `/api/v2/` 404 → issue #22 (P0 backend).
- Compose `cms`/`web` services → issue #8 (closed by PR #45).
- Dark-mode hero overlays → #43; lightbox → #42; SVG map → #14/#33.
