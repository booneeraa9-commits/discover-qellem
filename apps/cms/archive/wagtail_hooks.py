"""Wagtail admin registrations for the archive app."""

from django.utils.translation import gettext_lazy as _
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from archive.models import Person


class PersonSnippetViewSet(SnippetViewSet):
    model = Person
    icon = "user"
    menu_label = _("Notable people")
    list_display = ["name_om", "name_en", "slug", "is_zone_notable"]
    search_fields = ["name_om", "name_en", "slug"]


register_snippet(PersonSnippetViewSet)
