from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied
from django.test import RequestFactory, TestCase
from django.urls import reverse
from wagtail.documents import get_document_model
from wagtail.images import get_image_model

from editorial.choices import EditorialAction, EditorialRole, EditorialSubject
from editorial.groups import MEDIA_MANAGERS
from editorial.wagtail_hooks import enforce_bulk_action_scope

from .base import EditorialTestMixin


class MediaRouteAccessTests(EditorialTestMixin, TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.editor.groups.add(Group.objects.get(name=MEDIA_MANAGERS))

    def setUp(self):
        self.client.force_login(self.editor)

    def media_assignment(self, action):
        return self.assignment(
            role=EditorialRole.MEDIA_MANAGER,
            subject=EditorialSubject.MEDIA,
            geography=self.zone,
            action=action,
        )

    def test_image_routes_require_manage_media_scope(self):
        urls = [
            reverse("wagtailimages:index"),
            reverse("wagtailimages:add"),
            reverse("wagtailimages:edit", args=[999]),
            reverse("wagtailimages:delete", args=[999]),
        ]

        for url in urls:
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 403)

        self.media_assignment(EditorialAction.MANAGE_MEDIA)
        self.assertEqual(self.client.get(urls[0]).status_code, 200)
        self.assertEqual(self.client.get(urls[1]).status_code, 200)
        self.assertEqual(self.client.get(urls[2]).status_code, 404)
        self.assertEqual(self.client.get(urls[3]).status_code, 404)

    def test_document_routes_require_manage_media_scope(self):
        urls = [
            reverse("wagtaildocs:index"),
            reverse("wagtaildocs:add"),
            reverse("wagtaildocs:edit", args=[999]),
            reverse("wagtaildocs:delete", args=[999]),
        ]

        for url in urls:
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 403)

        self.media_assignment(EditorialAction.MANAGE_MEDIA)
        self.assertEqual(self.client.get(urls[0]).status_code, 200)
        self.assertEqual(self.client.get(urls[1]).status_code, 200)
        self.assertEqual(self.client.get(urls[2]).status_code, 404)
        self.assertEqual(self.client.get(urls[3]).status_code, 404)

    def test_image_and_document_choosers_require_view_not_manage_scope(self):
        chooser_urls = [
            reverse("wagtailimages_chooser:choose"),
            reverse("wagtaildocs_chooser:choose"),
        ]

        for url in chooser_urls:
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 403)

        manage_assignment = self.media_assignment(EditorialAction.MANAGE_MEDIA)
        for url in chooser_urls:
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 403)

        manage_assignment.delete()
        self.media_assignment(EditorialAction.VIEW)
        for url in chooser_urls:
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 200)


class MediaBulkActionTests(EditorialTestMixin, TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.image = get_image_model()(title="Test image")
        cls.document = get_document_model()(title="Test document")

    def request(self):
        request = RequestFactory().post("/admin/media/bulk/")
        request.user = self.editor
        return request

    def media_assignment(self):
        return self.assignment(
            role=EditorialRole.MEDIA_MANAGER,
            subject=EditorialSubject.MEDIA,
            geography=self.zone,
            action=EditorialAction.MANAGE_MEDIA,
        )

    def test_image_and_document_bulk_actions_require_manage_media(self):
        objects = [self.image, self.document]
        action_types = ["delete", "add_tags", "add_to_collection"]

        for action_type in action_types:
            with (
                self.subTest(action_type=action_type),
                self.assertRaises(PermissionDenied),
            ):
                enforce_bulk_action_scope(
                    self.request(),
                    action_type,
                    objects,
                    object(),
                )

        self.media_assignment()
        for action_type in action_types:
            with self.subTest(action_type=action_type):
                enforce_bulk_action_scope(
                    self.request(),
                    action_type,
                    objects,
                    object(),
                )

    def test_unknown_media_bulk_action_is_denied(self):
        self.media_assignment()

        with self.assertRaises(PermissionDenied):
            enforce_bulk_action_scope(
                self.request(),
                "unsupported-action",
                [self.image, self.document],
                object(),
            )
