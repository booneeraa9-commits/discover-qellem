"""Tests for the seeded sponsors and supporters from issue #28."""

from django.test import TestCase

from partners.models import (
    Collaborator,
    PartnerKind,
    PublicDisplayStatus,
    Sponsor,
)
from partners.services import partner_is_approved_for_public_display
from provenance.choices import ConsentStatus
from provenance.models import SourceCitation

SPONSOR_NAMES = {
    "Bulchiinsa Godina Qeellam Wallaggaa",
    "Waajjiira Oduu Godina Qeellam",
    "Yuunivarsiitii Dambi Doolloo",
    "Bulchiinsa Magaalaa Dambi Doolloo",
    "Waajjira Qonnaa Godinaa",
    "Waldaa Bunaa Qeellam",
}

SUPPORTER_PERSONS = {
    "Obbo Gammachuu Gurmeessaa",
    "Obbo Girmaa Dangalaa",
    "Dr. Utukaanaa Odaa",
}

SUPPORTER_ORGS = {
    "Waajjira Tuurizimii Qeellam",
    "Hawaasa Qeellam Wallaggaa",
    "Qonnaan bultootaa fi Waldaalee",
}


class SponsorSeedTests(TestCase):
    def test_the_six_verified_sponsors_are_seeded(self):
        self.assertEqual(
            set(Sponsor.objects.values_list("display_name", flat=True)),
            SPONSOR_NAMES,
        )

    def test_seeded_sponsors_await_review_and_are_not_public(self):
        for sponsor in Sponsor.objects.all():
            with self.subTest(name=sponsor.display_name):
                self.assertEqual(
                    sponsor.public_display_status,
                    PublicDisplayStatus.PENDING,
                )
                self.assertFalse(sponsor.is_active)
                self.assertFalse(
                    partner_is_approved_for_public_display(sponsor)
                )

    def test_seeded_sponsors_have_om_recognition_text(self):
        for sponsor in Sponsor.objects.all():
            with self.subTest(name=sponsor.display_name):
                self.assertTrue(sponsor.recognition_text_om.strip())


class SupporterSeedTests(TestCase):
    def test_the_six_verified_supporters_are_seeded(self):
        self.assertEqual(
            set(Collaborator.objects.values_list("display_name", flat=True)),
            SUPPORTER_PERSONS | SUPPORTER_ORGS,
        )

    def test_individuals_await_consent_confirmation(self):
        for name in SUPPORTER_PERSONS:
            with self.subTest(name=name):
                supporter = Collaborator.objects.get(display_name=name)
                self.assertEqual(supporter.partner_kind, PartnerKind.PERSON)
                self.assertEqual(
                    supporter.consent_status, ConsentStatus.PENDING
                )
                self.assertTrue(supporter.consent_notes.strip())

    def test_organizations_use_the_not_applicable_consent_status(self):
        for name in SUPPORTER_ORGS:
            with self.subTest(name=name):
                supporter = Collaborator.objects.get(display_name=name)
                self.assertEqual(
                    supporter.partner_kind, PartnerKind.ORGANIZATION
                )
                self.assertEqual(
                    supporter.consent_status, ConsentStatus.NOT_APPLICABLE
                )

    def test_seeded_supporters_are_not_publicly_displayable(self):
        for supporter in Collaborator.objects.all():
            with self.subTest(name=supporter.display_name):
                self.assertEqual(
                    supporter.public_display_status,
                    PublicDisplayStatus.PENDING,
                )
                self.assertFalse(supporter.is_active)
                self.assertFalse(
                    partner_is_approved_for_public_display(supporter)
                )

    def test_seeded_supporters_have_om_roles(self):
        for supporter in Collaborator.objects.all():
            with self.subTest(name=supporter.display_name):
                self.assertTrue(supporter.role_om.strip())


class PartnerSeedProvenanceTests(TestCase):
    def test_every_seeded_partner_has_a_roster_citation(self):
        for model, model_name in (
            (Sponsor, "sponsor"),
            (Collaborator, "collaborator"),
        ):
            for record in model.objects.all():
                with self.subTest(model=model_name, name=record.display_name):
                    citations = SourceCitation.objects.filter(
                        content_type__app_label="partners",
                        content_type__model=model_name,
                        object_id=record.pk,
                        source__source_id="SRC-031",
                    )
                    self.assertEqual(citations.count(), 1)
