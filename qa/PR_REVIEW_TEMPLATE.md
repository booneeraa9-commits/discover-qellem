# QA PR sign-off template

Paste this block as a comment on every PR. Fill in, do not leave blank. Binary
screenshots are not committed to the repo; attach them to the PR comment.

---

```
## QA sign-off — Discover Qellem

Lint/build: ✅ / ❌ (CI run: <link>)
Visual match to demo: ✅ / ❌ <screenshots if off>
Responsive (375px, 768px, 1280px): ✅ / ❌
Dark mode: ✅ / ❌
a11y (keyboard, contrast, alt): ✅ / ❌
Bilingual (all strings EN+OM, OM primary for content, no Amharic, no emojis): ✅ / ❌
Content facts verified (where applicable): ✅ / ❌ / N/A

QA sign-off: APPROVED / CHANGES REQUESTED

<Notes: be specific — e.g. "Heading contrast is 2.8:1 on the hero in dark mode
at 375px; needs >= 4.5:1" — not "looks bad". List any follow-up issues filed.>
```

---

### Hard rejections (automatic CHANGES REQUESTED)

1. Emojis in any user-visible UI or content (Lucide icons only).
2. Hardcoded color hex outside `apps/web/src/app/globals.css`.
3. `any` in TypeScript without justification.
4. English-only UI strings (OM missing).
5. Hardcoded place names, stats, or news copy in TSX (must come from the CMS).
6. New fact/date without a linked `Source` in the `provenance` app.
7. Photo without documented rights.
8. New model/permission/endpoint without tests.
9. `console.log` / `print` debug statements left in.
10. Out-of-sync migration file.
11. **News category keys** — every news seed/article must use exactly one of the 9
    canonical keys: `development`, `economy`, `environment`, `minerals`,
    `agriculture`, `health`, `education`, `culture`, `trade`. Any other key →
    block. (See `qa/CONTENT_FACTS.md` §News categories.)
12. **Category OM labels** — `economy` OM must be exactly `"Dinagdee"` (not
    `"Diinaagdee"`); `minerals` OM must be exactly `"Mineraala"` (not
    `"Albuuda"`). Flag any deviation.
13. **Canonical slugs/names** — place slugs must be the 12 canonical OM slugs
    (dambi-doolloo, sayyoo, haawwaa-galaan, daallee-sadii, daallee-waabaraa,
    gaawoo-qeebbee, yamaalogii-walal, anfilloo, gidaamii, laaloo-qilee,
    sadii-canqaa, jimmaa-horroo); woreda names the 12 canonical OM spellings.
14. **Inauguration gallery order** — must be project13, project6, project3,
    project1, project2 (bug #61).
15. **Dark-mode contrast** — no new `--brand-400`-on-dark text (2.54:1) and no
    white-on-white card chips (`.news-cat`/`.place-stat-chip` at 1.41:1) — see
    #80/#67.

### Remember

- You do not merge PRs (PM does). APPROVED = cleared for PM merge.
- Be specific: give the element, viewport, theme, and measured value.
- No emojis in QA feedback either.
- Reference the bug IDs in `qa/bugs/` when a finding matches a known baseline bug.
