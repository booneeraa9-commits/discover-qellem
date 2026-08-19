from datetime import date
from io import BytesIO
from tempfile import TemporaryDirectory

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.files.images import ImageFile
from django.db.models.deletion import ProtectedError
from django.test import TestCase, override_settings
from django.utils import timezone
from PIL import Image as PillowImage
from wagtail.images import get_image_model

from provenance.choices import (
    ConsentStatus,
    MediaReviewStatus,
    PermissionBasis,
)
from provenance.models import MediaRights
from provenance.services import image_is_approved_for_public_use


def make_test_image_file(filename="rights-test.png"):
    image_bytes = BytesIO()
    PillowImage.new("RGB", (32, 24), "green").save(image_bytes, format="PNG")
    image_bytes.seek(0)
    return ImageFile(image_bytes, name=filename)


class MediaRightsTests(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary_media = TemporaryDirectory()
        cls.media_settings = override_settings(MEDIA_ROOT=cls.temporary_media.name)
        cls.media_settings.enable()
        super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        try:
            super().tearDownClass()
        finally:
            cls.media_settings.disable()
            cls.temporary_media.cleanup()

    @classmethod
    def setUpTestData(cls):
        cls.reviewer = get_user_model().objects.create_user(username="media-reviewer")

    def setUp(self):
        self.image = get_image_model().objects.create(
            title="Qellem landscape",
            file=make_test_image_file(),
        )

    def approved_rights_data(self, **overrides):
        data = {
            "image": self.image,
            "creator_name": "Photographer unknown",
            "rights_owner_name": "Qellem Wallaggaa Zone Administration",
            "supplier_name": "Qellem Wallaggaa Zone Administration",
            "provenance_notes": "Supplied directly by the zone office.",
            "permission_basis": PermissionBasis.VERBAL,
            "permission_date": date(2026, 8, 19),
            "permitted_uses": "Discover Qellem website publication.",
            "credit_line": "Qellem Wallaggaa Zone Administration",
            "caption_om": "Lafa uumamaa Qellem Wallaggaa.",
            "alt_text_om": "Mul'ata lafa magariisaa Qellem Wallaggaa.",
            "review_status": MediaReviewStatus.APPROVED,
            "reviewed_by": self.reviewer,
            "reviewed_at": timezone.now(),
        }
        data.update(overrides)
        return data

    def test_missing_image_defaults_to_denial(self):
        self.assertFalse(image_is_approved_for_public_use(None))

    def test_image_without_rights_defaults_to_denial(self):
        self.assertFalse(image_is_approved_for_public_use(self.image))

    def test_pending_rights_do_not_allow_public_use(self):
        MediaRights.objects.create(image=self.image)

        self.assertFalse(image_is_approved_for_public_use(self.image))

    def test_approved_rights_allow_public_use_without_english_translation(self):
        rights = MediaRights.objects.create(**self.approved_rights_data())

        self.assertEqual(rights.caption_en, "")
        self.assertEqual(rights.alt_text_en, "")
        self.assertTrue(image_is_approved_for_public_use(self.image))

    def test_approval_requires_afaan_oromoo_caption_and_alt_text(self):
        rights = MediaRights(**self.approved_rights_data(caption_om="", alt_text_om=""))

        with self.assertRaises(ValidationError) as error:
            rights.save()

        self.assertIn("caption_om", error.exception.message_dict)
        self.assertIn("alt_text_om", error.exception.message_dict)
        self.assertFalse(MediaRights.objects.exists())

    def test_approval_requires_permission_provenance_credit_and_review(self):
        rights = MediaRights(
            **self.approved_rights_data(
                rights_owner_name="",
                supplier_name="",
                provenance_notes="",
                permission_basis=PermissionBasis.PENDING,
                permission_date=None,
                permitted_uses="",
                credit_line="",
                reviewed_by=None,
                reviewed_at=None,
            )
        )

        with self.assertRaises(ValidationError) as error:
            rights.full_clean()

        expected_fields = {
            "rights_owner_name",
            "supplier_name",
            "provenance_notes",
            "permission_basis",
            "permission_date",
            "permitted_uses",
            "credit_line",
            "reviewed_by",
            "reviewed_at",
        }
        self.assertTrue(expected_fields.issubset(error.exception.message_dict))

    def test_media_depicting_minors_requires_confirmed_consent(self):
        rights = MediaRights(
            **self.approved_rights_data(
                people_depicted=True,
                minors_depicted=True,
                consent_status=ConsentStatus.PENDING,
                consent_notes="Written consent has been requested.",
            )
        )

        with self.assertRaises(ValidationError) as error:
            rights.full_clean()

        self.assertIn("consent_status", error.exception.message_dict)

    def test_public_guard_revalidates_data_even_after_bulk_bypass(self):
        rights = MediaRights.objects.create(image=self.image)
        MediaRights.objects.filter(pk=rights.pk).update(
            review_status=MediaReviewStatus.APPROVED
        )

        self.assertFalse(image_is_approved_for_public_use(self.image))

    def test_image_with_rights_record_cannot_be_deleted_silently(self):
        MediaRights.objects.create(image=self.image)

        with self.assertRaises(ProtectedError):
            self.image.delete()
