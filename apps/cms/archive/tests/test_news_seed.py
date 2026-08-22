"""Tests for the seven seeded news articles from issue #28."""

from datetime import date

from django.test import TestCase

from archive.models import ArchiveIndexPage, NewsArticle
from provenance.models import SourceCitation

PAGES_URL = "/api/v2/pages/"

# slug -> (category, published_date)
EXPECTED_ARTICLES = {
    "coffee-2026": ("economy", date(2026, 8, 8)),
    "walal-2026": ("economy", date(2026, 7, 14)),
    "gold-2026": ("economy", date(2026, 6, 3)),
    "honey-2026": ("economy", date(2026, 5, 19)),
    "health-2026": ("health", date(2026, 4, 22)),
    "schools-2026": ("education", date(2026, 3, 9)),
    "irreecha-2026": ("culture", date(2026, 9, 27)),
}

# Figures that appear in the frontend mirror but are NOT in
# qa/CONTENT_FACTS.md section 1 and must stay out of the seeds.
UNVERIFIED_FRAGMENTS = ("372", "43,960", "339,193", "teachers' college")


class NewsSeedStructureTests(TestCase):
    def test_all_seven_articles_are_seeded_live_under_the_archive(self):
        index = ArchiveIndexPage.objects.get(slug="archive")
        for slug, (category, published) in EXPECTED_ARTICLES.items():
            with self.subTest(slug=slug):
                article = NewsArticle.objects.get(slug=slug)
                self.assertTrue(article.live)
                self.assertEqual(article.get_parent().pk, index.pk)
                self.assertEqual(article.category, category)
                self.assertEqual(article.published_date, published)
                self.assertEqual(article.title, article.title_om)

    def test_bodies_are_bilingual(self):
        for slug in EXPECTED_ARTICLES:
            with self.subTest(slug=slug):
                article = NewsArticle.objects.get(slug=slug)
                self.assertTrue(str(article.body_om).strip())
                self.assertTrue(str(article.body_en).strip())

    def test_verified_figures_are_present(self):
        checks = {
            "coffee-2026": ("134,213", "484,841", "817"),
            "walal-2026": ("87/2005", "25 May 2012"),
            "gold-2026": ("platinum", "tantalum", "uranium"),
            "honey-2026": ("473,300",),
            "health-2026": ("4 hospitals", "51", "256"),
            "schools-2026": ("452", "50", "348,516"),
        }
        for slug, fragments in checks.items():
            article = NewsArticle.objects.get(slug=slug)
            for fragment in fragments:
                with self.subTest(slug=slug, fragment=fragment):
                    self.assertIn(fragment, str(article.body_en))

    def test_unverified_figures_are_trimmed(self):
        for slug in EXPECTED_ARTICLES:
            article = NewsArticle.objects.get(slug=slug)
            body = f"{article.body_en} {article.body_om}"
            for fragment in UNVERIFIED_FRAGMENTS:
                with self.subTest(slug=slug, fragment=fragment):
                    self.assertNotIn(fragment, body)


class NewsSeedProvenanceTests(TestCase):
    def test_every_article_cites_the_demo_mirror_source(self):
        for slug in EXPECTED_ARTICLES:
            with self.subTest(slug=slug):
                article = NewsArticle.objects.get(slug=slug)
                source_ids = set(
                    SourceCitation.objects.filter(
                        content_type__app_label="archive",
                        content_type__model="newsarticle",
                        object_id=article.pk,
                    ).values_list("source__source_id", flat=True)
                )
                self.assertIn("SRC-029", source_ids)

    def test_statistical_articles_also_cite_the_zone_facts_source(self):
        for slug in EXPECTED_ARTICLES:
            if slug == "irreecha-2026":
                continue
            with self.subTest(slug=slug):
                article = NewsArticle.objects.get(slug=slug)
                source_ids = set(
                    SourceCitation.objects.filter(
                        content_type__app_label="archive",
                        content_type__model="newsarticle",
                        object_id=article.pk,
                    ).values_list("source__source_id", flat=True)
                )
                self.assertIn("SRC-026", source_ids)


class NewsSeedApiTests(TestCase):
    def test_anonymous_listing_includes_all_seeded_articles(self):
        response = self.client.get(
            PAGES_URL,
            {"type": "archive.NewsArticle", "fields": "category", "limit": 20},
        )
        self.assertEqual(response.status_code, 200)
        slugs = {
            item["meta"]["slug"] for item in response.json()["items"]
        }
        self.assertTrue(set(EXPECTED_ARTICLES).issubset(slugs))

    def test_anonymous_detail_serializes_a_seeded_article(self):
        article = NewsArticle.objects.get(slug="coffee-2026")
        response = self.client.get(f"{PAGES_URL}{article.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["category"], "economy")
        self.assertIn("134,213", payload["body_en"])
        self.assertIn("134,213", payload["body_om"])
