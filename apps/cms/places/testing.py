"""Shared test-data helpers for building valid geography profile pages."""


def geography_profile_kwargs(geography, **overrides):
    """Return constructor kwargs for a valid Afaan Oromoo profile page."""

    name = geography.canonical_name
    fields = {
        "title": name,
        "slug": geography.slug,
        "geography": geography,
        "introduction": f"Seensa {name}.",
        "overview": f"Ibsa {name}.",
        "intro_om": f"<p>Seensa {name}.</p>",
        "history_om": f"<p>Seenaa {name}.</p>",
        "economy_om": f"<p>Diinagdee {name}.</p>",
        "culture_om": f"<p>Aadaa {name}.</p>",
        "geography_om": f"<p>Teessuma lafaa {name}.</p>",
        "attractions_om": f"<p>Hawwata {name}.</p>",
    }
    fields.update(overrides)
    return fields


def get_places_index():
    """Return the Afaan Oromoo places index seeded by places/0005."""

    from places.models import GeographyIndexPage

    return GeographyIndexPage.objects.get(
        slug="places",
        locale__language_code="om",
    )


def create_test_woreda(slug="aanaa-yaalii", name="Aanaa Yaalii"):
    """Create a fresh woreda geography that has no seeded profile page."""

    from places.models import Geography

    zone = Geography.objects.get(slug="qellem-wallaggaa")
    return Geography.objects.create(
        canonical_name=name,
        slug=slug,
        level="woreda",
        parent=zone,
    )
