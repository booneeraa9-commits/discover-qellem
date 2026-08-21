# Reference screenshots — what to capture each release

Binary screenshots are intentionally **not** committed here (keeps the repo
clean). This file is the canonical list of URLs and viewports to capture for
every release so regression review is repeatable.

## Capture rules

- Two themes per shot: **light** and **dark**.
- Two languages per shot where content differs: **EN** and **OM** (OM is
  authoritative; capture OM first).
- Viewports: **375px** (mobile), **768px** (tablet), **1280px** (desktop).
- Tool: browser devtools device toolbar, or Playwright. Save as
  `<route-slug>--<viewport>--<theme>--<lang>.png` and attach to the release PR;
  do not commit.

## Shot list — production routes

### Static pages

| Route | What to capture |
|---|---|
| `/` | Hero above the fold, stats band, feature grid, at-a-glance table, sponsors marquee, footer |
| `/places` | Grid of 12 cards above the fold |
| `/news` | News list (News tab) and Events tab |
| `/history` | Timeline + history paragraphs |
| `/support` | Hero + sponsors/supporters + allocation cards |
| `/staff` | Login form |
| `/404` | Not-found state (any unknown URL) |

### Place detail (capture at least 3: one town + one highland woreda + one lowland woreda)

| Route | Notes |
|---|---|
| `/place/dambi-doolloo` | Town template: hero, key facts, gallery, notable people (Dr. Negasso Gidada) |
| `/place/yamaalogii-walal` | Mount Walal 3,335 m; Oliqa Dingil Booka |
| `/place/anfilloo` | Lowland/forest woreda; Gargeda forest; gold |
| `/place/gaawoo-qeebbee` | Dati Walal National Park |

### Article detail

| Route | Notes |
|---|---|
| `/news/<inauguration-slug>` | Inauguration article incl. **5-image gallery in verified order** (project13, 6, 3, 1, 2) — lightbox open + closed |

## Shot list — reference demo (for visual diffing)

Demo runs as a hash SPA (`python3 -m http.server 8080`):

| Demo URL | Maps to |
|---|---|
| `#/` | Home |
| `#/places` | Places |
| `#/place/dembi-dollo` | Dembi Dolo (note: anglicized slug in demo) |
| `#/news` | News + Events |
| `#/article/news/dembi-dollo-inauguration-2026` | Inauguration article + gallery |
| `#/history` | History |
| `#/support` | Support |
| `#/staff` | Staff |

## Release sign-off bar

A release passes QA only when the full shot list above is captured and every
shot matches the acceptance criteria in `TEST_PLAN.md` (§2–§8). Missing shots
count as an incomplete release, not a passing one.
