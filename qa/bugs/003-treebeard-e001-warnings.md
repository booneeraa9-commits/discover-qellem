# Bug 003 — 11 × `treebeard.E001` warnings on every check/test/runserver

- **Title:** `[bug] System check emits 11 treebeard.E001 warnings (will break on django-treebeard 6)`
- **Labels:** `bug`, `backend`, `P2`
- **Assignee lane:** `backend`
- **Status:** OPEN (found 2026-08-21 on `main` @ `b95d592`)

## Reproduction

1. `cd apps/cms && python manage.py check` (or `migrate`, `test`, `runserver`).

## Expected

Clean system check, or at most informational notes.

## Actual

11 identical warnings:

```
<class 'django.db.models.manager.BasePageManagerFromPageQuerySet'>:
  (treebeard.E001) ... does not subclass treebeard.mp_tree.MP_NodeManager.
  This will cause an error in Treebeard 6.
<class 'django.db.models.manager.BaseCollectionManagerFromCollectionQuerySet'>:
  (treebeard.E001) ... does not subclass treebeard.mp_tree.MP_NodeManager.
```

## Impact

- Not an error today (pinned `django-treebeard 5.3.1`): `check --database
  default` exits 0 and CI stays green.
- It is a hard forward-compat trap: the moment treebeard 6 lands (via a future
  Wagtail/dependency bump), these managers will raise. Wagtail's
  `PageManager`/`CollectionManager` need to subclass `MP_NodeManager`.

## Suggested fix

Track upstream Wagtail compatibility; on any dependency upgrade that pulls
treebeard 6, verify/fix these managers first. Optionally add a CI grep that
fails if `treebeard.E001` shows up in `manage.py check` output so the trap is
caught at upgrade time, not in production.

## gh command (run by PM)

```bash
gh issue create --title "[bug] 11x treebeard.E001 warnings will break on django-treebeard 6" \
  --body-file qa/bugs/003-treebeard-e001-warnings.md \
  --label "bug" --label "backend" --label "P2"
```
