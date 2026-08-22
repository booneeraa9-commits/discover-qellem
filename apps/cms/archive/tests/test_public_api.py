"""Public API visibility tests for archive content (issue #23)."""

from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase

from archive.models import ArchiveIndexPage, CommunityStory, NewsArticle
from archive.tests.test_content_pages import make_article, make_event, make_story

PAGES_URL = "/api/v2/pages/"


class ArchiveApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.index = ArchiveIndexPage.objects.get()

        cls.article = make_article()
        cls.index.add_child(instance=cls.article)

        cls.event = make_event(
            location_text_om="Magaalaa Dambi Doolloo",
            latitude=8.543,
            longitude=34.795,
        )
        cls.index.add_child(instance=cls.event)

        cls.approved_story = make_story(
            title="Seenaa Mirkanaa'e",
            slug="seenaa-mirkanaae",
            approved=True,
        )
        cls.index.add_child(instance=cls.approved_story)

        cls.unapproved_story = make_story(
            title="Seenaa Hin Mirkanoofne",
            slug="seenaa-hin-mirkanoofne",
            approved=False,
        )
        cls.index.add_child(instance=cls.unapproved_story)

    def test_news_article_detail_serializes_declared_fields(self):
        response = self.client.get(f"{PAGES_URL}{self.article.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["title_om"], "Mata Duree Oduu")
        self.assertEqual(payload["category"], "development")
        self.assertEqual(payload["published_date"], str(date(2026, 8, 21)))
        self.assertIn("gallery_images", payload)
        self.assertIn("featured_image", payload)
        self.assertIn("body_om", payload)
        self.assertIn("body_en", payload)

    def test_event_detail_serializes_declared_fields(self):
        response = self.client.get(f"{PAGES_URL}{self.event.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["title_om"], "Taatee Hawaasaa")
        self.assertEqual(payload["location_text_om"], "Magaalaa Dambi Doolloo")
        self.assertEqual(payload["latitude"], 8.543)
        self.assertEqual(payload["longitude"], 34.795)
        self.assertIn("event_start", payload)
        self.assertIn("event_end", payload)

    def test_anonymous_listing_hides_unapproved_stories(self):
        response = self.client.get(
            PAGES_URL, {"type": "archive.CommunityStory"}
        )
        self.assertEqual(response.status_code, 200)
        slugs = [item["meta"]["slug"] for item in response.json()["items"]]
        self.assertIn(self.approved_story.slug, slugs)
        self.assertNotIn(self.unapproved_story.slug, slugs)

    def test_anonymous_detail_hides_unapproved_story(self):
        approved = self.client.get(f"{PAGES_URL}{self.approved_story.pk}/")
        self.assertEqual(approved.status_code, 200)
        self.assertTrue(approved.json()["approved"])

        unapproved = self.client.get(f"{PAGES_URL}{self.unapproved_story.pk}/")
        self.assertEqual(unapproved.status_code, 404)

    def test_authenticated_reviewer_can_see_unapproved_story(self):
        user_model = get_user_model()
        reviewer = user_model.objects.create_user(
            username="story-reviewer",
            password="test-only-password",
        )
        self.client.force_login(reviewer)

        response = self.client.get(f"{PAGES_URL}{self.unapproved_story.pk}/")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["approved"])

    def test_unapproved_story_pages_are_otherwise_live(self):
        self.assertTrue(
            CommunityStory.objects.get(pk=self.unapproved_story.pk).live
        )

    def test_news_listing_can_project_custom_fields(self):
        response = self.client.get(
            PAGES_URL,
            {
                "type": "archive.NewsArticle",
                "fields": "title_om,category,published_date",
                "order": "-published_date",
            },
        )
        self.assertEqual(response.status_code, 200)
        items = response.json()["items"]
        by_title = {item["title_om"]: item for item in items}
        self.assertIn("Mata Duree Oduu", by_title)
        self.assertEqual(by_title["Mata Duree Oduu"]["category"], "development")

    def test_archive_index_exposes_introduction(self):
        response = self.client.get(f"{PAGES_URL}{self.index.pk}/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("introduction", response.json())

    def test_article_appears_only_once_in_full_listing(self):
        response = self.client.get(PAGES_URL, {"limit": 20})
        ids = [item["id"] for item in response.json()["items"]]
        self.assertEqual(ids.count(self.article.pk), 1)
        self.assertEqual(
            NewsArticle.objects.filter(pk=self.article.pk).count(), 1
        )
