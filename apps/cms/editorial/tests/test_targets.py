from django.test import TestCase
from home.models import HomePage
from partners.models import Sponsor
from places.models import Geography, GeographyAlias, GeographyProfilePage
from provenance.choices import SourceLanguage
from provenance.models import MediaRights, SourceRecord
from wagtail.models import Locale

from editorial.choices import EditorialLanguage, EditorialSubject
from editorial.targets import (
    media_target,
    model_create_target,
    model_target,
    page_create_target,
    page_target,
    possible_subjects_for_model,
)

from .base import EditorialTestMixin


class EditorialTargetTests(EditorialTestMixin, TestCase):
    def test_oromo_homepage_resolves_to_combined_zone_scope(self):
        target = page_target(HomePage.objects.get())

        self.assertEqual(target.subject, EditorialSubject.HOME_ZONE)
        self.assertEqual(target.geography_id, self.zone.pk)
        self.assertEqual(target.language, EditorialLanguage.OROMO)

    def test_english_page_target_uses_exact_english_language(self):
        homepage = HomePage.objects.get()
        homepage.locale = Locale.objects.get(language_code="en")

        target = page_target(homepage)

        self.assertEqual(target.language, EditorialLanguage.ENGLISH)

    def test_profile_create_post_resolves_selected_geography(self):
        parent = HomePage.objects.get()

        target = page_create_target(
            GeographyProfilePage,
            parent,
            data={"geography": str(self.dambi.pk)},
        )

        self.assertEqual(target.subject, EditorialSubject.GEOGRAPHY)
        self.assertEqual(target.geography_id, self.dambi.pk)
        self.assertEqual(target.language, EditorialLanguage.OROMO)

    def test_unbound_profile_create_has_no_fabricated_geography(self):
        target = page_create_target(GeographyProfilePage, HomePage.objects.get())

        self.assertIsNone(target.geography_id)

    def test_geography_and_alias_are_locale_neutral_targets(self):
        alias = GeographyAlias(geography=self.dambi)

        geography_target = model_target(self.dambi)
        alias_target = model_target(alias)

        for target in (geography_target, alias_target):
            self.assertEqual(target.subject, EditorialSubject.GEOGRAPHY)
            self.assertEqual(target.geography_id, self.dambi.pk)
            self.assertEqual(target.language, EditorialLanguage.BOTH)

    def test_source_target_uses_source_geography_and_language(self):
        source = SourceRecord(
            geography=self.sayyo,
            language=SourceLanguage.ENGLISH,
        )

        target = model_target(source)

        self.assertEqual(target.subject, EditorialSubject.SOURCES)
        self.assertEqual(target.geography_id, self.sayyo.pk)
        self.assertEqual(target.language, EditorialLanguage.ENGLISH)

    def test_partner_and_media_targets_are_zone_wide_and_neutral(self):
        partner_target = model_target(Sponsor())
        rights_target = model_create_target(MediaRights)

        for target, subject in (
            (partner_target, EditorialSubject.PARTNERS),
            (rights_target, EditorialSubject.MEDIA),
            (media_target(), EditorialSubject.MEDIA),
        ):
            self.assertEqual(target.subject, subject)
            self.assertEqual(target.geography_id, self.zone.pk)
            self.assertEqual(target.language, EditorialLanguage.BOTH)

    def test_unknown_model_is_not_silently_scoped(self):
        self.assertIsNone(model_create_target(Locale))
        self.assertEqual(possible_subjects_for_model(Locale), frozenset())

    def test_possible_subjects_are_deterministic_without_instances(self):
        self.assertEqual(
            possible_subjects_for_model(Geography),
            {EditorialSubject.GEOGRAPHY},
        )
        self.assertEqual(
            possible_subjects_for_model(SourceRecord),
            {EditorialSubject.SOURCES},
        )
        self.assertEqual(
            possible_subjects_for_model(MediaRights),
            {EditorialSubject.MEDIA},
        )
