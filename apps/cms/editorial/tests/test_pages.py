from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied
from django.test import RequestFactory, TestCase
from django.urls import resolve, reverse

from editorial.choices import (
    EditorialAction,
    EditorialLanguage,
    EditorialRole,
    EditorialSubject,
)
from editorial.groups import SUBJECT_EDITORS
from editorial.middleware import EditorialScopeMiddleware
from editorial.wagtail_hooks import (
    enforce_bulk_action_scope,
    enforce_page_create_scope,
    enforce_page_edit_scope,
)
from home.models import HomePage
from places.models import GeographyIndexPage, GeographyProfilePage

from .base import EditorialTestMixin


class ScopedPageAccessTests(EditorialTestMixin, TestCase):
    @classmethod
    def assignment(cls, **overrides):
        overrides.setdefault("language", EditorialLanguage.OROMO)
        return super().assignment(**overrides)

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.editor.groups.add(Group.objects.get(name=SUBJECT_EDITORS))
        cls.homepage = HomePage.objects.get()
        cls.index = GeographyIndexPage.objects.get(
            slug="places", locale__language_code="om"
        )
        cls.dambi_page = GeographyProfilePage.objects.get(
            slug="dambi-doolloo", locale__language_code="om"
        )
        cls.sayyo_page = GeographyProfilePage.objects.get(
            slug="sayyoo", locale__language_code="om"
        )

    @classmethod
    def make_profile(cls, geography):
        from places.testing import geography_profile_kwargs

        page = GeographyProfilePage(**geography_profile_kwargs(geography))
        cls.index.add_child(instance=page)
        return page

    def setUp(self):
        self.client.force_login(self.editor)

    def test_explorer_only_lists_authorized_child_page(self):
        self.assignment(action=EditorialAction.VIEW)

        response = self.client.get(
            reverse("wagtailadmin_explore", args=[self.index.pk])
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Dambi Doolloo")
        self.assertNotContains(response, "Sayyoo")

    def test_page_chooser_only_lists_authorized_child_page(self):
        self.assignment(action=EditorialAction.VIEW)

        response = self.client.get(
            reverse("wagtailadmin_choose_page_child", args=[self.index.pk])
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Dambi Doolloo")
        self.assertNotContains(response, "Sayyoo")

    def test_direct_edit_requires_instance_scope(self):
        self.assignment(action=EditorialAction.EDIT)

        allowed = self.client.get(
            reverse("wagtailadmin_pages:edit", args=[self.dambi_page.pk])
        )
        denied = self.client.get(
            reverse("wagtailadmin_pages:edit", args=[self.sayyo_page.pk])
        )

        self.assertEqual(allowed.status_code, 200)
        self.assertIn(denied.status_code, {302, 403, 404})

    def test_staff_group_membership_without_assignment_cannot_edit(self):
        response = self.client.get(
            reverse("wagtailadmin_pages:edit", args=[self.dambi_page.pk])
        )

        self.assertIn(response.status_code, {302, 403, 404})

    def test_direct_draft_preview_revision_and_workflow_routes_require_view_scope(
        self,
    ):
        revision = self.dambi_page.save_revision(user=self.grantor)
        urls = [
            reverse("wagtailadmin_pages:view_draft", args=[self.dambi_page.pk]),
            reverse("wagtailadmin_pages:preview_on_edit", args=[self.dambi_page.pk]),
            reverse(
                "wagtailadmin_pages:revisions_view",
                args=[self.dambi_page.pk, revision.pk],
            ),
            reverse(
                "wagtailadmin_pages:revisions_compare",
                args=[self.dambi_page.pk, revision.pk, revision.pk],
            ),
            reverse(
                "wagtailadmin_pages:workflow_preview",
                args=[self.dambi_page.pk, 999],
            ),
            reverse(
                "wagtailadmin_pages:workflow_history",
                args=[self.dambi_page.pk],
            ),
            reverse(
                "wagtailadmin_pages:workflow_history_detail",
                args=[self.dambi_page.pk, 999],
            ),
        ]
        middleware = EditorialScopeMiddleware(lambda request: None)

        for url in urls:
            with self.subTest(url=url):
                request = RequestFactory().get(url)
                request.user = self.editor
                request.resolver_match = resolve(url)
                with self.assertRaises(PermissionDenied):
                    middleware.process_view(
                        request,
                        object(),
                        request.resolver_match.args,
                        request.resolver_match.kwargs,
                    )

        self.assignment(action=EditorialAction.VIEW)
        for url in urls:
            with self.subTest(url=url):
                request = RequestFactory().get(url)
                request.user = self.editor
                request.resolver_match = resolve(url)
                self.assertIsNone(
                    middleware.process_view(
                        request,
                        object(),
                        request.resolver_match.args,
                        request.resolver_match.kwargs,
                    )
                )


class PageActionEnforcementTests(EditorialTestMixin, TestCase):
    @classmethod
    def assignment(cls, **overrides):
        overrides.setdefault("language", EditorialLanguage.OROMO)
        return super().assignment(**overrides)

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.homepage = HomePage.objects.get()
        cls.index = GeographyIndexPage.objects.get(
            slug="places", locale__language_code="om"
        )
        cls.profile = GeographyProfilePage.objects.get(
            slug="dambi-doolloo", locale__language_code="om"
        )

    def request(self, data=None):
        request = RequestFactory().post("/admin/pages/action/", data or {})
        request.user = self.editor
        return request

    def test_page_create_checks_selected_target_geography(self):
        self.assignment(
            subject=EditorialSubject.GEOGRAPHY,
            geography=self.dambi,
            action=EditorialAction.CREATE,
        )
        get_request = RequestFactory().get("/admin/pages/add/")
        get_request.user = self.editor
        enforce_page_create_scope(
            get_request,
            self.index,
            GeographyProfilePage,
        )

        denied_request = RequestFactory().post(
            "/admin/pages/add/",
            {"geography": self.sayyo.pk},
        )
        denied_request.user = self.editor
        with self.assertRaises(PermissionDenied):
            enforce_page_create_scope(
                denied_request,
                self.index,
                GeographyProfilePage,
            )

        allowed_request = RequestFactory().post(
            "/admin/pages/add/",
            {"geography": self.dambi.pk},
        )
        allowed_request.user = self.editor
        enforce_page_create_scope(
            allowed_request,
            self.index,
            GeographyProfilePage,
        )

    def test_submit_button_requires_separate_submit_assignment(self):
        self.assignment(
            subject=EditorialSubject.HOME_ZONE,
            geography=self.zone,
            action=EditorialAction.EDIT,
        )
        request = self.request({"action-submit": "Submit"})

        with self.assertRaises(PermissionDenied):
            enforce_page_edit_scope(request, self.homepage)

        self.assignment(
            subject=EditorialSubject.HOME_ZONE,
            geography=self.zone,
            action=EditorialAction.SUBMIT,
        )
        enforce_page_edit_scope(request, self.homepage)

    def test_publish_button_requires_explicit_managing_editor_assignment(self):
        self.assignment(
            subject=EditorialSubject.HOME_ZONE,
            geography=self.zone,
            action=EditorialAction.EDIT,
        )
        request = self.request({"action-publish": "Publish"})

        with self.assertRaises(PermissionDenied):
            enforce_page_edit_scope(request, self.homepage)

        self.assignment(
            role=EditorialRole.MANAGING_EDITOR,
            subject=EditorialSubject.HOME_ZONE,
            geography=self.zone,
            action=EditorialAction.PUBLISH,
        )
        enforce_page_edit_scope(request, self.homepage)

    def test_workflow_approve_field_requires_approve_assignment(self):
        self.assignment(
            subject=EditorialSubject.HOME_ZONE,
            geography=self.zone,
            action=EditorialAction.EDIT,
        )
        request = self.request(
            {
                "action-workflow-action": "true",
                "workflow-action-name": "approve",
            }
        )

        with self.assertRaises(PermissionDenied):
            enforce_page_edit_scope(request, self.homepage)

        self.assignment(
            role=EditorialRole.MANAGING_EDITOR,
            subject=EditorialSubject.HOME_ZONE,
            geography=self.zone,
            action=EditorialAction.APPROVE,
        )
        enforce_page_edit_scope(request, self.homepage)

    def test_bulk_action_names_map_to_required_editorial_actions(self):
        action_map = {
            "move": EditorialAction.EDIT,
            "publish": EditorialAction.PUBLISH,
            "unpublish": EditorialAction.ARCHIVE,
            "delete": EditorialAction.ARCHIVE,
        }
        for action_type, action in action_map.items():
            with self.subTest(action_type=action_type):
                with self.assertRaises(PermissionDenied):
                    enforce_bulk_action_scope(
                        self.request(),
                        action_type,
                        [self.homepage],
                        object(),
                    )
                role = (
                    EditorialRole.MANAGING_EDITOR
                    if action == EditorialAction.PUBLISH
                    else EditorialRole.SUBJECT_EDITOR
                )
                assignment = self.assignment(
                    role=role,
                    subject=EditorialSubject.HOME_ZONE,
                    geography=self.zone,
                    action=action,
                )
                enforce_bulk_action_scope(
                    self.request(),
                    action_type,
                    [self.homepage],
                    object(),
                )
                assignment.delete()

    def test_bulk_publish_descendants_are_checked(self):
        self.assignment(
            role=EditorialRole.MANAGING_EDITOR,
            subject=EditorialSubject.HOME_ZONE,
            geography=self.zone,
            action=EditorialAction.PUBLISH,
        )

        enforce_bulk_action_scope(
            self.request(),
            "publish",
            [self.homepage],
            object(),
        )
        with self.assertRaises(PermissionDenied):
            enforce_bulk_action_scope(
                self.request({"include_descendants": "on"}),
                "publish",
                [self.homepage],
                object(),
            )

    def test_unknown_page_bulk_action_is_denied(self):
        with self.assertRaises(PermissionDenied):
            enforce_bulk_action_scope(
                self.request(),
                "unsupported-action",
                [self.homepage],
                object(),
            )

    def test_workflow_middleware_maps_approve_and_review_actions(self):
        middleware = EditorialScopeMiddleware(lambda request: None)
        approve_urls = [
            reverse(
                "wagtailadmin_pages:workflow_action",
                args=[self.homepage.pk, "approve", 999],
            ),
            reverse(
                "wagtailadmin_pages:collect_workflow_action_data",
                args=[self.homepage.pk, "approve", 999],
            ),
        ]
        review_urls = [
            reverse(
                "wagtailadmin_pages:workflow_action",
                args=[self.homepage.pk, "reject", 999],
            ),
            reverse(
                "wagtailadmin_pages:confirm_workflow_cancellation",
                args=[self.homepage.pk],
            ),
        ]

        for url in approve_urls + review_urls:
            request = RequestFactory().get(url)
            request.user = self.editor
            request.resolver_match = resolve(url)
            with self.assertRaises(PermissionDenied):
                middleware.process_view(
                    request,
                    object(),
                    request.resolver_match.args,
                    request.resolver_match.kwargs,
                )

        self.assignment(
            role=EditorialRole.MANAGING_EDITOR,
            subject=EditorialSubject.HOME_ZONE,
            geography=self.zone,
            action=EditorialAction.APPROVE,
        )
        self.assignment(
            role=EditorialRole.MANAGING_EDITOR,
            subject=EditorialSubject.HOME_ZONE,
            geography=self.zone,
            action=EditorialAction.REVIEW,
        )
        for url in approve_urls + review_urls:
            request = RequestFactory().get(url)
            request.user = self.editor
            request.resolver_match = resolve(url)
            self.assertIsNone(
                middleware.process_view(
                    request,
                    object(),
                    request.resolver_match.args,
                    request.resolver_match.kwargs,
                )
            )
