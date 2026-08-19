from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone

from partners.models import (
    Collaborator,
    ConsentStatus,
    PartnerDisplayMode,
    PartnerKind,
    PublicDisplayStatus,
    Sponsor,
)
from partners.services import partner_is_approved_for_public_display


class SponsorApprovalTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.reviewer = get_user_model().objects.create_user(username="partner-reviewer")

    def sponsor_data(self, **overrides):
        data = {
            "partner_kind": PartnerKind.ORGANIZATION,
            "display_name": "Qellem Development Partner",
            "display_mode": PartnerDisplayMode.NAME_ONLY,
        }
        data.update(overrides)
        return data

    def approved_data(self, **overrides):
        data = self.sponsor_data(
            recognition_text_om="Deeggarsa isaanii ni galateeffanna.",
            public_display_status=PublicDisplayStatus.APPROVED,
            reviewed_by=self.reviewer,
            reviewed_at=timezone.now(),
            approval_notes="Public name recognition approved from supplied evidence.",
            is_active=True,
        )
        data.update(overrides)
        return data

    def test_approved_sponsor_requires_oromo_recognition_and_review_evidence(self):
        sponsor = Sponsor(
            **self.sponsor_data(
                public_display_status=PublicDisplayStatus.APPROVED,
                is_active=True,
            )
        )

        with self.assertRaises(ValidationError) as error:
            sponsor.full_clean()

        expected_fields = {
            "recognition_text_om",
            "reviewed_by",
            "reviewed_at",
            "approval_notes",
        }
        self.assertTrue(expected_fields.issubset(error.exception.message_dict))

    def test_approved_sponsor_may_publish_while_english_is_pending(self):
        sponsor = Sponsor.objects.create(**self.approved_data())

        self.assertEqual(sponsor.recognition_text_en, "")
        self.assertTrue(partner_is_approved_for_public_display(sponsor))

    def test_logo_display_mode_requires_an_approved_image(self):
        sponsor = Sponsor(
            **self.sponsor_data(display_mode=PartnerDisplayMode.IMAGE_AND_NAME)
        )

        with self.assertRaises(ValidationError) as error:
            sponsor.full_clean()

        self.assertIn("image", error.exception.message_dict)

    def test_public_display_guard_fails_closed_for_ineligible_records(self):
        pending = Sponsor.objects.create(**self.sponsor_data())
        inactive = Sponsor.objects.create(**self.approved_data(is_active=False))
        future = Sponsor.objects.create(
            **self.approved_data(display_start=timezone.localdate() + timedelta(days=1))
        )
        ended = Sponsor.objects.create(
            **self.approved_data(display_end=timezone.localdate() - timedelta(days=1))
        )

        self.assertFalse(partner_is_approved_for_public_display(None))
        self.assertFalse(partner_is_approved_for_public_display(pending))
        self.assertFalse(partner_is_approved_for_public_display(inactive))
        self.assertFalse(partner_is_approved_for_public_display(future))
        self.assertFalse(partner_is_approved_for_public_display(ended))

    def test_public_display_guard_revalidates_records_after_bulk_bypass(self):
        sponsor = Sponsor.objects.create(**self.sponsor_data())
        Sponsor.objects.filter(pk=sponsor.pk).update(
            is_active=True,
            public_display_status=PublicDisplayStatus.APPROVED,
        )
        sponsor.refresh_from_db()

        self.assertFalse(partner_is_approved_for_public_display(sponsor))

    def test_partner_schema_excludes_financial_contract_and_private_contact_data(self):
        field_names = {field.name for field in Sponsor._meta.get_fields()} | {
            field.name for field in Collaborator._meta.get_fields()
        }

        forbidden_names = {
            "contract",
            "payment_amount",
            "bank_account",
            "private_email",
            "private_phone",
            "contact_person",
        }
        self.assertTrue(field_names.isdisjoint(forbidden_names))


class CollaboratorApprovalTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.reviewer = get_user_model().objects.create_user(
            username="collaborator-reviewer"
        )

    def test_individual_collaborator_requires_resolved_consent_before_approval(self):
        collaborator = Collaborator(
            partner_kind=PartnerKind.PERSON,
            display_name="Community Contributor",
            role_om="Gorsa aadaa",
            description_om="Qophii qabiyyee aadaatiif gorsa kenne.",
            consent_status=ConsentStatus.PENDING,
            consent_notes="Confirmation requested.",
            public_display_status=PublicDisplayStatus.APPROVED,
            reviewed_by=self.reviewer,
            reviewed_at=timezone.now(),
            approval_notes="Identity reviewed; consent still pending.",
            is_active=True,
        )

        with self.assertRaises(ValidationError) as error:
            collaborator.full_clean()

        self.assertIn("consent_status", error.exception.message_dict)

    def test_approved_individual_with_confirmed_consent_is_publicly_eligible(self):
        collaborator = Collaborator.objects.create(
            partner_kind=PartnerKind.PERSON,
            display_name="Community Contributor",
            role_om="Gorsa aadaa",
            description_om="Qophii qabiyyee aadaatiif gorsa kenne.",
            consent_status=ConsentStatus.CONFIRMED,
            consent_notes="Written public-recognition consent reviewed.",
            public_display_status=PublicDisplayStatus.APPROVED,
            reviewed_by=self.reviewer,
            reviewed_at=timezone.now(),
            approval_notes="Public profile approved.",
            is_active=True,
        )

        self.assertTrue(partner_is_approved_for_public_display(collaborator))

    def test_approved_collaborator_requires_oromo_role_and_description(self):
        collaborator = Collaborator(
            partner_kind=PartnerKind.ORGANIZATION,
            display_name="Research Partner",
            public_display_status=PublicDisplayStatus.APPROVED,
            reviewed_by=self.reviewer,
            reviewed_at=timezone.now(),
            approval_notes="Organization display approved.",
            is_active=True,
        )

        with self.assertRaises(ValidationError) as error:
            collaborator.full_clean()

        self.assertIn("role_om", error.exception.message_dict)
        self.assertIn("description_om", error.exception.message_dict)
