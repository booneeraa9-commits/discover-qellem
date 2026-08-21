from django.contrib.auth import get_user_model
from django.test import TestCase
from wagtail.snippets.models import get_snippet_models

from editorial.choices import (
    EditorialAction,
    EditorialLanguage,
    EditorialRole,
    EditorialSubject,
)
from editorial.models import EditorialAssignment
from places.models import Geography, GeographyAlias


class GeographySnippetAdminTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.superuser = get_user_model().objects.create_superuser(
            username="geography-admin",
            email="geography-admin@example.invalid",
            password="test-only-password",
        )
        EditorialAssignment.objects.create(
            user=cls.superuser,
            role=EditorialRole.SUBJECT_EDITOR,
            subject=EditorialSubject.GEOGRAPHY,
            geography=Geography.objects.get(slug="qellem-wallaggaa"),
            language=EditorialLanguage.BOTH,
            action=EditorialAction.VIEW,
            granted_by=cls.superuser,
            reason="Allow this administrator to verify geography snippets.",
        )

    def setUp(self):
        self.client.force_login(self.superuser)

    def test_models_are_registered_as_wagtail_snippets(self):
        snippet_models = get_snippet_models()

        self.assertIn(Geography, snippet_models)
        self.assertIn(GeographyAlias, snippet_models)

    def test_geography_admin_list_is_available(self):
        response = self.client.get("/admin/snippets/places/geography/")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Qellem Wallaggaa")

    def test_geography_alias_admin_list_is_available(self):
        response = self.client.get("/admin/snippets/places/geographyalias/")

        self.assertEqual(response.status_code, 200)
