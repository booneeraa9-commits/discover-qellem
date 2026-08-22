"""QA API contract tests (Sprint 4).

These encode the public API contract between the Wagtail v2 backend and the
Next.js frontend (issues #29 / #30). They are the QA gate: if one of these
fails, a backend PR must not merge.

Contract sources of truth:
- qa/CONTENT_FACTS.md (verified facts, 12 canonical woredas, 9 categories)
- qa/API_CONTRACT.md (endpoint/shape/filter/error contracts)

NOTE for reviewers — two decisions are encoded deliberately (see inline
comments):
1. People slug: the PM contract lists ``jaal-laggasaa-wagii-metta``; the seed
   and FE currently use ``jaal-laggasaa-wagii`` / ``jaal-laggasaa-wagii-meettaa``.
   This test asserts the PM's canonical list and will fail until the slug is
   reconciled (tracked in a content bug).
2. Sponsors/supporters are seeded ``pending`` + ``inactive`` by design, so the
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
    # PM contract slug. The current seed uses "jaal-laggasaa-wagii" and the
    # FE used "jaal-laggasaa-wagii-meettaa" — reconcile before merge.
    "jaal-laggasaa-wagii-metta",
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
