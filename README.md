# Discover Qellem — Qeellam Wallaggaa

**A verified, bilingual (English / Afaan Oromoo), installable PWA guide to Kellem Wollega Zone, Oromia, Ethiopia.**

> Live: [discoverqellem.netlify.app](https://discoverqellem.netlify.app) — currently the public demo; production launches from this repo.

---

## What this is

Discover Qellem is a **vanilla HTML / CSS / JavaScript single-page application** — no build step, no npm, no framework. It documents the twelve woredas and towns of Kellem Wollega Zone with verified facts drawn from the Kellem Wollega Zone socio-economic profile (2015/16 E.C.), the Oromo source book, the 2007 Population and Housing Census, the Ethiopian Mapping Authority (1988), and the Kellem Wollega Zone Communication Office.

### Principles

1. **Verified facts only.** No demo/placeholder numbers. Every statistic traces to a named source.
2. **Bilingual by default.** English primary, Afaan Oromoo (`om`) complete. Editors may publish OM-only, never EN-only.
3. **Vanilla.** Plain HTML/CSS/JS. No npm, no bundlers, no frameworks — the site must run from any static host and offline via service worker.
4. **Premium & accessible.** Inter + Fraunces typography, Lucide line icons (no emojis), WCAG-conscious contrast, keyboard nav, reduced-motion support.
5. **Works offline.** Service-worker cached, installable as a PWA on desktop and mobile.

---

## Quick start

```bash
# Any static server works — no build step
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just double-click `index.html` (note: PWA service worker requires `http://` or `https://`, not `file://`).

---

## Project structure

```
discover-qellem/
├── index.html            # SPA shell: nav, footer, install banner, toast, SW registration
├── manifest.webmanifest  # PWA manifest
├── sw.js                 # Service worker (cache-first same-origin, network-first CDN)
├── css/
│   └── style.css         # All styles, light + dark theme tokens, responsive
├── js/
│   ├── data.js           # ALL content: i18n strings, stats, places, news, people, sponsors
│   └── app.js            # Router, views, lightbox, i18n toggle, dark mode, install prompt
├── img/                  # Logos, photos, PWA icons (real photos + documented placeholders)
└── README.md / CONTRIBUTING.md / AGENTS.md
```

### Adding a woreda photo, news item, or person

All content lives in **`js/data.js`** inside the `DATA` object:

- `DATA.places[]` — each woreda/town (slug, name EN/OM, img, tagline, badges, about[], facts[], gallery[], placesList[], notable[])
- `DATA.news[]` / `DATA.events[]` / `DATA.stories[]` — articles (bilingual title/excerpt/body, optional gallery)
- `DATA.zonePeople[]` — notable figures (bio EN/OM, link to woreda page, optional photo)
- `DATA.i18n.en` / `DATA.i18n.om` — UI strings
- `IMG` object at the top — image path constants. When a real photo replaces a placeholder, swap the URL in `IMG` and every reference updates.

**Do not hard-code image URLs in views.** Add them to `IMG` and reference the constant.

---

## Routes (hash-based SPA)

| Hash | Page |
|---|---|
| `#/` | Home |
| `#/places` | Woredas & Towns list |
| `#/place/<slug>` | Single woreda/town (e.g. `#/place/dembi-dollo`) |
| `#/place/<slug>/<attraction>` | Sub-place detail |
| `#/news` | News & Events (with tabs) |
| `#/article/news/<id>` | News article |
| `#/article/story/<id>` | Story |
| `#/stories` | Community stories |
| `#/history` | Zone history + timeline + notable figures |
| `#/support` | Support / donate / wall of supporters |
| `#/contribute` | Share a story form |
| `#/staff` | Staff login scaffold (editor studio coming) |
| `#/about` | About |

---

## Scripts

There are no build scripts. Before pushing:

1. `node --check js/app.js && node --check js/data.js` — JS syntax check
2. Open the local server and click through: nav, every woreda page, dark mode, EN/OM toggle, news article lightbox, install banner, mobile drawer
3. If you change the service worker, bump the `CACHE` constant in `sw.js` (e.g. `dq-v6` → `dq-v7`) so returning clients pick up the new version.

---

## Conventions

- **Icons:** [Lucide](https://lucide.dev) via `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`. Use `<i data-lucide="icon-name"></i>`; call `lucide.createIcons()` after injecting HTML.
- **Fonts:** Fraunces (serif display) + Inter (sans), loaded from Google Fonts.
- **Colors:** CSS custom properties in `:root` and `[data-theme="dark"]` — never hard-code hex outside the token block.
- **No emojis anywhere** in user-visible text or UI.
- **Photos:** Real photos preferred. Unsplash placeholders are documented with comments in `IMG`; swap them out as real photography arrives.
- **Translations:** Every user-visible string must have both `en` and `om` entries in `DATA.i18n` or the relevant `{en:"…", om:"…"}` object.
- **Chapa payments:** UI is wired but shows "coming soon" toast until merchant keys are provisioned.

---

## Team & contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branch/PR workflow, coding standards, and how to pick up work. See [AGENTS.md](./AGENTS.md) for notes specifically for AI teammates.

---

## Sources

- Kellem Wollega Zone Socio-Economic Profile (2015 & 2016 E.C.)
- Oromo Source Book (Afaan Oromoo)
- Ethiopian Population and Housing Census, 2007 (ESS)
- Ethiopian Mapping Authority (EMA), 1988 — mineral records
- Kellem Wollega Zone Communication Office (inauguration news, Aug 2026)
- Community knowledge, reviewed against zone records
