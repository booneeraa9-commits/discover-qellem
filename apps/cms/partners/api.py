"""Public API endpoints for approved sponsors and supporters (issue #28).

Both endpoints apply the public-display gate at the queryset level:
only records with ``public_display_status=approved`` and
``is_active=True`` that are inside their display window are exposed.
Private review and consent fields are never serialized.
"""

from django.db.models import Q
from django.utils import timezone
from wagtail.api.v2.views import BaseAPIViewSet

from partners.models import Collaborator, PublicDisplayStatus, Sponsor


def _publicly_displayable(queryset):
    today = timezone.localdate()
    return queryset.filter(
        is_active=True,
        public_display_status=PublicDisplayStatus.APPROVED,
    ).filter(
        Q(display_start__isnull=True) | Q(display_start__lte=today),
        Q(display_end__isnull=True) | Q(display_end__gte=today),
    )


class SponsorAPIViewSet(BaseAPIViewSet):
    """Read-only /api/v2/sponsors/ endpoint for approved sponsors."""

    model = Sponsor
    name = "sponsors"

    listing_default_fields = BaseAPIViewSet.listing_default_fields + [
        "display_name",
        "partner_kind",
        "website_url",
        "display_mode",
        "recognition_text_om",
        "recognition_text_en",
        "sponsorship_level",
        "display_order",
    ]

    def get_queryset(self):
        return _publicly_displayable(Sponsor.objects.all()).order_by(
            "display_order", "display_name"
        )


class SupporterAPIViewSet(BaseAPIViewSet):
    """Read-only /api/v2/supporters/ endpoint for approved supporters."""

    model = Collaborator
    name = "supporters"

    listing_default_fields = BaseAPIViewSet.listing_default_fields + [
        "display_name",
        "partner_kind",
        "website_url",
        "display_mode",
        "role_om",
        "role_en",
        "affiliation_om",
        "affiliation_en",
        "contribution_period",
        "description_om",
        "description_en",
        "display_order",
    ]

    def get_queryset(self):
        return _publicly_displayable(Collaborator.objects.all()).order_by(
            "display_order", "display_name"
        )
