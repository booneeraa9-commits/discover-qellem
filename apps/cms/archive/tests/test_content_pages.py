"""Model tests for the archive content pages introduced in issue #23."""

from datetime import UTC, date, datetime

from django.core.exceptions import ValidationError
from django.test import TestCase

from archive.models import (
    ArchiveIndexPage,
    CommunityStory,
    Event,
    NewsArticle,
    NewsCategory,
)
from home.models import HomePage


def make_article(**overrides):
    fields = {
        "title": "Mata Duree Oduu",
        "slug": "mata-duree-oduu",
        "title_om": "Mata Duree Oduu",
        "body_om": "<p>Qabiyyee oduu Afaan Oromoo.</p>",
        "category": NewsCategory.DEVELOPMENT,
        "published_date": date(2026, 8, 21),
    }
    fields.update(overrides)
    return NewsArticle(**fields)


def make_event(**overrides):
    fields = {
        "title": "Taatee Hawaasaa",
        "slug": "taatee-hawaasaa",
        "title_om": "Taatee Hawaasaa",
        "body_om": "<p>Ibsa taatee Afaan Oromoo.</p>",
        "event_start": datetime(2026, 9, 1, 9, 0, tzinfo=UTC),
    }
    fields.update(overrides)
    return Event(**fields)


def make_story(**overrides):
    fields = {
        "title": "Seenaa Hawaasaa",
        "slug": "seenaa-hawaasaa",
        "author_name": "Jiraataa Aanaa",
        "story_om": "<p>Seenaa hawaasaa Afaan Oromoo.</p>",
    }
    fields.update(overrides)
    return CommunityStory(**fields)


class ArchiveIndexPageTests(TestCase):
    def test_migration_created_live_archive_index_under_homepage(self):
        index = ArchiveIndexPage.objects.get()
        self.assertEqual(index.slug, "archive")
        self.assertTrue(index.live)
        self.assertEqual(index.locale.language_code, "om")
        self.assertEqual(
            index.get_parent().specific_class,
            HomePage,
        )
        self.assertTrue(index.introduction)

    def test_index_requires_stable_archive_slug(self):
        index = ArchiveIndexPage.objects.get()
        index.slug = "news"

        with self.assertRaises(ValidationError) as error:
            index.full_clean()

        self.assertIn("slug", error.exception.message_dict)

    def test_second_archive_index_is_rejected(self):
        homepage = HomePage.objects.get()
        duplicate = ArchiveIndexPage(
            title="Kuusaa Lammaffaa",
            slug="archive-2",
            introduction="<p>Kuusaa lammaffaa.</p>",
        )

        with self.assertRaises(ValidationError):
            homepage.add_child(instance=duplicate)


class NewsArticleTests(TestCase):
    def setUp(self):
        self.index = ArchiveIndexPage.objects.get()

    def test_valid_article_saves_under_archive_index(self):
        article = make_article()
        self.index.add_child(instance=article)
        self.assertTrue(
            NewsArticle.objects.filter(slug="mata-duree-oduu").exists()
        )

    def test_article_requires_om_title_and_body(self):
        article = make_article(title_om="", body_om="")

        with self.assertRaises(ValidationError) as error:
            self.index.add_child(instance=article)

        self.assertIn("title_om", error.exception.message_dict)
        self.assertIn("body_om", error.exception.message_dict)

    def test_english_body_requires_om_body(self):
        article = make_article(
            body_om="",
            body_en="<p>English only body.</p>",
        )

        with self.assertRaises(ValidationError) as error:
            self.index.add_child(instance=article)

        self.assertIn("body_om", error.exception.message_dict)

    def test_page_title_must_match_om_title(self):
        article = make_article(title="Different Title")

        with self.assertRaises(ValidationError) as error:
            self.index.add_child(instance=article)

        self.assertIn("title", error.exception.message_dict)

    def test_article_cannot_live_under_homepage(self):
        homepage = HomePage.objects.get()
        article = make_article()
        homepage.add_child(instance=article)

        with self.assertRaises(ValidationError):
            article.full_clean()

    def test_gallery_images_keep_declared_order(self):
        import io

        from django.core.files.uploadedfile import SimpleUploadedFile
        from PIL import Image as PillowImage
        from wagtail.images.models import Image

        article = make_article()
        self.index.add_child(instance=article)

        buffer = io.BytesIO()
        PillowImage.new("RGB", (1, 1), "white").save(buffer, format="PNG")
        png_bytes = buffer.getvalue()

        for position, name in enumerate(["c-first", "a-second", "b-third"]):
            image = Image.objects.create(
                title=name,
                file=SimpleUploadedFile(f"{name}.png", png_bytes),
                width=1,
                height=1,
            )
            article.gallery_images.create(image=image, sort_order=position)

        names = [item.image.title for item in article.gallery_images.all()]
        self.assertEqual(names, ["c-first", "a-second", "b-third"])


class EventTests(TestCase):
    def setUp(self):
        self.index = ArchiveIndexPage.objects.get()

    def test_valid_event_saves(self):
        event = make_event(
            event_end=datetime(2026, 9, 1, 17, 0, tzinfo=UTC),
            location_text_om="Magaalaa Dambi Doolloo",
            latitude=8.543,
            longitude=34.795,
        )
        self.index.add_child(instance=event)
        self.assertTrue(Event.objects.filter(slug="taatee-hawaasaa").exists())

    def test_event_requires_om_title_and_body(self):
        event = make_event(title_om="", body_om="")

        with self.assertRaises(ValidationError) as error:
            self.index.add_child(instance=event)

        self.assertIn("title_om", error.exception.message_dict)
        self.assertIn("body_om", error.exception.message_dict)

    def test_event_cannot_end_before_it_starts(self):
        event = make_event(
            event_end=datetime(2026, 8, 31, 9, 0, tzinfo=UTC),
        )

        with self.assertRaises(ValidationError) as error:
            self.index.add_child(instance=event)

        self.assertIn("event_end", error.exception.message_dict)

    def test_event_coordinates_must_be_paired_and_in_range(self):
        with self.assertRaises(ValidationError) as unpaired:
            self.index.add_child(instance=make_event(latitude=8.5))
        self.assertIn("longitude", unpaired.exception.message_dict)

        with self.assertRaises(ValidationError) as out_of_range:
            self.index.add_child(
                instance=make_event(latitude=95.0, longitude=34.7)
            )
        self.assertIn("latitude", out_of_range.exception.message_dict)

    def test_english_location_requires_om_location(self):
        event = make_event(location_text_en="Dembi Dolo Town")

        with self.assertRaises(ValidationError) as error:
            self.index.add_child(instance=event)

        self.assertIn("location_text_om", error.exception.message_dict)


class CommunityStoryTests(TestCase):
    def setUp(self):
        self.index = ArchiveIndexPage.objects.get()

    def test_valid_story_saves_unapproved_by_default(self):
        story = make_story()
        self.index.add_child(instance=story)
        saved = CommunityStory.objects.get(slug="seenaa-hawaasaa")
        self.assertFalse(saved.approved)
        self.assertIsNotNone(saved.submitted_at)

    def test_story_requires_om_text(self):
        story = make_story(story_om="")

        with self.assertRaises(ValidationError) as error:
            self.index.add_child(instance=story)

        self.assertIn("story_om", error.exception.message_dict)

    def test_english_story_requires_om_story(self):
        story = make_story(story_om="", story_en="<p>English only.</p>")

        with self.assertRaises(ValidationError) as error:
            self.index.add_child(instance=story)

        self.assertIn("story_om", error.exception.message_dict)
