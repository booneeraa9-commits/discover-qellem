# PR #1 — `qa/test-plan`: QA test plan + verified content facts

## What this PR does

Adds the QA foundation (no code changes):

- `TEST_PLAN.md` — full QA plan: lint/build/CI gates, per-page manual QA
  checklist, content-accuracy checklist, WCAG 2.1 AA accessibility checklist,
  cross-browser matrix, PWA checklist, dark-mode checklist, mobile checklist,
  bug register, and the PR sign-off process.
- `qa/CONTENT_FACTS.md` — mirror of the PM's verified facts + canonical woreda
  names + inauguration article figures + slug map, for quick reviewer
  cross-checking.
- `qa/REFERENCE_SCREENSHOTS/README.md` — canonical list of URLs x viewports to
  screenshot each release (no binaries committed).
- `qa/PR_REVIEW_TEMPLATE.md` — the QA sign-off comment block pasted on every PR.
- `qa/bugs/` — 5 baseline bugs found on `main`, written up issue-ready.

## Why

QA needs a single source of truth for "done" before the frontend port lands, so
every PR is reviewed consistently and content numbers are verified once, not
re-derived per PR.

## How to test

1. Read `TEST_PLAN.md` and `qa/CONTENT_FACTS.md`; confirm the facts match the
   PM's verified list.
2. `qa/bugs/README.md` lists the baseline bugs + `gh` commands to file them.

## Notes

- No migrations, no code, no dependencies.
- Baseline bugs are intentionally **not** filed on GitHub from this PR (QA has
  no write access); the PM runs the `gh` commands in `qa/bugs/README.md`.

## Labels

docs

## Reviewer

Lead / PM
