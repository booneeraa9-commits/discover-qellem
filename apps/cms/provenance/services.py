from django.core.exceptions import ValidationError

from provenance.choices import MediaReviewStatus
from provenance.models import MediaRights


def image_is_approved_for_public_use(image) -> bool:
    """Return true only for a complete, currently approved image-rights record."""

    if image is None:
        return False

    try:
        rights = image.discover_qellem_rights
    except (AttributeError, MediaRights.DoesNotExist):
        return False

    if rights.review_status != MediaReviewStatus.APPROVED:
        return False

    try:
        rights.full_clean()
    except ValidationError:
        return False

    return True
