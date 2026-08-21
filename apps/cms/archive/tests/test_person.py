"""Tests for the Person snippet and /api/v2/people/ endpoint (issue #25)."""

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from archive.models import Person, PersonPlacement
from places.models import Geography

PEOPLE_URL = "/api/v2/people/"

EXPECTED_PLACEMENTS = {
    "dr-negasso-gidada": {"dambi-doolloo", "sayyoo"},
    "oliqa-dingil-booka": {"yamaalogii-walal"},
    "jote-tulu": {"sayyoo"},
    "sadii-akkayyuu": {"sadii-canqaa"},
    "gidamii-guus-agaloo": {"gidaamii"},
    "jaal-laggasaa-wagii": {"gaawoo-qeebbee"},
}


def make_person(**overrides):
    fields = {
        "name_om": "Nama Yaalii",
        "name_en": "Test Person",
        "slug": "nama-yaalii",
        "bio_om": "<p>Seenaa gabaabaa.</p>",
        "is_zone_notable": False,
    }
    fields.update(overrides)
    return Person(**fields)


class PersonSeedTests(TestCase):
    def test_all_six_zone_notables_are_seeded(self):
        slugs = set(
            Person.objects.filter(is_zone_notable=True).values_list(
                "slug", flat=True
            )
        )
        self.assertEqual(slugs, set(EXPECTED_PLACEMENTS))

    def test_seeded_placements_follow_pm_mapping(self):
        for slug, expected_woredas in EXPECTED_PLACEMENTS.items():
            person = Person.objects.get(slug=slug)
            self.assertEqual(
                set(person.woreda_slugs),
                expected_woredas,
                msg=f"Wrong placements for {slug}",
            )

    def test_seeded_people_have_no_photos_or_years_yet(self):
        for person in Person.objects.filter(is_zone_notable=True):
            self.assertIsNone(person.photo_id)
            self.assertIsNone(person.birth_year)
            self.assertIsNone(person.death_year)

    def test_seeded_people_have_om_first_bios(self):
        for person in Person.objects.filter(is_zone_notable=True):
            self.assertTrue(person.name_om)
            self.assertTrue(person.bio_om)


class PersonValidationTests(TestCase):
    def test_om_name_is_required(self):
        with self.assertRaises(ValidationError) as error:
            make_person(name_om="").save()
        self.assertIn("name_om", error.exception.message_dict)

    def test_english_bio_requires_om_bio(self):
        with self.assertRaises(ValidationError) as error:
            make_person(bio_om="", bio_en="<p>English only.</p>").save()
        self.assertIn("bio_om", error.exception.message_dict)

    def test_death_year_cannot_precede_birth_year(self):
        with self.assertRaises(ValidationError) as error:
            make_person(birth_year=1950, death_year=1940).save()
        self.assertIn("death_year", error.exception.message_dict)

    def test_slug_must_be_unique(self):
        make_person().save()
        with self.assertRaises(ValidationError) as error:
            make_person(name_om="Nama Biraa").save()
        self.assertIn("slug", error.exception.message_dict)

    def test_placement_rejects_duplicate_geography(self):
        from django.db import IntegrityError

        person = make_person()
        person.save()
        sayyoo = Geography.objects.get(slug="sayyoo")
        PersonPlacement.objects.create(person=person, geography=sayyoo)
        with self.assertRaises(IntegrityError):
            PersonPlacement.objects.create(person=person, geography=sayyoo)


class PeopleApiTests(TestCase):
    def test_anonymous_listing_returns_all_zone_notables(self):
        response = self.client.get(PEOPLE_URL)
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["meta"]["total_count"], 6)
        by_slug = {item["slug"]: item for item in payload["items"]}
        self.assertEqual(set(by_slug), set(EXPECTED_PLACEMENTS))
        self.assertEqual(
            set(by_slug["dr-negasso-gidada"]["woreda_slugs"]),
            {"dambi-doolloo", "sayyoo"},
        )

    def test_anonymous_detail_returns_biography_fields(self):
        person = Person.objects.get(slug="jote-tulu")
        response = self.client.get(f"{PEOPLE_URL}{person.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["name_om"], "Jootee Tulluu")
        self.assertEqual(payload["name_en"], "Jote Tulu")
        self.assertEqual(payload["woreda_slugs"], ["sayyoo"])
        self.assertIsNone(payload["birth_year"])
        self.assertIsNone(payload["photo"])
        for field in ("bio_om", "bio_en", "death_year", "is_zone_notable"):
            self.assertIn(field, payload)

    def test_people_endpoint_is_read_only_for_anonymous_users(self):
        for method in (self.client.post, self.client.put, self.client.delete):
            response = method(PEOPLE_URL, data={})
            self.assertIn(
                response.status_code,
                (403, 405),
                msg=f"{method.__name__} unexpectedly allowed",
            )

    def test_people_endpoint_is_read_only_for_authenticated_users(self):
        user_model = get_user_model()
        user = user_model.objects.create_user(
            username="people-api-user",
            password="test-only-password",
        )
        self.client.force_login(user)
        response = self.client.post(PEOPLE_URL, data={"slug": "x"})
        self.assertIn(response.status_code, (403, 405))


class PersonAdminTests(TestCase):
    def test_scoped_people_editor_can_open_person_snippet_listing(self):
        from django.utils import timezone

        from editorial.choices import (
            EditorialAction,
            EditorialLanguage,
            EditorialRole,
            EditorialSubject,
        )
        from editorial.models import EditorialAssignment

        user_model = get_user_model()
        admin = user_model.objects.create_superuser(
            username="person-admin",
            email="person-admin@example.invalid",
            password="test-only-password",
        )
        EditorialAssignment.objects.create(
            user=admin,
            role=EditorialRole.SUBJECT_EDITOR,
            subject=EditorialSubject.PEOPLE,
            geography=Geography.objects.get(slug="qellem-wallaggaa"),
            language=EditorialLanguage.BOTH,
            action=EditorialAction.VIEW,
            starts_at=timezone.now(),
            is_active=True,
            reason="Required test assignment.",
            granted_by=admin,
        )
        self.client.force_login(admin)
        response = self.client.get("/admin/snippets/archive/person/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Jootee Tulluu")

    def test_unassigned_staff_user_cannot_open_person_snippet_listing(self):
        user_model = get_user_model()
        staff = user_model.objects.create_user(
            username="person-staff",
            password="test-only-password",
            is_staff=True,
        )
        self.client.force_login(staff)
        response = self.client.get("/admin/snippets/archive/person/")
        self.assertIn(response.status_code, (302, 403, 404))
