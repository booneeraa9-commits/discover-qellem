# Provenance and media rights domain

This app stores private catalogue metadata for owner-controlled sources, private source-to-content citations, and the evidence required before a Wagtail image may be selected for public output.

## Privacy and storage rules

- Original zone-office writings remain outside the CMS, media storage, and Git repository.
- `SourceRecord` deliberately has no upload, file, Wagtail Document, or image field.
- Wagtail Documents is not a substitute source archive; source-model permissions do not grant document-upload permissions.
- Source descriptions, permission notes, sensitivity notes, citation notes, and review notes are private CMS data.
- Source and rights records are non-routable Wagtail snippets protected by Django/Wagtail model permissions.

## Public-image rule

`image_is_approved_for_public_use()` defaults to denial. It returns true only when an image has a complete `MediaRights` record in the approved state. Authoritative Afaan Oromoo caption and alternative text are required for approval; English may remain pending.

Future public serializers and page models must call this centralized guard rather than reading Wagtail images directly. Phase 4’s later authorization and audit pull requests will add scoped staff policy and append-only decision events.
