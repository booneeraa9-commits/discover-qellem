# Baseline bug register

Found by QA on `main` @ `b95d592` (2026-08-21). Each file is an issue-ready
body. QA cannot authenticate to GitHub from the sandbox, so the PM runs the
`gh` commands below (or pastes the bodies into the issue UI).

| ID | Severity | Lane(s) | Title | File |
|---|---|---|---|---|
| 001 | P1 | frontend | `npx tsc --noEmit` fails on fresh clone (`LayoutProps`) | `001-tsc-noemit-layoutprops.md` |
| 002 | P1 | backend/docs | `pytest` + `ruff` documented but not installed/configured | `002-pytest-ruff-not-installed.md` |
| 003 | P2 | backend | 11 × `treebeard.E001` forward-compat warnings | `003-treebeard-e001-warnings.md` |
| 004 | P1 | content | Inauguration gallery order wrong vs verified facts | `004-inauguration-gallery-order.md` |
| 005 | P1 | content/frontend | Place slug divergence (canonical OM vs demo) | `005-place-slug-divergence.md` |

## One-shot filing commands

```bash
cd discover-qellem
gh issue create --title "[bug] npx tsc --noEmit fails on fresh install: TS2304 Cannot find name 'LayoutProps'" --body-file qa/bugs/001-tsc-noemit-layoutprops.md --label bug --label frontend --label P1
gh issue create --title "[bug] pytest and ruff documented but not installed/configured" --body-file qa/bugs/002-pytest-ruff-not-installed.md --label bug --label backend --label docs --label P1
gh issue create --title "[bug] 11x treebeard.E001 warnings will break on django-treebeard 6" --body-file qa/bugs/003-treebeard-e001-warnings.md --label bug --label backend --label P2
gh issue create --title "[bug] Inauguration gallery order is 3,6,13,1,2 — verified order is 13,6,3,1,2" --body-file qa/bugs/004-inauguration-gallery-order.md --label bug --label content --label P1
gh issue create --title "[bug] Place slugs diverge: production canonical OM vs demo anglicized" --body-file qa/bugs/005-place-slug-divergence.md --label bug --label content --label frontend --label P1
```

## Already tracked on GitHub (do NOT re-file)

- Wagtail API v2 not wired — `/api/v2/` returns 404, `wagtail.api.v2` absent
  from `INSTALLED_APPS` and `urls.py` → issue **#22** (P0 backend).
- `compose.yaml` defines only the `database` service (no `cms`/`web`) → issue **#8**.
- Scaffold metadata "Create Next App" + hardcoded `lang="en"` in
  `apps/web/src/app/layout.tsx` → covered by **#36** (metadata) and **#21** (i18n).

## Docs drift noted (folded into bug 002 or fix silently)

- README/AGENTS say **Wagtail 6 / Django 5**; `requirements.txt` pins
  **wagtail==7.4.2 / Django==5.2.17**.
- README says Node 20+; CI pins Node **24.19.0** (both fine, just stale text).
- README says Python 3.12+; verified working on 3.13.
