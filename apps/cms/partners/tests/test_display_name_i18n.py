"""Tests for partner display-name i18n and the strict am->om fallback (#116)."""

from django.core.exceptions import ValidationError
from django.test import TestCase

from archive.models import (
    NEWS_CATEGORY_LABELS_AM,
    NewsArticle,
    NewsCategory,
)
from partners.models import Collaborator, Sponsor

PAGES_URL = "/api/v2/pages/"

SPONSOR_EN_NAMES = [
    "Kellem Wollega Zone Administration",
    "Kellem Wollega Communication Office",
    "Dembi Dolo University",
    "Dembi Dolo City Administration",
    "Zone Agriculture Office",
    "Zone Culture & Tourism Office",
    "Oromia Science & Technology Authority",
    "Kellem Coffee Cooperatives Union",
    "Oromia Roads Authority",
    "Cultural Heritage Authority",
]

SUPPORTER_EN_NAMES = [
    "Ato Gammachuu Gurmesa",
    "Ato Girma Dangala",
    "Dr. Utukana Odaa",
    "Kellem Culture & Tourism Office",
    "The People of Kellem Wollega",
    "Farmers & Cooperatives",
]


class PartnerEnglishBackfillTests(TestCase):
    def test_all_ten_sponsor_english_names_are_backfilled(self):
        self.assertEqual(
            sorted(
                Sponsor.objects.exclude(display_name_en="").values_list(
                    "display_name_en", flat=True
                )
            ),
            sorted(SPONSOR_EN_NAMES),
        )

    def test_all_six_supporter_english_names_are_backfilled(self):
        self.assertEqual(
            sorted(
                Collaborator.objects.exclude(display_name_en="").values_list(
                    "display_name_en", flat=True
                )
            ),
            sorted(SUPPORTER_EN_NAMES),
        )

    def test_amharic_display_names_stay_blank_until_reviewed(self):
        self.assertFalse(
            Sponsor.objects.exclude(display_name_am="").exists()
        )
        self.assertFalse(
            Collaborator.objects.exclude(display_name_am="").exists()
        )

    def test_om_display_name_stays_required(self):
        sponsor = Sponsor.objects.first()
        sponsor.display_name = ""
        with self.assertRaises(ValidationError) as error:
            sponsor.full_clean()
        self.assertIn("display_name", error.exception.message_dict)

    def test_display_name_translations_reject_stray_whitespace(self):
        sponsor = Sponsor.objects.first()
        sponsor.display_name_am = " ስፖንሰር "
        with self.assertRaises(ValidationError) as error:
            sponsor.full_clean()
        self.assertIn("display_name_am", error.exception.message_dict)


class NewsCategoryAmharicLabelTests(TestCase):
    def test_all_nine_category_keys_have_amharic_labels(self):
        self.assertEqual(
            set(NEWS_CATEGORY_LABELS_AM), set(NewsCategory)
        )
        for key, label in NEWS_CATEGORY_LABELS_AM.items():
            with self.subTest(key=key):
                self.assertTrue(str(label).strip())

    def test_development_label_matches_pm_example(self):
        self.assertEqual(
            str(NEWS_CATEGORY_LABELS_AM[NewsCategory.DEVELOPMENT]), "ልማት"
        )

    def test_article_detail_serializes_amharic_category_label(self):
        article = NewsArticle.objects.get(slug="coffee-2026")
        payload = self.client.get(f"{PAGES_URL}{article.pk}/").json()
        self.assertEqual(
            payload["category_label_am"],
            str(NEWS_CATEGORY_LABELS_AM[article.category]),
        )


class StrictLangFallbackTests(TestCase):
    """?lang=am must fall back to OM, never to EN (FE flip contract)."""

    def setUp(self):
        self.article = NewsArticle.objects.get(slug="coffee-2026")
        self.url = f"{PAGES_URL}{self.article.pk}/"

    def test_lang_am_blank_am_returns_om_body_even_though_en_exists(self):
        self.assertTrue(self.article.body_en)  # EN candidate exists...
        payload = self.client.get(self.url, {"lang": "am"}).json()
        self.assertEqual(payload["body"], self.article.body_om)
        self.assertNotEqual(payload["body"], self.article.body_en)
        self.assertEqual(payload["title"], self.article.title_om)

    def test_lang_am_returns_am_body_when_present(self):
        NewsArticle.objects.filter(pk=self.article.pk).update(
            body_am="<p>የአማርኛ ጽሁፍ</p>"
        )
        payload = self.client.get(self.url, {"lang": "am"}).json()
        self.assertEqual(payload["body"], "<p>የአማርኛ ጽሁፍ</p>")

    def test_lang_en_blank_en_would_fall_back_to_om_not_stay_empty(self):
        NewsArticle.objects.filter(pk=self.article.pk).update(body_en="")
        payload = self.client.get(self.url, {"lang": "en"}).json()
        self.assertEqual(payload["body"], self.article.body_om)

    def test_invalid_lang_is_still_a_bad_request(self):
        self.assertEqual(
            self.client.get(self.url, {"lang": "bad"}).status_code, 400
        )
