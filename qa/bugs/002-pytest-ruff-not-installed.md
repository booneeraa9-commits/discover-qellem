# Bug 002 — `pytest` and `ruff` documented but not installed/configured

- **Title:** `[bug] pytest and ruff are documented in AGENTS/CONTRIBUTING but not in requirements.txt (ruff has no config)`
- **Labels:** `bug`, `backend`, `chore`, `docs`, `P1`
- **Assignee lane:** `backend`
- **Status:** OPEN (found 2026-08-21 on `main` @ `b95d592`)

## Reproduction

1. `cd apps/cms && python -m venv .venv && source .venv/bin/activate`
2. `pip install -r requirements.txt`
3. `pytest` → `pytest: command not found` (not in the venv).
4. `ruff check .` → `ruff: command not found` (not installed at all).

## Expected

`AGENTS.md` ("Useful commands") and `CONTRIBUTING.md` (testing checklist) tell
contributors to run `pytest` and `ruff check .`. Both should work after
`pip install -r requirements.txt`.

## Actual

- `requirements.txt` (and `requirements.in`) contain **neither pytest nor ruff**.
- There is **no ruff configuration** anywhere in the repo (no `pyproject.toml`,
  `ruff.toml`, or `[tool.ruff]`) — contradicting AGENTS.md's "Ruff is configured."
- There is no pytest config either (no `pytest.ini`/`pyproject.toml`).

## Impact

- New contributors following the onboarding docs hit "command not found"
  immediately (setup friction).
- CI runs `python manage.py test` (which passes, 146 tests), so nothing is
  broken in CI — but the docs promise two tools that do not exist in the project.
- The backend has **no lint step in CI** at all.

## Suggested fix

1. Add dev dependencies (e.g. a `requirements-dev.txt` or an extras block):
   `pytest`, `ruff`, `pytest-django` (if moving to pytest).
2. Add a `pyproject.toml` with a `[tool.ruff]` section (line-length and target
   version) and a `[tool.pytest.ini_options]` with `DJANGO_SETTINGS_MODULE`.
3. Add a `ruff check .` step to the backend CI job.
4. Make AGENTS/CONTRIBUTING consistent with whichever runner is canonical
   (`pytest` or `manage.py test`).

## gh command (run by PM)

```bash
gh issue create --title "[bug] pytest and ruff documented but not installed/configured" \
  --body-file qa/bugs/002-pytest-ruff-not-installed.md \
  --label "bug" --label "backend" --label "docs" --label "P1"
```
