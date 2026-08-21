## What this PR does

<!-- Concise summary. Link the issue, e.g. "Closes #12". -->

## Why

<!-- What problem does this solve? Reference designs, the demo branch, or the issue thread. -->

## How to test

<!-- Steps the reviewer should take. Include routes to visit, toggles to flip (dark/light, EN/OM, mobile/desktop), admin actions, migrations to apply, etc. -->

1.
2.
3.

## Screenshots / recordings (if visual)

<!-- Before/after for UI changes, or just "after" for new components. -->

## Content / sources (if applicable)

<!-- List `Source` records added to the `provenance` app, or cite sources in PR description for content-only PRs. -->

## Migrations

- [ ] New/changed models have corresponding migrations committed.
- [ ] `python manage.py migrate` runs cleanly.
- [ ] Seed data/fixtures updated if canonical data changed.

## Checklist

- [ ] `pytest` (backend) passes
- [ ] `npm run lint` and `npm run build` (frontend) pass
- [ ] Works in **light and dark** mode
- [ ] Works in **English and Afaan Oromoo** (new UI strings have both translations)
- [ ] **Mobile** tested at 360px width; no horizontal scroll
- [ ] No broken links or 404 routes
- [ ] New images have documented rights; no private/quarantine media committed
- [ ] New factual claims link to a `Source` in the `provenance` app
- [ ] Lucide React icons used for all glyphs; no emojis added to UI or content
- [ ] No new npm/pip dependency added without a note below justifying it
- [ ] PR is scoped to one concern
- [ ] Commit messages are imperative and scope-prefixed (e.g. `feat(web): ...`)

## New dependencies (if any)

<!-- List packages added and why. -->

## Labels

<!-- Add one: frontend / backend / content / pwa / docs / bug / chore -->

## Reviewer

<!-- Assign the lead/PM agent. -->
