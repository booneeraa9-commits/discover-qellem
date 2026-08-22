from datetime import date

from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.deletion import ProtectedError
from django.test import TestCase
from wagtail.documents import get_document_model

from home.models import HomePage
from places.models import Geography
from provenance.choices import (
    CalendarSystem,
    CitationDecision,
    PermissionBasis,
    SensitivityStatus,
    SourceDocumentType,
    SourceSubject,
    VerificationStatus,
)
from provenance.models import SourceCitation, SourceRecord


class SourceRecordTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.zone = Geography.objects.get(slug="qellem-wallaggaa")
        cls.reviewer = get_user_model().objects.create_user(username="source-reviewer")

    def source_data(self, **overrides):
        data = {
            "source_id": "SRC-001",
            "title": "Qellem Wallaggaa administrative profile",
            "issuing_organization": "Qellem Wallaggaa Zone Administration",
            "document_type": SourceDocumentType.PROFILE,
            "subject": SourceSubject.DEMOGRAPHICS,
            "geography": self.zone,
            "private_description": "Private catalogue description.",
        }
        data.update(overrides)
        return data

    def test_source_id_uses_stable_private_format(self):
        source = SourceRecord(**self.source_data(source_id="source-1"))

        with self.assertRaises(ValidationError) as error:
            source.full_clean()

        self.assertIn("source_id", error.exception.message_dict)

    def test_source_record_has_no_file_image_or_document_relationship(self):
        document_model = get_document_model()
        fields = SourceRecord._meta.get_fields()

        self.assertFalse(
            any(
                isinstance(field, (models.FileField, models.ImageField))
                for field in fields
            )
        )
        self.assertFalse(
            any(
                getattr(field, "related_model", None) is document_model
                for field in fields
            )
        )

    def test_confirmed_permission_requires_private_evidence_notes(self):
        source = SourceRecord(
            **self.source_data(permission_basis=PermissionBasis.VERBAL)
        )

        with self.assertRaises(ValidationError) as error:
            source.save()

        self.assertIn("permission_confirmation_notes", error.exception.message_dict)
        # Exclude the records seeded by data migrations (SRC-026/027/028).
        self.assertFalse(
            SourceRecord.objects.exclude(
                source_id__in=["SRC-026", "SRC-027", "SRC-028"]
            ).exists()
        )

    def test_source_date_and_calendar_must_be_recorded_together(self):
        invalid_values = (
            ("2018", CalendarSystem.UNKNOWN, "source_calendar"),
            ("", CalendarSystem.GREGORIAN, "source_date_text"),
        )

        for source_date_text, source_calendar, expected_field in invalid_values:
            with self.subTest(expected_field=expected_field):
                source = SourceRecord(
                    **self.source_data(
                        source_date_text=source_date_text,
                        source_calendar=source_calendar,
                    )
                )

                with self.assertRaises(ValidationError) as error:
                    source.full_clean()

                self.assertIn(expected_field, error.exception.message_dict)

    def test_completed_verification_requires_reviewer_and_date(self):
        source = SourceRecord(
            **self.source_data(verification_status=VerificationStatus.VERIFIED)
        )

        with self.assertRaises(ValidationError) as error:
            source.full_clean()

        self.assertIn("reviewed_by", error.exception.message_dict)
        self.assertIn("verified_on", error.exception.message_dict)

    def test_verified_source_preserves_screening_and_permission_metadata(self):
        source = SourceRecord.objects.create(
            **self.source_data(
                source_date_text="2018",
                source_calendar=CalendarSystem.GREGORIAN,
                permission_basis=PermissionBasis.VERBAL,
                permission_confirmed_on=date(2026, 8, 19),
                permission_confirmation_notes=(
                    "Supplied by the zone office with verbal online-publication "
                    "permission."
                ),
                sensitivity_status=SensitivityStatus.CLEARED,
                sensitivity_notes="Screened; no known sensitive information.",
                verification_status=VerificationStatus.VERIFIED,
                reviewed_by=self.reviewer,
                verified_on=date(2026, 8, 19),
            )
        )

        self.assertEqual(source.source_id, "SRC-001")
        self.assertEqual(source.geography, self.zone)
        self.assertEqual(source.permission_basis, PermissionBasis.VERBAL)
        self.assertEqual(source.sensitivity_status, SensitivityStatus.CLEARED)


class SourceCitationTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.editor = get_user_model().objects.create_user(username="citing-editor")
        cls.reviewer = get_user_model().objects.create_user(username="fact-reviewer")
        cls.source = SourceRecord.objects.create(
            source_id="SRC-002",
            title="History source",
            issuing_organization="Qellem Wallaggaa Zone Administration",
            document_type=SourceDocumentType.REPORT,
            subject=SourceSubject.HISTORY_NAMING,
            private_description="Private history source metadata.",
        )
        cls.homepage = HomePage.objects.get()
        cls.homepage_content_type = ContentType.objects.get_for_model(
            cls.homepage,
            for_concrete_model=False,
        )

    def citation_data(self, **overrides):
        data = {
            "source": self.source,
            "content_type": self.homepage_content_type,
            "object_id": self.homepage.pk,
            "claim_or_section": "Zone-name origin section, paragraph two.",
            "citing_editor": self.editor,
        }
        data.update(overrides)
        return data

    def test_citation_rejects_missing_target(self):
        citation = SourceCitation(**self.citation_data(object_id=999999))

        with self.assertRaises(ValidationError) as error:
            citation.full_clean()

        self.assertIn("object_id", error.exception.message_dict)

    def test_final_citation_decision_requires_reviewer_and_date(self):
        citation = SourceCitation(
            **self.citation_data(decision=CitationDecision.VERIFIED)
        )

        with self.assertRaises(ValidationError) as error:
            citation.save()

        self.assertIn("fact_reviewer", error.exception.message_dict)
        self.assertIn("verified_on", error.exception.message_dict)
        # Exclude the citations seeded by data migrations (SRC-026/027/028).
        self.assertFalse(
            SourceCitation.objects.exclude(
                source__source_id__in=["SRC-026", "SRC-027", "SRC-028"]
            ).exists()
        )

    def test_verified_citation_links_source_to_content(self):
        citation = SourceCitation.objects.create(
            **self.citation_data(
                decision=CitationDecision.VERIFIED,
                fact_reviewer=self.reviewer,
                verified_on=date(2026, 8, 19),
            )
        )

        self.assertEqual(citation.content_object, self.homepage)
        self.assertEqual(citation.source, self.source)
        self.assertEqual(citation.fact_reviewer, self.reviewer)

    def test_cited_source_cannot_be_deleted(self):
        SourceCitation.objects.create(**self.citation_data())

        with self.assertRaises(ProtectedError):
            self.source.delete()
