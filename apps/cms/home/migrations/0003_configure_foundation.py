from django.db import migrations


def configure_foundation(apps, schema_editor):
    Locale = apps.get_model("wagtailcore", "Locale")
    Site = apps.get_model("wagtailcore", "Site")

    # English is available, but Afaan Oromoo remains the default locale.
    Locale.objects.get_or_create(language_code="en")

    default_site = Site.objects.filter(
        is_default_site=True,
    ).first()

    if default_site and default_site.site_name != "Discover Qellem":
        default_site.site_name = "Discover Qellem"
        default_site.save(update_fields=["site_name"])


class Migration(migrations.Migration):
    dependencies = [
        ("home", "0002_create_homepage"),
        ("wagtailcore", "0054_initial_locale"),
    ]

    operations = [
        migrations.RunPython(
            configure_foundation,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
