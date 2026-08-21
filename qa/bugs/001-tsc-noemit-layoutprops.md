# Bug 001 — `npx tsc --noEmit` fails on a fresh clone

- **Title:** `[bug] npx tsc --noEmit fails on fresh install: TS2304 Cannot find name 'LayoutProps'`
- **Labels:** `bug`, `frontend`, `P1`
- **Assignee lane:** `frontend`
- **Status:** OPEN (found 2026-08-21 on `main` @ `b95d592`)

## Reproduction

1. Fresh clone of `main` (no `.next/` directory present).
2. `cd apps/web && npm install`
3. `npx tsc --noEmit`

## Expected

Type-check passes (this is the command `AGENTS.md` documents as "Type-check only").

## Actual

```
src/app/layout.tsx(9,50): error TS2304: Cannot find name 'LayoutProps'.
```

`layout.tsx` uses `LayoutProps<"/">` (Next.js 16 typed routes). `LayoutProps` is
provided by Next's generated `.next/types/*.d.ts`, imported transitively via
`next-env.d.ts`. Those files do not exist until `next dev` / `next build` runs,
so standalone `tsc --noEmit` fails on any fresh checkout.

## Notes / why this matters

- `npm run build` passes because Next generates the types during the build.
- `npm run lint` passes.
- A contributor who follows the documented type-check command on a fresh clone
  gets a spurious error and cannot tell whether their code type-checks.
- If a future CI step adds `tsc --noEmit` before a build step, CI will go red
  for the wrong reason.

## Suggested fixes (any of)

1. Run `next typegen` (Next 16 generates `.next/types`) or `next build` before
   type-checking in docs/CI.
2. Replace the `LayoutProps<"/">` generic with an explicit `{ children:
   React.ReactNode }` typing so the file type-checks standalone.
3. At minimum, update `AGENTS.md` to document that a warm-up `next dev`/`next
   build` is required first.

## gh command (run by PM)

```bash
gh issue create --title "[bug] npx tsc --noEmit fails on fresh install: TS2304 Cannot find name 'LayoutProps'" \
  --body-file qa/bugs/001-tsc-noemit-layoutprops.md \
  --label "bug" --label "frontend" --label "P1"
```
