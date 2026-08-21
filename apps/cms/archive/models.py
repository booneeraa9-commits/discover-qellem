from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.images import get_image_model_string
from wagtail.models import Page

from places.models import Geography
from qellem_cms.content_validation import (
    PUBLIC_RICH_TEXT_FEATURES,
    AuthoritativeOromoPageMixin,
    validate_approved_image,
)


class ArchiveCategory(models.TextChoices):
    HISTORY = "history", _("History")
    NAMING = "naming", _("Name origin or meaning")
    CULTURE = "culture", _("Culture")
    HERITAGE = "heritage", _("Heritage")
    PLACE = "place", _("Place or landmark")
    COMMUNITY_VOICE = "community_voice", _("Community voice")
    ORAL_HISTORY = "oral_history", _("Oral history")


class PartOfSpeech(models.TextChoices):
    NOUN = "noun", _("Noun")
    VERB = "verb", _("Verb")
    ADJECTIVE = "adjective", _("Adjective")
    ADVERB = "adverb", _("Adverb")
    PHRASE = "phrase", _("Phrase")
    PROPER_NAME = "proper_name", _("Proper name")
    OTHER = "other", _("Other")


class HistoryCultureIndexPage(AuthoritativeOromoPageMixin, Page):
    introduction = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )

    parent_page_types = ["home.HomePage"]
    subpage_types = ["archive.ArchiveEntryPage"]
    max_count_per_parent = 1

    required_om_fields = ("introduction",)
    public_rich_text_fields = ("introduction",)
    translation_invariant_fields = ("slug",)

    content_panels = Page.content_panels + [FieldPanel("introduction")]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.slug != "history":
            errors["slug"] = _("Use the stable ‘history’ slug in every language.")

        if errors:
            raise ValidationError(errors)


class PeopleIndexPage(AuthoritativeOromoPageMixin, Page):
    introduction = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )

    parent_page_types = ["home.HomePage"]
    subpage_types = ["archive.DeceasedPersonPage"]
    max_count_per_parent = 1

    required_om_fields = ("introduction",)
    public_rich_text_fields = ("introduction",)
    translation_invariant_fields = ("slug",)

    content_panels = Page.content_panels + [FieldPanel("introduction")]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.slug != "people":
            errors["slug"] = _("Use the stable ‘people’ slug in every language.")

        if errors:
            raise ValidationError(errors)


class GlossaryIndexPage(AuthoritativeOromoPageMixin, Page):
    introduction = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )

    parent_page_types = ["home.HomePage"]
    subpage_types = ["archive.GlossaryTermPage"]
    max_count_per_parent = 1

    required_om_fields = ("introduction",)
    public_rich_text_fields = ("introduction",)
    translation_invariant_fields = ("slug",)

    content_panels = Page.content_panels + [FieldPanel("introduction")]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.slug != "glossary":
            errors["slug"] = _("Use the stable ‘glossary’ slug in every language.")

        if errors:
            raise ValidationError(errors)


class ArchiveEntryPage(AuthoritativeOromoPageMixin, Page):
    category = models.CharField(max_length=20, choices=ArchiveCategory.choices)
    geography = models.ForeignKey(
        Geography,
        on_delete=models.PROTECT,
        related_name="archive_entry_translations",
    )
    summary = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    body = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    relevant_period = models.CharField(
        max_length=160,
        blank=True,
        help_text=_("Relevant date or period exactly as supported by the source."),
    )
    uncertainty_notes = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        help_text=_("Public alternative accounts, qualifications, or uncertainty."),
    )
    featured_image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
        help_text=_("Only an image with approved rights may be selected."),
    )

    parent_page_types = ["archive.HistoryCultureIndexPage"]
    subpage_types = []

    required_om_fields = ("summary", "body")
    public_rich_text_fields = ("summary", "body", "uncertainty_notes")
    translation_invariant_fields = (
        "category",
        "geography",
        "relevant_period",
        "slug",
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("category"),
                FieldPanel("geography"),
                FieldPanel("relevant_period"),
                FieldPanel("featured_image"),
            ],
            heading=_("Archive identity"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("summary"),
                FieldPanel("body"),
                FieldPanel("uncertainty_notes"),
            ],
            heading=_("Archive account"),
        ),
    ]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)
        validate_approved_image(self, "featured_image", errors)
        if errors:
            raise ValidationError(errors)


class DeceasedPersonPage(AuthoritativeOromoPageMixin, Page):
    canonical_name = models.CharField(
        max_length=255,
        help_text=_("The verified name used unchanged in every language."),
    )
    name_aliases = models.TextField(
        blank=True,
        help_text=_("Verified spelling or naming aliases, one per line."),
    )
    birth_date_or_period = models.CharField(max_length=160, blank=True)
    death_date_or_period = models.CharField(
        max_length=160,
        help_text=_("Exact or qualified approximate death date/period."),
    )
    birthplace = models.ForeignKey(
        Geography,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="people_born_here_translations",
    )
    geographic_associations = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    occupations = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    summary = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    biography = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    public_significance = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    portrait = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
        help_text=_("Only an image with approved rights may be selected."),
    )

    parent_page_types = ["archive.PeopleIndexPage"]
    subpage_types = []

    required_om_fields = (
        "occupations",
        "summary",
        "biography",
        "public_significance",
    )
    public_rich_text_fields = (
        "geographic_associations",
        "occupations",
        "summary",
        "biography",
        "public_significance",
    )
    translation_invariant_fields = (
        "canonical_name",
        "name_aliases",
        "birth_date_or_period",
        "death_date_or_period",
        "birthplace",
        "slug",
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("canonical_name"),
                FieldPanel("name_aliases"),
                FieldPanel("birth_date_or_period"),
                FieldPanel("death_date_or_period"),
                FieldPanel("birthplace"),
                FieldPanel("geographic_associations"),
                FieldPanel("portrait"),
            ],
            heading=_("Verified identity"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("occupations"),
                FieldPanel("summary"),
                FieldPanel("biography"),
                FieldPanel("public_significance"),
            ],
            heading=_("Biographical account"),
        ),
    ]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.canonical_name and self.title != self.canonical_name:
            errors["title"] = _(
                "The page title must match the verified canonical person name."
            )

        validate_approved_image(self, "portrait", errors)

        if errors:
            raise ValidationError(errors)


class GlossaryTermPage(AuthoritativeOromoPageMixin, Page):
    canonical_term = models.CharField(
        max_length=255,
        help_text=_("The authoritative Afaan Oromoo term used in every language."),
    )
    part_of_speech = models.CharField(
        max_length=16,
        choices=PartOfSpeech.choices,
    )
    definition = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    usage_example = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    related_terms = models.CharField(max_length=500, blank=True)

    parent_page_types = ["archive.GlossaryIndexPage"]
    subpage_types = []

    required_om_fields = ("definition",)
    public_rich_text_fields = ("definition", "usage_example")
    translation_invariant_fields = ("canonical_term", "part_of_speech", "slug")

    content_panels = Page.content_panels + [
        FieldPanel("canonical_term"),
        FieldPanel("part_of_speech"),
        FieldPanel("definition"),
        FieldPanel("usage_example"),
        FieldPanel("related_terms"),
    ]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.canonical_term and self.title != self.canonical_term:
            errors["title"] = _(
                "The page title must match the authoritative Afaan Oromoo term."
            )

        if errors:
            raise ValidationError(errors)
