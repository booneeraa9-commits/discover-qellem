"""Tests for the Amharic companion fields and ?lang= API param (#84)."""

from django.core.exceptions import ValidationError
from django.test import TestCase

from archive.models import NewsArticle, Person, TimelineEvent
from qellem_cms.content_validation import (
    AuthoritativeOromoPageMixin,
    MultilingualPageMixin,
)

PAGES_URL = "/api/v2/pages/"
TIMELINE_URL = "/api/v2/timeline/"
PEOPLE_URL = "/api/v2/people/"


class MultilingualMixinTests(TestCase):
    def test_mixin_declares_required_and_optional_languages(self):
        self.assertEqual(MultilingualPageMixin.required_languages, ("om",))
        self.assertEqual(
            MultilingualPageMixin.optional_languages, ("en", "am")
        )

    def test_old_mixin_name_stays_importable(self):
        self.assertIs(AuthoritativeOromoPageMixin, MultilingualPageMixin)


class AmharicModelRuleTests(TestCase):
    def test_amharic_fields_default_to_empty_and_are_optional(self):
        article = NewsArticle.objects.get(slug="coffee-2026")
        self.assertEqual(article.title_am, "")
        self.assertEqual(article.body_am, "")
        article.full_clean()  # Saved seed content stays valid without AM.

    def test_amharic_body_without_om_body_is_rejected(self):
        article = NewsArticle.objects.get(slug="coffee-2026")
        article.body_om = ""
        article.body_am = "<p>የአማርኛ ጽሁፍ</p>"
        with self.assertRaises(ValidationError) as error:
            article.full_clean()
        self.assertIn("body_om", error.exception.message_dict)

    def test_english_without_om_body_is_still_rejected(self):
        article = NewsArticle.objects.get(slug="coffee-2026")
        article.body_om = ""
        article.body_am = ""
        with self.assertRaises(ValidationError) as error:
            article.full_clean()
        self.assertIn("body_om", error.exception.message_dict)

    def test_amharic_alongside_om_is_accepted(self):
        article = NewsArticle.objects.get(slug="coffee-2026")
        article.title_am = "የአማርኛ ርዕስ"
        article.body_am = "<p>የአማርኛ ጽሁፍ</p>"
        article.full_clean()

    def test_person_amharic_bio_requires_om_bio(self):
        person = Person.objects.get(slug="dr-negasso-gidada")
        person.bio_om = ""
        person.bio_am = "<p>የአማርኛ የሕይወት ታሪክ</p>"
        with self.assertRaises(ValidationError) as error:
            person.full_clean()
        self.assertIn("bio_om", error.exception.message_dict)

    def test_timeline_amharic_fields_are_optional(self):
        event = TimelineEvent.objects.get(year_int=1898)
        self.assertEqual(event.title_am, "")
        event.full_clean()
        event.title_am = "የደምቢ ዶሎ ምስረታ"
        event.text_am = "የአማርኛ ጽሁፍ"
        event.full_clean()


class PagesLangParamTests(TestCase):
    def setUp(self):
        self.article = NewsArticle.objects.get(slug="coffee-2026")
        self.url = f"{PAGES_URL}{self.article.pk}/"

    def test_default_response_keeps_suffixed_fields_and_adds_translations(self):
        payload = self.client.get(self.url).json()
        self.assertIn("title_om", payload)
        self.assertIn("title_am", payload)
        self.assertIn("body_am", payload)
        self.assertIn("translations", payload)
        self.assertEqual(
            set(payload["translations"]["title"]), {"om", "en", "am"}
        )
        self.assertEqual(
            payload["translations"]["title"]["om"], self.article.title_om
        )
        self.assertEqual(payload["translations"]["title"]["am"], "")

    def test_lang_am_falls_back_to_om_when_blank(self):
        payload = self.client.get(self.url, {"lang": "am"}).json()
        self.assertEqual(payload["title"], self.article.title_om)
        self.assertIn("134,213", payload["body"])
        self.assertNotIn("title_om", payload)
        self.assertNotIn("body_am", payload)
        self.assertNotIn("translations", payload)

    def test_lang_am_returns_amharic_when_present(self):
        NewsArticle.objects.filter(pk=self.article.pk).update(
            title_am="የቡና ምርት ዜና"
        )
        payload = self.client.get(self.url, {"lang": "am"}).json()
        self.assertEqual(payload["title"], "የቡና ምርት ዜና")

    def test_lang_en_resolves_english(self):
        payload = self.client.get(self.url, {"lang": "en"}).json()
        self.assertEqual(payload["title"], self.article.title_en)

    def test_lang_om_resolves_oromo(self):
        payload = self.client.get(self.url, {"lang": "om"}).json()
        self.assertEqual(payload["title"], self.article.title_om)

    def test_invalid_lang_is_a_bad_request(self):
        response = self.client.get(self.url, {"lang": "fr"})
        self.assertEqual(response.status_code, 400)

    def test_gallery_captions_are_resolved_recursively(self):
        inauguration = NewsArticle.objects.get(
            slug="dembi-dollo-inauguration-2026"
        )
        payload = self.client.get(
            f"{PAGES_URL}{inauguration.pk}/", {"lang": "am"}
        ).json()
        first = payload["gallery_images"][0]
        self.assertIn("caption", first)
        self.assertNotIn("caption_om", first)
        self.assertTrue(first["caption"])  # falls back to the OM caption


class TimelineLangParamTests(TestCase):
    def test_lang_am_resolves_generic_keys_with_om_fallback(self):
        response = self.client.get(TIMELINE_URL, {"lang": "am", "limit": 20})
        self.assertEqual(response.status_code, 200)
        item = response.json()["items"][0]
        event = TimelineEvent.objects.get(year_int=item["year_int"])
        self.assertEqual(item["title"], event.title_om)
        self.assertEqual(item["year"], event.year_om)
        self.assertNotIn("title_om", item)

    def test_default_listing_includes_translations_groups(self):
        response = self.client.get(TIMELINE_URL, {"limit": 20})
        item = response.json()["items"][0]
        self.assertIn("title_am", item)
        self.assertIn("translations", item)
        self.assertEqual(
            set(payload_keys := item["translations"].keys()) >= {"title"},
            True,
            msg=str(payload_keys),
        )

    def test_invalid_lang_is_a_bad_request(self):
        response = self.client.get(TIMELINE_URL, {"lang": "xx"})
        self.assertEqual(response.status_code, 400)


class PeopleLangParamTests(TestCase):
    def test_lang_en_resolves_names_with_om_fallback(self):
        response = self.client.get(PEOPLE_URL, {"lang": "en"})
        self.assertEqual(response.status_code, 200)
        items = response.json()["items"]
        by_slug = {item["slug"]: item for item in items}
        negasso = by_slug["dr-negasso-gidada"]
        self.assertEqual(negasso["name"], "Dr. Negasso Gidada")
        self.assertNotIn("name_om", negasso)

    def test_default_listing_serializes_amharic_fields(self):
        response = self.client.get(PEOPLE_URL)
        item = response.json()["items"][0]
        self.assertIn("name_am", item)
        self.assertIn("translations", item)
