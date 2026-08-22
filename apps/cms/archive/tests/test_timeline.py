"""Tests for the TimelineEvent snippet, its seeds, and its API (#28)."""

from django.core.exceptions import ValidationError
from django.test import TestCase
from wagtail.snippets.models import get_snippet_models

from archive.models import TimelineEvent
from editorial.choices import EditorialSubject
from editorial.targets import possible_subjects_for_model
from provenance.models import SourceCitation

TIMELINE_URL = "/api/v2/timeline/"

# year_int -> (display label, OM title) for all 13 mirrored entries.
EXPECTED_ENTRIES = {
    1650: ("mid-1600s", "Sadii Akkayyuu — Biyya Sadii"),
    1874: ("1874", "Laaloo Qilee bulchiinsa argatte"),
    1884: ("1884", "Jootee Tulluu gara Gidaamiitti"),
    1890: ("c.1890", "Dhaloota Oliiqaa Dingil Bookaa"),
    1898: ("1898/1903", "Hundeeffama Dambi Doolloo"),
    1929: ("1929", "Qabsoo Oliiqaa Dingil"),
    1933: ("1933", "Bulchiinsa magaalaa Dambi Doolloo"),
    1941: ("1941", "Beekamtii seeraa"),
    1943: ("1943", "Dhaloota Dr. Nagaasoo Gidaadaa"),
    1995: ("1995–2001", "Pireezidaantii FDRE"),
    1998: ("1998", "Magaalaa guddittii godinaa; aanaalee haaraa"),
    2010: ("2010", "Sadii Canqaa of dandaate"),
    2026: ("2026", "Eebba pirojektoota Dambi Doolloo"),
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
        self.assertIn("title_om", error.exception.message_dict)
        self.assertIn("text_om", error.exception.message_dict)

    def test_english_fields_are_optional(self):
        event = TimelineEvent(
            year_om="1900",
            year_int=1900,
            title_om="Mata duree",
            text_om="Waan bara 1900 ta'e.",
        )
        event.full_clean()

    def test_year_label_rejects_surrounding_whitespace(self):
        event = TimelineEvent(
            year_om=" 1900 ",
            year_int=1900,
            title_om="Mata duree",
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
    def test_all_thirteen_entries_are_seeded_verbatim(self):
        self.assertEqual(TimelineEvent.objects.count(), 13)
        for year_int, (label, title_om) in EXPECTED_ENTRIES.items():
            with self.subTest(year=year_int):
                event = TimelineEvent.objects.get(year_int=year_int)
                self.assertEqual(event.year_om, label)
                self.assertEqual(event.year_en, label)
                self.assertEqual(event.title_om, title_om)
                self.assertTrue(event.title_en.strip())
                self.assertTrue(event.text_om.strip())
                self.assertTrue(event.text_en.strip())

    def test_every_seeded_entry_cites_the_demo_mirror_source(self):
        for event in TimelineEvent.objects.all():
            with self.subTest(year=event.year_int):
                source_ids = set(
                    SourceCitation.objects.filter(
                        content_type__app_label="archive",
                        content_type__model="timelineevent",
                        object_id=event.pk,
                    ).values_list("source__source_id", flat=True)
                )
                self.assertIn("SRC-029", source_ids)

    def test_2026_entry_also_cites_the_inauguration_source(self):
        event = TimelineEvent.objects.get(year_int=2026)
        source_ids = set(
            SourceCitation.objects.filter(
                content_type__app_label="archive",
                content_type__model="timelineevent",
                object_id=event.pk,
            ).values_list("source__source_id", flat=True)
        )
        self.assertIn("SRC-027", source_ids)


class TimelineApiTests(TestCase):
    def test_anonymous_listing_returns_newest_first(self):
        response = self.client.get(TIMELINE_URL, {"limit": 20})
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["meta"]["total_count"], 13)
        years = [item["year_int"] for item in payload["items"]]
        self.assertEqual(years, sorted(years, reverse=True))
        self.assertEqual(years[0], 2026)

    def test_anonymous_listing_serializes_bilingual_fields(self):
        response = self.client.get(TIMELINE_URL, {"limit": 20})
        by_year = {
            item["year_int"]: item for item in response.json()["items"]
        }
        entry = by_year[1898]
        self.assertEqual(entry["year_om"], "1898/1903")
        self.assertEqual(entry["title_om"], "Hundeeffama Dambi Doolloo")
        self.assertIn("muka dambii", entry["text_om"])
        self.assertIn("dambi tree", entry["text_en"])

    def test_anonymous_detail_returns_all_api_fields(self):
        event = TimelineEvent.objects.get(year_int=1929)
        response = self.client.get(f"{TIMELINE_URL}{event.pk}/")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        for field in (
            "year_om",
            "year_en",
            "year_int",
            "title_om",
            "title_en",
            "text_om",
            "text_en",
        ):
            self.assertIn(field, payload, msg=f"missing {field}")

    def test_timeline_endpoint_is_read_only_for_anonymous_users(self):
        response = self.client.post(TIMELINE_URL, {})
        self.assertIn(response.status_code, {403, 405})
