"""Tests for the TimelineEvent snippet and its seeded entries (#28)."""

from django.core.exceptions import ValidationError
from django.test import TestCase
from wagtail.snippets.models import get_snippet_models

from archive.models import TimelineEvent
from editorial.choices import EditorialSubject
from editorial.targets import possible_subjects_for_model
from provenance.models import SourceCitation

EXPECTED_YEARS = {
    1898: "1898/1903",
    1933: "1933 A.L.I",
    1998: "1998",
    2026: "2026",
}


class TimelineEventModelTests(TestCase):
    def test_timeline_event_is_registered_as_a_snippet(self):
        self.assertIn(TimelineEvent, get_snippet_models())

    def test_timeline_event_maps_to_history_culture_subject(self):
        self.assertEqual(
            possible_subjects_for_model(TimelineEvent),
            frozenset({EditorialSubject.HISTORY_CULTURE}),
        )

    def test_om_fields_are_required(self):
        event = TimelineEvent(year_int=1900)
        with self.assertRaises(ValidationError) as error:
            event.full_clean()
        self.assertIn("year_om", error.exception.message_dict)
        self.assertIn("text_om", error.exception.message_dict)

    def test_english_fields_are_optional(self):
        event = TimelineEvent(
            year_om="1900",
            year_int=1900,
            text_om="Waan bara 1900 ta'e.",
        )
        event.full_clean()

    def test_year_label_rejects_surrounding_whitespace(self):
        event = TimelineEvent(
            year_om=" 1900 ",
            year_int=1900,
            text_om="Waan bara 1900 ta'e.",
        )
        with self.assertRaises(ValidationError) as error:
            event.full_clean()
        self.assertIn("year_om", error.exception.message_dict)

    def test_default_ordering_is_by_numeric_year(self):
        years = list(
            TimelineEvent.objects.values_list("year_int", flat=True)
        )
        self.assertEqual(years, sorted(years))


class TimelineSeedTests(TestCase):
    def test_four_entries_are_seeded_with_expected_years(self):
        self.assertEqual(TimelineEvent.objects.count(), 4)
        for year_int, year_om in EXPECTED_YEARS.items():
            with self.subTest(year=year_int):
                event = TimelineEvent.objects.get(year_int=year_int)
                self.assertEqual(event.year_om, year_om)
                self.assertTrue(event.text_om.strip())
                self.assertTrue(event.text_en.strip())

    def test_every_seeded_entry_has_a_source_citation(self):
        for event in TimelineEvent.objects.all():
            with self.subTest(year=event.year_int):
                citations = SourceCitation.objects.filter(
                    content_type__app_label="archive",
                    content_type__model="timelineevent",
                    object_id=event.pk,
                )
                self.assertGreaterEqual(citations.count(), 1)

    def test_2026_entry_cites_the_inauguration_source(self):
        event = TimelineEvent.objects.get(year_int=2026)
        source_ids = set(
            SourceCitation.objects.filter(
                content_type__app_label="archive",
                content_type__model="timelineevent",
                object_id=event.pk,
            ).values_list("source__source_id", flat=True)
        )
        self.assertIn("SRC-027", source_ids)
        self.assertIn("SRC-029", source_ids)
