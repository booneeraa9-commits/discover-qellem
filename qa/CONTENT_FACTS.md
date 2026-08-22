# Discover Qellem — Verified Content Facts

Mirror of the PM's verified facts. Reviewers use this to cross-check numbers and
strings in one place instead of hunting through the demo. **Do not edit facts
here without PM sign-off** — if content looks wrong, open a `content` issue.

Source of truth in code: `demo-vanilla-reference` → `js/data.js`; production seed:
`apps/cms/places/migrations/0002_seed_canonical_geographies.py`. Every fact must
also trace to a `Source` record in the `provenance` app.

---

## 1. Zone-level facts

| Fact | Verified value |
|---|---|
| Population | **1,254,817** |
| Area | **≈ 9,857 km²** |
| Woredas + town | **12** (11 rural woredas + 1 town administration) |
| Kebeles | **289** (258 rural + 31 urban) |
| Coffee | **134,213 tonnes** from **484,841 ha** |
| Honey | **473,300** hives |
| Livestock | **6,721,429** |
| Schools | **452** primary / **50** secondary / **1** university |
| Students | **348,516** |
| Health | **4** hospitals / **51** health centres / **256** health posts |
| Cooperatives | **817** co-ops / **156,500** members |
| Climate | **47%** woyinadega / **39%** kola / **14%** dega |
| Ethnicity | Oromo **94.8%** / Amhara **4.01%** |
| Religion | Protestant **42.5%** / Orthodox **34%** / Muslim **21%** |
| Language | Afaan Oromoo **96.31%** / Amharic **3.13%** |
| Minerals | gold — Anfillo, Dale Wabera, Hawa Gelan, Lalo Kile, Sayo; platinum — Lalo Kile; tantalum — Sayo; uranium — Anfillo, Sayo |
| Dati Walal National Park | **103,500 ha**; proclamation **87/2005**; gazetted **25 May 2012** |

## 2. Canonical Oromo woreda names (12) — exact strings

```
Dambi Doolloo, Sayyoo, Laaloo Qilee, Jimmaa Horroo, Daallee Waabaraa,
Gidaamii, Anfilloo, Haawwaa Galaan, Daallee Sadii, Sadii Canqaa,
Gaawoo Qeebbee, Yamaalogii Walal.
```

English transliterations (for reference only, OM is authoritative):
Dembi Dolo, Sayo, Lalo Kile, Jimma Horo, Dale Wabera, Gidami, Anfillo,
Hawa Gelan, Dale Sadi, Sadi Chanka, Gawo Kebe, Yemalogi Welel.

Verification (2026-08-21): all 12 present, spelled exactly, in the demo
(`js/data.js` place `name.om` fields) and in the production seed migration.

## 3. Slug mapping (canonical vs demo)

| Canonical slug (production seed) | Demo slug |
|---|---|
| `dambi-doolloo` | `dembi-dollo` |
| `sayyoo` | `sayo` |
| `haawwaa-galaan` | `hawa-gelan` |
| `daallee-sadii` | `dale-sadi` |
| `daallee-waabaraa` | `dale-wabera` |
| `gaawoo-qeebbee` | `gawo-kebe` |
| `yamaalogii-walal` | `yemalogi-welel` |
| `anfilloo` | `anfilo` |
| `gidaamii` | `gidami` |
| `laaloo-qilee` | `lalo-kile` |
| `sadii-canqaa` | `sadi-chanka` |
| `jimmaa-horroo` | `jimma-horo` |

## 4. Inauguration article (2026-08-21) — verified figures

- Total: **more than 650 million Birr** across all projects.
- **Grand Oliqa Dingil Hall**: **> 425 million Birr**; construction began
  **2016 E.C.**; **11 rooms/units** + 1 grand hall + 1 secondary hall +
  cafeteria + recreation areas.
- **Obbo Girma Dangala** (Mayor of Dembi Dolo): **more than 32 projects** underway.
- **Obbo Gammachuu Gurmesa** (Chief Administrator, Kellem Wollega):
  **2,284 projects** worth **> 17 billion Birr**, completed over the
  **last 4 years**.
- **Dr. Utukana Odaa** (Deputy Head, Office of the President, Oromia Regional
  State) — attended and spoke. OM: "Dr. Utukaanaa Odaa".
- Source: Kellem Wollega Zone Communication Office.

### Gallery order (verified)

```
1. project13   (Oliiqaa Dingil Hall during large event)
2. project6    (Oliiqaa Dingil Grand Hall interior)
3. project3    (Ceremony with pink hats)
4. project1    (Ribbon cutting)
5. project2    (Main avenue of Dembi Dolo)
```

**Discrepancy (bug 004):** the demo orders the gallery
`project3, project6, project13, project1, project2`. The verified order above is
authoritative for the port (issue **#27**).

### Minor spelling flag

- EN "Dr. Utukana Oda" (demo) vs verified "Dr. Utukana Odaa". OM
  "Dr. Utukaanaa Odaa" is correct. Confirm the EN transliteration with the PM
  before the article is ported.

## 5. News categories (canonical — Sprint 3 taxonomy gate)

Every news seed/article must carry exactly one of these 9 keys (PM-approved,
2026-08-22). Any other key → QA blocks the PR.

| Key | EN label | OM label (exact) |
|---|---|---|
| `development` | Development | `Misooma` |
| `economy` | Economy | `Dinagdee` |
| `environment` | Environment | `Naannoo` |
| `minerals` | Minerals | `Mineraala` |
| `agriculture` | Agriculture | `Qonna` |
| `health` | Health | `Fayyaa` |
| `education` | Education | `Barnoota` |
| `culture` | Culture | `Aadaa` |
| `trade` | Trade | `Daldala` |

Hard rules:
- `economy` OM MUST be `"Dinagdee"` — not `"Diinaagdee"`.
- `minerals` OM MUST be `"Mineraala"` — not `"Albuuda"`.
- The FE data (`apps/web/src/lib/news-data.ts`) uses these keys:
  `development, economy, environment, minerals, agriculture, health,
  education, culture`; the demo also uses `trade` for the markets event.

---

## 6. Demo content notes for reviewers

- Demo defaults UI language to **EN** on load (index.html `lang="en"`), then
  toggles. Production should confirm the default (OM is authoritative).
- Demo uses literal `↔` / `→` arrows in a few UI strings ("Translation
  Oromo ↔ English", "Share → Add to Home Screen"). The port should use Lucide
  icons instead — no emoji-like glyphs in UI copy.
- Demo has extra routes not in the PM's production list: `/stories`,
  `/contribute`, `/about` (see TEST_PLAN §2 flag).
- Demo does **not** honor `prefers-reduced-motion`; production must
  (a11y requirement, not a demo parity requirement).
