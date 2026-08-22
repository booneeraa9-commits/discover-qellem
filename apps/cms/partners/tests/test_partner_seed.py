"""Tests for the seeded sponsors/supporters and their API (#28)."""

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from partners.models import (
    Collaborator,
    PartnerKind,
    PublicDisplayStatus,
    Sponsor,
)
from partners.services import partner_is_approved_for_public_display
from provenance.choices import ConsentStatus
from provenance.models import SourceCitation

SPONSORS_URL = "/api/v2/sponsors/"
SUPPORTERS_URL = "/api/v2/supporters/"

# Verbatim OM display names from ZONE_SPONSORS in
# apps/web/src/lib/zone-data.ts, in roster order.
SPONSOR_NAMES_IN_ORDER = [
    "Bulchiinsa Godina Qeellam Wallaggaa",
    "Waajjiira Oduu Godina Qeellam",
    "Yuunivarsiitii Dambi Doolloo",
    "Bulchiinsa Magaalaa Dambi Doolloo",
    "Waajjira Qonnaa Godinaa",
    "Waajjira Tuurizimii Godinaa",
    "Waajjira Saayinsii fi Teek.",
    "Waldaa Bunaa Qeellam",
    "Abbaa Taayitaa Daandii Oromiyaa",
    "Dhaabbata Qabeenya Biyyoolessaa",
]

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
    def test_all_ten_roster_sponsors_are_seeded_in_order(self):
        seeded = list(
            Sponsor.objects.order_by("display_order").values_list(
                "display_name", flat=True
            )
        )
        self.assertEqual(seeded, SPONSOR_NAMES_IN_ORDER)

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


class PartnerApiTestCase(TestCase):
    """Shared helpers to approve one partner of each kind for display."""

    @classmethod
    def setUpTestData(cls):
        cls.reviewer = get_user_model().objects.create_superuser(
            username="partner-reviewer",
            email="partner-reviewer@example.invalid",
            password="test-only-password",
        )

    def approve(self, record):
        record.is_active = True
        record.public_display_status = PublicDisplayStatus.APPROVED
        record.reviewed_by = self.reviewer
        record.reviewed_at = timezone.now()
        record.approval_notes = "Approved in a test after PM review."
        record.save()
        return record

    def approve_sponsor(self, name="Bulchiinsa Godina Qeellam Wallaggaa"):
        return self.approve(Sponsor.objects.get(display_name=name))

    def approve_supporter(self, name="Waajjira Tuurizimii Qeellam"):
        return self.approve(Collaborator.objects.get(display_name=name))


class SponsorApiTests(PartnerApiTestCase):
    def test_anonymous_listing_hides_pending_seed_records(self):
        response = self.client.get(SPONSORS_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["meta"]["total_count"], 0)

    def test_anonymous_listing_shows_only_approved_active_sponsors(self):
        approved = self.approve_sponsor()
        response = self.client.get(SPONSORS_URL)
        payload = response.json()
        self.assertEqual(payload["meta"]["total_count"], 1)
        item = payload["items"][0]
        self.assertEqual(item["display_name"], approved.display_name)
        self.assertIn("recognition_text_om", item)

    def test_expired_display_window_hides_an_approved_sponsor(self):
        sponsor = self.approve_sponsor()
        Sponsor.objects.filter(pk=sponsor.pk).update(
            display_end=timezone.localdate() - timedelta(days=1)
        )
        response = self.client.get(SPONSORS_URL)
        self.assertEqual(response.json()["meta"]["total_count"], 0)

    def test_detail_of_a_pending_sponsor_is_not_found(self):
        pending = Sponsor.objects.get(
            display_name="Waldaa Bunaa Qeellam"
        )
        response = self.client.get(f"{SPONSORS_URL}{pending.pk}/")
        self.assertEqual(response.status_code, 404)

    def test_private_review_fields_are_never_serialized(self):
        self.approve_sponsor()
        response = self.client.get(SPONSORS_URL)
        item = response.json()["items"][0]
        for private_field in ("approval_notes", "reviewed_by", "reviewed_at"):
            self.assertNotIn(private_field, item)

    def test_sponsors_endpoint_is_read_only_for_anonymous_users(self):
        response = self.client.post(SPONSORS_URL, {})
        self.assertIn(response.status_code, {403, 405})


class SupporterApiTests(PartnerApiTestCase):
    def test_anonymous_listing_hides_pending_seed_records(self):
        response = self.client.get(SUPPORTERS_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["meta"]["total_count"], 0)

    def test_anonymous_listing_shows_only_approved_active_supporters(self):
        approved = self.approve_supporter()
        response = self.client.get(SUPPORTERS_URL)
        payload = response.json()
        self.assertEqual(payload["meta"]["total_count"], 1)
        item = payload["items"][0]
        self.assertEqual(item["display_name"], approved.display_name)
        self.assertIn("role_om", item)

    def test_private_consent_fields_are_never_serialized(self):
        self.approve_supporter()
        response = self.client.get(SUPPORTERS_URL)
        item = response.json()["items"][0]
        for private_field in (
            "consent_notes",
            "consent_status",
            "approval_notes",
            "reviewed_by",
        ):
            self.assertNotIn(private_field, item)

    def test_detail_of_a_pending_supporter_is_not_found(self):
        pending = Collaborator.objects.get(
            display_name="Obbo Girmaa Dangalaa"
        )
        response = self.client.get(f"{SUPPORTERS_URL}{pending.pk}/")
        self.assertEqual(response.status_code, 404)

    def test_supporters_endpoint_is_read_only_for_anonymous_users(self):
        response = self.client.post(SUPPORTERS_URL, {})
        self.assertIn(response.status_code, {403, 405})
