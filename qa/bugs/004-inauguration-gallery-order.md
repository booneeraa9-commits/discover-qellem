# Bug 004 — Inauguration article gallery order wrong in demo vs verified facts

- **Title:** `[bug] Inauguration gallery order is project3,6,13,1,2 — verified order is project13,6,3,1,2`
- **Labels:** `bug`, `content`, `P1`
- **Assignee lane:** `content`
- **Cross-ref:** issue **#27** (port the inauguration article) — fix here before
  that port lands.
- **Status:** OPEN (found 2026-08-21, `demo-vanilla-reference`)

## Reproduction

1. Serve the demo (`demo-vanilla-reference`, `python3 -m http.server 8080`).
2. Open `#/article/news/dembi-dollo-inauguration-2026`.
3. Open the gallery and step through the first three photos.

## Expected (PM-verified order)

1. `project13` — Oliiqaa Dingil Hall during large event
2. `project6` — Oliiqaa Dingil Grand Hall interior
3. `project3` — ceremony with pink hats
4. `project1` — ribbon cutting
5. `project2` — main avenue of Dembi Dolo

## Actual (demo `js/data.js`)

```js
gallery:[IMG.inauguration3, IMG.dembiHall, IMG.dembiHall2, IMG.inauguration1, IMG.dembiCity]
//       project3         project6       project13       project1          project2
```

i.e. `project3, project6, project13, project1, project2`. The first three frames
are rotated relative to the verified order.

## Impact

The demo is the content source-of-truth for the port; if issue **#27** copies
the demo verbatim, the production article ships with the wrong photo sequence.

## Suggested fix

1. Content agent: correct the demo `gallery` array to the verified order
   (and note the change in the issue), or
2. If the demo is intentionally left untouched, record the verified order as the
   source of truth in issue **#27** so the port uses `project13,6,3,1,2`.

## gh command (run by PM)

```bash
gh issue create --title "[bug] Inauguration gallery order is 3,6,13,1,2 — verified order is 13,6,3,1,2" \
  --body-file qa/bugs/004-inauguration-gallery-order.md \
  --label "bug" --label "content" --label "P1"
```
