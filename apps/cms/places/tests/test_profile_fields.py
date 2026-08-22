"""Tests for the extended woreda profile fields (issue #24)."""

from django.core.exceptions import ValidationError
from django.test import TestCase

from archive.models import Person
from home.models import HomePage
from places.models import Geography, GeographyIndexPage, GeographyProfilePage
from places.testing import geography_profile_kwargs

PAGES_URL = "/api/v2/pages/"

VALID_QUICK_FACTS = [
    {
        "label_en": "Population",
        "label_om": "Baay'ina Ummataa",
        "value": 1254817,
    },
    {
        "label_en": "Area",
        "label_om": "Bal'ina Lafaa",
        "value": 9857,
        "unit": "km2",
        "note_en": "Zone-level figure.",
        "note_om": "Lakkoofsa sadarkaa godinaa.",
    },
]


class ProfileFieldTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.homepage = HomePage.objects.get()
        cls.dambi = Geography.objects.get(slug="dambi-doolloo")
        cls.sayyoo = Geography.objects.get(slug="sayyoo")
        cls.index = GeographyIndexPage(
            title="Aanaalee fi Bulchiinsa Magaalaa",
            slug="places",
            introduction="Iddoowwan Qellem Wallaggaa.",
        )
        cls.homepage.add_child(instance=cls.index)

    def make_profile(self, geography=None, **overrides):
        page = GeographyProfilePage(
            **geography_profile_kwargs(geography or self.dambi, **overrides)
        )
        self.index.add_child(instance=page)
        return page


class ProfileOmRequirementTests(ProfileFieldTestCase):
    def test_every_new_om_section_is_required(self):
        for field in (
            "intro_om",
            "history_om",
            "economy_om",
            "culture_om",
            "geography_om",
            "attractions_om",
        ):
            with self.subTest(field=field):
                with self.assertRaises(ValidationError) as error:
                    self.make_profile(**{field: ""})
                self.assertIn(field, error.exception.message_dict)

    def test_profile_with_all_om_sections_saves(self):
        page = self.make_profile(
            quick_facts=VALID_QUICK_FACTS,
            latitude=8.543,
            longitude=34.795,
        )
        saved = GeographyProfilePage.objects.get(pk=page.pk)
        self.assertEqual(saved.quick_facts, VALID_QUICK_FACTS)
        self.assertEqual(saved.latitude, 8.543)


class QuickFactValidationTests(ProfileFieldTestCase):
    def test_quick_facts_must_be_a_list(self):
        with self.assertRaises(ValidationError) as error:
            self.make_profile(quick_facts={"label_en": "Population"})
        self.assertIn("quick_facts", error.exception.message_dict)

    def test_quick_fact_requires_bilingual_labels_and_value(self):
        with self.assertRaises(ValidationError) as error:
            self.make_profile(
                quick_facts=[{"label_en": "Population", "value": 1}]
            )
        message = error.exception.message_dict["quick_facts"][0]
        self.assertIn("label_om", message)

    def test_quick_fact_rejects_unknown_keys(self):
        with self.assertRaises(ValidationError) as error:
            self.make_profile(
                quick_facts=[
                    {
                        "label_en": "Population",
                        "label_om": "Baay'ina Ummataa",
                        "value": 1,
                        "emoji": "x",
                    }
                ]
            )
        self.assertIn("quick_facts", error.exception.message_dict)

    def test_quick_fact_labels_cannot_be_blank(self):
        with self.assertRaises(ValidationError) as error:
            self.make_profile(
                quick_facts=[
                    {"label_en": " ", "label_om": "Baay'ina", "value": 1}
                ]
            )
        self.assertIn("quick_facts", error.exception.message_dict)


class CoordinateValidationTests(ProfileFieldTestCase):
    def test_coordinates_must_be_paired(self):
        with self.assertRaises(ValidationError) as error:
            self.make_profile(latitude=8.543)
        self.assertIn("longitude", error.exception.message_dict)

    def test_coordinates_must_be_in_range(self):
        with self.assertRaises(ValidationError) as error:
            self.make_profile(latitude=95.0, longitude=200.0)
        self.assertIn("latitude", error.exception.message_dict)
        self.assertIn("longitude", error.exception.message_dict)


class ProfileApiSerializationTests(ProfileFieldTestCase):
    def test_detail_exposes_all_new_public_fields(self):
        person = Person.objects.get(slug="dr-negasso-gidada")
        page = self.make_profile(
            intro_en="<p>Introduction in English.</p>",
            quick_facts=VALID_QUICK_FACTS,
            latitude=8.543,
            longitude=34.795,
        )
        page.notable_people.add(person)
        page.save_revision().publish()

        response = self.client.get(f"{PAGES_URL}{page.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()

        for field in (
            "intro_om",
            "intro_en",
            "history_om",
            "history_en",
            "economy_om",
            "economy_en",
            "culture_om",
            "culture_en",
            "geography_om",
            "geography_en",
            "attractions_om",
            "attractions_en",
            "quick_facts",
            "hero_image",
            "latitude",
            "longitude",
            "notable_people_list",
        ):
            self.assertIn(field, payload, msg=f"missing {field}")

        self.assertEqual(payload["quick_facts"], VALID_QUICK_FACTS)
        self.assertEqual(payload["latitude"], 8.543)
        self.assertEqual(payload["longitude"], 34.795)
        self.assertEqual(
            payload["notable_people_list"],
            [
                {
                    "slug": "dr-negasso-gidada",
                    "name_om": "Dr. Nagaasoo Gidaadaa",
                    "name_en": "Dr. Negasso Gidada",
                    "is_zone_notable": True,
                }
            ],
        )

    def test_listing_can_project_new_fields(self):
        self.make_profile(quick_facts=VALID_QUICK_FACTS)
        response = self.client.get(
            PAGES_URL,
            {
                "type": "places.GeographyProfilePage",
                "fields": "geography_slug,quick_facts,latitude,longitude",
            },
        )
        self.assertEqual(response.status_code, 200)
        items = response.json()["items"]
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]["quick_facts"], VALID_QUICK_FACTS)


class ProfileAdminPanelTests(TestCase):
    def test_edit_handler_binds_all_new_fields(self):
        edit_handler = GeographyProfilePage.get_edit_handler()
        form_class = edit_handler.get_form_class()
        form_fields = set(form_class.base_fields)
        for field in (
            "intro_om",
            "intro_en",
            "history_om",
            "economy_om",
            "culture_om",
            "geography_om",
            "attractions_om",
            "quick_facts",
            "hero_image",
            "latitude",
            "longitude",
            "notable_people",
        ):
            self.assertIn(field, form_fields, msg=f"missing {field}")
