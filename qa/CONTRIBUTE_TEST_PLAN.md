# QA test plan — /contribute community-story form (issues #32 / #18)

> Owner: QA. Backend endpoint landed (#108, `POST /api/v2/community-stories/`);
> the FE form landed in **#126** and is **live on main @ 490c859**
> (`ContributeForm.tsx`). This plan is the acceptance criteria, updated for the
> Sprint 6 manual pass.

---

## 0. Backend contract (landed, #108)

- `POST /api/v2/community-stories/` — anonymous, DRF `APIView`.
- Accepted fields: `author_name` (opt), `place` (opt, canonical woreda slug,
  validated against `Geography`), `story_om` / `story_en` / `story_am`
  (opt, each ≤ 10,000 chars, plain text escaped to `<p>`), `website` (honeypot).
- Validation: at least one of `story_om/en/am` must have meaning
  (`text_has_meaning` → non-whitespace). `place` must exist or be blank.
- Honeypot: if `website` is non-empty → **201 fake success, nothing stored**.
- Rate limit: `community_story_submissions` = **5/hour** (DRF scoped throttle) →
  429 when exceeded.
- Success: 201 `{"received": true, "detail": "Galatoomaa! … awaiting editorial review."}`;
  story saved unpublished + unapproved under the OM archive index.
- 503 if no live OM archive index page exists.

---

## 1. Gaps — resolved by PR #126 (pre-flip)

The FE wiring landed in PR **#126** (`ContributeForm.tsx`, 267 lines). Gap
status against that PR:

| # | Gap | Resolved by #126? |
|---|---|---|
| G1 | Consent checkbox | **YES** — "I confirm I have the right to share this story" checkbox, required, client-side only (backend still has no consent field — a server-side `consent_confirmed` remains a follow-up if the PM wants server enforcement). |
| G2 | "Too-short" story | **PARTIAL** — client enforces ≥20 chars; the backend still rejects only empty/whitespace (`text_has_meaning`). The 20-char floor is FE-only. |
| G3 | Photo upload | **DROPPED** — the new form has no file input (backend has no attachment path). |
| G4 | Language mapping | **YES** — single story textarea mapped to `story_om/en/am` by the active language. |
| G5 | Place field | **YES** — optional `<select>` populated from `places.GeographyProfilePage` (the places API). |
| G6 | Honeypot | **YES** — hidden off-screen `website` field, submitted empty for real users. |

Re-test note: run §2/§3 against #126 once it merges (the form is live on
`/contribute`); the "stub" framing above no longer applies.

---

## 2. Manual test cases

### 2a. Happy path
1. Fill name, place (e.g. `dambi-doolloo`), story → submit.
2. **Expected:** success toast in OM ("Galatoomaa! …"); form clears; no JS errors.
3. Verify via CMS admin: a new unpublished `CommunityStory` exists under the
   archive index with `approved=False`, `live=False`, and the submitted text
   escaped to `<p>`.

### 2b. Validation (client + server)
| Case | Expected |
|---|---|
| Empty story (all languages blank) | 400; error message "Provide the story in at least one language"; focus moves to the story field |
| Story with only whitespace | same as empty |
| Too-short story (if G2 lands) | field error with the minimum-length message |
| Unknown place slug | 400 "Unknown place slug." |
| Overlong story (> 10,000 chars) | 400 max-length error |
| Unchecked consent (if G1 lands) | form blocked client-side (button disabled / inline error); server unaffected |

### 2c. Honeypot
1. Fill `website` with anything (e.g. "spam.com") and submit a valid story.
2. **Expected:** 201 "received" message, but **no** `CommunityStory` created
   (verify count unchanged in the DB/admin).

### 2d. Rate limit
1. Submit 6 valid stories within an hour (or use the DRF test override).
2. **Expected:** the 6th returns **429**; the FE shows a user-friendly
   "too many submissions, try again later" message (not a raw JSON/stack trace).

### 2e. Accessibility
- Every input has an associated `<label for=…>`.
- Client validation errors are announced (`role="alert"`/`aria-live`) and the
  error list is linked to the offending field; focus moves to the first error.
- Escape does not close anything unexpected (no modal on this page); no focus
  trap.
- All controls ≥ 44px (textarea, inputs, submit, select).
- Honeypot field is hidden from SR and keyboard (not `display:none` alone —
  use `tabindex="-1" autocomplete="off" aria-hidden="true"`).

### 2f. Visual / i18n
- Dark mode readable; no horizontal scroll at 375px.
- EN/OM (and AM once enabled) labels route through i18n; no hardcoded English;
  no emojis.
- Success/error toasts use the active language.

---

## 3. Headless checks (Puppeteer — to run once the form lands)

Extend the QA harness (`/home/user/qatools`) with `contribute-check.js`:

1. Load `/contribute` at 375/768/1280 in light+dark: assert no hscroll, no
   broken images, 0 console errors.
2. Submit empty → assert error message visible + `document.activeElement` is
   the story textarea (focus moved).
3. Submit a valid story (mock or live CMS) → assert success toast contains
   "Galatoomaa" (or the localized success key).
4. Inject `website` value → submit → assert success toast shown AND (if live
   CMS) the story count is unchanged.
5. 429 path: POST until throttled → assert the user-facing throttle message
   (not a raw JSON dump).
6. Tab through the form → assert focus order name → place → story → (consent) →
   submit, with visible focus rings.
7. AM toggle (once #85 lands): assert the form labels re-render in Amharic and
   the Ethiopic font is applied.

---

## 3b. Sprint 6 manual pass (the PM's acceptance list)

Run each row against a **running CMS in Docker** (real POSTs, not mock) and
record PASS/FAIL with screenshots in the PR comment.

| # | Test | Steps | Expected |
|---|---|---|---|
| M1 | Empty form | Submit with story blank and consent unchecked | Field errors on **story** and **consent**; focus moves to the first invalid field (story textarea) |
| M2 | Valid OM story | Fill a ≥20-char story, check consent, submit in OM | Success message ("Galatoomaa! …"); record appears in Wagtail admin with `live=False`, `approved=False`, under the OM archive index |
| M3 | Throttle | Submit 6 valid stories in the hour (or use a test override) | 6th returns **429**; the form shows a user-friendly "too many submissions" message (no raw JSON/stack trace) |
| M4 | Honeypot | Fill the off-screen `website` field and submit a valid story | Server returns the fake success; **no** `CommunityStory` row is created (verify count in admin/DB) |
| M5 | a11y | Inspect the form | Every input has an associated `<label>`; on error, `aria-invalid="true"` and `aria-describedby` point at the error text; focus moves to the first error; honeypot is `tabindex="-1" aria-hidden="true" autocomplete="off"` |
| M6 | Dark + mobile | Toggle dark mode; resize to 375px | Readable in dark mode; no horizontal scroll |

Note on M1/M2: the backend serializer has no `consent` field, so consent is a
client-side gate only (G1). The "empty form → field errors on story + consent"
behaviour is therefore FE-enforced; the server only rejects the empty story.
Confirm with PM whether server-side consent is wanted.

---

## 4. Sign-off bar

The FE wiring PR is APPROVED only when: all of §2 passes manually, §3 headless
checks pass, gaps G1–G6 have an explicit PM decision recorded (and any that
require backend changes are filed as issues), and the Sprint-5 contrast bugs
(#80/#82/#121) are not newly instantiated on this page.
