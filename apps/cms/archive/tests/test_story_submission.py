"""Tests for the anonymous community-story submission endpoint (#32)."""

from unittest import mock

from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework.throttling import SimpleRateThrottle

from archive.models import ArchiveIndexPage, CommunityStory
from places.models import Geography

SUBMIT_URL = "/api/v2/community-stories/"
PAGES_URL = "/api/v2/pages/"

VALID_PAYLOAD = {
    "author_name": "Abdiisaa Tasfaayee",
    "story_om": "Seenaa gabaa Dambi Doolloo waggaa digdamaan dura.",
}


@mock.patch.dict(
    SimpleRateThrottle.THROTTLE_RATES,
    {"community_story_submissions": "100/hour"},
)
class StorySubmissionTests(TestCase):
    def setUp(self):
        cache.clear()  # Reset throttle counters between tests.

    def submit(self, **overrides):
        payload = {**VALID_PAYLOAD, **overrides}
        return self.client.post(
            SUBMIT_URL, payload, content_type="application/json"
        )

    def test_anonymous_submission_creates_unapproved_unpublished_story(self):
        before = CommunityStory.objects.count()
        response = self.submit()
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json()["received"])
        story = CommunityStory.objects.order_by("-id").first()
        self.assertEqual(CommunityStory.objects.count(), before + 1)
        self.assertFalse(story.approved)
        self.assertFalse(story.live)
        self.assertEqual(story.author_name, "Abdiisaa Tasfaayee")
        self.assertIn("Seenaa gabaa", story.story_om)
        self.assertIsInstance(
            story.get_parent().specific, ArchiveIndexPage
        )

    def test_submission_without_name_is_accepted(self):
        response = self.submit(author_name="")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            CommunityStory.objects.order_by("-id").first().author_name, ""
        )

    def test_english_only_submission_is_accepted(self):
        response = self.submit(
            story_om="", story_en="A market story from twenty years ago."
        )
        self.assertEqual(response.status_code, 201)
        story = CommunityStory.objects.order_by("-id").first()
        self.assertEqual(story.story_om, "")
        self.assertIn("market story", story.story_en)

    def test_amharic_only_submission_is_accepted(self):
        response = self.submit(story_om="", story_am="የገበያ ታሪክ ከሃያ ዓመት በፊት።")
        self.assertEqual(response.status_code, 201)

    def test_submission_with_place_slug_links_geography(self):
        response = self.submit(place="anfilloo")
        self.assertEqual(response.status_code, 201)
        story = CommunityStory.objects.order_by("-id").first()
        self.assertEqual(story.geography.slug, "anfilloo")

    def test_submission_without_any_story_text_is_rejected(self):
        before = CommunityStory.objects.count()
        response = self.submit(story_om="", story_en="", story_am="")
        self.assertEqual(response.status_code, 400)
        self.assertIn("story_om", response.json())
        self.assertEqual(CommunityStory.objects.count(), before)

    def test_unknown_place_slug_is_rejected(self):
        response = self.submit(place="atlantis")
        self.assertEqual(response.status_code, 400)
        self.assertIn("place", response.json())

    def test_overlong_story_is_rejected(self):
        response = self.submit(story_om="x" * 10_001)
        self.assertEqual(response.status_code, 400)

    def test_html_input_is_escaped_into_plain_paragraphs(self):
        self.submit(story_om='<script>alert("x")</script>\nJalqaba seenaa.')
        story = CommunityStory.objects.order_by("-id").first()
        self.assertNotIn("<script>", story.story_om)
        self.assertIn("&lt;script&gt;", story.story_om)
        self.assertIn("<p>Jalqaba seenaa.</p>", story.story_om)

    def test_honeypot_pretends_success_but_stores_nothing(self):
        before = CommunityStory.objects.count()
        response = self.submit(website="https://spam.example.com")
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json()["received"])
        self.assertEqual(CommunityStory.objects.count(), before)

    def test_get_is_not_allowed(self):
        self.assertEqual(self.client.get(SUBMIT_URL).status_code, 405)

    def test_new_submission_is_hidden_from_anonymous_pages_api(self):
        self.submit()
        story = CommunityStory.objects.order_by("-id").first()
        listing = self.client.get(
            PAGES_URL, {"type": "archive.CommunityStory"}
        ).json()
        self.assertNotIn(
            story.pk, [item["id"] for item in listing["items"]]
        )
        detail = self.client.get(f"{PAGES_URL}{story.pk}/")
        self.assertEqual(detail.status_code, 404)


@mock.patch.dict(
    SimpleRateThrottle.THROTTLE_RATES,
    {"community_story_submissions": "2/hour"},
)
class StorySubmissionThrottleTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_third_submission_within_window_is_throttled(self):
        for _ in range(2):
            response = self.client.post(
                SUBMIT_URL, VALID_PAYLOAD, content_type="application/json"
            )
            self.assertEqual(response.status_code, 201)
        response = self.client.post(
            SUBMIT_URL, VALID_PAYLOAD, content_type="application/json"
        )
        self.assertEqual(response.status_code, 429)


class StoryApprovalRuleTests(TestCase):
    def _make_story(self, **fields):
        parent = ArchiveIndexPage.objects.first()
        story = CommunityStory(
            title="Seenaa hawaasaa",
            slug=fields.pop("slug", "story-approval-rules"),
            live=False,
            locale=parent.locale,
            **fields,
        )
        parent.add_child(instance=story)
        return story

    def test_unapproved_story_may_be_english_only(self):
        story = self._make_story(story_en="<p>An English-only draft.</p>")
        story.full_clean()  # No error: OM only required on approval.

    def test_approving_without_om_story_is_rejected(self):
        story = self._make_story(story_en="<p>An English-only draft.</p>")
        story.approved = True
        with self.assertRaises(ValidationError) as error:
            story.full_clean()
        self.assertIn("story_om", error.exception.message_dict)

    def test_approving_with_om_story_is_accepted(self):
        story = self._make_story(
            story_om="<p>Seenaa Afaan Oromoo.</p>",
            story_en="<p>The English translation.</p>",
        )
        story.approved = True
        story.full_clean()

    def test_unapproved_story_requires_some_story_text(self):
        story = self._make_story()
        with self.assertRaises(ValidationError) as error:
            story.full_clean()
        self.assertIn("story_om", error.exception.message_dict)

    def test_geography_slug_serialized_for_approved_story(self):
        geography = Geography.objects.get(slug="anfilloo")
        story = self._make_story(
            story_om="<p>Seenaa Anfilloo.</p>",
            geography=geography,
            approved=True,
        )
        story.live = True
        story.save()
        payload = self.client.get(f"{PAGES_URL}{story.pk}/").json()
        self.assertEqual(payload["geography_slug"], "anfilloo")
