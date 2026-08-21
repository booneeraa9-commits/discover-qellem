# Discover Qellem — Qeellam Wallaggaa

A verified, bilingual (Afaan Oromoo / English) digital archive and public-information platform for **Kellem Wollega Zone, Oromia, Ethiopia**.

> **Production:** launching at [discoverqellem.netlify.app](https://discoverqellem.netlify.app) (current static demo)
> **Stack in this repo (production):** Next.js + TypeScript frontend, Django + Wagtail CMS backend, PostgreSQL, Docker Compose, Caddy.

---

## Languages

- **Afaan Oromoo is the mandatory and authoritative content language.**
- Reviewed English translations are published alongside.
- Editors may publish Afaan Oromoo-only content, but never English-only.

## Architecture

| Layer | Tech | Path |
|---|---|---|
| Public frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 | `apps/web/` |
| Editorial CMS / API | Django 5, Wagtail 6, Django REST Framework | `apps/cms/` |
| Database | PostgreSQL 17 | (Docker Compose service) |
| Reverse proxy / HTTPS | Caddy 2 | (`compose.yaml` / deploy config) |
| Local environment | Docker Compose | `compose.yaml` in repo root |
| CI | GitHub Actions | `.github/workflows/ci.yml` |

### Content apps in the CMS

- `places` — canonical geography (zone → woreda → town → attraction) with coordinates, population, elevation, etc.
- `archive` — news, stories, history, notable people, glossary.
- `editorial` — role-based permissions (editors, translators, reviewers), media policy enforcement.
- `partners` — sponsors, supporters, institutional partners.
- `provenance` — source attribution for every factual claim (zone profile 2015/16 E.C., ESS 2007, EMA 1988, Communication Office, etc.).
- `home` — zone home page model with translatable rich-text fields.

### Why not a static site?

The prior v0 demo (`demo-vanilla-reference` branch) was a pure static SPA. For production we need authenticated editing, a vetted editorial workflow, media rights management, bilingual field-level validation, and a donate/forms backend — Wagtail + Next.js gives us that while still producing a fast static/pre-rendered public site.

---

## Quick start

### Prerequisites

- Docker Engine + Docker Compose v2
- Node.js 20+ (only if running the frontend outside Docker)
- Python 3.12+ (only if running the CMS outside Docker)

### Run everything in Docker

```bash
# 1. Copy environment template
cp .env.example .env
# Edit .env and set POSTGRES_PASSWORD, DJANGO_SECRET_KEY to real secrets.

# 2. Start the database + CMS + frontend
docker compose up --build

# 3. In another terminal, run migrations and create an admin user
docker compose exec cms python manage.py migrate
docker compose exec cms python manage.py createsuperuser

# 4. Visit:
#   - Frontend:   http://localhost:3000
#   - CMS admin:  http://localhost:8000/admin
#   - Wagtail API http://localhost:8000/api/v2/
```

### Frontend only (for UI work, using a remote CMS)

```bash
cd apps/web
npm install
npm run dev
# http://localhost:3000
```

### CMS only (for backend/content work)

```bash
cd apps/cms
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgres://...  # or use docker compose db
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

---

## Development conventions

Read **[CONTRIBUTING.md](./CONTRIBUTING.md)** before opening a PR. AI teammates must also read **[AGENTS.md](./AGENTS.md)**.

- Branch protection on `main` — all changes via PR, at least one review, CI must pass.
- Commit messages: imperative, prefix with area (e.g. `feat(web):`, `fix(cms):`, `content:`, `chore:`).
- English default for code, UI, and code comments; Afaan Oromoo is the authoritative content language.
- Lucide icons for all UI glyphs; no emojis in user-facing text.
- Brand palette is defined in `apps/web` Tailwind theme — dark + light modes supported.
- Private source documents, credentials, unapproved photos, and production secrets must **never** be committed.

---

## Repository layout

```
discover-qellem/
├── apps/
│   ├── cms/                 # Django + Wagtail backend
│   │   ├── archive/         # News, stories, history, people, glossary
│   │   ├── editorial/       # Permissions, roles, media policy
│   │   ├── home/            # Zone home page model
│   │   ├── partners/        # Sponsors / supporters
│   │   ├── places/          # Woredas, towns, attractions + seed data
│   │   ├── provenance/      # Source attribution for facts
│   │   ├── qellem_cms/      # Django project settings
│   │   └── locale/          # Translations (Afaan Oromoo .po/.mo)
│   └── web/                 # Next.js 16 frontend
│       └── src/app/         # App router pages
├── .github/
│   ├── ISSUE_TEMPLATE/      # Bug / content / feature templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/ci.yml     # Backend + frontend CI
├── compose.yaml             # Docker Compose (db, cms, web)
├── .env.example
├── AGENTS.md                # Instructions for AI teammates
├── CONTRIBUTING.md
└── README.md
```

---

## Content sources (provenance)

All factual claims trace to a source in the `provenance` app. Canonical sources:

- Kellem Wollega Zone Socio-Economic Profile (2015 & 2016 E.C.)
- Oromo Source Book (Afaan Oromoo)
- Ethiopian Population and Housing Census, 2007 (ESS)
- Ethiopian Mapping Authority (EMA), 1988 — mineral records
- Kellem Wollega Zone Communication Office (news releases, inaugurations)
- Vetted community knowledge, reviewed against zone records

---

## Team

We are four AI agents + one human product owner, coordinated through GitHub issues and PRs:

- **PM / Lead (merges PRs, sets roadmap, enforces standards)** — default Arena lead agent.
- **Frontend agent** — Next.js/Tailwind components, animations, responsive design, PWA.
- **Content agent** — Wagtail page models, Afaan Oromoo/English copy, photo pipeline, fact-checking/provenance.
- **Backend agent** — Django/Wagtail logic, API endpoints, auth, Chapa payments, deployment.

Agents: read [AGENTS.md](./AGENTS.md) before touching code.

---

## Status

Current phase: **port from vanilla demo to production stack.**

- `main` — production foundation (Django/Wagtail models, editorial permissions, CI, Docker).
- `demo-vanilla-reference` — the static SPA demo that serves as the visual/design/content reference.

See the [**Project board**](https://github.com/booneeraa9-commits/discover-qellem/projects) for current work.
# bounty-fix-ref: https://github.com/booneeraa9-commits/discover-qellem/issues/33
