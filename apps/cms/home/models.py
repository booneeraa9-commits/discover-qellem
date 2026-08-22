from django.core.exceptions import NON_FIELD_ERRORS, ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.api import APIField
from wagtail.fields import RichTextField
from wagtail.images import get_image_model_string
from wagtail.models import Page

from qellem_cms.content_validation import (
    PUBLIC_RICH_TEXT_FEATURES,
    AuthoritativeOromoPageMixin,
    validate_approved_image,
)


class HomePage(AuthoritativeOromoPageMixin, Page):
    """The single translated page identity for the Qellem Wallaggaa zone profile."""

    geography = models.ForeignKey(
        "places.Geography",
        to_field="slug",
        db_column="geography_slug",
        default="qellem-wallaggaa",
        on_delete=models.PROTECT,
        related_name="homepage_translations",
        limit_choices_to={"level": "zone"},
    )
    introduction = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        help_text=_("Opening introduction in this page's language."),
    )
    overview = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        help_text=_("Authoritative zone overview in this page's language."),
    )
    naming_summary = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    history_summary = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    culture_summary = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    contribute_summary = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    hero_image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
        help_text=_("Only an image with approved rights may be selected."),
    )

    # A second independent zone homepage is prohibited. Wagtail translations retain
    # the original translation key and are validated as one bilingual identity.
    max_count = 1
    parent_page_types = ["wagtailcore.Page"]
    subpage_types = [
        "places.GeographyIndexPage",
        "archive.HistoryCultureIndexPage",
        "archive.PeopleIndexPage",
        "archive.GlossaryIndexPage",
        "archive.ArchiveIndexPage",
    ]

    required_om_fields = ("introduction", "overview")
    public_rich_text_fields = (
        "introduction",
        "overview",
        "naming_summary",
        "history_summary",
        "culture_summary",
        "contribute_summary",
    )
    translation_invariant_fields = ("geography",)

    api_fields = [
        APIField("geography_slug"),
        APIField("geography_name"),
        APIField("introduction"),
        APIField("overview"),
        APIField("naming_summary"),
        APIField("history_summary"),
        APIField("culture_summary"),
        APIField("contribute_summary"),
        APIField("hero_image"),
    ]

    @property
    def geography_slug(self):
        return self.geography.slug if self.geography_id else None

    @property
    def geography_name(self):
        return self.geography.canonical_name if self.geography_id else None

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("geography"),
                FieldPanel("introduction"),
                FieldPanel("overview"),
                FieldPanel("hero_image"),
            ],
            heading=_("Zone profile"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("naming_summary"),
                FieldPanel("history_summary"),
                FieldPanel("culture_summary"),
                FieldPanel("contribute_summary"),
            ],
            heading=_("Homepage section introductions"),
        ),
    ]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.geography_id:
            if self.geography.level != "zone":
                errors["geography"] = _(
                    "The combined homepage must reference Qellem Wallaggaa zone."
                )
            elif self.geography.slug != "qellem-wallaggaa":
                errors["geography"] = _(
                    "The combined homepage must reference Qellem Wallaggaa."
                )
            elif self.title != self.geography.canonical_name:
                errors["title"] = _(
                    "The homepage title must use the canonical Qellem Wallaggaa name."
                )

        if (
            self.locale_id
            and self.locale.language_code == "om"
            and HomePage.objects.exclude(pk=self.pk)
            .exclude(translation_key=self.translation_key)
            .exists()
        ):
            errors.setdefault(NON_FIELD_ERRORS, []).append(
                _("Only one Qellem Wallaggaa homepage identity is allowed.")
            )

        validate_approved_image(self, "hero_image", errors)

        if errors:
            raise ValidationError(errors)
