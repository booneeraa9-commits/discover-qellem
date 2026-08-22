"""Seed the six zone-wide notable people (issue #25).

Photos stay null on purpose: they will be attached by the content
migration once the media-rights workflow for portraits (#40) is defined.
Birth and death years stay null until each year is verified against a
provenance Source record.
"""

from django.db import migrations

ZONE_NOTABLES = (
    {
        "slug": "dr-negasso-gidada",
        "name_om": "Dr. Nagaasoo Gidaadaa",
        "name_en": "Dr. Negasso Gidada",
        "bio_om": (
            "<p>Pirezidaantii duraanii Rippabliika Dimokraatawaa Federaalawaa "
            "Itoophiyaa; magaalaa Dambi Doollootti dhalatan.</p>"
        ),
        "bio_en": (
            "<p>Former President of the Federal Democratic Republic of "
            "Ethiopia, born in Dembi Dolo.</p>"
        ),
        "woredas": ("dambi-doolloo", "sayyoo"),
    },
    {
        "slug": "oliqa-dingil-booka",
        "name_om": "Oliiqaa Dingil Booka",
        "name_en": "Oliqa Dingil Booka",
        "bio_om": (
            "<p>Nama seenaa bebbeekamaa aanaa Yamaalogii Walal; galmi guddaan "
            "Dambi Doolloo maqaa isaatiin moggaafame.</p>"
        ),
        "bio_en": (
            "<p>Historical figure of the Yamaalogii Walal district; the grand "
            "hall in Dembi Dolo is named after him.</p>"
        ),
        "woredas": ("yamaalogii-walal",),
    },
    {
        "slug": "jote-tulu",
        "name_om": "Jootee Tulluu",
        "name_en": "Jote Tulu",
        "bio_om": (
            "<p>Bulchaa seenaa naannoo Sayyoo fi Qellem bal'aa keessatti "
            "yaadatamu.</p>"
        ),
        "bio_en": (
            "<p>Historical ruler remembered across Sayyoo and the wider "
            "Qellem area.</p>"
        ),
        "woredas": ("sayyoo",),
    },
    {
        "slug": "sadii-akkayyuu",
        "name_om": "Sadii Akkayyuu",
        "name_en": "Sadii Akkayyuu",
        "bio_om": "<p>Nama seenaa aanaa Sadii Canqaa keessatti yaadatamu.</p>",
        "bio_en": (
            "<p>Historical figure remembered in the Sadii Canqaa district.</p>"
        ),
        "woredas": ("sadii-canqaa",),
    },
    {
        "slug": "gidamii-guus-agaloo",
        "name_om": "Gidaamii Guus Agaloo",
        "name_en": "Gidaamii Guus Agaloo",
        "bio_om": "<p>Nama seenaa aanaa Gidaamii keessatti yaadatamu.</p>",
        "bio_en": "<p>Historical figure remembered in the Gidaamii district.</p>",
        "woredas": ("gidaamii",),
    },
    {
        "slug": "jaal-laggasaa-wagii",
        "name_om": "Jaal Laggasaa Wagii",
        "name_en": "Jaal Laggasaa Wagii",
        "bio_om": "<p>Nama bebbeekamaa aanaa Gaawoo Qeebbee.</p>",
        "bio_en": "<p>Prominent figure from the Gaawoo Qeebbee district.</p>",
        "woredas": ("gaawoo-qeebbee",),
    },
)


def seed_zone_notables(apps, schema_editor):
    Person = apps.get_model("archive", "Person")
    PersonPlacement = apps.get_model("archive", "PersonPlacement")
    Geography = apps.get_model("places", "Geography")

    for entry in ZONE_NOTABLES:
        person, _ = Person.objects.update_or_create(
            slug=entry["slug"],
            defaults={
                "name_om": entry["name_om"],
                "name_en": entry["name_en"],
                "bio_om": entry["bio_om"],
                "bio_en": entry["bio_en"],
                "is_zone_notable": True,
            },
        )
        for sort_order, geography_slug in enumerate(entry["woredas"]):
            geography = Geography.objects.get(slug=geography_slug)
            PersonPlacement.objects.update_or_create(
                person=person,
                geography=geography,
                defaults={"sort_order": sort_order},
            )


def remove_zone_notables(apps, schema_editor):
    Person = apps.get_model("archive", "Person")
    Person.objects.filter(
        slug__in=[entry["slug"] for entry in ZONE_NOTABLES]
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("archive", "0004_person_personplacement_person_woredas_and_more"),
        ("places", "0002_seed_canonical_geographies"),
    ]

    operations = [
        migrations.RunPython(seed_zone_notables, reverse_code=remove_zone_notables),
    ]
