from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import TestCase
from editorial.choices import (
    EditorialAction,
    EditorialLanguage,
    EditorialRole,
    EditorialSubject,
)
from editorial.models import EditorialAssignment
from places.models import Geography
from wagtail.snippets.models import get_snippet_models

from provenance.choices import SourceDocumentType, SourceSubject
from provenance.models import MediaRights, SourceCitation, SourceRecord


class ProvenanceAdminPrivacyTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.superuser = get_user_model().objects.create_superuser(
            username="provenance-admin",
            email="provenance-admin@example.invalid",
            password="test-only-password",
        )
        cls.staff_without_source_access = get_user_model().objects.create_user(
            username="ordinary-staff",
            is_staff=True,
        )
        cls.source_staff = get_user_model().objects.create_user(
            username="source-cataloguer",
            is_staff=True,
        )
        access_admin = Permission.objects.get(
            content_type__app_label="wagtailadmin",
            codename="access_admin",
        )
        cls.staff_without_source_access.user_permissions.add(access_admin)
        cls.source_staff.user_permissions.add(
            access_admin,
            Permission.objects.get(
                content_type__app_label="provenance",
                codename="view_sourcerecord",
            ),
            Permission.objects.get(
                content_type__app_label="provenance",
                codename="add_sourcerecord",
            ),
        )
        cls.source = SourceRecord.objects.create(
            source_id="SRC-099",
            title="Private source title",
            issuing_organization="Qellem Wallaggaa Zone Administration",
            document_type=SourceDocumentType.REPORT,
            subject=SourceSubject.MIXED,
            private_description="NEVER-PUBLIC-PRIVATE-SOURCE-DESCRIPTION",
        )
        zone = Geography.objects.get(slug="qellem-wallaggaa")
        EditorialAssignment.objects.create(
            user=cls.source_staff,
            role=EditorialRole.SUBJECT_EDITOR,
            subject=EditorialSubject.SOURCES,
            geography=zone,
            language=EditorialLanguage.OROMO,
            action=EditorialAction.VIEW,
            granted_by=cls.superuser,
            reason="Allow this cataloguer to view Afaan Oromoo source records.",
        )
        for subject, language, action in (
            (
                EditorialSubject.SOURCES,
                EditorialLanguage.OROMO,
                EditorialAction.VIEW,
            ),
            (
                EditorialSubject.SOURCES,
                EditorialLanguage.BOTH,
                EditorialAction.VIEW,
            ),
            (
                EditorialSubject.MEDIA,
                EditorialLanguage.BOTH,
                EditorialAction.MANAGE_MEDIA,
            ),
        ):
            EditorialAssignment.objects.create(
                user=cls.superuser,
                role=EditorialRole.MANAGING_EDITOR,
                subject=subject,
                geography=zone,
                language=language,
                action=action,
                granted_by=cls.superuser,
                reason="Explicit scope for the provenance administrator test.",
            )

    def test_provenance_models_are_registered_as_wagtail_snippets(self):
        snippet_models = get_snippet_models()

        self.assertIn(SourceRecord, snippet_models)
        self.assertIn(SourceCitation, snippet_models)
        self.assertIn(MediaRights, snippet_models)

    def test_anonymous_user_cannot_access_private_source_admin(self):
        response = self.client.get("/admin/snippets/provenance/sourcerecord/")

        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin/login/", response.url)

    def test_staff_without_source_permission_cannot_access_private_sources(self):
        self.client.force_login(self.staff_without_source_access)

        response = self.client.get("/admin/snippets/provenance/sourcerecord/")

        self.assertNotEqual(response.status_code, 200)

    def test_source_permission_grants_private_source_list_access(self):
        self.client.force_login(self.source_staff)

        response = self.client.get("/admin/snippets/provenance/sourcerecord/")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "SRC-099")
        self.assertContains(response, "Private source title")

    def test_source_permissions_do_not_grant_document_upload_access(self):
        self.client.force_login(self.source_staff)

        self.assertFalse(self.source_staff.has_perm("wagtaildocs.add_document"))
        response = self.client.get("/admin/documents/add/")

        self.assertNotEqual(response.status_code, 200)

    def test_superuser_with_explicit_scope_can_access_all_provenance_admin_lists(self):
        self.client.force_login(self.superuser)

        for url in (
            "/admin/snippets/provenance/sourcerecord/",
            "/admin/snippets/provenance/sourcecitation/",
            "/admin/snippets/provenance/mediarights/",
        ):
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 200)

    def test_private_source_metadata_is_not_rendered_on_public_homepage(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertNotContains(
            response,
            "NEVER-PUBLIC-PRIVATE-SOURCE-DESCRIPTION",
        )
