from django.contrib.auth.models import Group
from django.test import TestCase
from django.urls import reverse

from editorial.admin_permissions import ScopedSnippetPermissionPolicy
from editorial.choices import EditorialAction
from editorial.groups import SUBJECT_EDITORS
from places.models import Geography

from .base import EditorialTestMixin


class ScopedSnippetAccessTests(EditorialTestMixin, TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.editor.groups.add(Group.objects.get(name=SUBJECT_EDITORS))

    def setUp(self):
        self.client.force_login(self.editor)

    def test_generic_snippet_index_is_denied_even_with_scoped_access(self):
        self.assignment(action=EditorialAction.VIEW)

        response = self.client.get(reverse("wagtailsnippets:index"))

        self.assertEqual(response.status_code, 403)

    def test_model_index_requires_an_assignment(self):
        response = self.client.get(reverse("wagtailsnippets_places_geography:list"))

        self.assertIn(response.status_code, {302, 403, 404})

    def test_model_index_only_lists_authorized_geography(self):
        self.assignment(action=EditorialAction.VIEW)

        response = self.client.get(reverse("wagtailsnippets_places_geography:list"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Dambi Doolloo")
        self.assertNotContains(response, "Sayyoo")
        self.assertNotContains(response, "Qellem Wallaggaa")

    def test_direct_edit_rejects_an_unassigned_instance(self):
        self.assignment(action=EditorialAction.EDIT)

        allowed = self.client.get(
            reverse(
                "wagtailsnippets_places_geography:edit",
                args=[self.dambi.pk],
            )
        )
        denied = self.client.get(
            reverse(
                "wagtailsnippets_places_geography:edit",
                args=[self.sayyo.pk],
            )
        )

        self.assertEqual(allowed.status_code, 200)
        self.assertIn(denied.status_code, {302, 403, 404})

    def test_create_post_requires_scope_for_selected_parent(self):
        self.assignment(action=EditorialAction.CREATE)
        url = reverse("wagtailsnippets_places_geography:add")
        data = {
            "canonical_name": "Test Woreda",
            "slug": "test-woreda",
            "level": "woreda",
            "parent": self.zone.pk,
            "status": "active",
            "display_order": 99,
            "administrative_notes": "",
        }

        lower_scope = self.client.post(url, data)
        self.assertFalse(Geography.objects.filter(slug="test-woreda").exists())
        self.assignment(
            geography=self.zone,
            action=EditorialAction.CREATE,
        )
        zone_scope = self.client.post(url, data)

        self.assertIn(lower_scope.status_code, {302, 403, 404})
        self.assertEqual(zone_scope.status_code, 302)
        self.assertTrue(Geography.objects.filter(slug="test-woreda").exists())

    def test_chooser_listing_and_search_results_are_filtered(self):
        self.assignment(action=EditorialAction.VIEW)

        choose = self.client.get(
            reverse("wagtailsnippetchoosers_places_geography:choose")
        )
        search = self.client.get(
            reverse("wagtailsnippetchoosers_places_geography:choose_results"),
            {"q": "a"},
        )

        for response in (choose, search):
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, "Dambi Doolloo")
            self.assertNotContains(response, "Sayyoo")
            self.assertNotContains(response, "Qellem Wallaggaa")

    def test_chooser_chosen_endpoint_rejects_unassigned_instance(self):
        self.assignment(action=EditorialAction.VIEW)

        allowed = self.client.get(
            reverse(
                "wagtailsnippetchoosers_places_geography:chosen",
                args=[self.dambi.pk],
            )
        )
        denied = self.client.get(
            reverse(
                "wagtailsnippetchoosers_places_geography:chosen",
                args=[self.sayyo.pk],
            )
        )

        self.assertEqual(allowed.status_code, 200)
        self.assertIn(denied.status_code, {302, 403, 404})

    def test_chooser_multiple_endpoint_omits_unassigned_instances(self):
        self.assignment(action=EditorialAction.VIEW)

        response = self.client.get(
            reverse("wagtailsnippetchoosers_places_geography:chosen_multiple"),
            {"id": [self.dambi.pk, self.sayyo.pk]},
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Dambi Doolloo")
        self.assertNotContains(response, "Sayyoo")

    def test_unconfigured_chooser_create_endpoint_is_denied(self):
        self.assignment(
            geography=self.zone,
            action=EditorialAction.CREATE,
        )
        url = reverse("wagtailsnippetchoosers_places_geography:create")

        get_response = self.client.get(url)
        post_response = self.client.post(url, {})

        self.assertIn(get_response.status_code, {302, 403, 404})
        self.assertIn(post_response.status_code, {302, 403, 404})

    def test_policy_user_queryset_honors_assignment_dates(self):
        self.assignment(action=EditorialAction.VIEW)
        policy = ScopedSnippetPermissionPolicy(Geography)

        permitted_users = policy.users_with_any_permission(["view"])

        self.assertIn(self.editor, permitted_users)
        self.assertNotIn(self.super_editor, permitted_users)

    def test_main_menu_replaces_generic_snippets_with_direct_model_link(self):
        self.assignment(action=EditorialAction.VIEW)

        response = self.client.get(reverse("wagtailadmin_home"))
        content = response.content.decode()

        self.assertEqual(response.status_code, 200)
        self.assertNotIn(
            f'href="{reverse("wagtailsnippets:index")}"',
            content,
        )
        self.assertIn(
            reverse("wagtailsnippets_places_geography:list"),
            content,
        )
