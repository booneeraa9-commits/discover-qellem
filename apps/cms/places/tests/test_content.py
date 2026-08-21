from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import NON_FIELD_ERRORS, ValidationError
from django.test import TestCase
from wagtail.models import Locale

from home.models import HomePage
from places.models import (
    DatedStatistic,
    Geography,
    GeographyIndexPage,
    GeographyProfilePage,
)
from provenance.choices import (
    SensitivityStatus,
    SourceDocumentType,
    SourceSubject,
    VerificationStatus,
)
from provenance.models import SourceRecord


class GeographyPageTests(TestCase):
    def setUp(self):
        self.homepage = HomePage.objects.get()
        self.sayyoo = Geography.objects.get(slug="sayyoo")

    def make_index(self, slug="places"):
        page = GeographyIndexPage(
            title="Aanaalee fi Bulchiinsa Magaalaa",
            slug=slug,
            introduction="Iddoowwan Qellem Wallaggaa.",
        )
        self.homepage.add_child(instance=page)
        return page

    def make_profile(self, parent=None, geography=None):
        geography = geography or self.sayyoo
        page = GeographyProfilePage(
            title=geography.canonical_name,
            slug=geography.slug,
            geography=geography,
            introduction=f"Seensa {geography.canonical_name}.",
            overview=f"Ibsa {geography.canonical_name}.",
        )
        (parent or self.make_index()).add_child(instance=page)
        return page

    def test_index_requires_stable_route(self):
        with self.assertRaises(ValidationError) as error:
            self.make_index(slug="locations")

        self.assertIn("slug", error.exception.message_dict)

    def test_profile_requires_canonical_name_and_slug(self):
        profile = self.make_profile()
        profile.title = "Sayyo"
        profile.slug = "sayyo"

        with self.assertRaises(ValidationError) as error:
            profile.full_clean()

        self.assertIn("title", error.exception.message_dict)
        self.assertIn("slug", error.exception.message_dict)

    def test_zone_cannot_have_a_separate_geography_profile(self):
        zone = Geography.objects.get(slug="qellem-wallaggaa")

        with self.assertRaises(ValidationError) as error:
            self.make_profile(geography=zone)

        self.assertIn("geography", error.exception.message_dict)

    def test_profile_placement_is_enforced_outside_the_editor_ui(self):
        profile = GeographyProfilePage(
            title=self.sayyoo.canonical_name,
            slug=self.sayyoo.slug,
            geography=self.sayyoo,
            introduction="Seensa Sayyoo.",
            overview="Ibsa Sayyoo.",
        )
        self.homepage.add_child(instance=profile)

        with self.assertRaises(ValidationError) as error:
            profile.full_clean()

        self.assertIn(NON_FIELD_ERRORS, error.exception.message_dict)

    def test_linked_translations_must_keep_the_same_geography_identity(self):
        profile = self.make_profile()
        english_locale = Locale.objects.get(language_code="en")
        dambi = Geography.objects.get(slug="dambi-doolloo")
        english = GeographyProfilePage(
            title=dambi.canonical_name,
            slug=dambi.slug,
            locale=english_locale,
            translation_key=profile.translation_key,
            geography=dambi,
            introduction="Dambi Doolloo introduction.",
            overview="Dambi Doolloo overview.",
        )

        with self.assertRaises(ValidationError) as error:
            english.full_clean()

        self.assertIn("geography", error.exception.message_dict)
        self.assertIn("slug", error.exception.message_dict)

    def test_one_geography_profile_per_locale_is_enforced(self):
        first = self.make_profile()
        second = GeographyProfilePage(
            title=self.sayyoo.canonical_name,
            slug=self.sayyoo.slug,
            geography=self.sayyoo,
            introduction="Seensa biraa.",
            overview="Ibsa biraa.",
        )
        with self.assertRaises(ValidationError) as error:
            first.get_parent().add_child(instance=second)

        self.assertIn(NON_FIELD_ERRORS, error.exception.message_dict)


class DatedStatisticTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.zone = Geography.objects.get(slug="qellem-wallaggaa")
        cls.reviewer = get_user_model().objects.create_user(username="stat-reviewer")
        cls.pending_source = SourceRecord.objects.create(
            source_id="SRC-901",
            title="Zone population table",
            issuing_organization="Qellem Wallaggaa Zone Administration",
            document_type=SourceDocumentType.DATASET,
            subject=SourceSubject.DEMOGRAPHICS,
            private_description="Private source catalogue entry.",
        )
        cls.verified_source = SourceRecord.objects.create(
            source_id="SRC-902",
            title="Verified zone population table",
            issuing_organization="Qellem Wallaggaa Zone Administration",
            document_type=SourceDocumentType.DATASET,
            subject=SourceSubject.DEMOGRAPHICS,
            private_description="Private source catalogue entry.",
            sensitivity_status=SensitivityStatus.CLEARED,
            verification_status=VerificationStatus.VERIFIED,
            reviewed_by=cls.reviewer,
            verified_on=date(2026, 8, 19),
        )

    def statistic_data(self, **overrides):
        data = {
            "geography": self.zone,
            "indicator_om": "Baay'ina uummataa",
            "value": Decimal("123456.0000"),
            "unit_om": "nama",
            "reference_year_ec": "2016 E.C.",
            "reference_year_gc": "2023/24 G.C.",
            "source": self.pending_source,
        }
        data.update(overrides)
        return data

    def test_verified_statistic_requires_verified_cleared_source(self):
        statistic = DatedStatistic(
            **self.statistic_data(
                verification_status=VerificationStatus.VERIFIED,
                reviewed_by=self.reviewer,
                verified_on=date(2026, 8, 19),
            )
        )

        with self.assertRaises(ValidationError) as error:
            statistic.full_clean()

        self.assertIn("source", error.exception.message_dict)

    def test_verified_statistic_preserves_source_and_review_history(self):
        statistic = DatedStatistic.objects.create(
            **self.statistic_data(
                source=self.verified_source,
                verification_status=VerificationStatus.VERIFIED,
                reviewed_by=self.reviewer,
                verified_on=date(2026, 8, 19),
                verification_notes="Checked against the cited table.",
            )
        )

        self.assertEqual(statistic.source, self.verified_source)
        self.assertEqual(statistic.reviewed_by, self.reviewer)
        self.assertEqual(statistic.reference_year_ec, "2016 E.C.")

    def test_new_year_creates_a_second_snapshot_instead_of_replacing_old_data(self):
        first = DatedStatistic.objects.create(**self.statistic_data())
        second = DatedStatistic.objects.create(
            **self.statistic_data(
                value=Decimal("130000.0000"),
                reference_year_ec="2017 E.C.",
                reference_year_gc="2024/25 G.C.",
            )
        )

        self.assertNotEqual(first.pk, second.pk)
        self.assertEqual(DatedStatistic.objects.count(), 2)

    def test_duplicate_historical_snapshot_is_rejected(self):
        DatedStatistic.objects.create(**self.statistic_data())
        duplicate = DatedStatistic(**self.statistic_data())

        with self.assertRaises(ValidationError) as error:
            duplicate.full_clean()

        self.assertIn(NON_FIELD_ERRORS, error.exception.message_dict)
