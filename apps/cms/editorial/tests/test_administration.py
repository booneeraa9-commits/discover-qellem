from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase
from django.utils import timezone
from wagtail.models import GroupCollectionPermission, GroupPagePermission

from editorial.choices import (
    EditorialAction,
    EditorialLanguage,
    EditorialRole,
    EditorialSubject,
)
from editorial.groups import (
    BASELINE_GROUPS,
    MANAGING_EDITORS,
    SYSTEM_ADMINISTRATORS,
)
from editorial.models import EditorialAssignment
from editorial.signals import ensure_baseline_cms_groups

from .base import EditorialTestMixin


class EditorialAssignmentFormTests(EditorialTestMixin, TestCase):
    def form_data(self):
        return {
            "user": self.editor.pk,
            "role": EditorialRole.SUBJECT_EDITOR,
            "subject": EditorialSubject.GEOGRAPHY,
            "geography": self.zone.pk,
            "language": EditorialLanguage.OROMO,
            "action": EditorialAction.EDIT,
            "starts_at": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ends_at": "",
            "is_active": "on",
            "reason": "Approved test assignment",
        }

    def test_new_assignment_records_authenticated_superuser_as_grantor(self):
        form_class = EditorialAssignment.snippet_viewset.get_form_class()
        form = form_class(data=self.form_data(), for_user=self.grantor)

        self.assertTrue(form.is_valid(), form.errors.as_json())
        assignment = form.save()
        self.assertEqual(assignment.granted_by, self.grantor)

    def test_system_administrator_group_member_can_grant_assignment(self):
        grantor = get_user_model().objects.create_user(
            "system-administrator", is_staff=True
        )
        grantor.groups.add(Group.objects.get(name=SYSTEM_ADMINISTRATORS))
        form_class = EditorialAssignment.snippet_viewset.get_form_class()
        form = form_class(data=self.form_data(), for_user=grantor)

        self.assertTrue(form.is_valid(), form.errors.as_json())
        self.assertEqual(form.save().granted_by, grantor)

    def test_ordinary_staff_user_cannot_grant_assignment(self):
        form_class = EditorialAssignment.snippet_viewset.get_form_class()
        form = form_class(data=self.form_data(), for_user=self.editor)

        self.assertFalse(form.is_valid())
        self.assertIn("Only a system administrator", form.non_field_errors()[0])

    def test_edit_does_not_replace_original_grantor(self):
        assignment = self.assignment()
        form_class = EditorialAssignment.snippet_viewset.get_form_class(for_update=True)
        data = self.form_data()
        data["reason"] = "Updated reason"
        form = form_class(
            data=data,
            instance=assignment,
            for_user=self.super_editor,
        )

        self.assertTrue(form.is_valid(), form.errors.as_json())
        self.assertEqual(form.save().granted_by, self.grantor)


class EditorialBootstrapTests(TestCase):
    @patch("editorial.signals.MigrationRecorder")
    def test_bootstrap_skips_when_initial_migration_is_not_applied(self, recorder):
        recorder.return_value.migration_qs.filter.return_value.exists.return_value = (
            False
        )
        Group.objects.filter(name=MANAGING_EDITORS).delete()

        ensure_baseline_cms_groups()

        self.assertFalse(Group.objects.filter(name=MANAGING_EDITORS).exists())

    def test_bootstrap_is_idempotent_and_attaches_broad_access(self):
        ensure_baseline_cms_groups()
        before_page_permissions = GroupPagePermission.objects.count()
        before_collection_permissions = GroupCollectionPermission.objects.count()

        ensure_baseline_cms_groups()

        self.assertTrue(
            set(BASELINE_GROUPS).issubset(
                set(Group.objects.values_list("name", flat=True))
            )
        )
        self.assertEqual(GroupPagePermission.objects.count(), before_page_permissions)
        self.assertEqual(
            GroupCollectionPermission.objects.count(),
            before_collection_permissions,
        )
        self.assertTrue(
            Group.objects.get(name=MANAGING_EDITORS)
            .permissions.filter(codename="access_admin")
            .exists()
        )
        self.assertTrue(
            Group.objects.get(name=SYSTEM_ADMINISTRATORS)
            .permissions.filter(
                content_type__app_label="editorial",
                codename="change_editorialassignment",
            )
            .exists()
        )
