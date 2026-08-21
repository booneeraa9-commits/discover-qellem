## What this PR does

<!-- Concise summary of the change. Link to the issue it addresses (e.g. "Closes #12"). -->

## Why

<!-- What problem does this solve? Why now? -->

## How to test

<!-- Steps a reviewer should take to verify this works locally. Include routes to visit, buttons to click, toggles to flip (dark/light, EN/OM, mobile/desktop). -->

1.
2.
3.

## Screenshots (if visual)

<!-- Before/after if a UI change, or just "after" if a new component. -->

## Sources (if content)

<!-- Every new/changed fact, figure, date, or historical claim needs a source. -->

## Checklist

- [ ] `node --check js/app.js && node --check js/data.js` passes
- [ ] Works in **light and dark** mode (no unreadable text)
- [ ] Works in **English and Afaan Oromoo** (or OM strings added for new UI text)
- [ ] **Mobile** tested at 360px width; no horizontal scroll
- [ ] All new routes/woreda links **do not 404**
- [ ] If a new static asset was added, it's listed in `sw.js` `ASSETS` and `CACHE` version bumped
- [ ] No emojis added; Lucide icons used for all UI glyphs
- [ ] No new npm dependencies or build steps introduced
- [ ] PR is scoped to **one concern** (split unrelated changes into separate PRs)

## Labels

<!-- Add one: frontend / content / backend / pwa / docs / bug / chore -->

## Reviewer

<!-- Assign the lead/PM as reviewer. -->
