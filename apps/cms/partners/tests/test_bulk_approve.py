"""Tests for the "Approve for display" partner bulk action (#120)."""

from django.contrib.auth.models import Group
from django.test import TestCase
from django.urls import reverse

from editorial.choices import EditorialAction, EditorialSubject
from editorial.groups import SUBJECT_EDITORS
from editorial.tests.base import EditorialTestMixin
from partners.models import Collaborator, PublicDisplayStatus, Sponsor
from partners.wagtail_hooks import (
    DEFAULT_BULK_APPROVAL_NOTE,
    ApproveForDisplayBulkAction,
)


def bulk_url(model_name):
    return reverse(
        "wagtail_bulk_action",
        args=("partners", model_name, "approve_for_display"),
    )


class ExecuteActionTests(EditorialTestMixin, TestCase):
    def test_all_seeded_sponsors_approved_in_one_call(self):
        approved, _ = ApproveForDisplayBulkAction.execute_action(
            list(Sponsor.objects.all()), user=self.grantor
        )
        self.assertEqual(approved, 10)
        for sponsor in Sponsor.objects.all():
            self.assertEqual(
                sponsor.public_display_status, PublicDisplayStatus.APPROVED
            )
            self.assertTrue(sponsor.is_active)
            self.assertEqual(sponsor.reviewed_by, self.grantor)
            self.assertIsNotNone(sponsor.reviewed_at)
            self.assertTrue(sponsor.approval_notes.strip())

    def test_org_supporters_approved_and_unconsented_people_skipped(self):
        # The three individual supporters were seeded with consent_status
        # "pending" (flagged to the PM); the consent rule blocks approving
        # a person until consent is confirmed, so they are skipped rather
        # than force-approved. The three organizations flip cleanly.
        approved, _ = ApproveForDisplayBulkAction.execute_action(
            list(Collaborator.objects.all()), user=self.grantor
        )
        self.assertEqual(approved, 3)
        self.assertEqual(
            set(
                Collaborator.objects.filter(
                    public_display_status=PublicDisplayStatus.APPROVED
                ).values_list("partner_kind", flat=True)
            ),
            {"organization"},
        )

    def test_people_approve_once_consent_is_confirmed(self):
        Collaborator.objects.filter(partner_kind="person").update(
            consent_status="confirmed"
        )
        approved, _ = ApproveForDisplayBulkAction.execute_action(
            list(Collaborator.objects.all()), user=self.grantor
        )
        self.assertEqual(approved, 6)

    def test_existing_approval_notes_are_preserved(self):
        sponsor = Sponsor.objects.first()
        Sponsor.objects.filter(pk=sponsor.pk).update(
            approval_notes="Evidence: PM roster e-mail, 2026-08-01."
        )
        sponsor.refresh_from_db()
        ApproveForDisplayBulkAction.execute_action(
            [sponsor], user=self.grantor
        )
        sponsor.refresh_from_db()
        self.assertEqual(
            sponsor.approval_notes, "Evidence: PM roster e-mail, 2026-08-01."
        )

    def test_empty_notes_get_the_default_bulk_note(self):
        sponsor = Sponsor.objects.first()
        self.assertEqual(sponsor.approval_notes, "")
        ApproveForDisplayBulkAction.execute_action(
            [sponsor], user=self.grantor
        )
        sponsor.refresh_from_db()
        self.assertEqual(sponsor.approval_notes, DEFAULT_BULK_APPROVAL_NOTE)

    def test_record_failing_validation_is_skipped_not_forced(self):
        sponsor = Sponsor(
            partner_kind="organization",
            display_name="Waldaa Qorannoo",
            recognition_text_om="",  # approval requires OM recognition text
        )
        sponsor.save()
        approved, _ = ApproveForDisplayBulkAction.execute_action(
            [sponsor], user=self.grantor
        )
        self.assertEqual(approved, 0)
        sponsor.refresh_from_db()
        self.assertEqual(
            sponsor.public_display_status, PublicDisplayStatus.PENDING
        )
        self.assertFalse(sponsor.is_active)


class BulkActionViewTests(EditorialTestMixin, TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.editor.groups.add(Group.objects.get(name=SUBJECT_EDITORS))

    def setUp(self):
        self.client.force_login(self.editor)

    def grant_partner_edit(self):
        return self.assignment(
            subject=EditorialSubject.PARTNERS,
            geography=self.zone,
            action=EditorialAction.EDIT,
        )

    def sponsor_ids(self):
        return list(Sponsor.objects.values_list("pk", flat=True))

    def test_confirmation_page_renders_for_assigned_editor(self):
        self.grant_partner_edit()
        query = "&".join(f"id={pk}" for pk in self.sponsor_ids())
        response = self.client.get(f"{bulk_url('sponsor')}?{query}")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Approve for display")

    def test_post_approves_all_selected_sponsors(self):
        self.grant_partner_edit()
        query = "&".join(f"id={pk}" for pk in self.sponsor_ids())
        response = self.client.post(f"{bulk_url('sponsor')}?{query}")
        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            Sponsor.objects.filter(
                public_display_status=PublicDisplayStatus.APPROVED,
                is_active=True,
                reviewed_by=self.editor,
            ).count(),
            10,
        )

    def test_post_approves_selected_supporters_with_resolved_consent(self):
        self.grant_partner_edit()
        Collaborator.objects.filter(partner_kind="person").update(
            consent_status="confirmed"
        )
        ids = list(Collaborator.objects.values_list("pk", flat=True))
        query = "&".join(f"id={pk}" for pk in ids)
        response = self.client.post(f"{bulk_url('collaborator')}?{query}")
        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            Collaborator.objects.filter(
                public_display_status=PublicDisplayStatus.APPROVED
            ).count(),
            6,
        )

    def test_unassigned_editor_cannot_approve_anything(self):
        query = "&".join(f"id={pk}" for pk in self.sponsor_ids())
        response = self.client.post(f"{bulk_url('sponsor')}?{query}")
        self.assertIn(response.status_code, {200, 302, 403})
        self.assertFalse(
            Sponsor.objects.filter(
                public_display_status=PublicDisplayStatus.APPROVED
            ).exists()
        )

    def test_anonymous_user_is_redirected_to_login(self):
        self.client.logout()
        response = self.client.post(f"{bulk_url('sponsor')}?id=1")
        self.assertEqual(response.status_code, 302)
        self.assertIn("login", response["Location"])
        self.assertFalse(
            Sponsor.objects.filter(
                public_display_status=PublicDisplayStatus.APPROVED
            ).exists()
        )
