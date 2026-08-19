from django.core.exceptions import ValidationError
from django.test import TestCase

from places.models import (
    AliasLanguageContext,
    Geography,
    GeographyAlias,
    GeographyLevel,
    GeographyStatus,
)

EXPECTED_GEOGRAPHIES = [
    ("Qellem Wallaggaa", "qellem-wallaggaa", GeographyLevel.ZONE),
    ("Dambi Doolloo", "dambi-doolloo", GeographyLevel.TOWN),
    ("Sayyoo", "sayyoo", GeographyLevel.WOREDA),
    ("Haawwaa Galaan", "haawwaa-galaan", GeographyLevel.WOREDA),
    ("Daallee Sadii", "daallee-sadii", GeographyLevel.WOREDA),
    ("Daallee Waabaraa", "daallee-waabaraa", GeographyLevel.WOREDA),
    ("Gaawoo Qeebbee", "gaawoo-qeebbee", GeographyLevel.WOREDA),
    ("Yamaalogii Walal", "yamaalogii-walal", GeographyLevel.WOREDA),
    ("Anfilloo", "anfilloo", GeographyLevel.WOREDA),
    ("Gidaamii", "gidaamii", GeographyLevel.WOREDA),
    ("Laaloo Qilee", "laaloo-qilee", GeographyLevel.WOREDA),
    ("Sadii Canqaa", "sadii-canqaa", GeographyLevel.WOREDA),
    ("Jimmaa Horroo", "jimmaa-horroo", GeographyLevel.WOREDA),
]


class CanonicalGeographySeedTests(TestCase):
    def test_seed_contains_exact_approved_names_slugs_and_levels(self):
        actual = list(Geography.objects.values_list("canonical_name", "slug", "level"))

        self.assertEqual(actual, EXPECTED_GEOGRAPHIES)

    def test_seed_has_one_zone_eleven_woredas_and_one_town(self):
        self.assertEqual(
            Geography.objects.filter(level=GeographyLevel.ZONE).count(),
            1,
        )
        self.assertEqual(
            Geography.objects.filter(level=GeographyLevel.WOREDA).count(),
            11,
        )
        self.assertEqual(
            Geography.objects.filter(level=GeographyLevel.TOWN).count(),
            1,
        )

    def test_seed_uses_zone_as_only_root_and_parent_of_every_child(self):
        zone = Geography.objects.get(level=GeographyLevel.ZONE)

        self.assertIsNone(zone.parent)
        self.assertEqual(zone.children.count(), 12)
        self.assertFalse(
            Geography.objects.exclude(level=GeographyLevel.ZONE)
            .exclude(parent=zone)
            .exists()
        )

    def test_seed_is_active_and_has_deterministic_display_order(self):
        self.assertFalse(
            Geography.objects.exclude(status=GeographyStatus.ACTIVE).exists()
        )
        self.assertEqual(
            list(Geography.objects.values_list("display_order", flat=True)),
            list(range(1, 14)),
        )


class GeographyValidationTests(TestCase):
    def setUp(self):
        self.zone = Geography.objects.get(level=GeographyLevel.ZONE)
        self.woreda = Geography.objects.get(slug="sayyoo")

    def test_woreda_requires_parent(self):
        geography = Geography(
            canonical_name="Test Woreda",
            slug="test-woreda",
            level=GeographyLevel.WOREDA,
        )

        with self.assertRaises(ValidationError) as error:
            geography.full_clean()

        self.assertIn("parent", error.exception.message_dict)

    def test_child_requires_zone_as_direct_parent(self):
        geography = Geography(
            canonical_name="Test Woreda",
            slug="test-woreda",
            level=GeographyLevel.WOREDA,
            parent=self.woreda,
        )

        with self.assertRaises(ValidationError) as error:
            geography.full_clean()

        self.assertIn("parent", error.exception.message_dict)

    def test_zone_cannot_have_parent(self):
        geography = Geography(
            canonical_name="Test Zone",
            slug="test-zone",
            level=GeographyLevel.ZONE,
            parent=self.zone,
        )

        with self.assertRaises(ValidationError) as error:
            geography.full_clean()

        self.assertIn("parent", error.exception.message_dict)

    def test_canonical_name_cannot_have_outer_whitespace(self):
        geography = Geography(
            canonical_name=" Test Woreda",
            slug="test-woreda",
            level=GeographyLevel.WOREDA,
            parent=self.zone,
        )

        with self.assertRaises(ValidationError) as error:
            geography.full_clean()

        self.assertIn("canonical_name", error.exception.message_dict)

    def test_save_enforces_hierarchy_validation(self):
        geography = Geography(
            canonical_name="Test Woreda",
            slug="test-woreda",
            level=GeographyLevel.WOREDA,
            parent=self.woreda,
        )

        with self.assertRaises(ValidationError):
            geography.save()

        self.assertFalse(Geography.objects.filter(slug="test-woreda").exists())


class GeographyAliasValidationTests(TestCase):
    def setUp(self):
        self.geography = Geography.objects.get(slug="dambi-doolloo")

    def test_alias_must_differ_from_canonical_name(self):
        alias = GeographyAlias(
            geography=self.geography,
            name="dambi doolloo",
            language_context=AliasLanguageContext.UNSPECIFIED,
        )

        with self.assertRaises(ValidationError) as error:
            alias.full_clean()

        self.assertIn("name", error.exception.message_dict)

    def test_redirect_requires_slug(self):
        alias = GeographyAlias(
            geography=self.geography,
            name="Dembi Dolo",
            redirect_enabled=True,
        )

        with self.assertRaises(ValidationError) as error:
            alias.full_clean()

        self.assertIn("slug", error.exception.message_dict)

    def test_alias_cannot_reuse_canonical_slug(self):
        alias = GeographyAlias(
            geography=self.geography,
            name="Dembi Dolo",
            slug="sayyoo",
        )

        with self.assertRaises(ValidationError) as error:
            alias.full_clean()

        self.assertIn("slug", error.exception.message_dict)

    def test_case_insensitive_duplicate_alias_is_rejected(self):
        GeographyAlias.objects.create(
            geography=self.geography,
            name="Dembi Dolo",
            language_context=AliasLanguageContext.ENGLISH,
        )
        alias = GeographyAlias(
            geography=self.geography,
            name="dembi dolo",
            language_context=AliasLanguageContext.ENGLISH,
        )

        with self.assertRaises(ValidationError) as error:
            alias.full_clean()

        self.assertIn("name", error.exception.message_dict)

    def test_save_enforces_alias_validation(self):
        alias = GeographyAlias(
            geography=self.geography,
            name="Dambi Doolloo",
        )

        with self.assertRaises(ValidationError):
            alias.save()

        self.assertFalse(GeographyAlias.objects.exists())
