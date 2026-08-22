"""Tests for absolute media URLs in API responses (#119)."""

from django.test import TestCase, override_settings

from archive.models import NewsArticle

PAGES_URL = "/api/v2/pages/"
IMAGES_URL = "/api/v2/images/"

OVERRIDE_BASE = "https://cms.discoverqellem.et"


def collect_media_urls(data, found=None):
    """Collect every download_url and rendition URL in a payload."""

    if found is None:
        found = []
    if isinstance(data, list):
        for item in data:
            collect_media_urls(item, found)
    elif isinstance(data, dict):
        for key, value in data.items():
            if key == "download_url" and isinstance(value, str):
                found.append(value)
            elif key == "renditions" and isinstance(value, dict):
                found.extend(value.values())
            else:
                collect_media_urls(value, found)
    return found


class DevAbsoluteMediaURLTests(TestCase):
    """Without an override, URLs anchor on the request host."""

    def test_pages_gallery_images_have_absolute_download_urls(self):
        article = NewsArticle.objects.get(slug="dembi-dollo-inauguration-2026")
        payload = self.client.get(f"{PAGES_URL}{article.pk}/").json()
        urls = collect_media_urls(payload["gallery_images"])
        self.assertTrue(urls, "gallery images expected")
        for url in urls:
            self.assertTrue(
                url.startswith("http://testserver/media/"), msg=url
            )

    def test_images_listing_download_urls_and_renditions_are_absolute(self):
        payload = self.client.get(IMAGES_URL).json()
        urls = collect_media_urls(payload["items"])
        self.assertTrue(urls)
        for url in urls:
            self.assertTrue(url.startswith("http://testserver/"), msg=url)

    def test_custom_endpoints_carry_no_relative_media_paths(self):
        for endpoint in ("people", "timeline", "sponsors", "supporters"):
            with self.subTest(endpoint=endpoint):
                payload = self.client.get(f"/api/v2/{endpoint}/").json()
                for url in collect_media_urls(payload):
                    self.assertTrue(url.startswith("http"), msg=url)

    def test_pages_listing_is_also_rewritten(self):
        payload = self.client.get(
            PAGES_URL,
            {
                "type": "archive.NewsArticle",
                "fields": "featured_image,gallery_images",
            },
        ).json()
        for url in collect_media_urls(payload["items"]):
            self.assertTrue(url.startswith("http://testserver/"), msg=url)


@override_settings(CMS_MEDIA_BASE_URL=OVERRIDE_BASE)
class MediaBaseURLOverrideTests(TestCase):
    """CMS_MEDIA_BASE_URL overrides the host for every media URL."""

    def test_pages_gallery_media_urls_use_the_override(self):
        article = NewsArticle.objects.get(slug="dembi-dollo-inauguration-2026")
        payload = self.client.get(f"{PAGES_URL}{article.pk}/").json()
        urls = collect_media_urls(payload["gallery_images"])
        self.assertTrue(urls)
        for url in urls:
            self.assertTrue(url.startswith(f"{OVERRIDE_BASE}/media/"), msg=url)

    def test_images_renditions_use_the_override(self):
        payload = self.client.get(IMAGES_URL).json()
        urls = collect_media_urls(payload["items"])
        self.assertTrue(urls)
        for url in urls:
            self.assertTrue(url.startswith(f"{OVERRIDE_BASE}/media/"), msg=url)

    def test_detail_view_uses_the_override_too(self):
        first = self.client.get(IMAGES_URL).json()["items"][0]
        payload = self.client.get(f"{IMAGES_URL}{first['id']}/").json()
        self.assertTrue(
            payload["meta"]["download_url"].startswith(OVERRIDE_BASE)
        )
        for url in payload["renditions"].values():
            self.assertTrue(url.startswith(OVERRIDE_BASE), msg=url)


@override_settings(USE_X_FORWARDED_HOST=True, ALLOWED_HOSTS=["*"])
class ForwardedHostTests(TestCase):
    """With USE_X_FORWARDED_HOST on, the proxy host anchors media URLs."""

    def test_forwarded_host_appears_in_media_urls(self):
        payload = self.client.get(
            IMAGES_URL, HTTP_X_FORWARDED_HOST="cms.discoverqellem.et"
        ).json()
        urls = collect_media_urls(payload["items"])
        self.assertTrue(urls)
        for url in urls:
            self.assertIn("cms.discoverqellem.et", url)
