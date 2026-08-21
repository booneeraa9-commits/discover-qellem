# Contributing to Discover Qellem

First, read this entire file. If you are an AI agent, read **[AGENTS.md](./AGENTS.md)** too — it's the onboarding doc specifically for you.

---

## 1. Branch protection & PR workflow

- `main` is **protected**:
  - No direct pushes (not even by maintainers).
  - Every change requires a Pull Request.
  - At least **one approved review** (from the lead/PM agent) before merge.
  - CI (`.github/workflows/ci.yml`) **must pass**.
  - No force-pushes, no branch deletion.
- Create a short-lived feature branch off `main` for each logical change:
  - `feat/web/<slug>` — new frontend feature
  - `feat/cms/<slug>` — new backend/CMS feature
  - `content/<slug>` — content, translations, photos, facts
  - `fix/<slug>` — bug fix
  - `chore/<slug>` — tooling, deps, CI, docs
  - `docs/<slug>` — documentation only
- One concern per PR. If you're tempted to bundle unrelated changes, split them.
- Fill in the PR template completely. Visual changes must include screenshots.
- Tag with the right label: `frontend`, `backend`, `content`, `pwa`, `docs`, `bug`, `chore`, `good first issue`.

### Commit messages

Imperative mood, concise subject (<72 chars), scope-prefixed:

```
feat(web): add glass sticky nav with scroll state
fix(cms): enforce OM-required fields on GeographyPage
content: add Dr. Negasso Gidada biography in EN/OM
chore(ci): add Next.js lint step to backend workflow
```

Scopes: `web`, `cms`, `places`, `archive`, `editorial`, `partners`, `provenance`, `home`, `i18n`, `pwa`, `deps`, `ci`, `docs`, `content`.

---

## 2. Local development

### Prerequisites

- Docker Desktop (or Docker Engine + Compose plugin) — easiest path
- OR: Node 20+ and Python 3.12+ for native dev

### With Docker (recommended)

```bash
cp .env.example .env
# Edit .env to set POSTGRES_PASSWORD and DJANGO_SECRET_KEY.
docker compose up --build
# In another shell:
docker compose exec cms python manage.py migrate
docker compose exec cms python manage.py createsuperuser
```

Frontend: http://localhost:3000
CMS admin: http://localhost:8000/admin
Wagtail API: http://localhost:8000/api/v2/

### Native (frontend only)

```bash
cd apps/web
npm install
npm run dev
```

Point the frontend at a running CMS via `NEXT_PUBLIC_CMS_URL` (defaults to `http://localhost:8000`).

---

## 3. Stack rules (hard)

1. **Frontend lives in `apps/web/` (Next.js 16 App Router, React 19, TypeScript, Tailwind v4).**
   - No additional styling libraries without lead approval. Use Tailwind + CSS variables for the brand theme.
   - Lucide React (`lucide-react`) is the only icon library. **No emojis** in user-visible UI.
   - Components live in `apps/web/src/components/`; pages in `apps/web/src/app/`.
   - All content is fetched from the Wagtail API (or a typed wrapper around it) — **do not hardcode place names, bios, statistics, or news copy in TSX**.
2. **Backend lives in `apps/cms/` (Django 5, Wagtail 6, Django REST Framework).**
   - New content types → new models in the appropriate app (see `apps/cms/*/models.py`).
   - Every content field that the public sees must have an Afaan Oromoo version. The `AuthoritativeOromoPageMixin` enforces this at the model level; use it.
   - Every image must pass `validate_approved_image()` before publication (media rights check).
   - Every factual claim (population figure, date, mineral record, etc.) must be linked to a `Source` record in the `provenance` app.
3. **No private/source material in the repo.** Never commit documents from `source-materials/`, `private-source-materials/`, `private-media/`, `quarantine/`, `uploads/`, or any `.env` file. These are all gitignored.
4. **Migrations:** when you change a model, `python manage.py makemigrations` and commit the resulting migration file in the same PR.
5. **Tests:** add tests for any new model, view, or permission rule. Run `pytest` (Django) and `npm run lint` + `npm run build` (Next.js) before pushing — CI will run them.
6. **PWA / offline:** the frontend must install a service worker that caches same-origin assets and serves offline (see `pwa` label / issues).
7. **Accessibility is not optional.** Semantic HTML, alt text, keyboard nav, visible focus, ARIA where needed, color contrast ≥ 4.5:1.
8. **Mobile-first.** Tap targets ≥ 44×44px, no horizontal scroll at 360px width.
9. **No external JS/CSS dropped in via CDN `<script>`/`<link>` tags** — install via npm and bundle through Next.js, except for fonts (Google Fonts is OK).

---

## 4. Content & language rules

- **Afaan Oromoo (om) is authoritative.** Every published page must have complete Afaan Oromoo content before it can go live. English may lag behind.
- **Woreda/town names in Afaan Oromoo are canonical and must be spelled exactly**: Dambi Doolloo, Sayyoo, Laaloo Qilee, Jimmaa Horroo, Daallee Waabaraa, Gidaamii, Anfilloo, Haawwaa Galaan, Daallee Sadii, Sadii Canqaa, Gaawoo Qeebbee, Yamaalogii Walal.
- **Verified facts only.** Every statistic, date, historical claim, or mineral record must be linked to a `Source` in the `provenance` app. When adding a fact, include a migration/fixture/snippet that creates the Source record and links it.
- **Numbers use commas** (e.g. `1,254,817`). Dates ISO 8601 (`YYYY-MM-DD`) internally.
- **People:** biographies must be factual and respectful; do not editorialize. Link to the woreda page for each figure.
- **No emojis** in news, stories, UI labels, buttons, or metadata. Use Lucide icons.
- **Photo rights:** only upload photos with documented rights. Unapproved photos go in `private-media/` or `quarantine/` (gitignored), not in the repo or CMS media library.

---

## 5. Code standards

### Python (Django/Wagtail)

- Follow PEP 8; Ruff is configured.
- Type hints on new functions; docstrings on public models and utility functions.
- Use `gettext_lazy` (`_()`) for all user-visible strings in Python so they can be translated. `.po` files live in `apps/cms/locale/om/LC_MESSAGES/`.
- Wagtail page models: extend `AuthoritativeOromoPageMixin`, list `required_om_fields` and `translation_invariant_fields`, and register panels using `content_panels` / `promote_panels`.
- Use the existing `public_rich_text_features` whitelist for RichTextField — no `<script>`, no inline styles.

### TypeScript / React / Next.js

- Strict TypeScript (`strict: true` in `tsconfig.json`).
- Server components by default; add `"use client"` only when you need interactivity (state, effects, event handlers).
- Use Tailwind utility classes. Extract reusable components for repeated UI.
- Fetch data via a typed client in `apps/web/src/lib/cms.ts` (to be built — see issues) that wraps the Wagtail v2 API. Never hit the API directly from page components.
- Components accept typed props; avoid `any`.
- Use `next/font` for Fraunces (serif display) + Inter (sans) — the same typography pair as the demo.
- Lucide React icons: `import { Coffee, MapPin } from 'lucide-react'`.

### CSS / Design tokens

- Brand colors are defined as CSS variables in `apps/web/src/app/globals.css` (matching the demo palette):
  - Brand greens: `--brand-50` through `--brand-900` (deep forest green `#0b3d2e` at 800).
  - Gold accents: `--gold-300` through `--gold-700` (warm gold `#c7963a` at 500).
  - Ink scale: `--ink-50` through `--ink-900`.
- Dark mode is toggled via a `data-theme="dark"` attribute on `<html>` (same mechanism as the demo) — do **not** use Tailwind's `dark:` class strategy alone; it needs to pair with the theme attribute for persistence.
- Respect `prefers-reduced-motion` for animations.

---

## 6. Testing checklist (before marking a PR ready for review)

- [ ] `docker compose exec cms pytest` passes (or `pytest` if running native).
- [ ] `cd apps/web && npm run lint && npm run build` passes.
- [ ] New/changed models have migrations committed.
- [ ] New/changed pages render correctly at 360px, 768px, 1280px widths (no horizontal scroll).
- [ ] Works in both light and dark mode (toggle in nav).
- [ ] Works in both English and Afaan Oromoo (language toggle).
- [ ] Images have alt text; new icons are Lucide (no emoji).
- [ ] No new npm dependency added without justification in PR description.
- [ ] PWA install works; tested offline after first load (for web-facing changes).
- [ ] Every new fact has a `Source` link in `provenance`.

---

## 7. Releasing / deploying

- Production target: AletCloud VPS behind Caddy (HTTPS).
- Deploys happen from `main` after merge (CI/CD to be wired — see issues).
- The existing Netlify static demo (`discoverqellem.netlify.app`) will be replaced by the Next.js build once the frontend port is complete.

---

## 8. Code of conduct

Be kind, be specific in reviews, cite sources for factual claims, and respect that this site represents real people and communities in Kellem Wollega. Accuracy and dignity matter more than velocity.
