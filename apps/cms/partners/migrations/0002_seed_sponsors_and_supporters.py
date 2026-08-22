"""Seed the ten verified sponsors and six supporters (issue #28).

Names, roles, and bilingual strings mirror ZONE_SPONSORS and
ZONE_SUPPORTERS verbatim from ``apps/web/src/lib/zone-data.ts``
(PM-confirmed roster of 10 sponsor organizations and 6 supporters).

Every record is seeded with ``public_display_status=pending`` and
``is_active=False``: nothing becomes publicly visible until the PM (or a
reviewer) completes the display approval, and individual supporters also
await consent confirmation.
"""

from django.db import migrations

ROSTER_SOURCE_ID = "SRC-031"
ROSTER_SOURCE_TITLE = (
    "Discover Qellem PM-approved support page partner roster, 2026"
)
SEED_EDITOR_USERNAME = "content-seed-bot"

# (display_name, recognition_text_om, recognition_text_en)
# All 10 organizations verbatim (OM names) from ZONE_SPONSORS in
# apps/web/src/lib/zone-data.ts, in roster order.
SPONSORS = (
    (
        "Bulchiinsa Godina Qeellam Wallaggaa",
        "Bulchiinsa Godina Qeellam Wallaggaa galateeffanna.",
        "With thanks to the Kellem Wollega Zone Administration.",
    ),
    (
        "Waajjiira Oduu Godina Qeellam",
        "Waajjiira Oduu Godina Qeellam galateeffanna.",
        "With thanks to the Kellem Wollega Communication Office.",
    ),
    (
        "Yuunivarsiitii Dambi Doolloo",
        "Yuunivarsiitii Dambi Doolloo galateeffanna.",
        "With thanks to Dembi Dolo University.",
    ),
    (
        "Bulchiinsa Magaalaa Dambi Doolloo",
        "Bulchiinsa Magaalaa Dambi Doolloo galateeffanna.",
        "With thanks to the Dembi Dolo City Administration.",
    ),
    (
        "Waajjira Qonnaa Godinaa",
        "Waajjira Qonnaa Godinaa galateeffanna.",
        "With thanks to the Zone Agriculture Office.",
    ),
    (
        "Waajjira Tuurizimii Godinaa",
        "Waajjira Tuurizimii Godinaa galateeffanna.",
        "With thanks to the Zone Culture & Tourism Office.",
    ),
    (
        "Waajjira Saayinsii fi Teek.",
        "Waajjira Saayinsii fi Teek. galateeffanna.",
        "With thanks to the Oromia Science & Technology Auth.",
    ),
    (
        "Waldaa Bunaa Qeellam",
        "Waldaa Bunaa Qeellam galateeffanna.",
        "With thanks to the Kellem Coffee Cooperatives Union.",
    ),
    (
        "Abbaa Taayitaa Daandii Oromiyaa",
        "Abbaa Taayitaa Daandii Oromiyaa galateeffanna.",
        "With thanks to the Oromia Roads Authority.",
    ),
    (
        "Dhaabbata Qabeenya Biyyoolessaa",
        "Dhaabbata Qabeenya Biyyoolessaa galateeffanna.",
        "With thanks to the Cultural Heritage Authority.",
    ),
)

# (display_name, partner_kind, role_om, role_en,
#  description_om, description_en, consent_status, consent_notes)
SUPPORTERS = (
    (
        "Obbo Gammachuu Gurmeessaa",
        "person",
        "Bulchaa Godina Qeellam Wallaggaa",
        "Chief Administrator, Kellem Wollega Zone",
        "Deeggarsa hojii pirojektii kanaa.",
        "Supporter of this project's work.",
        "pending",
        "Public-figure recognition mirrors the PM-approved support page; "
        "individual consent confirmation pending (flagged to the PM).",
    ),
    (
        "Obbo Girmaa Dangalaa",
        "person",
        "Kantiibaa Magaalaa Dambi Doolloo",
        "Mayor, Dembi Dolo City",
        "Deeggarsa hojii pirojektii kanaa.",
        "Supporter of this project's work.",
        "pending",
        "Public-figure recognition mirrors the PM-approved support page; "
        "individual consent confirmation pending (flagged to the PM).",
    ),
    (
        "Dr. Utukaanaa Odaa",
        "person",
        "Itt. Hoog. Waajjira Pirezidaantii Oromiyaa",
        "Deputy Head, Office of the President, Oromia",
        "Deeggarsa hojii pirojektii kanaa.",
        "Supporter of this project's work.",
        "pending",
        "Public-figure recognition mirrors the PM-approved support page; "
        "individual consent confirmation pending (flagged to the PM).",
    ),
    (
        "Waajjira Tuurizimii Qeellam",
        "organization",
        "Deeggarsa qorannoo fi suuraa",
        "Research & photography partner",
        "Deeggarsa qorannoo fi suuraa pirojektii kanaaf.",
        "Research and photography partner for this project.",
        "not_applicable",
        "",
    ),
    (
        "Hawaasa Qeellam Wallaggaa",
        "organization",
        "Seenaa fi qabeenya — hundee fuula kanaa",
        "The story and soul of this site",
        "Seenaa fi qabeenya — hundee fuula kanaa.",
        "The story and soul of this site.",
        "not_applicable",
        "",
    ),
    (
        "Qonnaan bultootaa fi Waldaalee",
        "organization",
        "817 waldaalee, miseensota 156,500",
        "817 co-ops, 156,500 members",
        "Waldaalee 817 miseensota 156,500 waliin.",
        "817 cooperatives with 156,500 members.",
        "not_applicable",
        "",
    ),
)


def _get_seed_editor(apps):
    User = apps.get_model("auth", "User")
    seed_editor, _ = User.objects.get_or_create(
        username=SEED_EDITOR_USERNAME,
        defaults={
            "is_active": False,
            "is_staff": False,
            "password": "!",  # Unusable password marker.
        },
    )
    return seed_editor


def _get_roster_source(apps):
    SourceRecord = apps.get_model("provenance", "SourceRecord")
    Geography = apps.get_model("places", "Geography")
    zone = Geography.objects.filter(slug="qellem-wallaggaa").first()

    source, _ = SourceRecord.objects.get_or_create(
        source_id=ROSTER_SOURCE_ID,
        defaults={
            "title": ROSTER_SOURCE_TITLE,
            "issuing_organization": "Discover Qellem project (PM-approved)",
            "source_date_text": "2026",
            "source_calendar": "gc",
            "document_type": "other",
            "language": "om_en",
            "subject": "mixed",
            "geography": zone,
            "private_description": (
                "Sponsor and supporter roster mirrored verbatim from "
                "ZONE_SPONSORS and ZONE_SUPPORTERS in "
                "apps/web/src/lib/zone-data.ts (PM-confirmed: 10 "
                "sponsor organizations, 6 supporters)."
            ),
        },
    )
    return source


def seed_partners(apps, schema_editor):
    ContentType = apps.get_model("contenttypes", "ContentType")
    Sponsor = apps.get_model("partners", "Sponsor")
    Collaborator = apps.get_model("partners", "Collaborator")
    SourceCitation = apps.get_model("provenance", "SourceCitation")

    seed_editor = _get_seed_editor(apps)
    roster_source = _get_roster_source(apps)

    sponsor_content_type, _ = ContentType.objects.get_or_create(
        app_label="partners",
        model="sponsor",
    )
    collaborator_content_type, _ = ContentType.objects.get_or_create(
        app_label="partners",
        model="collaborator",
    )

    for order, (name, text_om, text_en) in enumerate(SPONSORS, start=1):
        sponsor, created = Sponsor.objects.get_or_create(
            display_name=name,
            defaults={
                "partner_kind": "organization",
                "display_mode": "name_only",
                "recognition_text_om": text_om,
                "recognition_text_en": text_en,
                "display_order": order,
                "is_active": False,
                "public_display_status": "pending",
            },
        )
        if created:
            SourceCitation.objects.create(
                source=roster_source,
                content_type=sponsor_content_type,
                object_id=sponsor.pk,
                claim_or_section=(
                    f"Sponsor '{name}' per the PM-approved support page "
                    "roster."
                ),
                citing_editor=seed_editor,
            )

    for order, (
        name,
        partner_kind,
        role_om,
        role_en,
        description_om,
        description_en,
        consent_status,
        consent_notes,
    ) in enumerate(SUPPORTERS, start=1):
        collaborator, created = Collaborator.objects.get_or_create(
            display_name=name,
            defaults={
                "partner_kind": partner_kind,
                "display_mode": "name_only",
                "role_om": role_om,
                "role_en": role_en,
                "description_om": description_om,
                "description_en": description_en,
                "consent_status": consent_status,
                "consent_notes": consent_notes,
                "display_order": order,
                "is_active": False,
                "public_display_status": "pending",
            },
        )
        if created:
            SourceCitation.objects.create(
                source=roster_source,
                content_type=collaborator_content_type,
                object_id=collaborator.pk,
                claim_or_section=(
                    f"Supporter '{name}' ({role_en}) per the PM-approved "
                    "support page roster."
                ),
                citing_editor=seed_editor,
            )


def remove_partners(apps, schema_editor):
    ContentType = apps.get_model("contenttypes", "ContentType")
    Sponsor = apps.get_model("partners", "Sponsor")
    Collaborator = apps.get_model("partners", "Collaborator")
    SourceCitation = apps.get_model("provenance", "SourceCitation")
    SourceRecord = apps.get_model("provenance", "SourceRecord")

    sponsor_content_type = ContentType.objects.filter(
        app_label="partners", model="sponsor"
    ).first()
    for name, *_rest in SPONSORS:
        sponsor = Sponsor.objects.filter(display_name=name).first()
        if sponsor is None:
            continue
        if sponsor_content_type is not None:
            SourceCitation.objects.filter(
                content_type=sponsor_content_type,
                object_id=sponsor.pk,
            ).delete()
        sponsor.delete()

    collaborator_content_type = ContentType.objects.filter(
        app_label="partners", model="collaborator"
    ).first()
    for name, *_rest in SUPPORTERS:
        collaborator = Collaborator.objects.filter(display_name=name).first()
        if collaborator is None:
            continue
        if collaborator_content_type is not None:
            SourceCitation.objects.filter(
                content_type=collaborator_content_type,
                object_id=collaborator.pk,
            ).delete()
        collaborator.delete()

    roster_source = SourceRecord.objects.filter(
        source_id=ROSTER_SOURCE_ID
    ).first()
    if roster_source is not None and not roster_source.citations.exists():
        roster_source.delete()


class Migration(migrations.Migration):
    dependencies = [
        ("partners", "0001_initial"),
        ("places", "0002_seed_canonical_geographies"),
        ("provenance", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(
            seed_partners,
            reverse_code=remove_partners,
        ),
    ]
