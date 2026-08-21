# Contributing to Discover Qellem

Thank you for helping build Discover Qellem. This document explains how we work.

---

## Workflow (trunk-based PRs)

- Default branch: `main` (protected — requires PR + review to merge)
- For every task, create a short-lived feature branch off `main`:
  - `feature/<short-slug>` — new features (e.g. `feature/chapa-donate`)
  - `content/<short-slug>` — content additions/edits (e.g. `content/gidami-history`)
  - `fix/<short-slug>` — bug fixes (e.g. `fix/hero-image-dark-mode`)
  - `chore/<short-slug>` — tooling/infra
- Open a **Pull Request** against `main`, fill in the PR template (which will appear automatically), request review from the lead maintainer.
- A PR should be small and focused — ideally one concern. If you find yourself touching unrelated files, split it.

### Commit messages

Use the imperative mood, keep the subject under 72 chars:

```
feat: wire Chapa donate button to live API
fix: ensure hero bg renders on woreda pages in dark mode
content: add 3 notable figures for Hawa Gelan
docs: update README with i18n string conventions
```

Prefixes: `feat`, `fix`, `content`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `pwa`, `i18n`.

---

## Hard rules (these will get a PR rejected)

1. **No npm, no build step, no framework.** Plain HTML/CSS/vanilla JS. Adding a dependency without discussion is an automatic "request changes."
2. **No emojis** in user-visible text or UI (Lucide icons only).
3. **Every user-visible string must be bilingual** — every new string needs both `en` and `om` in `DATA.i18n` (or `{en:"…", om:"…"}` for content entries).
4. **All facts must be sourced.** If you add a number, name, date, or historical claim, cite the source in the PR description and in an adjacent code comment.
5. **Never hardcode colors** outside the `:root` / `[data-theme="dark"]` token block in `style.css`. Use the CSS variables (`var(--brand-700)`, `var(--gold-400)`, etc.).
6. **Don't break offline/PWA.** If you add a new static asset, add it to the `ASSETS` array in `sw.js` and bump the `CACHE` version.
7. **Mobile-first.** Every new UI element must work at 360px width. No horizontal scroll.
8. **Accessibility is not optional.** Semantic HTML, alt text for images, keyboard-navigable controls, visible focus states, `aria-*` where needed.
9. **Lucide icons only** for UI glyphs — no icon fonts, no emoji, no inline SVGs of icons (inline SVGs for the zone map are fine).
10. **Don't ship broken routes.** Every new hash route must be registered in `parseHash()` in `app.js`, every `href="#/..."` must resolve.

---

## Coding standards

### HTML

- Use semantic elements (`<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<main>`).
- Declare language on `<html>` and update it when the user toggles language (the app already does this — don't regress it).
- Always set `alt=""` for decorative images, descriptive `alt` for meaningful ones.

### CSS

- Work inside the existing token system. If you need a new color/shadow/radius, add a token rather than a one-off value.
- Follow the BEM-ish class naming already in use (`.block`, `.block-element`, `.block--modifier`).
- Dark-mode variants go inside `[data-theme="dark"] { … }` blocks — never use `@media (prefers-color-scheme: dark)` as the only mechanism (the user toggle must win).
- Respect `prefers-reduced-motion` for any new animation.
- Use `clamp()` for fluid typography; don't set fixed pixel font sizes for headings.

### JavaScript

- No libraries other than Lucide.
- Stay inside the IIFE in `app.js`; don't leak globals. The only global you may set is `window.toast` (already exported for inline handlers).
- Use `const`/`let`, never `var`.
- All DOM injection must happen inside a `view*()` function and go through `$app.innerHTML = …` (the router pattern). Don't append ad-hoc elements to `<body>` after render except for transient overlays (toast, lightbox, install banner — those already exist).
- After updating DOM, call `if (window.lucide) lucide.createIcons();` and re-bind behaviors if needed.
- i18n strings: use `t('key')` for UI strings and `pick(obj)` for content objects like `{en:"…", om:"…"}`. Don't read `state.lang` directly unless you must.
- Keep functions small. If a `view*()` function grows beyond ~150 lines, extract helpers.

### Content (data.js)

- Keep entries alphabetical/natural-ordered within their arrays.
- Every woreda/town needs: `slug`, `type` (`"woreda"` or `"town"`), `name.{en,om}`, `img`, `tagline.{en,om}`, `badges[]`, `pop`, `elev.{en,om}`, `key.{en,om}`, `coords[lat,lng]`, `aboutTitle.{en,om}`, `about[]` (array of `{en,om}` paragraphs), `facts[]` (array of `{l:{en,om}, v, n?}`), `gallery[]`, `placesList[]`, `notable[]`.
- Notable people: add to `zonePeople[]` (with `link:'/place/<slug>'`) and reference from the woreda's `notable[]`.
- Dates ISO 8601 (`YYYY-MM-DD`).
- Numbers: strings with commas for display (e.g. `"1,254,817"`).

---

## Testing before opening a PR

1. `node --check js/app.js && node --check js/data.js` — zero syntax errors.
2. Local server (`python3 -m http.server 8080`) and manually check:
   - [ ] All top-level nav links work
   - [ ] Every woreda page loads (hero photo visible, quick facts, gallery lightbox opens, OSM map renders, culture grid, notable people)
   - [ ] Dark mode toggle works across all pages, no unreadable text
   - [ ] EN/OM toggle applies to the page you're on (and persists on reload via localStorage)
   - [ ] Mobile nav opens/closes, no horizontal scroll at 360px width
   - [ ] News article with photo gallery (inauguration) opens lightbox, prev/next/Esc all work
   - [ ] PWA: Lighthouse "Installable" badge passes; offline works after first load (kill network, refresh)
3. If you changed service worker behavior: bump `CACHE` in `sw.js`.
4. If you added new routes/links: confirm they don't 404.

---

## Reporting bugs

Open an issue using the **Bug report** template. Include:

- Which page/route
- What you expected vs. what happened
- Browser + device (with screenshot if visual)
- Steps to reproduce

---

## Code of conduct

Be kind, be specific in reviews, cite sources for factual claims, and respect that this site represents real communities in Kellem Wollega. When writing about people, culture, or history, accuracy and dignity matter more than velocity.
