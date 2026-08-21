# Bug 005 — Place slug divergence: canonical Oromo vs demo anglicized

- **Title:** `[bug] Place slugs diverge between production seed (canonical OM) and demo (anglicized) — demo links will 404`
- **Labels:** `bug`, `content`, `frontend`, `P1`
- **Assignee lane:** `content` (decide + redirect map), `frontend` (route layer)
- **Cross-ref:** issues **#26** (port woreda pages), **#30** (wire routes)
- **Status:** OPEN (found 2026-08-21)

## Reproduction

Compare the two sources:

- Production seed `apps/cms/places/migrations/0002_seed_canonical_geographies.py`
  uses canonical Oromo slugs: `dambi-doolloo`, `haawwaa-galaan`,
  `gaawoo-qeebbee`, `yamaalogii-walal`, …
- Demo `js/data.js` uses anglicized slugs: `dembi-dollo`, `hawa-gelan`,
  `gawo-kebe`, `yemalogi-welel`, …

The demo also emits hardcoded deep-links using the anglicized slugs, e.g.
notable-people `link: "/place/dembi-dollo"` and `"/place/yemalogi-welel"`.

## Expected

One canonical slug scheme for `/place/<slug>`, used everywhere; no dead links
after the port.

## Actual

Two competing schemes exist. If production serves pages under the canonical
slugs (as the seed and AGENTS.md "never hardcode place slugs in multiple
places" imply), every demo-sourced deep-link will 404 unless redirects are
added.

## Suggested fix

1. PM/content decide the canonical URL scheme (recommendation: keep the
   canonical Oromo slugs from the seed — they match the authoritative spellings).
2. Add a redirect map (anglicized → canonical) for the demo's legacy links.
3. Record the decision in `qa/CONTENT_FACTS.md` §3 and have the port use only
   canonical slugs.

## gh command (run by PM)

```bash
gh issue create --title "[bug] Place slugs diverge: production canonical OM vs demo anglicized" \
  --body-file qa/bugs/005-place-slug-divergence.md \
  --label "bug" --label "content" --label "frontend" --label "P1"
```
