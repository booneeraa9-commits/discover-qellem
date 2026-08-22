"""Absolute media URL resolution for API responses (issue #119).

The Wagtail API serializes media file URLs relative to ``MEDIA_URL``
(``/media/...``). When the Next.js frontend runs on a different origin
(standalone dev on :3000, or AletCloud behind Caddy) the browser
resolves those paths against the *web* origin and 404s.

Resolution order for the media host:

1. ``CMS_MEDIA_BASE_URL`` — explicit override, e.g. the public CMS
   origin when Caddy fronts Django on another host;
2. the request host (which honours ``X-Forwarded-Host`` when
   ``USE_X_FORWARDED_HOST`` is enabled for a proxy deployment);
3. ``WAGTAILADMIN_BASE_URL`` as the request-less fallback.

Only URL *emission* changes here — serving ``/media/`` in production
remains Caddy's job (deploy config, #39).
"""

from urllib.parse import urljoin

from django.conf import settings

# Response keys whose string values are media file URLs.
MEDIA_URL_KEYS = ("download_url",)


def media_base_url(request=None):
    """Return the origin media URLs should be anchored to."""

    override = getattr(settings, "CMS_MEDIA_BASE_URL", "")
    if override:
        return override
    if request is not None:
        return request.build_absolute_uri("/")
    return settings.WAGTAILADMIN_BASE_URL


def absolute_media_url(url, request=None):
    """Anchor a relative media URL; pass fully-qualified URLs through
    unless an explicit ``CMS_MEDIA_BASE_URL`` override is configured."""

    if not url:
        return url
    base = media_base_url(request)
    if url.startswith(("http://", "https://")):
        override = getattr(settings, "CMS_MEDIA_BASE_URL", "")
        if not override:
            return url
        # Re-anchor onto the override, keeping only the path.
        from urllib.parse import urlsplit

        url = urlsplit(url).path
    return urljoin(base if base.endswith("/") else base + "/", url.lstrip("/"))


def rewrite_media_urls(data, request=None):
    """Recursively absolutize media URLs in a serialized API payload."""

    if isinstance(data, list):
        for item in data:
            rewrite_media_urls(item, request)
        return data
    if not isinstance(data, dict):
        return data

    for key, value in data.items():
        if key in MEDIA_URL_KEYS and isinstance(value, str):
            data[key] = absolute_media_url(value, request)
        elif key == "renditions" and isinstance(value, dict):
            data[key] = {
                spec: absolute_media_url(url, request)
                for spec, url in value.items()
            }
        else:
            rewrite_media_urls(value, request)
    return data


class MediaURLAwareAPIViewSetMixin:
    """Absolutize media URLs on a Wagtail API v2 viewset's responses."""

    def listing_view(self, request):
        response = super().listing_view(request)
        rewrite_media_urls(response.data, request)
        return response

    def detail_view(self, request, pk):
        response = super().detail_view(request, pk)
        rewrite_media_urls(response.data, request)
        return response
