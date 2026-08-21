from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied, ValidationError
from django.test import TestCase
from django.utils import timezone

from editorial.choices import (
    EditorialAction,
    EditorialLanguage,
    EditorialRole,
    EditorialSubject,
)
from editorial.policy import EditorialTarget, editorial_policy
from places.models import Geography, GeographyLevel

from .base import EditorialTestMixin


class EditorialPolicyTests(EditorialTestMixin, TestCase):
    def target(
        self,
        *,
        subject=EditorialSubject.GEOGRAPHY,
        geography=None,
        language=EditorialLanguage.BOTH,
    ):
        return EditorialTarget(subject, (geography or self.dambi).pk, language)

    def test_staff_user_without_assignment_is_denied(self):
        self.assertFalse(
            editorial_policy.can(self.editor, EditorialAction.VIEW, self.target())
        )

    def test_superuser_has_no_implicit_editorial_authority(self):
        self.assertFalse(
            editorial_policy.can(self.super_editor, EditorialAction.VIEW, self.target())
        )

    def test_inactive_and_nonstaff_users_are_denied(self):
        inactive = get_user_model().objects.create_user(
            username="inactive-editor",
            is_staff=True,
            is_active=False,
        )
        nonstaff = get_user_model().objects.create_user(username="nonstaff-editor")
        for user in (inactive, nonstaff):
            with self.subTest(user=user.username):
                self.assertFalse(
                    editorial_policy.can(user, EditorialAction.VIEW, self.target())
                )

    def test_exact_assignment_allows_compatible_action(self):
        self.assignment()

        self.assertTrue(
            editorial_policy.can(self.editor, EditorialAction.VIEW, self.target())
        )

    def test_subject_action_and_language_must_match_exactly(self):
        self.assignment(language=EditorialLanguage.OROMO)

        self.assertTrue(
            editorial_policy.can(
                self.editor,
                EditorialAction.VIEW,
                self.target(language=EditorialLanguage.OROMO),
            )
        )
        self.assertFalse(
            editorial_policy.can(
                self.editor,
                EditorialAction.EDIT,
                self.target(language=EditorialLanguage.OROMO),
            )
        )
        self.assertFalse(
            editorial_policy.can(
                self.editor,
                EditorialAction.VIEW,
                self.target(
                    subject=EditorialSubject.PEOPLE,
                    language=EditorialLanguage.OROMO,
                ),
            )
        )
        self.assertFalse(
            editorial_policy.can(
                self.editor,
                EditorialAction.VIEW,
                self.target(language=EditorialLanguage.ENGLISH),
            )
        )

    def test_both_language_assignment_does_not_cover_single_language_content(self):
        self.assignment(language=EditorialLanguage.BOTH)

        self.assertFalse(
            editorial_policy.can(
                self.editor,
                EditorialAction.VIEW,
                self.target(language=EditorialLanguage.OROMO),
            )
        )
        self.assertFalse(
            editorial_policy.can(
                self.editor,
                EditorialAction.VIEW,
                self.target(language=EditorialLanguage.ENGLISH),
            )
        )

    def test_single_language_assignment_does_not_cover_neutral_record(self):
        self.assignment(language=EditorialLanguage.OROMO)

        self.assertFalse(
            editorial_policy.can(self.editor, EditorialAction.VIEW, self.target())
        )

    def test_zone_assignment_covers_its_direct_descendants(self):
        self.assignment(geography=self.zone)

        for geography in (self.zone, self.dambi, self.sayyo):
            with self.subTest(geography=geography.slug):
                self.assertTrue(
                    editorial_policy.can(
                        self.editor,
                        EditorialAction.VIEW,
                        self.target(geography=geography),
                    )
                )

    def test_lower_geography_does_not_cover_zone_or_sibling(self):
        self.assignment(geography=self.dambi)

        self.assertFalse(
            editorial_policy.can(
                self.editor,
                EditorialAction.VIEW,
                self.target(geography=self.zone),
            )
        )
        self.assertFalse(
            editorial_policy.can(
                self.editor,
                EditorialAction.VIEW,
                self.target(geography=self.sayyo),
            )
        )

    def test_unrelated_zone_assignment_does_not_cover_qellem_target(self):
        other_zone = Geography.objects.create(
            canonical_name="Other Test Zone",
            slug="other-test-zone",
            level=GeographyLevel.ZONE,
            display_order=99,
        )
        self.assignment(geography=other_zone)

        self.assertFalse(
            editorial_policy.can(self.editor, EditorialAction.VIEW, self.target())
        )

    def test_future_expired_and_revoked_assignments_are_denied(self):
        now = timezone.now()
        scenarios = (
            {"starts_at": now + timedelta(days=1)},
            {
                "starts_at": now - timedelta(days=2),
                "ends_at": now - timedelta(days=1),
            },
            {"is_active": False},
        )
        for index, assignment_kwargs in enumerate(scenarios):
            with self.subTest(index=index):
                assignment = self.assignment(**assignment_kwargs)
                self.assertFalse(
                    editorial_policy.can(
                        self.editor,
                        EditorialAction.VIEW,
                        self.target(),
                    )
                )
                assignment.delete()

    def test_managing_editor_requires_explicit_publish_assignment(self):
        self.assignment(
            user=self.super_editor,
            role=EditorialRole.MANAGING_EDITOR,
            action=EditorialAction.VIEW,
        )

        self.assertFalse(
            editorial_policy.can(
                self.super_editor,
                EditorialAction.PUBLISH,
                self.target(),
            )
        )
        self.assignment(
            user=self.super_editor,
            role=EditorialRole.MANAGING_EDITOR,
            action=EditorialAction.PUBLISH,
        )
        self.assertTrue(
            editorial_policy.can(
                self.super_editor,
                EditorialAction.PUBLISH,
                self.target(),
            )
        )

    def test_system_administrator_group_is_not_editorial_authority(self):
        from django.contrib.auth.models import Group

        from editorial.groups import SYSTEM_ADMINISTRATORS

        self.editor.groups.add(Group.objects.get(name=SYSTEM_ADMINISTRATORS))

        self.assertFalse(
            editorial_policy.can(self.editor, EditorialAction.VIEW, self.target())
        )

    def test_require_raises_permission_denied(self):
        with self.assertRaises(PermissionDenied):
            editorial_policy.require(
                self.editor,
                EditorialAction.VIEW,
                self.target(),
            )

    def test_assignment_rejects_incompatible_role_action(self):
        with self.assertRaises(ValidationError):
            self.assignment(
                role=EditorialRole.SUBJECT_EDITOR,
                action=EditorialAction.PUBLISH,
            )

    def test_assignment_rejects_invalid_dates_and_nonstaff_user(self):
        now = timezone.now()
        with self.assertRaises(ValidationError):
            self.assignment(
                starts_at=now,
                ends_at=now,
            )

        nonstaff = get_user_model().objects.create_user(username="invalid-grantee")
        with self.assertRaises(ValidationError):
            self.assignment(user=nonstaff)

    def test_assignment_grantor_cannot_be_changed(self):
        assignment = self.assignment()
        replacement = get_user_model().objects.create_superuser(
            username="replacement-grantor",
            email="replacement@example.invalid",
            password="test-only-password",
        )
        assignment.granted_by = replacement

        with self.assertRaises(ValidationError):
            assignment.save()
