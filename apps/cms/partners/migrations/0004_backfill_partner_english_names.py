"""Backfill English display names for the seeded partner roster (#116).

The 16 English names below are the PM-approved canonical English list
(Sprint 5 brief), matching ZONE_SPONSORS / ZONE_SUPPORTERS in
apps/web/src/lib/zone-data.ts. Rows are matched by their canonical
Afaan Oromoo ``display_name``, which stays the required authoritative
name. Amharic display names remain blank until reviewed translations
exist (no invented content).
"""

from django.db import migrations

# OM display_name -> PM-approved English display name (verbatim).
SPONSOR_EN_NAMES = {
    "Bulchiinsa Godina Qeellam Wallaggaa": "Kellem Wollega Zone Administration",
    "Waajjiira Oduu Godina Qeellam": "Kellem Wollega Communication Office",
    "Yuunivarsiitii Dambi Doolloo": "Dembi Dolo University",
    "Bulchiinsa Magaalaa Dambi Doolloo": "Dembi Dolo City Administration",
    "Waajjira Qonnaa Godinaa": "Zone Agriculture Office",
    "Waajjira Tuurizimii Godinaa": "Zone Culture & Tourism Office",
    # PM list gives the full name; zone-data.ts abbreviates it for the
    # marquee ("Oromia Science & Technology Auth.").
    "Waajjira Saayinsii fi Teek.": "Oromia Science & Technology Authority",
    "Waldaa Bunaa Qeellam": "Kellem Coffee Cooperatives Union",
    "Abbaa Taayitaa Daandii Oromiyaa": "Oromia Roads Authority",
    "Dhaabbata Qabeenya Biyyoolessaa": "Cultural Heritage Authority",
}

SUPPORTER_EN_NAMES = {
    "Obbo Gammachuu Gurmeessaa": "Ato Gammachuu Gurmesa",
    "Obbo Girmaa Dangalaa": "Ato Girma Dangala",
    "Dr. Utukaanaa Odaa": "Dr. Utukana Odaa",
    "Waajjira Tuurizimii Qeellam": "Kellem Culture & Tourism Office",
    "Hawaasa Qeellam Wallaggaa": "The People of Kellem Wollega",
    "Qonnaan bultootaa fi Waldaalee": "Farmers & Cooperatives",
}


def _apply(model, mapping):
    for om_name, en_name in mapping.items():
        # queryset.update() bypasses full_clean(), which is what we want
        # in a data migration operating on historical models.
        model.objects.filter(display_name=om_name).update(
            display_name_en=en_name
        )


def _revert(model, mapping):
    model.objects.filter(display_name__in=mapping).update(display_name_en="")


def backfill_english_names(apps, schema_editor):
    _apply(apps.get_model("partners", "Sponsor"), SPONSOR_EN_NAMES)
    _apply(apps.get_model("partners", "Collaborator"), SUPPORTER_EN_NAMES)


def remove_english_names(apps, schema_editor):
    _revert(apps.get_model("partners", "Sponsor"), SPONSOR_EN_NAMES)
    _revert(apps.get_model("partners", "Collaborator"), SUPPORTER_EN_NAMES)


class Migration(migrations.Migration):
    dependencies = [
        ("partners", "0003_collaborator_display_name_am_and_more"),
    ]

    operations = [
        migrations.RunPython(backfill_english_names, remove_english_names),
    ]
