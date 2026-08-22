"""Public API endpoints for notable people (issue #25) and the zone
timeline (issue #28)."""

from wagtail.api.v2.views import BaseAPIViewSet

from archive.models import Person, TimelineEvent


class PersonAPIViewSet(BaseAPIViewSet):
    """Read-only /api/v2/people/ endpoint backed by the Person snippet."""

    model = Person
    name = "people"

    listing_default_fields = BaseAPIViewSet.listing_default_fields + [
        "name_om",
        "name_en",
        "slug",
        "is_zone_notable",
        "woreda_slugs",
    ]

    def get_queryset(self):
        return (
            self.model.objects.all()
            .prefetch_related("placements__geography")
            .order_by("name_om", "id")
        )


class TimelineEventAPIViewSet(BaseAPIViewSet):
    """Read-only /api/v2/timeline/ endpoint, newest events first."""

    model = TimelineEvent
    name = "timeline"

    listing_default_fields = BaseAPIViewSet.listing_default_fields + [
        "year_om",
        "year_en",
        "year_int",
        "title_om",
        "title_en",
        "text_om",
        "text_en",
    ]

    def get_queryset(self):
        return self.model.objects.all().order_by("-year_int", "-id")
