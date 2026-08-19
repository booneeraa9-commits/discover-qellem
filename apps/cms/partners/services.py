from django.core.exceptions import ValidationError
from django.utils import timezone

from partners.models import PublicDisplayStatus


def partner_is_approved_for_public_display(partner, on_date=None) -> bool:
    """Fail closed unless a complete partner record is approved and in date."""

    if partner is None:
        return False
    if not partner.is_active:
        return False
    if partner.public_display_status != PublicDisplayStatus.APPROVED:
        return False

    display_date = on_date or timezone.localdate()
    if partner.display_start and display_date < partner.display_start:
        return False
    if partner.display_end and display_date > partner.display_end:
        return False

    try:
        partner.full_clean()
    except (AttributeError, ValidationError):
        return False

    return True
