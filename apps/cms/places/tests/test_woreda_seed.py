"""Tests for the seeded places index and 12 woreda profile pages (#26)."""

from django.test import TestCase

from home.models import HomePage
from places.models import GeographyIndexPage, GeographyProfilePage
from provenance.models import SourceCitation, SourceRecord

PAGES_URL = "/api/v2/pages/"

EXPECTED_COORDINATES = {
    "dambi-doolloo": (8.543, 34.795),
    "sayyoo": (8.62, 34.38),
    "haawwaa-galaan": (8.75, 34.58),
    "daallee-sadii": (8.50, 34.33),
    "daallee-waabaraa": (8.70, 34.80),
    "gaawoo-qeebbee": (8.85, 35.05),
    "yamaalogii-walal": (8.72, 34.15),
    "anfilloo": (8.42, 34.55),
    "gidaamii": (8.98, 34.60),
    "laaloo-qilee": (8.70, 34.47),
    "sadii-canqaa": (8.85, 34.60),
    "jimmaa-horroo": (9.05, 35.20),
}

EXPECTED_MINERALS = {
    "sayyoo": "Gold, tantalum, uranium",
    "haawwaa-galaan": "Gold",
    "daallee-waabaraa": "Gold",
    "anfilloo": "Gold, uranium",
    "laaloo-qilee": "Gold, platinum",
}

EXPECTED_NOTABLES = {
    "dambi-doolloo": {"dr-negasso-gidada"},
    "sayyoo": {"jote-tulu", "dr-negasso-gidada"},
    "gaawoo-qeebbee": {"jaal-laggasaa-wagii"},
    "yamaalogii-walal": {"oliqa-dingil-booka"},
    "gidaamii": {"gidamii-guus-agaloo"},
    "sadii-canqaa": {"sadii-akkayyuu"},
}

SECTION_FIELDS = (
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
    "introduction",
    "overview",
)


class WoredaSeedStructureTests(TestCase):
    def test_places_index_is_seeded_under_the_homepage(self):
        index = GeographyIndexPage.objects.get(slug="places")
        self.assertTrue(index.live)
        self.assertEqual(index.locale.language_code, "om")
        self.assertEqual(
            index.get_parent().specific_class,
            HomePage,
        )

    def test_all_twelve_profiles_exist_with_canonical_identity(self):
        index = GeographyIndexPage.objects.get(slug="places")
        profiles = GeographyProfilePage.objects.filter(
            locale__language_code="om"
        )
        self.assertEqual(profiles.count(), 12)
        for slug in EXPECTED_COORDINATES:
            with self.subTest(slug=slug):
                page = profiles.get(slug=slug)
                self.assertTrue(page.live)
                self.assertEqual(page.geography.slug, slug)
                self.assertEqual(page.title, page.geography.canonical_name)
                self.assertEqual(page.get_parent().pk, index.pk)

    def test_index_child_count_is_consistent(self):
        index = GeographyIndexPage.objects.get(slug="places")
        self.assertEqual(index.get_children().count(), index.numchild)
        self.assertEqual(index.get_children().count(), 12)

    def test_seat_coordinates_match_the_pm_supplied_values(self):
        for slug, (latitude, longitude) in EXPECTED_COORDINATES.items():
            with self.subTest(slug=slug):
                page = GeographyProfilePage.objects.get(slug=slug)
                self.assertAlmostEqual(page.latitude, latitude)
                self.assertAlmostEqual(page.longitude, longitude)


class WoredaSeedContentTests(TestCase):
    def test_every_section_is_populated_in_both_languages(self):
        for slug in EXPECTED_COORDINATES:
            page = GeographyProfilePage.objects.get(slug=slug)
            for field in SECTION_FIELDS:
                with self.subTest(slug=slug, field=field):
                    self.assertTrue(str(getattr(page, field)).strip())

    def test_quick_facts_fall_back_to_zone_figures_with_notes(self):
        for slug in EXPECTED_COORDINATES:
            with self.subTest(slug=slug):
                page = GeographyProfilePage.objects.get(slug=slug)
                facts = {fact["label_en"]: fact for fact in page.quick_facts}
                self.assertEqual(facts["Population"]["value"], 1254817)
                self.assertEqual(facts["Kebeles"]["value"], 289)
                self.assertEqual(facts["Area"]["unit"], "km2")
                for label, fact in facts.items():
                    if label == "Verified minerals":
                        continue
                    self.assertEqual(fact["note_en"], "Zone-level figure.")
                    self.assertEqual(
                        fact["note_om"], "Lakkoofsa sadarkaa godinaa."
                    )

    def test_mineral_facts_only_for_verified_woredas(self):
        for slug in EXPECTED_COORDINATES:
            with self.subTest(slug=slug):
                page = GeographyProfilePage.objects.get(slug=slug)
                facts = {fact["label_en"]: fact for fact in page.quick_facts}
                if slug in EXPECTED_MINERALS:
                    self.assertEqual(
                        facts["Verified minerals"]["value"],
                        EXPECTED_MINERALS[slug],
                    )
                else:
                    self.assertNotIn("Verified minerals", facts)

    def test_notable_people_follow_the_verified_mapping(self):
        for slug in EXPECTED_COORDINATES:
            with self.subTest(slug=slug):
                page = GeographyProfilePage.objects.get(slug=slug)
                slugs = set(
                    page.notable_people.values_list("slug", flat=True)
                )
                self.assertEqual(slugs, EXPECTED_NOTABLES.get(slug, set()))


class WoredaSeedProvenanceTests(TestCase):
    def test_facts_and_coordinates_sources_exist(self):
        facts = SourceRecord.objects.get(source_id="SRC-026")
        coords = SourceRecord.objects.get(source_id="SRC-028")
        self.assertEqual(
            facts.issuing_organization, "Kellem Wollega Zone Administration"
        )
        self.assertEqual(coords.issuing_organization, "OpenStreetMap Nominatim")

    def test_every_seeded_profile_has_both_citations(self):
        for slug in EXPECTED_COORDINATES:
            with self.subTest(slug=slug):
                page = GeographyProfilePage.objects.get(slug=slug)
                citations = SourceCitation.objects.filter(
                    content_type__app_label="places",
                    content_type__model="geographyprofilepage",
                    object_id=page.pk,
                )
                self.assertEqual(
                    set(
                        citations.values_list(
                            "source__source_id", flat=True
                        )
                    ),
                    {"SRC-026", "SRC-028"},
                )


class WoredaSeedApiTests(TestCase):
    def test_anonymous_listing_returns_all_twelve_profiles(self):
        response = self.client.get(
            PAGES_URL,
            {
                "type": "places.GeographyProfilePage",
                "fields": "geography_slug,latitude,longitude",
            },
        )
        self.assertEqual(response.status_code, 200)
        items = response.json()["items"]
        slugs = {item["geography_slug"] for item in items}
        self.assertEqual(slugs, set(EXPECTED_COORDINATES))

    def test_anonymous_detail_serializes_seeded_content(self):
        page = GeographyProfilePage.objects.get(slug="anfilloo")
        response = self.client.get(f"{PAGES_URL}{page.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("Anfilloo", payload["intro_om"])
        self.assertIn("gold", payload["economy_en"])
        self.assertAlmostEqual(payload["latitude"], 8.42)
        self.assertTrue(
            any(
                fact["label_en"] == "Verified minerals"
                for fact in payload["quick_facts"]
            )
        )

    def test_notable_people_serialized_on_seeded_town_page(self):
        page = GeographyProfilePage.objects.get(slug="dambi-doolloo")
        response = self.client.get(f"{PAGES_URL}{page.pk}/")
        self.assertEqual(response.status_code, 200)
        people = response.json()["notable_people_list"]
        self.assertEqual(
            [person["slug"] for person in people], ["dr-negasso-gidada"]
        )
