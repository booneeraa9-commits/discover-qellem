"""Tests for Amharic profile sections and ?lang= on place pages (#84)."""

from django.test import TestCase

from places.models import GeographyProfilePage

PAGES_URL = "/api/v2/pages/"

AM_SECTION_FIELDS = (
    "intro_am",
    "history_am",
    "economy_am",
    "culture_am",
    "geography_am",
    "attractions_am",
)


class ProfileAmharicFieldTests(TestCase):
    def test_amharic_sections_default_empty_and_stay_optional(self):
        page = GeographyProfilePage.objects.get(slug="dambi-doolloo")
        for field in AM_SECTION_FIELDS:
            with self.subTest(field=field):
                self.assertEqual(getattr(page, field), "")
        page.full_clean()  # Seeded content stays valid without AM.

    def test_amharic_sections_accept_content_alongside_om(self):
        page = GeographyProfilePage.objects.get(slug="dambi-doolloo")
        page.intro_am = "<p>የደምቢ ዶሎ መግቢያ</p>"
        page.full_clean()


class ProfileLangParamTests(TestCase):
    def setUp(self):
        self.page = GeographyProfilePage.objects.get(slug="anfilloo")
        self.url = f"{PAGES_URL}{self.page.pk}/"

    def test_lang_am_resolves_sections_with_om_fallback(self):
        payload = self.client.get(self.url, {"lang": "am"}).json()
        self.assertEqual(payload["intro"], self.page.intro_om)
        self.assertEqual(payload["economy"], self.page.economy_om)
        self.assertNotIn("intro_om", payload)
        self.assertNotIn("economy_am", payload)
        # Non-language keys are untouched.
        self.assertEqual(payload["geography_slug"], "anfilloo")

    def test_lang_en_resolves_english_sections(self):
        payload = self.client.get(self.url, {"lang": "en"}).json()
        self.assertEqual(payload["intro"], self.page.intro_en)
        self.assertEqual(payload["economy"], self.page.economy_en)

    def test_default_response_groups_translations(self):
        payload = self.client.get(self.url).json()
        self.assertIn("intro_am", payload)
        self.assertIn("translations", payload)
        translations = payload["translations"]
        for base in ("intro", "history", "economy", "culture", "attractions"):
            with self.subTest(base=base):
                self.assertEqual(set(translations[base]), {"om", "en", "am"})
                self.assertEqual(translations[base]["am"], "")

    def test_listing_with_lang_and_projected_fields(self):
        response = self.client.get(
            PAGES_URL,
            {
                "type": "places.GeographyProfilePage",
                "fields": "geography_slug,intro_om,intro_en,intro_am",
                "lang": "am",
            },
        )
        self.assertEqual(response.status_code, 200)
        items = response.json()["items"]
        by_slug = {item["geography_slug"]: item for item in items}
        self.assertIn("intro", by_slug["anfilloo"])
        self.assertNotIn("intro_om", by_slug["anfilloo"])
