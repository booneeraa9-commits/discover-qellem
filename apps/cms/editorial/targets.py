from django.core.exceptions import ObjectDoesNotExist

from editorial.choices import EditorialLanguage, EditorialSubject
from editorial.policy import EditorialTarget, editorial_policy

ZONE_SLUG = "qellem-wallaggaa"


def zone_geography_id():
    from places.models import Geography

    return Geography.objects.only("pk").get(slug=ZONE_SLUG).pk


def _language_from_locale(locale):
    return editorial_policy.normalize_language(
        getattr(locale, "language_code", EditorialLanguage.OROMO)
    )


def _posted_geography_id(data, field_name="geography"):
    from places.models import Geography

    raw_value = data.get(field_name) if data else None
    if not raw_value:
        return None
    try:
        return Geography.objects.only("pk").get(pk=raw_value).pk
    except (Geography.DoesNotExist, ValueError, TypeError):
        try:
            return Geography.objects.only("pk").get(slug=raw_value).pk
        except Geography.DoesNotExist:
            return None


def _related_geography_id(instance, field_name="geography"):
    try:
        geography = getattr(instance, field_name, None)
    except ObjectDoesNotExist:
        geography = None
    return getattr(geography, "pk", None)


def page_subject(page_or_class):
    from archive.models import (
        ArchiveEntryPage,
        ArchiveIndexPage,
        CommunityStory,
        DeceasedPersonPage,
        Event,
        GlossaryIndexPage,
        GlossaryTermPage,
        HistoryCultureIndexPage,
        NewsArticle,
        PeopleIndexPage,
    )
    from home.models import HomePage
    from places.models import GeographyIndexPage, GeographyProfilePage

    model = page_or_class if isinstance(page_or_class, type) else type(page_or_class)
    if issubclass(model, HomePage):
        return EditorialSubject.HOME_ZONE
    if issubclass(model, (GeographyIndexPage, GeographyProfilePage)):
        return EditorialSubject.GEOGRAPHY
    if issubclass(model, (HistoryCultureIndexPage, ArchiveEntryPage)):
        return EditorialSubject.HISTORY_CULTURE
    if issubclass(model, (PeopleIndexPage, DeceasedPersonPage)):
        return EditorialSubject.PEOPLE
    if issubclass(model, (GlossaryIndexPage, GlossaryTermPage)):
        return EditorialSubject.GLOSSARY_LANGUAGE
    if issubclass(model, (ArchiveIndexPage, NewsArticle, Event)):
        return EditorialSubject.NEWS_FEED
    if issubclass(model, CommunityStory):
        return EditorialSubject.PUBLIC_SUBMISSIONS
    return EditorialSubject.HOME_ZONE


def page_target(page, *, data=None):
    """Resolve a saved Wagtail page to stable authorization coordinates."""

    from archive.models import ArchiveEntryPage, DeceasedPersonPage
    from places.models import GeographyProfilePage

    page = page.specific
    subject = page_subject(page)
    geography_id = zone_geography_id()
    if isinstance(page, (GeographyProfilePage, ArchiveEntryPage)):
        geography_id = _related_geography_id(page)
    elif isinstance(page, DeceasedPersonPage):
        geography_id = _related_geography_id(page, "birthplace") or geography_id

    if data:
        if isinstance(page, (GeographyProfilePage, ArchiveEntryPage)):
            geography_id = _posted_geography_id(data) or geography_id
        elif isinstance(page, DeceasedPersonPage):
            geography_id = _posted_geography_id(data, "birthplace") or geography_id

    return EditorialTarget(
        subject=subject,
        geography_id=geography_id,
        language=_language_from_locale(page.locale),
    )


def page_create_target(page_class, parent_page, *, data=None, locale_code=None):
    from archive.models import ArchiveEntryPage, DeceasedPersonPage
    from places.models import GeographyProfilePage

    geography_id = zone_geography_id()
    if issubclass(page_class, (GeographyProfilePage, ArchiveEntryPage)):
        geography_id = _posted_geography_id(data)
    elif issubclass(page_class, DeceasedPersonPage):
        geography_id = _posted_geography_id(data, "birthplace") or geography_id

    language = editorial_policy.normalize_language(
        locale_code or (data or {}).get("locale")
    )
    if not language:
        language = _language_from_locale(parent_page.locale)

    return EditorialTarget(
        subject=page_subject(page_class),
        geography_id=geography_id,
        language=language,
    )


def model_target(instance, *, data=None):
    """Resolve protected locale-neutral snippets and media-rights records."""

    from archive.models import Person
    from partners.models import Collaborator, Sponsor
    from places.models import DatedStatistic, Geography, GeographyAlias
    from provenance.models import MediaRights, SourceCitation, SourceRecord

    zone_id = zone_geography_id()

    if isinstance(instance, Person):
        return EditorialTarget(
            EditorialSubject.PEOPLE,
            zone_id,
            EditorialLanguage.BOTH,
        )
    if isinstance(instance, Geography):
        return EditorialTarget(
            EditorialSubject.GEOGRAPHY,
            instance.pk or _posted_geography_id(data, "parent"),
            EditorialLanguage.BOTH,
        )
    if isinstance(instance, GeographyAlias):
        return EditorialTarget(
            EditorialSubject.GEOGRAPHY,
            _related_geography_id(instance) or _posted_geography_id(data),
            EditorialLanguage.BOTH,
        )
    if isinstance(instance, DatedStatistic):
        return EditorialTarget(
            EditorialSubject.STATISTICS,
            _related_geography_id(instance) or _posted_geography_id(data),
            EditorialLanguage.BOTH,
        )
    if isinstance(instance, SourceRecord):
        language = {
            "om": EditorialLanguage.OROMO,
            "en": EditorialLanguage.ENGLISH,
            "om_en": EditorialLanguage.BOTH,
        }.get(instance.language or (data or {}).get("language"), EditorialLanguage.BOTH)
        return EditorialTarget(
            EditorialSubject.SOURCES,
            _related_geography_id(instance) or _posted_geography_id(data) or zone_id,
            language,
        )
    if isinstance(instance, SourceCitation):
        geography_id = zone_id
        if instance.source_id:
            geography_id = _related_geography_id(instance.source) or zone_id
        return EditorialTarget(
            EditorialSubject.SOURCES,
            geography_id,
            EditorialLanguage.BOTH,
        )
    if isinstance(instance, MediaRights):
        return media_target()
    if isinstance(instance, (Sponsor, Collaborator)):
        return EditorialTarget(
            EditorialSubject.PARTNERS,
            zone_id,
            EditorialLanguage.BOTH,
        )
    return None


def model_create_target(model, *, data=None):
    try:
        instance = model()
    except TypeError:
        return None
    return model_target(instance, data=data)


def possible_subjects_for_model(model):
    """Return subjects that may be chosen without touching the database."""

    from archive.models import Person, TimelineEvent
    from partners.models import Collaborator, Sponsor
    from places.models import DatedStatistic, Geography, GeographyAlias
    from provenance.models import MediaRights, SourceCitation, SourceRecord

    if issubclass(model, Person):
        return frozenset({EditorialSubject.PEOPLE})
    if issubclass(model, TimelineEvent):
        return frozenset({EditorialSubject.HISTORY_CULTURE})
    if issubclass(model, (Geography, GeographyAlias)):
        return frozenset({EditorialSubject.GEOGRAPHY})
    if issubclass(model, DatedStatistic):
        return frozenset({EditorialSubject.STATISTICS})
    if issubclass(model, (SourceRecord, SourceCitation)):
        return frozenset({EditorialSubject.SOURCES})
    if issubclass(model, MediaRights):
        return frozenset({EditorialSubject.MEDIA})
    if issubclass(model, (Sponsor, Collaborator)):
        return frozenset({EditorialSubject.PARTNERS})
    return frozenset()


def media_target():
    """Media remains zone-wide until per-image geographic metadata exists."""

    return EditorialTarget(
        EditorialSubject.MEDIA,
        zone_geography_id(),
        EditorialLanguage.BOTH,
    )
