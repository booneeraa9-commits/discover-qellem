# QA API contract — CMS ↔ frontend (issues #29 / #30)

> Owner: QA. This is the single source of truth for what the Wagtail v2 API
> promises to the Next.js frontend, and what the `qellem_cms` contract test
> suite (`apps/cms/qellem_cms/tests/test_api_contract.py`) enforces on every
> backend PR.
>
> All shapes below were verified against `main` @ `9798162` by hitting the live
> API (Django test client + `runserver` + curl). Update this file whenever an
> endpoint's serialization changes, and keep the test suite in sync.

---

## 1. Endpoints

Base path `/api/v2/`. All responses are JSON with `?format=json` (or
`Accept: application/json`).

| Endpoint | Backing model / viewset | Public notes |
|---|---|---|
| `/api/v2/pages/` | `PublicPagesAPIViewSet` (Wagtail `PagesAPIViewSet` + story filter) | all published Wagtail pages |
| `/api/v2/images/` | Wagtail `ImagesAPIViewSet` | image library |
| `/api/v2/documents/` | Wagtail `DocumentsAPIViewSet` | document library (0 seeded) |
| `/api/v2/people/` | `archive.PersonAPIViewSet` | notable people (snippet) |
| `/api/v2/timeline/` | `archive.TimelineEventAPIViewSet` | zone history timeline |
| `/api/v2/sponsors/` | `partners.SponsorAPIViewSet` | display-approved sponsors |
| `/api/v2/supporters/` | `partners.SupporterAPIViewSet` | display-approved supporters |

> The PM brief says "six public v2 endpoints"; the router registers **seven**
> (`pages`, `images`, `documents`, `people`, `timeline`, `sponsors`,
> `supporters`). The contract and tests cover all seven. Confirm with PM
> whether `documents` is considered public (it is registered and returns 200).

---

## 2. Method / error contract (applies to every endpoint)

| Case | Status | Body |
|---|---|---|
| Anonymous GET (listing or detail) | 200 | JSON |
| Anonymous POST / PUT / DELETE | **405** | `{"message": ...}` |
| Missing detail (unknown pk, or record filtered from anon) | 404 | `{"message": "No ... matches the given query."}` |
| Invalid filter name or unknown query param (e.g. `?lang=`) | 400 | `{"message": "query parameter is not an operation or a recognised field: <name>"}` |
| `limit` > 20 on `pages` | 400 | `{"message": "limit cannot be higher than 20"}` |
| Unpublished page (draft) via detail | 404 | — |

Verified 2026-08-22: all seven endpoints return 405 for anon POST/PUT/DELETE.

---

## 3. Page shapes

### 3a. Listing (default fields)

Every listing item is `{"id", "meta", "title"}`:

```json
{
  "id": 6,
  "meta": {
    "type": "places.GeographyProfilePage",
    "detail_url": "http://…/api/v2/pages/6/",
    "html_url": "http://…/places/dambi-doolloo/",
    "slug": "dambi-doolloo",
    "first_published_at": null,
    "locale": "om"
  },
  "title": "Dambi Doolloo"
}
```

**Gotcha:** on `pages`, `slug` lives inside `meta.slug` (not top-level). The
custom endpoints (`people`, `timeline`, `sponsors`, `supporters`) expose their
fields **top-level** (see §5) — the FE client must not assume one convention.

### 3b. Listing with `fields=*`

`?fields=*` promotes each model's `api_fields` into the listing. For a
`NewsArticle` this yields: `body_en, body_om, category, featured_image,
gallery_images, published_date, title, title_en, title_om` (+ `id, meta`).

### 3c. Detail shapes

- `HomePage`: `contribute_summary, culture_summary, geography_name,
  geography_slug, hero_image, history_summary, introduction, naming_summary,
  overview, title` (+ id/meta).
- `GeographyProfilePage`: `geography_slug, geography_name, geography_level,
  introduction, overview, naming_origin, history, area_location,
  featured_image` (+ the §2b Sprint-3 additions).
- `NewsArticle`: `title_om, title_en, body_om, body_en, category,
  published_date, featured_image, gallery_images` (+ title/meta).

### 3d. Gallery image item

```json
{
  "id": 1,
  "meta": { "type": "archive.NewsArticleGalleryImage" },
  "image": {
    "id": 1,
    "meta": { "type": "wagtailimages.Image",
              "detail_url": "…/api/v2/images/1/",
              "download_url": "/media/original_images/inauguration-2026-project13.jpg" },
    "title": "Oliqa Dingil Hall during a large event"
  },
  "caption_om": "…",
  "caption_en": "…"
}
```

**Inauguration gallery order is authoritative (bug #61):** the `gallery_images`
list must serialize, in order, to project13 → project6 → project3 → project1 →
project2 (assert by matching `project(\d+)` in the `download_url` stem — the
test DB appends a random suffix like `project13_KJFXNqa`).

### 3e. Images / renditions

`/api/v2/images/<id>/` returns `{id, meta, title, width, height}` and
`meta.download_url` points at the **original** file. **No rendition URLs are
exposed** (checked: no `renditions` key, and `?renditions=max-800x600` has no
effect on this default viewset). Flag for #30/#40: the FE must either use
originals or the backend must add a renditions-capable image viewset before the
photo-heavy pages ship.

---

## 4. Filters (Wagtail v2, apply to `pages`; `type`/`fields` also to custom sets)

| Param | Meaning | Example |
|---|---|---|
| `type` | filter by page/snippet model | `?type=archive.NewsArticle` |
| `fields` | include extra fields (`*` = all `api_fields`) | `?fields=*` |
| `limit` / `offset` | pagination (limit max 20 on `pages`) | `?limit=20&offset=0` |
| `order` | ordering by field | `?order=-published_date` |
| `search` | full-text search | `?search=coffee` |
| `slug` | filter by slug | `?slug=dambi-doolloo` |
| `locale` | Wagtail locale | `?locale=om` |
| `translation_of` | translations of a page | `?translation_of=3` |

`?lang=` is **not** a valid param today (400). See §7 for the upcoming
`?lang=om|en|am` contract.

---

## 5. Custom endpoint shapes (top-level fields)

### people — `/api/v2/people/`
Fields: `id, meta, name_om, name_en, slug, is_zone_notable, woreda_slugs`.
Ordered by `name_om`, then `id`. Must return the **6** canonical slugs (see §6).

### timeline — `/api/v2/timeline/`
Fields: `id, meta, year_om, year_en, year_int, title_om, title_en, text_om,
text_en`. Ordered by **`-year_int`** (newest first). 13 seeded events.

### sponsors — `/api/v2/sponsors/`
Fields: `id, meta, display_name, partner_kind, website_url, display_mode,
recognition_text_om, recognition_text_en, sponsorship_level, display_order`.
Only `public_display_status=approved` + `is_active=True` + inside the display
window. Ordered by `display_order`, `display_name`.

### supporters — `/api/v2/supporters/`
Fields: `id, meta, display_name, partner_kind, website_url, display_mode,
role_om, role_en, affiliation_om, affiliation_en, contribution_period,
description_om, description_en, display_order`. Same display gate + ordering.

---

## 6. Data contract (enforced by the test suite)

### 6a. News category keys — exactly 9
`development, economy, environment, minerals, agriculture, health, education,
culture, trade`. No extras, no missing. (Verified: `NewsCategory` choices ==
this set.)

### 6b. Exact OM labels
- `economy` → `"Dinagdee"` (NOT `"Diinaagdee"`)
- `minerals` → `"Mineraala"` (NOT `"Albuuda"`)
- (Full table in `qa/CONTENT_FACTS.md` §5.)

### 6c. Canonical woreda slugs — exactly 12
`dambi-doolloo, sayyoo, haawwaa-galaan, daallee-sadii, daallee-waabaraa,
gaawoo-qeebbee, yamaalogii-walal, anfilloo, gidaamii, laaloo-qilee,
sadii-canqaa, jimmaa-horroo`.
(Enforced on the `Geography` model and on the `GeographyProfilePage` listing.)

### 6d. People slugs — exactly 6
`dr-negasso-gidada, oliqa-dingil-booka, jote-tulu, sadii-akkayyuu,
gidamii-guus-agaloo, jaal-laggasaa-wagii-metta`.

> **OPEN (bug #106):** the seed currently uses `jaal-laggasaa-wagii` and the FE
> uses `jaal-laggasaa-wagii-meettaa`. The contract asserts the PM list
> (`…-metta`), so the test is intentionally red until the slug is reconciled.

### 6e. Inauguration gallery order
project13, project6, project3, project1, project2 (§3d).

### 6f. Anonymity / published-only
- Anonymous `pages` listing excludes drafts; draft detail → 404.
- Anonymous listing + detail exclude **unapproved `CommunityStory`** records;
  authenticated users can see them. (Verified: unapproved story detail → 404.)

### 6g. Partner display gate
- 10 sponsors + 6 supporters are **seeded** (model rows), but all are
  `pending` + `inactive` by design → the anonymous public endpoints return
  `total_count: 0` until the PM approves display.
- After display approval, the public endpoints return 10 / 6.

### 6h. Timeline
13 events, ordered `-year_int` (descending).

---

## 7. `?lang=om|en|am` + `*_am` fields (LANDED for archive/places in #107)

**Status on `main @ 8a9e7f3`:** `?lang=` is live on `pages`, `people`, and
`timeline` (via `LanguageAwareAPIViewSetMixin`). `*_am` companions exist on
`NewsArticle`, `Event`, `CommunityStory`, and `GeographyProfilePage`.

Behaviour (verified live + by contract tests):

- `?lang=<code>` resolves every companion group (`title`, `body`, …) to a
  single value under the **generic base key**, preferring the requested
  language, then falling back **OM → EN** (`FALLBACK_ORDER = ("om", "en")`).
- With `?lang`, the suffixed keys (`title_om`/`title_en`/`title_am`, …) are
  **removed** from the response.
- Without `?lang`, every suffixed key is kept and a `translations` object is
  added mapping each base key to its three language values.
- Invalid `?lang=` (anything but om/en/am) → 400
  `{"message": "lang must be one of: om, en, am"}`.
- **`?lang=am` with an empty `*_am` field returns the OM value — never EN.**
  (Contract test `LanguageProjectionContractTests` asserts exactly this:
  `title_am=""`, `title_om="OM BODY"`, `title_en="EN BODY"` → `?lang=am`
  returns `"OM BODY"` and never `"EN BODY"`.)
- Default language is still `en` (FE `DEFAULT_LANG`) until #85 flips it; the
  API keeps `locale: om` as the primary page locale regardless.

---

## 7b. Sprint 5 BE additions (pending — gated by contract tests)

These are documented targets; the matching contract tests are
`@unittest.skip("pending Sprint 5 BE …")` today and must be un-skipped by the
BE PR that lands them.

### 7b-i. Partners bilingual fields (issue #122)
- `Sponsor` + `Collaborator` expose `display_name_om/en/am` (OM authoritative;
  EN/AM optional).
- Companions `recognition_text_am`, `role_am`, `description_am` present
  wherever the EN pair exists.
- `/api/v2/sponsors/` + `/api/v2/supporters/` accept `?lang=om|en|am` with the
  same OM-then-EN fallback.

### 7b-ii. NewsCategory Amharic labels (issue #123)
- Each of the 9 category labels carries an Amharic (Ethiopic script U+1200–U+137F)
  component so the FE can render Amharic chips without a hardcoded dictionary.

### 7b-iii. Image renditions (issue #112)
- `/api/v2/images/<id>/` exposes `meta.renditions` with at least
  `fill-400x300`, `fill-800x600`, `max-1600x1200`, and `original`, each with a
  resolvable URL. (Currently only the original `download_url` exists.)

---

## 8. Known risks

- The #79 taxonomy landed before #27/#28 seeds — verified consistent (seeds use
  `environment`/`minerals`/`agriculture` correctly).
- `slug` placement differs between `pages` (`meta.slug`) and custom endpoints
  (top-level) — the #29 typed client must handle both.
- Image renditions are not exposed (§3e) — block `next/image`-scale assumptions
  until the backend adds them or the FE accepts originals.
- People slug needs reconciliation before #30 links person cards (bug #106).
