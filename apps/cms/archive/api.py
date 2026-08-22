"""Public API endpoint for notable people (issue #25)."""

from wagtail.api.v2.views import BaseAPIViewSet

from archive.models import Person


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
