from unittest.mock import patch

from django.test import SimpleTestCase

from qellem_cms.content_validation import validate_approved_image


class ApprovedImageValidationTests(SimpleTestCase):
    class FakeContent:
        hero_image_id = 17
        hero_image = object()

    @patch(
        "provenance.services.image_is_approved_for_public_use",
        return_value=False,
    )
    def test_unapproved_public_image_fails_closed(self, approval_check):
        errors = {}

        validate_approved_image(self.FakeContent(), "hero_image", errors)

        approval_check.assert_called_once()
        self.assertIn("hero_image", errors)

    @patch(
        "provenance.services.image_is_approved_for_public_use",
        return_value=True,
    )
    def test_complete_approved_public_image_is_accepted(self, approval_check):
        errors = {}

        validate_approved_image(self.FakeContent(), "hero_image", errors)

        approval_check.assert_called_once()
        self.assertNotIn("hero_image", errors)
