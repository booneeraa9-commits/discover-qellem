"""Images API endpoint that exposes rendition URLs (issue #112).

The stock Wagtail images v2 endpoint serves only the original file's
``download_url``. The frontend needs pre-sized variants for cards,
heroes, and lightboxes (#40), so listing and detail responses gain a
``renditions`` object::

    "renditions": {
        "fill-400x300": "https://.../example.fill-400x300.jpg",
        "fill-800x600": "https://.../example.fill-800x600.jpg",
        "max-1600x1200": "https://.../example.max-1600x1200.jpg",
        "original": "https://.../example.jpg"
    }

Renditions are generated on first request and cached by Wagtail, so
subsequent responses only read existing rendition rows.
"""

from wagtail.images import get_image_model
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.images.exceptions import InvalidFilterSpecError

RENDITION_SPECS = ("fill-400x300", "fill-800x600", "max-1600x1200")


class RenditionedImagesAPIViewSet(ImagesAPIViewSet):
    """Images endpoint whose responses include a ``renditions`` dict."""

    def listing_view(self, request):
        response = super().listing_view(request)
        self._attach_renditions(request, response.data.get("items", []))
        return response

    def detail_view(self, request, pk):
        response = super().detail_view(request, pk)
        self._attach_renditions(request, [response.data])
        return response

    def _attach_renditions(self, request, items):
        ids = [item["id"] for item in items if "id" in item]
        images = get_image_model().objects.in_bulk(ids)
        for item in items:
            image = images.get(item.get("id"))
            if image is None:
                continue
            urls = {}
            for spec in RENDITION_SPECS:
                try:
                    urls[spec] = request.build_absolute_uri(
                        image.get_rendition(spec).url
                    )
                except (InvalidFilterSpecError, OSError):
                    # A missing or unreadable source file must not break
                    # the whole listing; skip that variant.
                    continue
            urls["original"] = request.build_absolute_uri(image.file.url)
            item["renditions"] = urls
