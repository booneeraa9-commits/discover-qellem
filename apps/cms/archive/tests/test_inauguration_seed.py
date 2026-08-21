"""Tests for the seeded inauguration article and its provenance (issue #27)."""

from datetime import date

from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase

from archive.models import ArchiveIndexPage, NewsArticle, NewsCategory
from provenance.models import SourceCitation, SourceRecord

PAGES_URL = "/api/v2/pages/"

EXPECTED_GALLERY_ORDER = [
    "project13",
    "project6",
    "project3",
    "project1",
    "project2",
]


class InaugurationSeedTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.article = NewsArticle.objects.get(
            slug="dembi-dollo-inauguration-2026"
        )

    def test_article_lives_under_archive_index_and_is_live(self):
        self.assertTrue(self.article.live)
        self.assertEqual(
            self.article.get_parent().specific_class,
            ArchiveIndexPage,
        )
        self.assertEqual(self.article.locale.language_code, "om")

    def test_article_identity_matches_verified_facts(self):
        self.assertEqual(self.article.category, NewsCategory.DEVELOPMENT)
        self.assertEqual(self.article.published_date, date(2026, 8, 21))
        self.assertEqual(
            self.article.title_en,
            "650M Birr in Projects Inaugurated in Dembi Dollo",
        )
        self.assertEqual(
            self.article.title_om,
            "Pirojektiiwwan Qarshii Miliyoona 650 oliin Magaalaa Dambi "
            "Doollootti Eebbifaman",
        )
        self.assertEqual(self.article.title, self.article.title_om)

    def test_body_en_covers_all_verified_figures(self):
        body = self.article.body_en
        for fragment in (
            "650 million Birr",
            "425 million Birr",
            "2016 E.C.",
            "11 rooms",
            "grand hall",
            "secondary hall",
            "cafeteria",
            "recreation",
            "Girma Dangala",
            "32 projects",
            "Gammachuu Gurmesa",
            "2,284 projects",
            "17 billion Birr",
            "four-year reform",
            "Utukana Odaa",
            "Office of the President",
        ):
            self.assertIn(fragment, body, msg=f"missing fragment: {fragment}")

    def test_body_om_is_the_labeled_placeholder(self):
        self.assertIn("[OM body pending PM content]", self.article.body_om)

    def test_gallery_order_is_authoritative(self):
        stems = [
            item.image.file.name.rsplit("/", 1)[-1]
            for item in self.article.gallery_images.all()
        ]
        for expected, actual in zip(EXPECTED_GALLERY_ORDER, stems, strict=False):
            self.assertIn(expected, actual, msg=f"{expected} not in {actual}")
        self.assertEqual(len(stems), 5)

    def test_gallery_images_have_real_dimensions(self):
        for item in self.article.gallery_images.all():
            self.assertGreater(item.image.width, 0)
            self.assertGreater(item.image.height, 0)
            self.assertTrue(item.caption_om)
            self.assertTrue(item.caption_en)

    def test_source_record_and_citation_are_attached(self):
        source = SourceRecord.objects.get(source_id="SRC-027")
        self.assertEqual(
            source.title,
            "Kellem Wollega Zone Communication Office, 2026-08-21",
        )
        citation = SourceCitation.objects.get(
            content_type=ContentType.objects.get_for_model(NewsArticle),
            object_id=self.article.pk,
        )
        self.assertEqual(citation.source_id, source.pk)
        self.assertIn("650M", citation.claim_or_section)
        self.assertIn("2,284", citation.claim_or_section)

    def test_seed_editor_account_cannot_log_in(self):
        user = get_user_model().objects.get(username="content-seed-bot")
        self.assertFalse(user.is_active)
        self.assertFalse(user.has_usable_password())

    def test_anonymous_api_detail_serves_ordered_gallery(self):
        response = self.client.get(f"{PAGES_URL}{self.article.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["title_om"], self.article.title_om)
        gallery = payload["gallery_images"]
        self.assertEqual(len(gallery), 5)
        captions = [item["caption_en"] for item in gallery]
        self.assertEqual(
            captions,
            [
                "Oliqa Dingil Hall during a large event",
                "Oliqa Dingil Grand Hall interior",
                "Inauguration ceremony",
                "Ribbon cutting",
                "Main avenue of Dembi Dolo",
            ],
        )
