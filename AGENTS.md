# AGENTS.md — Instructions for AI Teammates

Hi, teammate. You're an AI agent contributing to Discover Qellem. This file is your fast-path onboarding. Read it before you start coding.

---

## TL;DR

1. You are working on a **Next.js 16 + TypeScript + Tailwind** public frontend (`apps/web/`) and a **Django 5 + Wagtail 6** editorial CMS (`apps/cms/`), backed by **PostgreSQL 17**, running via **Docker Compose**.
2. `main` is protected. Create a branch `feat/web/...`, `feat/cms/...`, `content/...`, or `fix/...`, make focused commits, open a PR, and assign the lead/PM agent as reviewer. Do not merge your own PRs.
3. Read **README.md** and **CONTRIBUTING.md** first. They contain the rules you must follow.
4. **Afaan Oromoo is the authoritative content language.** English is a reviewed translation. Content without OM cannot be published.
5. **Facts must have sources** via the `provenance` app. No invented numbers or dates.
6. **Lucide React icons only. No emojis** in UI or content.
7. The vanilla HTML/CSS/JS demo (our v0 reference design and content) lives on the `demo-vanilla-reference` branch. It is the visual and content source-of-truth for the port.
8. After you make changes, run the local test/lint/build commands before asking for review.

---

## Who's who

- **Product owner (human):** final say on scope, brand, content, and which issues get prioritized.
- **Lead / PM (Arena agent):** sets roadmap, triages, reviews and merges all PRs, enforces standards. That's the agent who told you to read this file. Tag them in PRs and on blocking questions.
- **Frontend agent (you or another agent):** Next.js/Tailwind components, routing, animation, responsive design, PWA, accessibility, performance.
- **Content agent:** Wagtail page models, fixture data, EN/OM copy, photo imports, fact-checking via `provenance` sources, translation files.
- **Backend agent:** Django models/permissions, API endpoints, auth, Chapa payments, forms (contribute, contact), Docker/Caddy deployment, CI/CD.

Roles are loose — but if an issue has a `frontend`, `backend`, or `content` label, default to staying in your lane unless you coordinate in the issue.

---

## The stack in one page

### Backend (`apps/cms/`)

Django project is `qellem_cms/` with settings split:

- `qellem_cms/settings/base.py` — shared settings
- `qellem_cms/settings/dev.py` — local dev (DEBUG=True, console email)
- `qellem_cms/settings/production.py` — production (Caddy, secure cookies, etc.)

Apps:

| App | Purpose |
|---|---|
| `places` | Canonical geography tree: Zone → Woreda → Town → Attraction. Populated via `0002_seed_canonical_geographies.py`. Always use the model; never hardcode place slugs in multiple places. |
| `archive` | HistoryCultureIndexPage, PeopleIndexPage, GlossaryIndexPage — news, stories, timeline, notable people, glossary. |
| `home` | Zone HomePage (single instance), with translatable rich-text fields. |
| `partners` | Sponsors, supporters, institutional partners. |
| `provenance` | `Source` model + `SourcedClaim` mechanism for tracking where every fact came from. |
| `editorial` | Roles (Editor, Translator, Reviewer, Contributor), media permission policy (`validate_approved_image`), admin panels. |
| `search` | Wagtail search configuration. |

Wagtail API v2 is enabled at `/api/v2/` — that's how the Next.js frontend fetches content.

Key mixins you'll use:

- `AuthoritativeOromoPageMixin` — enforces that required Afaan Oromoo fields are filled before publish. Declare `required_om_fields` and `translation_invariant_fields` on the model.
- Use `PUBLIC_RICH_TEXT_FEATURES` (from `qellem_cms.content_validation`) for RichTextFields that appear on the public site.
- `validate_approved_image` is hooked into image uploads to enforce media rights.

### Frontend (`apps/web/`)

Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4.

- App routes live under `apps/web/src/app/`.
- Components in `apps/web/src/components/` (to be built out).
- CMS client in `apps/web/src/lib/cms.ts` (to be built) — typed wrapper around `/api/v2/`.
- Typography: Fraunces (serif display, weights 400–800, opsz axis) + Inter (sans, 300–800), loaded via `next/font`.
- Icons: `lucide-react`.
- Theme: dark/light toggle via `data-theme="dark"` on `<html>`, stored in `localStorage`. Default follows `prefers-color-scheme`.
- PWA: install banner, service worker precache, offline shell.

### Docker

- `docker compose up --build` brings up:
  - `database` — PostgreSQL 17 on port 5432
  - `cms` — Django/Wagtail (port 8000) — **TODO: define in compose.yaml**
  - `web` — Next.js dev server (port 3000) — **TODO: define in compose.yaml**
- Current `compose.yaml` only defines the database; adding `cms` and `web` services is an open P0 issue.

---

## The reference demo (use it!)

The full visual and content design already exists as a vanilla SPA on the branch **`demo-vanilla-reference`**. Treat it as the Figma/spec:

```bash
git checkout demo-vanilla-reference
python3 -m http.server 8080   # browse http://localhost:8000
```

Use it for:

- **Exact visual spec** — gradients, shadows, card hover states, typography scale, hero layout, glass nav, sponsor marquee, supporters wall, quick-fact cards, timeline, pretty tables, culture grid, lightbox, install banner.
- **Verified content** — all 12 woreda/town pages (histories, facts, notable people), news articles (including the Aug 2026 inauguration), statistics, timeline events, sponsors, supporters, partner list, OSM coordinates.
- **Behavior** — dark/light toggle, language toggle (EN/OM), mobile drawer, read-more, lightbox keyboard nav (Esc/←/→), animated counters, fade-ins, install banner flow, hash routing (porting to Next.js file-based routing).

When porting, match the demo pixel-for-pixel visually unless an issue says otherwise. If you notice the demo got a fact wrong, open an issue rather than silently "fixing" it.

---

## How to do common things (recipes)

### Add a new content model (e.g. a NewsArticle in `archive`)

1. Add the model in `apps/cms/archive/models.py`. Extend `AuthoritativeOromoPageMixin, Page` (or `ClusterableModel` for snippets).
2. Declare `required_om_fields`, `translation_invariant_fields`, `public_rich_text_fields`, and `content_panels`.
3. Add a factory or migration to create the index page if needed.
4. Run `python manage.py makemigrations archive` and commit the migration.
5. Register with Wagtail admin in `archive/wagtail_hooks.py`.
6. Add tests in `archive/tests/`.
7. Expose fields via the Wagtail API (use `api_fields`).
8. Add TypeScript types and a fetcher in `apps/web/src/lib/cms.ts`, then build the Next.js page under `apps/web/src/app/news/`.

### Add an image/photo

1. Verify you have rights. Do not commit photos without a documented source/permission.
2. If the photo is approved for public display, place it in the CMS media library via the Wagtail admin (or in a fixture for seed content). Reference it via a `ForeignKey('wagtailimages.Image')` with `on_delete=PROTECT`.
3. Seed photography used for the home hero, woreda heroes, and notables will be ported from `/img/` on the `demo-vanilla-reference` branch — see the content migration issue.
4. Never add photos to `private-media/`, `quarantine/`, or `uploads/` in the repo — those are gitignored.

### Add a new frontend page

1. Create a folder under `apps/web/src/app/<route>/page.tsx` (Next.js App Router).
2. If it needs CMS data, write an async function that fetches from the Wagtail API via the CMS client, and call it in the page component (Server Component by default).
3. Add a link to the page in the `Nav` component.
4. Add bilingual strings to the i18n dictionary (the EN/OM string system in `apps/web/src/lib/i18n.ts` — see issue).
5. Match the demo visually. Use Tailwind + CSS variables from `globals.css`.

### Add an i18n string

UI strings are not yet wired in Next.js (that's an open issue). Until the i18n system lands, add strings to both languages side-by-side in a const in the component file and leave a `// TODO(i18n): wire to locale dict` comment. Do not ship English-only UI.

### Fix a bug

1. Branch off `main` as `fix/<slug>`.
2. Write a regression test first (backend: pytest; frontend: a component test or at minimum a manual verification checklist in the PR).
3. Fix the bug.
4. Reference the issue (`Fixes #123`) in the PR description.
5. Run linters and tests.

### Wire a new backend/API endpoint

1. Add a Django view or DRF ViewSet in the appropriate app.
2. Register in the app's `urls.py` and include in the project `urls.py` (usually under `/api/v2/...` or Wagtail API extension).
3. Add permissions (editorial roles) — don't expose draft/unpublished content anonymously.
4. Add tests covering anon, editor, and reviewer roles.
5. Add the TypeScript fetcher and types to `apps/web/src/lib/cms.ts`.

---

## Environment & running locally (quick)

```bash
# Copy secrets template
cp .env.example .env
# Edit .env — replace the passwords/secrets with real values for your local machine.

# Boot database first (CMS/web services are TODO in compose.yaml — see issues)
docker compose up -d database

# CMS (native, in one tab)
cd apps/cms
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000

# Frontend (native, in another tab)
cd apps/web
npm install
npm run dev
# http://localhost:3000, talking to http://localhost:8000
```

---

## Accessibility (every PR)

- Semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<button>` vs `<div onclick>`, etc.).
- Keyboard reachable and operable. Visible focus styles (Tailwind's default ring is fine; don't remove outlines without a replacement).
- Images: descriptive `alt` for meaningful images, `alt=""` for decorative.
- Color contrast ≥ 4.5:1 for body text, 3:1 for large text — the brand palette already meets this; don't introduce new colors that fail.
- `prefers-reduced-motion` — respect it for parallax/fade/animation.
- Target size ≥ 44×44px for interactive controls on touch devices.

---

## Things that will get your PR sent back

1. Build step, npm package, or framework added without prior discussion in an issue.
2. Any emojis in user-visible text or UI.
3. English-only new content (OM missing).
4. New fact/statistic/date without a linked `Source` in the `provenance` app.
5. Photo added with no source/rights documented.
6. Hardcoded color hexes outside `globals.css` design tokens.
7. Hardcoded place names, stats, or news copy in TSX.
8. No tests for a new Django model, permission, or API endpoint.
9. `any` types introduced in TypeScript without justification.
10. `console.log`/print debug statements left in.
11. A migration file that is out of sync with the current models.
12. Direct commits to `main`.

---

## Labels & picking work

Issues are labeled:

- **Priority:** `P0` (ship-blocking), `P1` (post-beta), `P2` (nice-to-have)
- **Lane:** `frontend`, `backend`, `content`, `pwa`, `docs`, `chore`
- **Size:** `good first issue`, `small`, `medium`, `large`

Pick a **P0** or **good first issue** if you're just joining. Assign yourself to the issue, move it to "In progress" on the Project board, branch, and go. If you start work and realize it's bigger than estimated, comment on the issue and tag the PM.

If you're blocked, open a Draft PR and tag the PM with your question. Don't go silent.

---

## Useful commands

```bash
# Backend
cd apps/cms
pytest                                    # Run all backend tests
python manage.py makemigrations           # After changing models
python manage.py migrate
python manage.py loaddata <fixture>       # Load seed data
python manage.py compilemessages          # Compile translations after editing .po files
python manage.py createsuperuser
ruff check .                              # Lint

# Frontend
cd apps/web
npm install
npm run dev                               # Dev server
npm run lint                              # ESLint
npm run build                             # Production build (catches type errors too)
npx tsc --noEmit                          # Type-check only

# Docker
docker compose up --build
docker compose exec cms pytest
docker compose exec web npm run build
```

---

## Design reference at a glance (matching the demo)

- **Palette:** deep brand green `#0b3d2e` (brand-800), accent gold `#c7963a` (gold-500), warm paper white, ink scale for text.
- **Typography:** Fraunces for headings/display (weight 500–700), Inter for UI/body.
- **Shapes:** rounded corners 14–22px, generous shadows, glassmorphic cards over hero imagery, pill buttons.
- **Motion:** 550ms page in, 800ms fade-ins on scroll (IntersectionObserver), 350ms button/card hover lifts.
- **Photo hero:** large title (clamp 40–70px), tagline, chips, glass quick-fact cards over a dark green-to-transparent gradient.
- **Dark mode:** deep ink backgrounds (`#0e1713` paper, `#0b1310` paper-2), inverted brand tokens, gold preserved.

Match the demo; don't redesign. If you think something should change, open a `discussion` issue and tag the PM.

---

Welcome aboard. Ship quality, cite your sources, and remember this site represents real people and real places in Kellem Wollega.
