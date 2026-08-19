from wagtail.models import Page, Site
from wagtail.test.utils import WagtailPageTestCase

from home.models import HomePage


class HomeSetUpTests(WagtailPageTestCase):
    """
    Tests for basic page structure setup and HomePage creation.
    """

    def test_root_create(self):
        root_page = Page.objects.get(pk=1)
        self.assertIsNotNone(root_page)

    def test_homepage_is_limited_to_one_instance(self):
        root_page = Page.objects.get(pk=1)

        self.assertEqual(HomePage.objects.count(), 1)
        self.assertFalse(HomePage.can_create_at(root_page))


class HomeTests(WagtailPageTestCase):
    """
    Tests for homepage functionality and rendering.
    """

    def setUp(self):
        """Use the single homepage created by the foundation migrations."""
        self.homepage = HomePage.objects.get()
        site = Site.objects.get(is_default_site=True)
        site.hostname = "testserver"
        site.root_page = self.homepage
        site.save(update_fields=["hostname", "root_page"])

    def test_homepage_is_renderable(self):
        self.assertPageIsRenderable(self.homepage)

    def test_homepage_template_used(self):
        response = self.client.get(self.homepage.url)
        self.assertTemplateUsed(response, "home/home_page.html")
