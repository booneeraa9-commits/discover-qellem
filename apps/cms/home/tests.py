from django.core.exceptions import NON_FIELD_ERRORS, ValidationError
from places.models import Geography
from qellem_cms.content_validation import PUBLIC_RICH_TEXT_FEATURES
from wagtail.models import Locale, Page, Site
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


class HomeContentValidationTests(WagtailPageTestCase):
    def setUp(self):
        self.homepage = HomePage.objects.get()
        self.zone = Geography.objects.get(slug="qellem-wallaggaa")

    def complete_oromo_homepage(self):
        self.homepage.introduction = "Baga gara Qellem Wallaggaa dhuftan."
        self.homepage.overview = "Qellem Wallaggaa godina Oromiyaa keessaa tokko."
        self.homepage.save()
        return self.homepage

    def test_data_migration_configures_combined_zone_profile_identity(self):
        self.assertEqual(self.homepage.title, "Qellem Wallaggaa")
        self.assertEqual(self.homepage.geography, self.zone)
        self.assertEqual(self.homepage.locale.language_code, "om")

    def test_authoritative_oromo_fields_are_required(self):
        with self.assertRaises(ValidationError) as error:
            self.homepage.full_clean()

        self.assertIn("introduction", error.exception.message_dict)
        self.assertIn("overview", error.exception.message_dict)

    def test_english_translation_requires_completed_linked_oromo_content(self):
        english_locale = Locale.objects.get(language_code="en")
        english = self.homepage.copy_for_translation(english_locale)
        english.introduction = "Welcome to Qellem Wallaggaa."
        english.overview = "A profile of Qellem Wallaggaa."

        with self.assertRaises(ValidationError) as error:
            english.full_clean()

        self.assertIn(NON_FIELD_ERRORS, error.exception.message_dict)

    def test_linked_english_translation_may_exist_without_english_body(self):
        self.complete_oromo_homepage()
        english_locale = Locale.objects.get(language_code="en")
        english = self.homepage.copy_for_translation(english_locale)
        english.introduction = ""
        english.overview = ""

        english.full_clean()

        self.assertEqual(english.translation_key, self.homepage.translation_key)
        self.assertEqual(english.geography, self.zone)

    def test_unrelated_second_oromo_homepage_is_rejected(self):
        duplicate = HomePage(
            title="Qellem Wallaggaa",
            slug="another-home",
            locale=self.homepage.locale,
            geography=self.zone,
            introduction="Seensa.",
            overview="Ibsa.",
        )

        with self.assertRaises(ValidationError) as error:
            duplicate.full_clean()

        self.assertIn(NON_FIELD_ERRORS, error.exception.message_dict)

    def test_content_locales_are_limited_to_oromo_and_english(self):
        french_locale = Locale.objects.create(language_code="fr")
        unsupported = HomePage(
            title="Qellem Wallaggaa",
            slug="accueil",
            locale=french_locale,
            geography=self.zone,
        )

        with self.assertRaises(ValidationError) as error:
            unsupported.full_clean()

        self.assertIn(NON_FIELD_ERRORS, error.exception.message_dict)

    def test_public_rich_text_rejects_embedded_media_markup(self):
        self.homepage.introduction = "Seensa."
        self.homepage.overview = '<embed embedtype="media" id="17"/>'

        with self.assertRaises(ValidationError) as error:
            self.homepage.full_clean()

        self.assertIn("overview", error.exception.message_dict)

    def test_public_rich_text_fields_exclude_upload_and_embed_features(self):
        self.assertEqual(
            HomePage._meta.get_field("overview").features,
            PUBLIC_RICH_TEXT_FEATURES,
        )
        self.assertTrue(
            {"image", "document-link", "embed"}.isdisjoint(PUBLIC_RICH_TEXT_FEATURES)
        )
