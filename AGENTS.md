# AGENTS.md — Notes for AI Teammates

Hi, teammate. You're an AI agent contributing to Discover Qellem. This file exists so you (and other agents) can onboard quickly without asking the PM what to do. Read this entire file before making changes.

---

## TL;DR

1. You are working on a **vanilla HTML/CSS/JS PWA**. No npm, no build, no frameworks. Ever.
2. Clone the repo, make a branch, pick an issue from the **Project board → To do**, work it, open a PR.
3. Read `README.md` and `CONTRIBUTING.md` first. They are the law.
4. The project lead (a fellow AI agent — "Arena PM") reviews PRs. Assign them as reviewer.
5. All content is in `js/data.js`. All behavior/routing is in `js/app.js`. All styles in `css/style.css`.
6. Bilingual EN/OM on every user-facing string. No emojis. Lucide icons only.
7. Facts need sources. Cite in PR description.
8. After changes, run `node --check js/app.js && node --check js/data.js` and click-test locally before PR.

---

## Who's who (team of 4 AI agents + 1 human)

- **Product owner (human):** Arena user. Final say on scope, brand, content.
- **Lead / PM (Arena agent, default):** Sets roadmap, triages issues, reviews all PRs, merges to `main`, maintains conventions. That's the agent who sent you here.
- **Agent 2 (Frontend/UI):** Picks up visual, CSS, animation, responsive, accessibility tasks.
- **Agent 3 (Content/i18n):** Woreda pages, notable people bios, EN/OM copy, photos, facts/sources.
- **Agent 4 (Backend/PWA/Forms):** Service worker, install flow, Chapa donations, form endpoints (Formspree/EmailJS), staff editor backend (Supabase or similar), SEO.

Roles are flexible. Don't feel boxed in — but if an issue is labeled `frontend`, `content`, or `backend`, respect the lane unless you've talked to the PM.

---

## The stack, in one paragraph

This is a single-page application with **hash-based routing** (`#/place/dembi-dollo`, etc.). `index.html` is the shell (nav, footer, toast, install banner, script tags). `js/data.js` holds **all content as JS objects** — i18n strings, places, news, people, sponsors — inside a single `DATA` constant and an `IMG` constant for image paths. `js/app.js` is an IIFE that bootstraps: it reads state (language, theme, route) from localStorage/hash, routes to a `view*()` function that returns HTML strings, injects into `#app`, then calls `bindBehaviors()` (lightbox, tabs, read-more, forms, fade-ins, counters, gallery). `sw.js` is a stale-while-revalidate service worker. `manifest.webmanifest` makes it a PWA.

Lucide icons are loaded from a CDN script and convert `<i data-lucide="icon-name"></i>` at render time. **Always call `if (window.lucide) lucide.createIcons();`** after you inject HTML that contains Lucide icons.

---

## How to add / change things (recipes)

### Add a new UI string (button, label, heading)

1. Add a `key:"English text"` entry to both `DATA.i18n.en` and `DATA.i18n.om` (Afaan Oromoo version).
2. Reference in views as `t('key')`.

### Add a new image

1. Drop the file into `img/`. Use lowercase-kebab-case names.
2. Add a line to the `IMG` object in `js/data.js`: `myPhoto: 'img/my-photo.jpg',`.
3. Reference as `IMG.myPhoto` in JS views. Never hardcode the string `'img/...'` in a view.
4. Add the path to the `ASSETS` array in `sw.js` so it precaches, and **bump `CACHE`** to a new version (e.g. `dq-v7`).

### Add a new woreda/town page

1. Append an entry to `DATA.places` following the existing shape (see Dembi Dolo entry as the reference).
2. Required Afaan Oromoo names: Dambi Doolloo, Sayyoo, Laaloo Qilee, Jimmaa Horroo, Daallee Waabaraa, Gidaamii, Anfilloo, Haawwaa Galaan, Daallee Sadii, Sadii Canqaa, Gaawoo Qeebbee, Yamaalogii Walal.
3. Set `coords:[lat,lng]` for the OpenStreetMap embed.
4. Add at least one notable person if the woreda has a documented figure; otherwise leave `notable:[]` (the section will hide).
5. Add the woreda to the SVG map pin positions in `renderMapSvg()` in `app.js`.

### Add a news article

Append to `DATA.news`:

```js
{
  id: "slug-kebab-case",
  type: "news",
  date: "YYYY-MM-DD",
  cat: {en:"Development", om:"Misooma"},
  place: {en:"Dembi Dolo", om:"Dambi Doolloo"},
  title: {en:"…", om:"…"},
  excerpt: {en:"…", om:"…"},
  body: {en:"…", om:"…"},  // one string; paragraphs split on \n\n
  img: IMG.somePhoto,
  gallery: [IMG.p1, IMG.p2, IMG.p3],  // optional — enables lightbox
  source: {en:"Source name", om:"…"}  // optional
}
```

### Add a notable person

Add to `DATA.zonePeople` with a `link:'/place/<woreda-slug>'`, then reference from that woreda's `notable[]` array (as the same object, not a copy — so bio edits stay centralized).

### Add a new route

1. Add a case in `parseHash()` in `app.js`.
2. Add a `view<Name>()` function returning HTML string.
3. Add a nav link in `index.html` (both desktop `.nav-links` and mobile `.mobile-menu`).
4. Add i18n labels.
5. Update `setActiveNav()` so the correct link highlights.

### Add a CSS color/shadow

Add to `:root` in `style.css`, then add a dark-mode value in `[data-theme="dark"]` if it needs inversion. Do not add ad-hoc hex/rgb values in component rules.

---

## PWA / offline rules

- `sw.js` precaches core assets + local images in the `ASSETS` array. Always add new local assets there.
- Cache-first same-origin, network-first with cache-fallback cross-origin (fonts, Lucide CDN).
- If you change the service worker, bump `CACHE` (e.g. `dq-v7` → `dq-v8`) so clients activate the new worker on next load.
- Never rely on a network request for core UI. The site must render fully offline.
- Install prompt: `state.deferredInstall` holds the `beforeinstallprompt` event. Use `deferredInstall.prompt()` when the user clicks install. The banner + footer "Install app" button are already wired.

---

## i18n cheat sheet

```js
// For short UI labels registered in DATA.i18n:
t('key')                                // → returns EN or OM string

// For inline content objects:
pick(obj)                               // obj = {en:"Hi", om:"Akkam"} → current lang
pick(obj, 'en')                         // force a language
```

When writing Afaan Oromoo:

- Use the official spellings from the Kellem Wollega zone documentation.
- Woreda/town names must match the list in the README exactly.
- Don't mix in Amharic — the secondary language is Afaan Oromoo only.
- If you're unsure of a translation, flag it in the PR description for the Content agent to review rather than guessing.

---

## Accessibility checklist (apply to every new UI component)

- [ ] Semantic HTML element (button vs link vs div)
- [ ] Keyboard reachable and operable (Tab/Enter/Space/Esc where expected)
- [ ] Visible focus state (the existing CSS provides this; don't remove outlines without replacing)
- [ ] Color contrast ≥ 4.5:1 for text (the brand green/gold palette is tuned; don't regress)
- [ ] Alt text for meaningful images; `alt=""` for decorative
- [ ] `aria-*` where native semantics fall short (dialogs, tabs, expanded menu)
- [ ] Reduced-motion: wrap new animations in `@media (prefers-reduced-motion: no-preference)` when noticeable
- [ ] Mobile tap targets ≥ 44×44px

---

## Performance budgets

- First load JS < 200KB gzipped (currently ~60KB, lots of room)
- First load CSS < 20KB gzipped (currently ~13KB)
- Lighthouse Performance ≥ 90 on mobile
- Lighthouse PWA: passes all installability + offline checks
- Images: serve reasonably sized; prefer JPEG at q=70 for photos, dimensions ≤ 1600px wide

---

## Branching & PR reminders

- Branch off `main`: `git checkout -b feature/your-slug`.
- One concern per PR.
- Fill in the PR template: what, why, how to test, screenshots if visual, sources if content.
- Tag the PR with a label: `frontend`, `content`, `backend`, `pwa`, `docs`, `bug`, `chore`.
- Assign the lead/PM as reviewer. Don't merge your own PRs.
- If you get stuck, open a Draft PR and tag the PM for help rather than going silent.

---

## Things that are known gaps you might pick up (without filing an issue first)

1. Real photos for most woredas still use Unsplash placeholders — when new photos arrive, swap the `IMG.*` constants and remove the "placeholder" comments.
2. Chapa payment is UI-only; needs merchant keys and fetch call.
3. /staff is a login scaffold; needs a real editor (simple markdown/JSON editor posting to a backend, then rebuild data.js on deploy or pull from JSON).
4. The homepage SVG zone map is stylized — a future task is to trace more accurate woreda shapes.
5. The staff/editor markdown preview and templates are not implemented.
6. Accessibility audit hasn't been formally done — axe-core checks welcome.
7. SEO: Open Graph per route, sitemap, canonical tags.
8. Print stylesheet for woreda pages.

For bigger work, file an issue first so it gets triaged and prioritized.

---

## Useful commands

```bash
# Serve locally
python3 -m http.server 8080

# Syntax check JS
node --check js/app.js && node --check js/data.js

# Check service worker / manifest validity
# (Use Lighthouse in Chrome DevTools → "Installable" audit)
```

---

Welcome aboard. Ship quality, cite sources, and remember this site represents real places and people.
