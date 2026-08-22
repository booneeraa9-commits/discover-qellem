"""Anonymous access, serialization, and CORS tests for the public API."""

from pathlib import Path

from django.test import TestCase, override_settings

from home.models import HomePage
from places.models import Geography, GeographyProfilePage

PAGES_URL = "/api/v2/pages/"
IMAGES_URL = "/api/v2/images/"
DOCUMENTS_URL = "/api/v2/documents/"

FRONTEND_ORIGIN = "http://localhost:3000"


class ApiPageTreeMixin:
    """Reuse the seeded page tree plus one extra draft profile page."""

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.homepage = HomePage.objects.get()
        cls.dambi = Geography.objects.get(slug="dambi-doolloo")
        cls.sayyo = Geography.objects.get(slug="sayyoo")

        from places.testing import (
            create_test_woreda,
            geography_profile_kwargs,
            get_places_index,
        )

        cls.index = get_places_index()
        cls.dambi_page = GeographyProfilePage.objects.get(
            slug="dambi-doolloo", locale__language_code="om"
        )

        cls.draft_page = GeographyProfilePage(
            **geography_profile_kwargs(create_test_woreda(), live=False)
        )
        cls.index.add_child(instance=cls.draft_page)


class AnonymousPagesApiTests(ApiPageTreeMixin, TestCase):
    def test_anonymous_pages_listing_returns_ok(self):
        response = self.client.get(PAGES_URL)
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertGreaterEqual(payload["meta"]["total_count"], 3)
        titles = [item["title"] for item in payload["items"]]
        self.assertIn("Qellem Wallaggaa", titles)
        self.assertIn("Dambi Doolloo", titles)

    def test_homepage_detail_exposes_zone_profile_fields(self):
        response = self.client.get(f"{PAGES_URL}{self.homepage.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["geography_slug"], "qellem-wallaggaa")
        self.assertEqual(payload["geography_name"], "Qellem Wallaggaa")
        for field in (
            "introduction",
            "overview",
            "naming_summary",
            "history_summary",
            "culture_summary",
            "contribute_summary",
            "hero_image",
        ):
            self.assertIn(field, payload)

    def test_profile_page_detail_exposes_place_fields(self):
        response = self.client.get(f"{PAGES_URL}{self.dambi_page.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["geography_slug"], "dambi-doolloo")
        self.assertEqual(payload["geography_name"], "Dambi Doolloo")
        self.assertEqual(payload["geography_level"], "town")
        self.assertIn("Dambi Doolloo", payload["introduction"])
        for field in (
            "overview",
            "naming_origin",
            "history",
            "area_location",
            "featured_image",
        ):
            self.assertIn(field, payload)

    def test_profile_pages_can_be_filtered_by_type_with_fields(self):
        response = self.client.get(
            PAGES_URL,
            {
                "type": "places.GeographyProfilePage",
                "fields": "geography_slug,introduction",
            },
        )
        self.assertEqual(response.status_code, 200)
        items = response.json()["items"]
        # All 12 seeded woreda profiles are listed; check the town's entry.
        self.assertEqual(len(items), 12)
        by_slug = {item["geography_slug"]: item for item in items}
        self.assertIn("dambi-doolloo", by_slug)
        self.assertIn("Dambi Doolloo", by_slug["dambi-doolloo"]["introduction"])

    def test_unpublished_page_is_hidden_from_listing_and_detail(self):
        listing = self.client.get(
            PAGES_URL, {"type": "places.GeographyProfilePage"}
        )
        slugs = [item["meta"]["slug"] for item in listing.json()["items"]]
        self.assertNotIn(self.draft_page.slug, slugs)

        detail = self.client.get(f"{PAGES_URL}{self.draft_page.pk}/")
        self.assertEqual(detail.status_code, 404)


class AnonymousMediaApiTests(TestCase):
    def test_anonymous_images_listing_returns_ok(self):
        response = self.client.get(IMAGES_URL)
        self.assertEqual(response.status_code, 200)
        self.assertIn("items", response.json())

    def test_anonymous_documents_listing_returns_ok(self):
        response = self.client.get(DOCUMENTS_URL)
        self.assertEqual(response.status_code, 200)
        self.assertIn("items", response.json())


class ApiCorsTests(ApiPageTreeMixin, TestCase):
    def test_allowed_frontend_origin_receives_cors_header(self):
        response = self.client.get(PAGES_URL, HTTP_ORIGIN=FRONTEND_ORIGIN)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.headers.get("Access-Control-Allow-Origin"),
            FRONTEND_ORIGIN,
        )

    def test_unknown_origin_receives_no_cors_header(self):
        response = self.client.get(
            PAGES_URL, HTTP_ORIGIN="https://unknown.example"
        )
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("Access-Control-Allow-Origin", response.headers)

    def test_non_api_routes_receive_no_cors_header(self):
        response = self.client.get("/search/", HTTP_ORIGIN=FRONTEND_ORIGIN)
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("Access-Control-Allow-Origin", response.headers)

    @override_settings(CORS_ALLOWED_ORIGINS=[])
    def test_disabled_gate_serves_no_cors_header(self):
        response = self.client.get(PAGES_URL, HTTP_ORIGIN=FRONTEND_ORIGIN)
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("Access-Control-Allow-Origin", response.headers)


class ProductionCorsSafetyTests(TestCase):
    def test_base_settings_never_install_corsheaders(self):
        from qellem_cms.settings import base

        self.assertNotIn("corsheaders", base.INSTALLED_APPS)
        self.assertNotIn(
            "corsheaders.middleware.CorsMiddleware", base.MIDDLEWARE
        )

    def test_production_settings_never_reference_corsheaders(self):
        production_path = (
            Path(__file__).resolve().parent.parent / "settings" / "production.py"
        )
        self.assertNotIn("corsheaders", production_path.read_text())
