from django.db import migrations

CANONICAL_GEOGRAPHIES = (
    (1, "Qellem Wallaggaa", "qellem-wallaggaa", "zone"),
    (2, "Dambi Doolloo", "dambi-doolloo", "town"),
    (3, "Sayyoo", "sayyoo", "woreda"),
    (4, "Haawwaa Galaan", "haawwaa-galaan", "woreda"),
    (5, "Daallee Sadii", "daallee-sadii", "woreda"),
    (6, "Daallee Waabaraa", "daallee-waabaraa", "woreda"),
    (7, "Gaawoo Qeebbee", "gaawoo-qeebbee", "woreda"),
    (8, "Yamaalogii Walal", "yamaalogii-walal", "woreda"),
    (9, "Anfilloo", "anfilloo", "woreda"),
    (10, "Gidaamii", "gidaamii", "woreda"),
    (11, "Laaloo Qilee", "laaloo-qilee", "woreda"),
    (12, "Sadii Canqaa", "sadii-canqaa", "woreda"),
    (13, "Jimmaa Horroo", "jimmaa-horroo", "woreda"),
)


def seed_canonical_geographies(apps, schema_editor):
    Geography = apps.get_model("places", "Geography")

    zone_order, zone_name, zone_slug, zone_level = CANONICAL_GEOGRAPHIES[0]
    zone, _ = Geography.objects.update_or_create(
        slug=zone_slug,
        defaults={
            "canonical_name": zone_name,
            "level": zone_level,
            "parent": None,
            "status": "active",
            "display_order": zone_order,
        },
    )

    for display_order, canonical_name, slug, level in CANONICAL_GEOGRAPHIES[1:]:
        Geography.objects.update_or_create(
            slug=slug,
            defaults={
                "canonical_name": canonical_name,
                "level": level,
                "parent": zone,
                "status": "active",
                "display_order": display_order,
            },
        )


def remove_canonical_geographies(apps, schema_editor):
    Geography = apps.get_model("places", "Geography")
    slugs = [item[2] for item in CANONICAL_GEOGRAPHIES]

    Geography.objects.filter(slug__in=slugs[1:]).delete()
    Geography.objects.filter(slug=slugs[0]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("places", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(
            seed_canonical_geographies,
            reverse_code=remove_canonical_geographies,
        ),
    ]
