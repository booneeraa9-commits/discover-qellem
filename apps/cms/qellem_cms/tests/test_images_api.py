"""Tests for the renditioned images endpoint (#112)."""

from django.test import TestCase
from wagtail.images import get_image_model

IMAGES_URL = "/api/v2/images/"

EXPECTED_KEYS = {
    "fill-400x300",
    "fill-800x600",
    "max-1600x1200",
    "original",
}


class ImagesRenditionsTests(TestCase):
    def test_listing_items_include_all_rendition_urls(self):
        response = self.client.get(IMAGES_URL)
        self.assertEqual(response.status_code, 200)
        items = response.json()["items"]
        self.assertTrue(items, "seeded gallery images expected")
        for item in items:
            with self.subTest(image=item["id"]):
                self.assertIn("renditions", item)
                self.assertEqual(set(item["renditions"]), EXPECTED_KEYS)
                for url in item["renditions"].values():
                    self.assertTrue(url.startswith("http"))

    def test_detail_includes_rendition_urls(self):
        image = get_image_model().objects.first()
        response = self.client.get(f"{IMAGES_URL}{image.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(set(payload["renditions"]), EXPECTED_KEYS)

    def test_fill_renditions_are_resized_variants_not_the_original(self):
        image = get_image_model().objects.first()
        payload = self.client.get(f"{IMAGES_URL}{image.pk}/").json()
        renditions = payload["renditions"]
        self.assertIn("fill-400x300", renditions["fill-400x300"])
        self.assertNotEqual(renditions["fill-400x300"], renditions["original"])
        rendition = image.get_rendition("fill-400x300")
        self.assertEqual(rendition.width, 400)
        self.assertEqual(rendition.height, 300)

    def test_existing_contract_fields_are_untouched(self):
        image = get_image_model().objects.first()
        payload = self.client.get(f"{IMAGES_URL}{image.pk}/").json()
        for key in ("id", "title", "width", "height", "meta"):
            self.assertIn(key, payload)
        self.assertIn("download_url", payload["meta"])
