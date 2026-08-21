# Discover Qellem — QA Test Plan

- **Owner:** QA Engineer
- **Status:** Living document — update as pages port and gates change
- **Last run of gates:** 2026-08-21 against `main` @ `b95d592`
- **Reference build:** `demo-vanilla-reference` branch (visual + content spec)

Every PR is blocked from merge until QA posts the sign-off block (see
`qa/PR_REVIEW_TEMPLATE.md`). This plan is the definition of "done" that block
refers to.

---

## 0. How to run the environment

```bash
# 1. Clone
git clone https://github.com/booneeraa9-commits/discover-qellem.git

# 2. Database (PostgreSQL 17 — there is NO SQLite fallback in settings)
cp .env.example .env   # then set POSTGRES_PASSWORD, DJANGO_SECRET_KEY
docker compose up -d database          # or run a local Postgres 17

# 3. Backend (Django 5.2 + Wagtail 7.4)
cd apps/cms
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000

# 4. Frontend (Next.js 16)
cd apps/web
npm install
npm run dev          # http://localhost:3000

# 5. Reference demo (visual/content spec)
git worktree add ../demo-vanilla demo-vanilla-reference
cd ../demo-vanilla && python3 -m http.server 8080   # http://localhost:8080
```

**Environment notes (documented friction):**

- The backend hard-codes `django.db.backends.postgresql`; there is no SQLite
  fallback, so `migrate`, `check --database default`, and the test suite all
  require a running Postgres. New contributors without Docker hit this
  immediately. (See bug `qa/bugs/002-pytest-ruff-not-installed.md` for the
  related tooling gap.)
- The QA sandbox has no Docker engine, so the three container checks below are
  run by CI only and cannot be executed locally here. They are enforced in
  `.github/workflows/ci.yml`.

---

## 1. Lint / Build / CI gates

### 1a. Backend (`apps/cms/`) — expected gates

| Gate | Command | Verdict (2026-08-21) | Notes |
|---|---|---|---|
| Install locked deps | `pip install -r requirements.txt` | PASS | `pip check` reports "No broken requirements found" |
| Missing migrations | `python manage.py makemigrations --check --dry-run` | PASS | "No changes detected" |
| Apply migrations | `python manage.py migrate --noinput` | PASS | Requires Postgres |
| System checks (db-aware) | `python manage.py check --database default` | PASS (with warnings) | 11 × `treebeard.E001` warnings — see bug 003 |
| Backend tests | `python manage.py test` | PASS | 146 tests OK |
| Lint | `ruff check .` | **GAP** | `ruff` is not installed and no ruff config exists — see bug 002 |
| Tests via pytest | `pytest` | **GAP** | `pytest` is not in `requirements.txt`; CI runs `manage.py test` — see bug 002 |

CI currently runs: install → `pip check` → `makemigrations --check --dry-run` →
`migrate` → `check --database default` → `test`. There is **no backend lint step**
and **no pytest step** in CI, despite `AGENTS.md` / `CONTRIBUTING.md` instructing
contributors to run `pytest` and `ruff check .`.

### 1b. Frontend (`apps/web/`) — expected gates

| Gate | Command | Verdict (2026-08-21) | Notes |
|---|---|---|---|
| Install locked deps | `npm ci --ignore-scripts` (CI) / `npm install` (local) | PASS | 0 vulnerabilities on install |
| Lint | `npm run lint` | PASS | |
| Type-check | `npx tsc --noEmit` | **FAIL on fresh clone** | `TS2304: Cannot find name 'LayoutProps'` in `layout.tsx` — see bug 001 |
| Production build | `npm run build` | PASS | Routes today: `/`, `/_not-found` only |

The `npx tsc --noEmit` failure is transient (it succeeds after `next dev` or
`next build` has generated `.next/types/*.d.ts`), but it is the documented
"type-check only" command, so it must work on a fresh checkout — see bug 001.

### 1c. Container (`apps/cms/Dockerfile` + `compose.yaml`) — CI-only gates

| Check | How CI enforces it |
|---|---|
| Compose config valid | `docker compose config --quiet` |
| Image builds | `docker build --tag discover-qellem-cms:ci apps/cms` |
| Non-root user | asserts `docker image inspect … '{{.Config.User}}'` == `qellem` |
| Gunicorn runtime | runs `gunicorn --version` against the image |
| No auto-migrate | asserts `Config.Cmd` starts `gunicorn` and contains no `migrate` |

Known gap: `compose.yaml` defines **only** the `database` service; `cms` and
`web` services are missing (already tracked as issue **#8**). The CI `container`
job only builds the CMS image — it does not exercise a full `docker compose up`.

### 1d. Gate definitions for sign-off

A PR is **not** ready for QA unless:

1. Backend CI job is green (or equivalent local runs above are green).
2. Frontend CI job is green (`lint` + `build`).
3. `npx tsc --noEmit` passes after a clean `npm ci` (until bug 001 is fixed,
   QA will run it after a `next build` warm-up and note the caveat).
4. Container job is green when the PR touches `Dockerfile`/`compose.yaml`.

---

## 2. Manual QA checklist per page

**Route set for the production port (per PM):** `/`, `/places`, `/place/<slug>`,
`/news`, `/news/<slug>`, `/history`, `/support`, `/staff`, `/404`.

**Current status on `main`:** only `/` exists (Next.js scaffold renders
"Hello world!"). All other routes are not yet implemented and are covered by
issues **#13–#18, #30**. The checklist below applies to each route **as it
lands**; a route does not get a QA sign-off until every applicable row passes.

> Flag for PM: the reference demo also has `/stories`, `/contribute`, and
> `/about` routes (plus `#/article/<type>/<id>`). The production route list
> above omits them. Confirm whether `/stories` (Community Stories) and
> `/contribute` / `/about` are in scope for the port, or deliberately dropped.

**Common checks — run on EVERY page, in light and dark mode, in EN and OM:**

| # | Check |
|---|---|
| C1 | Page loads with HTTP 200; no console errors, no hydration warnings |
| C2 | `<html lang>` is set correctly and **toggles** with the EN/OM switch (`om`/`en`) |
| C3 | Dark mode renders every section legible (no unreadable text, no invisible borders) |
| C4 | EN/OM toggle switches all visible strings; OM is never missing when EN is present |
| C5 | No emojis anywhere in UI or content (Lucide icons only) |
| C6 | At 375px and 768px: **no horizontal scroll** (document.scrollingElement.scrollWidth ≤ viewport width) |
| C7 | Hero/photo text is readable over the photo (overlay/gradient present) in both themes |
| C8 | Every link navigates (no `href="#"`, no dead 404s); external links open safely |
| C9 | Every button and link is a real interactive element (`<button>`/`<a>`), not `div onclick` |
| C10 | All interactive targets ≥ 44×44px (touch) |
| C11 | Keyboard: Tab order is logical; focus ring visible on every focusable element |
| C12 | `prefers-reduced-motion` is honored (parallax/fade/counter animations disabled) |

**Per-page specifics:**

### `/` (Home)
- Hero: title (clamp 40–70px), tagline, chips, glass quick-fact cards over the
  green-to-transparent gradient (match demo `#/`).
- Stats band: 4 animated counters (1,254,817 / 9,857 / 12 / 134,213) — verify
  values match `qa/CONTENT_FACTS.md`; counters disabled under reduced motion.
- Feature grid (8 cards), "At a glance" table, places preview, news preview,
  stories, notable people, plan-visit, sponsors marquee, support CTA, footer.
- Announcement bar shows the "2015/16 E.C." verified-content line and can be dismissed.
- Language toggle defaults: demo defaults to **EN**; confirm with PM whether OM
  should be the default (OM is the authoritative language).

### `/places`
- 12 cards: 11 woredas + 1 town, each with the **canonical Oromo name**
  (see `qa/CONTENT_FACTS.md`) and correct EN pairing.
- Each card links to `/place/<slug>` using the **canonical slug** scheme (see bug 005).

### `/place/<slug>`
- All 12 slugs resolve; unknown slug renders a graceful not-found state.
- Sections per demo: about (read-more), key facts table, culture grid, places to
  discover, gallery, notable people, OSM map, photo hero with chips.
- Gallery lightbox: Esc closes, ←/→ navigates, prev/next buttons, touch swipe,
  focus returns to trigger (issue **#42**).
- OSM coordinates match demo `coords` (issue **#33**).

### `/news`
- News tab and Events tab both populate; categories match demo (`Development`,
  `Economy`, `Environment`, `Minerals`, `Agriculture`, `Health`, `Education`,
  `Culture`, `Trade`).
- Article cards link to `/news/<slug>`; dates ISO `YYYY-MM-DD` internally.

### `/news/<slug>`
- Inauguration article (issue **#27**) renders the **5-image gallery in the
  verified order** (project13 → 6 → 3 → 1 → 2) — see `qa/CONTENT_FACTS.md` and bug 004.
- Article numbers verified against `qa/CONTENT_FACTS.md` (650M / 425M / 11 rooms /
  2016 E.C. / 32+ / 2,284 / 17B / 4 years / Dr. Utukana Odaa).
- Source line ("Kellem Wollega Zone Communication Office") rendered.

### `/history`
- Timeline events, history paragraphs, notable-people links match demo `#/history`.
- All dates render in both languages.

### `/support`
- Sponsors/supporters list, allocation cards, "Chapa coming soon" state (issue **#31**).
- Donate CTA is inert/disabled until Chapa lands (no fake payment flow).

### `/staff`
- Login form only (username/password) with proper `<label>`s; no emoji, no
  English-only strings; auth wiring is issue **#38**.

### `/404`
- Friendly bilingual "not found" + "back to home"; triggered by any unknown route;
  returns a real 404 status (not a soft 200).

---

## 3. Content accuracy checklist

Cross-check **every hardcoded-looking number** against `qa/CONTENT_FACTS.md`
(the single mirror of the PM's verified facts). Any new number in code or
content must be linked to a `Source` in the `provenance` app — otherwise the PR
is sent back.

### 3a. Zone-level facts (verified)

| Fact | Verified value |
|---|---|
| Population | 1,254,817 |
| Area | ≈ 9,857 km² |
| Woredas + town | 12 (11 rural + 1 town) |
| Kebeles | 289 (258 rural + 31 urban) |
| Coffee | 134,213 tonnes from 484,841 ha |
| Honey | 473,300 hives |
| Livestock | 6,721,429 |
| Schools | 452 primary / 50 secondary / 1 university |
| Students | 348,516 |
| Health | 4 hospitals / 51 health centres / 256 health posts |
| Cooperatives | 817 co-ops / 156,500 members |
| Climate | 47% woyinadega / 39% kola / 14% dega |
| Ethnicity | Oromo 94.8% / Amhara 4.01% |
| Religion | Protestant 42.5% / Orthodox 34% / Muslim 21% |
| Language | Afaan Oromoo 96.31% / Amharic 3.13% |
| Minerals | gold (Anfillo/Dale Wabera/Hawa Gelan/Lalo Kile/Sayo), platinum (Lalo Kile), tantalum (Sayo), uranium (Anfillo/Sayo) |
| Dati Walal NP | 103,500 ha; proc 87/2005; gazetted 25 May 2012 |

Verification status 2026-08-21: all values above match the reference demo
(`js/data.js`) **and** the production seed migration
(`apps/cms/places/migrations/0002_seed_canonical_geographies.py`).

### 3b. Canonical Oromo woreda names (12) — must appear EXACTLY

```
Dambi Doolloo, Sayyoo, Laaloo Qilee, Jimmaa Horroo, Daallee Waabaraa,
Gidaamii, Anfilloo, Haawwaa Galaan, Daallee Sadii, Sadii Canqaa,
Gaawoo Qeebbee, Yamaalogii Walal.
```

All 12 verified present, spelled exactly, in both the demo and the production
seed. Any new place string must use these spellings. English pairings (Dembi
Dolo, Sayo, Lalo Kile, Jimma Horo, Dale Wabera, Gidami, Anfillo, Hawa Gelan,
Dale Sadi, Sadi Chanka, Gawo Kebe, Yemalogi Welel) are transliterations only —
OM is authoritative.

### 3c. Inauguration article (Aug 2026) — verified figures

| Item | Verified value | Demo matches? |
|---|---|---|
| Total project cost | > 650 million Birr | YES |
| Grand Oliqa Dingil Hall | > 425 million Birr | YES |
| Hall rooms | 11 rooms/units + 1 grand hall + 1 secondary hall + cafeteria + recreation | YES |
| Hall construction start | 2016 E.C. | YES |
| Mayor Girma Dangala | "more than 32 projects" underway | YES |
| Chief Admin Gammachuu Gurmesa | 2,284 projects / > 17 billion Birr / last 4 years | YES |
| Dr. Utukana Odaa | Deputy Head, Office of the President, Oromia | YES (EN "Dr. Utukana Oda" — see note) |
| Gallery order | **project13, project6, project3, project1, project2** | **NO — see bug 004** |

Notes:
- Demo gallery order is `project3, project6, project13, project1, project2`
  (`inauguration3, dembiHall, dembiHall2, inauguration1, dembiCity`). The
  verified order is `project13, project6, project3, project1, project2`.
  Flagged as bug 004 (cross-references issue **#27**).
- EN transliteration "Dr. Utukana Oda" vs verified "Dr. Utukana Odaa" — minor;
  OM "Dr. Utukaanaa Odaa" is correct. Tracked in `qa/CONTENT_FACTS.md`.

### 3d. Slug scheme (routing compatibility — see bug 005)

The production seed uses **canonical Oromo slugs**; the demo uses anglicized
slugs. Mapping to keep consistent when porting:

| Canonical (production seed) | Demo slug |
|---|---|
| dambi-doolloo | dembi-dollo |
| sayyoo | sayo |
| haawwaa-galaan | hawa-gelan |
| daallee-sadii | dale-sadi |
| daallee-waabaraa | dale-wabera |
| gaawoo-qeebbee | gawo-kebe |
| yamaalogii-walal | yemalogi-welel |
| anfilloo | anfilo |
| gidaamii | gidami |
| laaloo-qilee | lalo-kile |
| sadii-canqaa | sadi-chanka |
| jimmaa-horroo | jimma-horo |

Demo deep-links (e.g. notable-people `link: "/place/dembi-dollo"`) will 404
against production unless a redirect map is added. Decision needed before
issues **#26/#30** land.

---

## 4. Accessibility checklist (WCAG 2.1 AA minimum)

Run on every PR; block on failure. Manual now, axe-core in CI later (issue **#34**).

- **Semantic HTML:** `<header>/<nav>/<main>/<article>/<section>/<footer>`,
  `<button>` for actions, `<a>` for navigation, lists as `<ul>/<ol>`, headings
  in order (h1 → h2 → h3, no skips).
- **Keyboard nav:** every interactive element reachable and operable by Tab +
  Enter/Space; visible focus ring (Tailwind ring is fine; never remove outline
  without a replacement); Esc closes modals, mobile drawer, and the lightbox.
- **Color contrast:** body text ≥ 4.5:1; large text ≥ 3:1; icons/controls ≥ 3:1.
  The brand palette (brand-800 `#0b3d2e`, gold-500 `#c7963a`, ink scale) already
  meets this — no new off-palette colors (hardcoded hexes outside
  `apps/web/src/app/globals.css` are an automatic reject).
- **Images:** meaningful images have descriptive `alt`; decorative images
  `alt=""`; gallery buttons have accessible names ("Open photo N").
- **Status indicators:** no emojis or color-only status; use text + icon + color.
- **Forms:** every input has a `<label>` (or `aria-label`); errors announced via
  `role="alert"`/`aria-live`; focus moves to first error.
- **`prefers-reduced-motion`:** honored for parallax, scroll fades, counters.
  **Note:** the reference demo does NOT implement this — the production port
  must add it (demo is the visual spec, not the a11y spec).
- **`lang` attribute:** set to `en` initially and toggled to `om` on language
  switch (demo does this — match it).
- **Tap targets:** ≥ 44×44px for all interactive controls on touch devices.
- **ARIA:** lightbox `aria-modal="true"` + `role="dialog"`; hamburger
  `aria-expanded` state; nav has an accessible name.

---

## 5. Cross-browser matrix (feeds issue #44)

| Browser / device | Test focus |
|---|---|
| Chrome (desktop, latest) | Full functional pass; devtools axe scan; PWA install + offline |
| Firefox (desktop, latest) | Full functional pass; `:focus-visible` rings; CSS grid/flex; PWA install prompt |
| Safari (desktop, latest) | Visual parity; sticky nav + backdrop-filter; fonts (Fraunces/Inter); lightbox |
| iOS Safari (iPhone, latest 2 versions) | Install banner flow (Share → Add to Home Screen); 100vh/notch behavior; tap targets; offline after first load; `apple-mobile-web-app-*` meta |
| Chrome on Android | Install banner (dismiss persistence via `localStorage.dq_install_dismissed`); offline shell; 360px no horizontal scroll |

Minimum matrix per release: Chrome desktop + one iOS + one Android. Full matrix
before launch (issue **#44**).

---

## 6. PWA checklist (feeds issue #19)

- [ ] `manifest.webmanifest` (or Next.js manifest) present and linked; `name`,
  `short_name`, `start_url`, `display: standalone`, `theme_color #0b3d2e`,
  `background_color`.
- [ ] Icon set: 192×192, 512×512 (maskable + any), apple-touch-icon.
- [ ] Service worker registers on first load and precaches the shell (nav,
  fonts, CSS, JS).
- [ ] Install banner appears when `beforeinstallprompt` fires (or iOS fallback).
- [ ] Banner can be dismissed, and stays dismissed via
  `localStorage.dq_install_dismissed === "1"` across reloads (demo behavior).
- [ ] Offline shell loads after first visit: `/`, `/places`, `/news` render
  (cached shell), no blank screen.
- [ ] SW versioning (cache bump, e.g. `dq-vN`) so stale caches purge on deploy.

---

## 7. Dark mode checklist (feeds issue #43)

- [ ] Every page readable in dark mode (paper `#0e1713`, paper-2 `#0b1310`,
  inverted ink, gold preserved).
- [ ] Hero photos keep a proper dark overlay/gradient in **dark** mode — text
  stays ≥ 4.5:1 over the photo (this is issue **#43**; verify at 375px where
  the overlay is most likely to fail).
- [ ] No pure-black/pure-white flash on load: theme is applied from
  `localStorage.dq_theme` (defaulting to `prefers-color-scheme`) **before**
  first paint (no FOUC).
- [ ] Toggle uses `data-theme="dark"` on `<html>` (not only Tailwind `dark:`
  classes) so it persists and pairs with the demo mechanism.
- [ ] Preference persists across reloads and navigations.

---

## 8. Mobile checklist

- [ ] No horizontal scroll at 360px/375px/768px.
- [ ] Hamburger menu opens/closes; Esc closes; links work; `aria-expanded`
  toggles; menu closes after navigating.
- [ ] Touch targets ≥ 44×44px (nav toggles, gallery buttons, read-more).
- [ ] Over photo heroes, the dark/lang/menu icons are visible as
  semi-transparent white pills (glass nav).
- [ ] Viewport meta present (`width=device-width, initial-scale=1,
  viewport-fit=cover`).
- [ ] Counters/fades don't cause layout shift (CLS) on slow mobile CPUs.

---

## 9. Bug register

Baseline bugs found on `main` are written up in `qa/bugs/` (issue-ready bodies
+ `gh` commands). Summary:

| ID | Severity | Lane | Title |
|---|---|---|---|
| 001 | P1 | frontend | `npx tsc --noEmit` fails on fresh clone (`LayoutProps`) |
| 002 | P1 | backend/docs | `pytest` + `ruff` documented but not installed/configured |
| 003 | P2 | backend | 11 × `treebeard.E001` warnings on every check/test/runserver |
| 004 | P1 | content | Inauguration gallery order wrong in demo vs verified facts |
| 005 | P1 | content | Place slug divergence (canonical OM vs demo anglicized) |

Already tracked on GitHub (do not re-file): Wagtail API v2 not wired (**#22**),
compose `cms`/`web` services missing (**#8**), scaffold metadata
"Create Next App" + hardcoded `lang="en"` (covered by **#36/#21**).

---

## 10. Sign-off process

1. Author completes the PR template + checklist, links CI run.
2. QA runs gates (§1) and the per-page/a11y/dark/mobile/PWA checks that apply.
3. QA pastes the sign-off block from `qa/PR_REVIEW_TEMPLATE.md` with
   **APPROVED** or **CHANGES REQUESTED**.
4. PM merges only after an **APPROVED** sign-off from QA.
