from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import NON_FIELD_ERRORS, ValidationError
from django.db import models
from django.test import TestCase
from wagtail.documents import get_document_model
from wagtail.models import Locale

from archive.models import (
    ArchiveCategory,
    ArchiveEntryPage,
    DeceasedPersonPage,
    GlossaryIndexPage,
    GlossaryTermPage,
    HistoryCultureIndexPage,
    PartOfSpeech,
    PeopleIndexPage,
)
from home.models import HomePage
from places.models import Geography
from provenance.choices import SourceDocumentType, SourceSubject
from provenance.models import SourceCitation, SourceRecord


class ArchiveIndexTests(TestCase):
    def setUp(self):
        self.homepage = HomePage.objects.get()

    def test_archive_indexes_enforce_stable_routes(self):
        cases = (
            (HistoryCultureIndexPage, "historii", "history"),
            (PeopleIndexPage, "namoota", "people"),
            (GlossaryIndexPage, "jechoota", "glossary"),
        )

        for page_class, wrong_slug, expected_slug in cases:
            with self.subTest(page_class=page_class.__name__):
                page = page_class(
                    title=page_class.__name__,
                    slug=wrong_slug,
                    introduction="Seensa kuusaa.",
                )
                with self.assertRaises(ValidationError) as error:
                    self.homepage.add_child(instance=page)

                self.assertIn("slug", error.exception.message_dict)
                self.assertNotEqual(wrong_slug, expected_slug)

    def test_only_one_history_index_is_allowed_per_translated_homepage(self):
        first = HistoryCultureIndexPage(
            title="Seenaa fi Aadaa",
            slug="history",
            introduction="Seensa seenaa fi aadaa.",
        )
        self.homepage.add_child(instance=first)
        self.assertFalse(HistoryCultureIndexPage.can_create_at(self.homepage))


class ArchiveContentTests(TestCase):
    def setUp(self):
        self.homepage = HomePage.objects.get()
        self.zone = Geography.objects.get(slug="qellem-wallaggaa")

    def make_history_index(self):
        index = HistoryCultureIndexPage(
            title="Seenaa fi Aadaa",
            slug="history",
            introduction="Seensa seenaa fi aadaa.",
        )
        self.homepage.add_child(instance=index)
        return index

    def make_people_index(self):
        index = PeopleIndexPage(
            title="Namoota Yaadataman",
            slug="people",
            introduction="Seensa namoota yaadatamanii.",
        )
        self.homepage.add_child(instance=index)
        return index

    def make_person(self):
        person = DeceasedPersonPage(
            title="Nama Seenaa",
            slug="nama-seenaa",
            canonical_name="Nama Seenaa",
            death_date_or_period="Bara 1990 keessa",
            birthplace=self.zone,
            occupations="Hojii hawaasaa.",
            summary="Cuunfaa jireenyaa.",
            biography="Seenaa jireenyaa bal'aa.",
            public_significance="Hawaasaaf gumaacha taasise.",
        )
        self.make_people_index().add_child(instance=person)
        return person

    def test_archive_models_have_no_original_writing_upload_field(self):
        document_model = get_document_model()

        for page_class in (
            ArchiveEntryPage,
            DeceasedPersonPage,
            GlossaryTermPage,
        ):
            with self.subTest(page_class=page_class.__name__):
                fields = page_class._meta.get_fields()
                self.assertFalse(
                    any(isinstance(field, models.FileField) for field in fields)
                )
                self.assertFalse(
                    any(
                        getattr(field, "related_model", None) is document_model
                        for field in fields
                    )
                )

    def test_oromo_archive_entry_requires_summary_and_body(self):
        entry = ArchiveEntryPage(
            title="Seenaa Qellem",
            slug="seenaa-qellem",
            category=ArchiveCategory.HISTORY,
            geography=self.zone,
        )
        with self.assertRaises(ValidationError) as error:
            self.make_history_index().add_child(instance=entry)

        self.assertIn("summary", error.exception.message_dict)
        self.assertIn("body", error.exception.message_dict)

    def test_private_source_citation_links_to_structured_archive_page(self):
        entry = ArchiveEntryPage(
            title="Seenaa Qellem",
            slug="seenaa-qellem",
            category=ArchiveCategory.HISTORY,
            geography=self.zone,
            summary="Cuunfaa seenaa.",
            body="Ibsa seenaa bal'aa.",
        )
        self.make_history_index().add_child(instance=entry)
        source = SourceRecord.objects.create(
            source_id="SRC-903",
            title="Private zone history source",
            issuing_organization="Qellem Wallaggaa Zone Administration",
            document_type=SourceDocumentType.REPORT,
            subject=SourceSubject.HISTORY_NAMING,
            geography=self.zone,
            private_description="Private catalogue notes kept out of public fields.",
        )
        editor = get_user_model().objects.create_user(username="archive-citing-editor")
        citation = SourceCitation.objects.create(
            source=source,
            content_type=ContentType.objects.get_for_model(
                entry,
                for_concrete_model=False,
            ),
            object_id=entry.pk,
            claim_or_section="History section, paragraphs one through three.",
            citing_editor=editor,
        )

        self.assertEqual(citation.content_object, entry)
        self.assertEqual(citation.source.source_id, "SRC-903")

    def test_archive_entry_must_be_beneath_history_index(self):
        entry = ArchiveEntryPage(
            title="Seenaa Qellem",
            slug="seenaa-qellem",
            category=ArchiveCategory.HISTORY,
            geography=self.zone,
            summary="Cuunfaa seenaa.",
            body="Ibsa seenaa bal'aa.",
        )
        self.homepage.add_child(instance=entry)

        with self.assertRaises(ValidationError) as error:
            entry.full_clean()

        self.assertIn(NON_FIELD_ERRORS, error.exception.message_dict)

    def test_person_title_must_match_verified_canonical_name(self):
        person = self.make_person()
        person.title = "Maqaa Jijjiirame"

        with self.assertRaises(ValidationError) as error:
            person.full_clean()

        self.assertIn("title", error.exception.message_dict)

    def test_person_translation_cannot_change_verified_identity(self):
        person = self.make_person()
        english_locale = Locale.objects.get(language_code="en")
        english = DeceasedPersonPage(
            title="Different Person",
            slug=person.slug,
            locale=english_locale,
            translation_key=person.translation_key,
            canonical_name="Different Person",
            death_date_or_period=person.death_date_or_period,
            birthplace=self.zone,
            occupations="Community work.",
            summary="Life summary.",
            biography="Long biography.",
            public_significance="Public contribution.",
        )

        with self.assertRaises(ValidationError) as error:
            english.full_clean()

        self.assertIn("canonical_name", error.exception.message_dict)

    def test_glossary_title_uses_authoritative_oromo_term(self):
        term = GlossaryTermPage(
            title="Translated label",
            slug="gadaa",
            canonical_term="Gadaa",
            part_of_speech=PartOfSpeech.NOUN,
            definition="Sirna bulchiinsaa Oromoo.",
        )

        with self.assertRaises(ValidationError) as error:
            term.full_clean()

        self.assertIn("title", error.exception.message_dict)
