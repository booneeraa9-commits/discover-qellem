from django.db import migrations


def configure_zone_homepage(apps, schema_editor):
    Geography = apps.get_model("places", "Geography")
    HomePage = apps.get_model("home", "HomePage")

    zone = Geography.objects.get(slug="qellem-wallaggaa")
    HomePage.objects.update(
        geography=zone,
        title=zone.canonical_name,
        draft_title=zone.canonical_name,
    )


def restore_foundation_title(apps, schema_editor):
    HomePage = apps.get_model("home", "HomePage")
    HomePage.objects.update(title="Home", draft_title="Home")


class Migration(migrations.Migration):
    dependencies = [
        ("home", "0004_homepage_contribute_summary_homepage_culture_summary_and_more"),
    ]

    operations = [
        migrations.RunPython(
            configure_zone_homepage,
            reverse_code=restore_foundation_title,
        ),
    ]
