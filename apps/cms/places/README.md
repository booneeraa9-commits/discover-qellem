# Places domain

This app owns locale-neutral geographic identities for Discover Qellem.

## Invariants

- `Geography.canonical_name` is the owner-approved Afaan Oromoo name and is used in every public language.
- Qellem Wallaggaa is the only root geography.
- Woredas and the Dambi Doolloo town administration are direct children of the zone.
- Canonical slugs are stable.
- `GeographyAlias` records support later search matching and redirects but never replace canonical names.
- Model validation runs on ordinary saves, while database constraints protect the hierarchy shape and alias uniqueness where PostgreSQL can enforce them.

Migration `0002_seed_canonical_geographies` creates the approved one-zone, eleven-woreda, one-town structure. No legacy aliases are seeded until they receive a separate owner review.

Translated profile and archive pages will reference these identities in later Phase 4 pull requests.
