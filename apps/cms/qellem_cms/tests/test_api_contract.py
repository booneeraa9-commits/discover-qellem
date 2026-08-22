"""QA API contract tests (Sprint 4).

These encode the public API contract between the Wagtail v2 backend and the
Next.js frontend (issues #29 / #30). They are the QA gate: if one of these
fails, a backend PR must not merge.

Contract sources of truth:
- qa/CONTENT_FACTS.md (verified facts, 12 canonical woredas, 9 categories)
- qa/API_CONTRACT.md (endpoint/shape/filter/error contracts)

NOTE for reviewers — one decision is encoded deliberately (see inline
comments):
1. Sponsors/supporters are seeded ``pending`` + ``inactive`` by design, so the
   anonymous public endpoint returns 0 until the PM approves display. The
   contract asserts the seeded row counts (10/6) at the model level, the
   0-by-default public behaviour, and the 10/6 public count after display
   approval.
"""

from pathlib import PurePosixPath

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from archive.models import NewsCategory
from archive.tests.test_content_pages import make_story
from partners.models import Collaborator, PartnerKind, PublicDisplayStatus, Sponsor
from places.models import Geography, GeographyLevel
from provenance.choices import ConsentStatus

# --- Canonical fixtures (mirror qa/CONTENT_FACTS.md) -------------------------

EXPECTED_CATEGORY_KEYS = {
    "development",
    "economy",
    "environment",
    "minerals",
    "agriculture",
    "health",
    "education",
    "culture",
    "trade",
}

EXPECTED_WOREDA_SLUGS = {
    "dambi-doolloo",
    "sayyoo",
    "haawwaa-galaan",
    "daallee-sadii",
    "daallee-waabaraa",
    "gaawoo-qeebbee",
    "yamaalogii-walal",
    "anfilloo",
    "gidaamii",
    "laaloo-qilee",
    "sadii-canqaa",
    "jimmaa-horroo",
}

EXPECTED_PERSON_SLUGS = {
    "dr-negasso-gidada",
    "oliqa-dingil-booka",
    "jote-tulu",
    "sadii-akkayyuu",
    "gidamii-guus-agaloo",
    # Canonical Oromo slug per qa/CONTENT_FACTS.md (full name: Jaal Laggasaa Wagii Meettaa).
    "jaal-laggasaa-wagii",
}

EXPECTED_GALLERY_STEMS = [
    "project13",
    "project6",
    "project3",
    "project1",
    "project2",
]

PUBLIC_ENDPOINTS = [
    "/api/v2/pages/",
    "/api/v2/images/",
    "/api/v2/documents/",
    "/api/v2/people/",
    "/api/v2/timeline/",
    "/api/v2/sponsors/",
    "/api/v2/supporters/",
]


class ApiMethodContractTests(TestCase):
    """Every public endpoint is GET-only for anonymous users."""

    def test_anonymous_get_returns_200(self):
        for url in PUBLIC_ENDPOINTS:
            with self.subTest(url=url):
                response = self.client.get(url, {"format": "json"})
                self.assertEqual(response.status_code, 200, url)

    def test_anonymous_write_methods_return_405(self):
        for url in PUBLIC_ENDPOINTS:
            for method in ("post", "put", "delete"):
                with self.subTest(url=url, method=method):
                    target = url if method == "post" else f"{url}1/"
                    response = getattr(self.client, method)(target, {}, format="json")
                    self.assertEqual(
                        response.status_code, 405, f"{method.upper()} {url}"
                    )


class CategoryContractTests(TestCase):
    def test_category_key_set_is_exactly_the_nine_expected(self):
        actual = {choice.value for choice in NewsCategory}
        self.assertEqual(actual, EXPECTED_CATEGORY_KEYS)

    def test_economy_om_label_is_dinagdee_not_diinaagdee(self):
        label = NewsCategory.ECONOMY.label
        self.assertIn("Dinagdee", label)
        self.assertNotIn("Diinaagdee", label)

    def test_minerals_om_label_is_mineraala_not_albuuda(self):
        label = NewsCategory.MINERALS.label
        self.assertIn("Mineraala", label)
        self.assertNotIn("Albuuda", label)

    def test_seeded_articles_only_use_allowed_keys(self):
        from archive.models import NewsArticle

        used = set(
            NewsArticle.objects.values_list("category", flat=True).distinct()
        )
        self.assertTrue(
            used <= EXPECTED_CATEGORY_KEYS,
            f"seeded categories outside the 9: {sorted(used - EXPECTED_CATEGORY_KEYS)}",
        )


class WoredaContractTests(TestCase):
    def test_twelve_canonical_woreda_slugs(self):
        slugs = set(
            Geography.objects.filter(
                level__in=[GeographyLevel.WOREDA, GeographyLevel.TOWN]
            ).values_list("slug", flat=True)
        )
        self.assertEqual(slugs, EXPECTED_WOREDA_SLUGS)

    def test_place_pages_expose_canonical_geography_slugs(self):
        response = self.client.get(
            "/api/v2/pages/",
            {"type": "places.GeographyProfilePage", "format": "json"},
        )
        self.assertEqual(response.status_code, 200)
        geo_slugs = {
            item["meta"]["slug"] for item in response.json()["items"]
        }
        self.assertEqual(geo_slugs, EXPECTED_WOREDA_SLUGS)


class InaugurationContractTests(TestCase):
    def test_gallery_order_matches_verified_sequence(self):
        from archive.models import NewsArticle

        article = NewsArticle.objects.get(slug="dembi-dollo-inauguration-2026")
        response = self.client.get(f"/api/v2/pages/{article.pk}/", {"format": "json"})
        self.assertEqual(response.status_code, 200)
        gallery = response.json()["gallery_images"]
        stems = [
            PurePosixPath(item["image"]["meta"]["download_url"]).stem
            for item in gallery
        ]
        # Stems look like "inauguration-2026-project13" (the test DB appends a
        # random suffix like "project13_KJFXNqa"), so match the project number.
        import re

        project_numbers = [
            int(m.group(1))
            for stem in stems
            for m in [re.search(r"project(\d+)", stem)]
            if m
        ]
        self.assertEqual(
            project_numbers,
            [13, 6, 3, 1, 2],
            f"gallery stems: {stems}",
        )


class CommunityStoryVisibilityTests(TestCase):
    def test_unapproved_story_hidden_from_anonymous_listing_and_detail(self):
        from archive.models import ArchiveIndexPage

        index = ArchiveIndexPage.objects.get()
        unapproved = make_story(title="Seenaa Hin Mirkanoofne", slug="contract-story", approved=False)
        index.add_child(instance=unapproved)

        listing = self.client.get(
            "/api/v2/pages/", {"type": "archive.CommunityStory", "format": "json"}
        )
        self.assertEqual(listing.status_code, 200)
        self.assertNotIn(
            "contract-story",
            [item["meta"]["slug"] for item in listing.json()["items"]],
        )

        detail = self.client.get(f"/api/v2/pages/{unapproved.pk}/", {"format": "json"})
        self.assertEqual(detail.status_code, 404)


class PartnerContractTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.reviewer = get_user_model().objects.create_superuser(
            username="contract-reviewer",
            email="contract-reviewer@example.invalid",
            password="test-only-password",
        )

    def approve_all(self, model):
        for record in model.objects.all():
            record.is_active = True
            record.public_display_status = PublicDisplayStatus.APPROVED
            record.reviewed_by = self.reviewer
            record.reviewed_at = timezone.now()
            record.approval_notes = "Approved in a contract test (simulated PM review)."
            if model is Collaborator and getattr(record, "partner_kind", None) == PartnerKind.PERSON:
                # Individuals must have consent resolved before display approval.
                record.consent_status = ConsentStatus.CONFIRMED
            update_fields = [
                "is_active",
                "public_display_status",
                "reviewed_by",
                "reviewed_at",
                "approval_notes",
            ]
            if model is Collaborator and getattr(record, "partner_kind", None) == PartnerKind.PERSON:
                update_fields.append("consent_status")
            record.save(update_fields=update_fields)

    def test_ten_sponsors_and_six_supporters_are_seeded(self):
        self.assertEqual(Sponsor.objects.count(), 10)
        self.assertEqual(Collaborator.objects.count(), 6)

    def test_anonymous_public_lists_are_empty_while_seeds_are_pending(self):
        sponsors = self.client.get("/api/v2/sponsors/", {"format": "json"})
        supporters = self.client.get("/api/v2/supporters/", {"format": "json"})
        self.assertEqual(sponsors.json()["meta"]["total_count"], 0)
        self.assertEqual(supporters.json()["meta"]["total_count"], 0)

    def test_public_lists_show_all_ten_and_six_after_display_approval(self):
        self.approve_all(Sponsor)
        self.approve_all(Collaborator)
        sponsors = self.client.get("/api/v2/sponsors/", {"format": "json"})
        supporters = self.client.get("/api/v2/supporters/", {"format": "json"})
        self.assertEqual(sponsors.json()["meta"]["total_count"], 10)
        self.assertEqual(supporters.json()["meta"]["total_count"], 6)


class TimelineContractTests(TestCase):
    def test_timeline_ordered_by_descending_year_int(self):
        response = self.client.get("/api/v2/timeline/", {"format": "json"})
        self.assertEqual(response.status_code, 200)
        years = [item["year_int"] for item in response.json()["items"]]
        self.assertEqual(years, sorted(years, reverse=True))

    def test_timeline_has_thirteen_seeded_events(self):
        response = self.client.get("/api/v2/timeline/", {"format": "json"})
        self.assertEqual(response.json()["meta"]["total_count"], 13)


class PeopleContractTests(TestCase):
    def test_people_endpoint_returns_the_six_expected_slugs(self):
        response = self.client.get("/api/v2/people/", {"format": "json"})
        self.assertEqual(response.status_code, 200)
        actual = {item["slug"] for item in response.json()["items"]}
        self.assertEqual(
            actual,
            EXPECTED_PERSON_SLUGS,
            "People slug set mismatch — reconcile the canonical slug for "
            "Jaal Laggasaa Wagi (see qa/API_CONTRACT.md and the content bug).",
        )


# =============================================================================
# Sprint 5 additions (issue #84 follow-up + pending BE).
# =============================================================================

class LanguageProjectionContractTests(TestCase):
    """?lang=om|en|am projection (landed in #107, strict OM-only fallback in #117)."""

    @classmethod
    def setUpTestData(cls):
        from archive.models import ArchiveIndexPage, NewsArticle

        cls.index = ArchiveIndexPage.objects.get()
        cls.article = NewsArticle(
            title="OM BODY",
            slug="lang-fallback-contract",
            title_om="OM BODY",
            title_en="EN BODY",
            title_am="",
            body_om="<p>OM BODY</p>",
            body_en="<p>EN BODY</p>",
            body_am="",
            category=NewsCategory.DEVELOPMENT,
            published_date="2026-08-21",
        )
        cls.index.add_child(instance=cls.article)

    def _detail(self, params):
        return self.client.get(
            f"/api/v2/pages/{self.article.pk}/",
            {**params, "format": "json"},
        )

    def test_lang_am_falls_back_to_om_not_en(self):
        # The PM's exact assertion: am="" om="OM BODY" en="EN BODY" → ?lang=am
        # returns "OM BODY" and never "EN BODY".
        response = self._detail({"lang": "am"})
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["title"], "OM BODY")
        self.assertEqual(payload["body"], "<p>OM BODY</p>")
        self.assertNotIn("EN BODY", payload["title"])
        self.assertNotIn("EN BODY", payload["body"])

    def test_lang_om_and_en_resolve_their_own_language(self):
        self.assertEqual(self._detail({"lang": "om"}).json()["title"], "OM BODY")
        self.assertEqual(self._detail({"lang": "en"}).json()["title"], "EN BODY")

    def test_lang_projection_removes_suffixed_keys(self):
        payload = self._detail({"lang": "am"}).json()
        for key in ("title_om", "title_en", "title_am", "body_om", "body_en", "body_am"):
            self.assertNotIn(key, payload, f"suffixed key {key} should be removed")

    def test_invalid_lang_returns_400(self):
        response = self._detail({"lang": "fr"})
        self.assertEqual(response.status_code, 400)

    def test_lang_am_with_empty_om_never_falls_back_to_en(self):
        # Edge case #117 tightens: when the requested language AND OM are both
        # empty, the projection must still never surface the EN value (main
        # currently falls back OM→EN). Because the model forbids blank OM, this
        # is exercised at the projection layer, not via a saved page.
        from qellem_cms.i18n_api import _transform

        data = {
            "title_om": "",
            "title_en": "EN BODY",
            "title_am": "",
            "body_om": "",
            "body_en": "EN BODY",
            "body_am": "",
        }
        _transform(data, "am")
        self.assertNotIn("EN BODY", data.get("title", ""))
        self.assertNotIn("EN BODY", data.get("body", ""))


class PartnerBilingualFieldContractTests(TestCase):
    """Sprint 5 BE #117 (LANDED): partner display_name_en/_am companions."""

    @classmethod
    def setUpTestData(cls):
        cls.reviewer = get_user_model().objects.create_superuser(
            username="partner-i18n-reviewer",
            email="partner-i18n@example.invalid",
            password="test-only-password",
        )

    def _approve(self, record, is_person=False):
        record.is_active = True
        record.public_display_status = PublicDisplayStatus.APPROVED
        record.reviewed_by = self.reviewer
        record.reviewed_at = timezone.now()
        record.approval_notes = "Approved in a contract test."
        if is_person:
            record.consent_status = ConsentStatus.CONFIRMED
        record.save()

    def _listing(self, url):
        return self.client.get(url, {"format": "json"}).json()["items"]

    def test_sponsors_expose_display_name_en_and_am(self):
        sponsor = Sponsor.objects.first()
        self._approve(sponsor)
        items = self._listing("/api/v2/sponsors/")
        self.assertTrue(items, "expected at least one approved sponsor")
        for item in items:
            self.assertIn("display_name_en", item)
            self.assertIn("display_name_am", item)
            # EN is backfilled for every seeded sponsor; AM is intentionally blank.
            self.assertTrue(item["display_name_en"])
            self.assertEqual(item["display_name_am"], "")

    def test_supporters_expose_display_name_en_and_am(self):
        supporter = Collaborator.objects.filter(partner_kind=PartnerKind.PERSON).first()
        self._approve(supporter, is_person=True)
        items = self._listing("/api/v2/supporters/")
        self.assertTrue(items, "expected at least one approved supporter")
        for item in items:
            self.assertIn("display_name_en", item)
            self.assertIn("display_name_am", item)


class NewsCategoryAmharicLabelContractTests(TestCase):
    def test_news_category_labels_include_amharic(self):
        from archive.models import NEWS_CATEGORY_LABELS_AM

        # Covers exactly the 9 canonical keys with Ethiopic-script values.
        self.assertEqual(
            {choice for choice in NewsCategory},
            set(NEWS_CATEGORY_LABELS_AM.keys()),
        )
        for choice, am_label in NEWS_CATEGORY_LABELS_AM.items():
            ethiopic = any("\u1200" <= ch <= "\u137f" for ch in str(am_label))
            self.assertTrue(
                ethiopic,
                f"{choice.name} Amharic label has no Ethiopic: {am_label!r}",
            )

    def test_news_detail_serializes_category_label_am(self):
        from archive.models import NewsArticle

        article = NewsArticle.objects.filter(slug="dembi-dollo-inauguration-2026").first()
        self.assertIsNotNone(article)
        response = self.client.get(f"/api/v2/pages/{article.pk}/", {"format": "json"})
        self.assertEqual(response.status_code, 200)
        label_am = response.json().get("category_label_am")
        ethiopic = any("\u1200" <= ch <= "\u137f" for ch in str(label_am))
        self.assertTrue(ethiopic, f"category_label_am not Amharic: {label_am!r}")


class ImageRenditionContractTests(TestCase):
    """Sprint 5 BE #118 (LANDED): top-level rendition URLs on /api/v2/images/ (issue #112)."""

    def test_image_detail_exposes_rendition_urls(self):
        from wagtail.images import get_image_model

        Image = get_image_model()
        image = Image.objects.first()
        if image is None:
            self.skipTest("no seeded images")
        response = self.client.get(f"/api/v2/images/{image.pk}/", {"format": "json"})
        self.assertEqual(response.status_code, 200)
        renditions = response.json().get("renditions", {})
        for name in ("fill-400x300", "fill-800x600", "max-1600x1200", "original"):
            url = renditions.get(name)
            self.assertTrue(url, f"missing or empty rendition {name}")
            self.assertTrue(url.startswith("http"), f"rendition URL not absolute: {url}")
        # The stock contract fields remain intact.
        self.assertIn("meta", response.json())
        self.assertIn("download_url", response.json()["meta"])

    def test_image_listing_items_carry_renditions(self):
        response = self.client.get("/api/v2/images/", {"format": "json"})
        self.assertEqual(response.status_code, 200)
        items = response.json()["items"]
        if not items:
            self.skipTest("no seeded images")
        for item in items:
            renditions = item.get("renditions", {})
            for name in ("fill-400x300", "fill-800x600", "max-1600x1200", "original"):
                self.assertIn(name, renditions, f"missing rendition {name} in listing")


# =============================================================================
# Sprint 6 additions.
# =============================================================================

class ImageUrlContractTests(TestCase):
    """Image/rendition URLs must be absolute so the FE can render them (#119)."""

    def test_rendition_urls_are_absolute(self):
        from wagtail.images import get_image_model

        Image = get_image_model()
        image = Image.objects.first()
        if image is None:
            self.skipTest("no seeded images")
        response = self.client.get(f"/api/v2/images/{image.pk}/", {"format": "json"})
        self.assertEqual(response.status_code, 200)
        renditions = response.json().get("renditions", {})
        for name, url in renditions.items():
            self.assertTrue(
                url.startswith(("http://", "https://")),
                f"rendition {name} URL not absolute: {url!r}",
            )

    @unittest.skip("pending #119: download_url must become absolute (CMS origin rewrite)")
    def test_download_url_is_absolute(self):
        from wagtail.images import get_image_model

        Image = get_image_model()
        image = Image.objects.first()
        if image is None:
            self.skipTest("no seeded images")
        response = self.client.get(f"/api/v2/images/{image.pk}/", {"format": "json"})
        self.assertEqual(response.status_code, 200)
        download_url = response.json()["meta"]["download_url"]
        self.assertTrue(
            download_url.startswith(("http://", "https://")),
            f"download_url not absolute: {download_url!r}",
        )


class CommunityStorySubmissionContractTests(TestCase):
    """POST /api/v2/community-stories/ must keep working unauthenticated (#108/#32)."""

    def setUp(self):
        from django.core.cache import cache

        cache.clear()  # Reset the scoped throttle between tests.

    def test_anonymous_post_returns_201(self):
        response = self.client.post(
            "/api/v2/community-stories/",
            {"story_om": "Seenaa qabatamaa asitti.", "story_en": "", "story_am": ""},
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.content[:200])
        self.assertTrue(response.json()["received"])

    def test_anonymous_post_creates_unapproved_story(self):
        from archive.models import CommunityStory

        before = CommunityStory.objects.count()
        self.client.post(
            "/api/v2/community-stories/",
            {"story_om": "Seenaa qabatamaa lamaffaa.", "story_en": "", "story_am": ""},
            format="json",
        )
        self.assertEqual(CommunityStory.objects.count(), before + 1)
        story = CommunityStory.objects.order_by("-pk").first()
        self.assertFalse(story.approved)

    def test_honeypot_fakes_success_and_stores_nothing(self):
        from archive.models import CommunityStory

        before = CommunityStory.objects.count()
        response = self.client.post(
            "/api/v2/community-stories/",
            {
                "story_om": "Seenaa bot.",
                "story_en": "",
                "story_am": "",
                "website": "spam.example",
            },
            format="json",
        )
        # Fake success to the bot, but no record stored.
        self.assertEqual(response.status_code, 201, response.content[:200])
        self.assertTrue(response.json()["received"])
        self.assertEqual(CommunityStory.objects.count(), before)

    def test_empty_story_returns_400(self):
        response = self.client.post(
            "/api/v2/community-stories/",
            {"story_om": "", "story_en": "", "story_am": ""},
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class AuthEndpointContractTests(TestCase):
    """Sprint 6 #38: session/auth endpoints for /staff (PENDING until #38 lands)."""

    @unittest.skip("pending #38: /api/v2/whoami/ endpoint")
    def test_whoami_returns_authenticated_false_for_anon(self):
        response = self.client.get("/api/v2/whoami/", {"format": "json"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["authenticated"], False)

    @unittest.skip("pending #38: /api/v2/auth/login/ endpoint")
    def test_login_with_good_credentials_returns_200_and_cookie(self):
        get_user_model().objects.create_user(
            username="staff-user", password="good-password"
        )
        response = self.client.post(
            "/api/v2/auth/login/",
            {"username": "staff-user", "password": "good-password"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("sessionid", response.cookies)

    @unittest.skip("pending #38: /api/v2/auth/login/ endpoint")
    def test_login_with_bad_credentials_returns_401(self):
        response = self.client.post(
            "/api/v2/auth/login/",
            {"username": "staff-user", "password": "wrong-password"},
            format="json",
        )
        self.assertEqual(response.status_code, 401)

    @unittest.skip("pending #38: /api/v2/auth/csrf/ endpoint")
    def test_csrf_returns_csrftoken_cookie(self):
        response = self.client.get("/api/v2/auth/csrf/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("csrftoken", response.cookies)
