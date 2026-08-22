"""Wagtail admin registrations for the archive app."""

from django.utils.translation import gettext_lazy as _
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from archive.models import Person, TimelineEvent


class PersonSnippetViewSet(SnippetViewSet):
    model = Person
    icon = "user"
    menu_label = _("Notable people")
    list_display = ["name_om", "name_en", "slug", "is_zone_notable"]
    search_fields = ["name_om", "name_en", "slug"]


register_snippet(PersonSnippetViewSet)


class TimelineEventSnippetViewSet(SnippetViewSet):
    model = TimelineEvent
    icon = "date"
    menu_label = _("Timeline events")
    list_display = ["year_om", "year_en", "year_int", "title_om"]
    search_fields = ["year_om", "year_en", "title_om", "title_en", "text_om", "text_en"]


register_snippet(TimelineEventSnippetViewSet)
