from django.conf import settings
from django.core.exceptions import NON_FIELD_ERRORS, ValidationError
from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from modelcluster.fields import ParentalManyToManyField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.api import APIField
from wagtail.fields import RichTextField
from wagtail.images import get_image_model_string
from wagtail.models import Page
from wagtail.snippets.models import register_snippet

from provenance.choices import SensitivityStatus, VerificationStatus
from qellem_cms.content_validation import (
    PUBLIC_RICH_TEXT_FEATURES,
    MultilingualPageMixin,
    validate_approved_image,
)


class GeographyLevel(models.TextChoices):
    ZONE = "zone", _("Zone")
    WOREDA = "woreda", _("Woreda")
    TOWN = "town", _("Town administration")


class GeographyStatus(models.TextChoices):
    ACTIVE = "active", _("Active")
    HISTORICAL = "historical", _("Historical")


@register_snippet
class Geography(models.Model):
    """Locale-neutral identity for a canonical Qellem geography."""

    canonical_name = models.CharField(
        max_length=120,
        unique=True,
        help_text=_(
            "The approved Afaan Oromoo place name. It remains unchanged in every "
            "public language."
        ),
    )
    slug = models.SlugField(
        max_length=120,
        unique=True,
        help_text=_("Stable canonical URL segment; do not replace it with an alias."),
    )
    level = models.CharField(
        max_length=10,
        choices=GeographyLevel.choices,
    )
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="children",
        help_text=_(
            "Leave empty for Qellem Wallaggaa. Woredas and the town administration "
            "must use Qellem Wallaggaa as parent."
        ),
    )
    status = models.CharField(
        max_length=10,
        choices=GeographyStatus.choices,
        default=GeographyStatus.ACTIVE,
    )
    display_order = models.PositiveSmallIntegerField(
        default=0,
        help_text=_("Lower numbers appear first."),
    )
    administrative_notes = models.TextField(
        blank=True,
        help_text=_("Private administrative notes; never part of public output."),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("canonical_name"),
                FieldPanel("slug"),
                FieldPanel("level"),
                FieldPanel("parent"),
            ],
            heading=_("Canonical identity"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("status"),
                FieldPanel("display_order"),
                FieldPanel("administrative_notes"),
            ],
            heading=_("Administration"),
        ),
    ]

    class Meta:
        ordering = ["display_order", "canonical_name"]
        verbose_name = _("geography")
        verbose_name_plural = _("geographies")
        constraints = [
            models.CheckConstraint(
                condition=(
                    Q(level=GeographyLevel.ZONE, parent__isnull=True)
                    | Q(
                        level__in=[GeographyLevel.WOREDA, GeographyLevel.TOWN],
                        parent__isnull=False,
                    )
                ),
                name="places_geography_level_parent_shape",
            ),
        ]

    def __str__(self):
        return self.canonical_name

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.canonical_name and self.canonical_name != self.canonical_name.strip():
            errors["canonical_name"] = _(
                "Canonical names cannot begin or end with whitespace."
            )

        if self.parent_id and self.pk and self.parent_id == self.pk:
            errors["parent"] = _("A geography cannot be its own parent.")
        elif self.level == GeographyLevel.ZONE:
            if self.parent_id:
                errors["parent"] = _("The zone must be the root geography.")
        elif self.level in {GeographyLevel.WOREDA, GeographyLevel.TOWN}:
            if not self.parent_id:
                errors["parent"] = _(
                    "A woreda or town administration must have the zone as parent."
                )
            elif (
                Geography.objects.filter(pk=self.parent_id)
                .exclude(level=GeographyLevel.ZONE)
                .exists()
            ):
                errors["parent"] = _(
                    "A woreda or town administration must be a direct child "
                    "of the zone."
                )

        if (
            self.slug
            and GeographyAlias.objects.filter(
                slug=self.slug,
                is_active=True,
            ).exists()
        ):
            errors["slug"] = _("This slug is already an active geography alias.")

        if errors:
            raise ValidationError(errors)


class GeographyAliasType(models.TextChoices):
    SPELLING = "spelling", _("Alternative spelling")
    LEGACY_SLUG = "legacy_slug", _("Legacy URL slug")
    HISTORICAL = "historical", _("Historical name")
    OTHER = "other", _("Other")


class AliasLanguageContext(models.TextChoices):
    UNSPECIFIED = "und", _("Unspecified")
    OROMO = "om", _("Afaan Oromoo")
    ENGLISH = "en", _("English")


@register_snippet
class GeographyAlias(models.Model):
    """Search or redirect alias that never replaces a canonical place name."""

    geography = models.ForeignKey(
        Geography,
        on_delete=models.CASCADE,
        related_name="aliases",
    )
    name = models.CharField(
        max_length=120,
        help_text=_(
            "Older or alternative form; never displayed as the canonical name."
        ),
    )
    slug = models.SlugField(
        max_length=120,
        blank=True,
        default="",
        help_text=_("Optional old URL segment used for a redirect."),
    )
    alias_type = models.CharField(
        max_length=16,
        choices=GeographyAliasType.choices,
        default=GeographyAliasType.SPELLING,
    )
    language_context = models.CharField(
        max_length=3,
        choices=AliasLanguageContext.choices,
        default=AliasLanguageContext.UNSPECIFIED,
    )
    redirect_enabled = models.BooleanField(
        default=False,
        help_text=_("Redirect this alias slug to the canonical geography route."),
    )
    is_active = models.BooleanField(default=True)
    notes = models.TextField(
        blank=True,
        help_text=_("Private explanation or evidence for this alias."),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("geography"),
                FieldPanel("name"),
                FieldPanel("slug"),
                FieldPanel("alias_type"),
                FieldPanel("language_context"),
            ],
            heading=_("Alias"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("redirect_enabled"),
                FieldPanel("is_active"),
                FieldPanel("notes"),
            ],
            heading=_("Use and evidence"),
        ),
    ]

    class Meta:
        ordering = ["geography__display_order", "name"]
        verbose_name = _("geography alias")
        verbose_name_plural = _("geography aliases")
        constraints = [
            models.UniqueConstraint(
                fields=["geography", "name", "language_context"],
                name="places_alias_unique_name_context",
            ),
            models.UniqueConstraint(
                fields=["slug"],
                condition=~Q(slug=""),
                name="places_alias_unique_nonempty_slug",
            ),
            models.CheckConstraint(
                condition=(Q(redirect_enabled=False) | Q(is_active=True) & ~Q(slug="")),
                name="places_alias_redirect_requires_active_slug",
            ),
        ]

    def __str__(self):
        return f"{self.name} → {self.geography.canonical_name}"

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.name and self.name != self.name.strip():
            errors["name"] = _("Aliases cannot begin or end with whitespace.")

        if self.geography_id and self.name:
            canonical_name = (
                Geography.objects.filter(pk=self.geography_id)
                .values_list("canonical_name", flat=True)
                .first()
            )
            if canonical_name and self.name.casefold() == canonical_name.casefold():
                errors["name"] = _(
                    "An alias must differ from the canonical place name."
                )
            elif (
                GeographyAlias.objects.filter(
                    geography_id=self.geography_id,
                    name__iexact=self.name,
                    language_context=self.language_context,
                )
                .exclude(pk=self.pk)
                .exists()
            ):
                errors["name"] = _(
                    "This alias already exists for the selected language context."
                )

        if self.redirect_enabled and not self.slug:
            errors["slug"] = _("A redirect requires an alias slug.")
        if self.redirect_enabled and not self.is_active:
            errors["redirect_enabled"] = _("An inactive alias cannot redirect.")

        if self.slug and Geography.objects.filter(slug=self.slug).exists():
            errors["slug"] = _("An alias cannot reuse a canonical geography slug.")

        if errors:
            raise ValidationError(errors)


class GeographyIndexPage(MultilingualPageMixin, Page):
    """Translated Woredas and Towns landing page."""

    introduction = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )

    parent_page_types = ["home.HomePage"]
    subpage_types = ["places.GeographyProfilePage"]
    max_count_per_parent = 1

    required_om_fields = ("introduction",)
    public_rich_text_fields = ("introduction",)
    translation_invariant_fields = ("slug",)

    api_fields = [APIField("introduction")]

    content_panels = Page.content_panels + [FieldPanel("introduction")]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.slug != "places":
            errors["slug"] = _("Use the stable ‘places’ slug in every language.")

        if errors:
            raise ValidationError(errors)


class GeographyProfilePage(MultilingualPageMixin, Page):
    """Translated public profile for one woreda or town administration."""

    geography = models.ForeignKey(
        Geography,
        on_delete=models.PROTECT,
        related_name="profile_page_translations",
        limit_choices_to={
            "level__in": [GeographyLevel.WOREDA, GeographyLevel.TOWN],
        },
    )
    introduction = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    overview = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    naming_origin = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    history = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    area_location = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )
    intro_om = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Afaan Oromoo introduction"),
    )
    intro_en = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("English introduction"),
    )
    intro_am = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Amharic introduction"),
        help_text=_(
            "Optional translation; Afaan Oromoo stays authoritative."
        ),
    )
    history_om = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Afaan Oromoo history"),
    )
    history_en = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("English history"),
    )
    history_am = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Amharic history"),
        help_text=_(
            "Optional translation; Afaan Oromoo stays authoritative."
        ),
    )
    economy_om = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Afaan Oromoo economy"),
    )
    economy_en = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("English economy"),
    )
    economy_am = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Amharic economy"),
        help_text=_(
            "Optional translation; Afaan Oromoo stays authoritative."
        ),
    )
    culture_om = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Afaan Oromoo culture"),
    )
    culture_en = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("English culture"),
    )
    culture_am = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Amharic culture"),
        help_text=_(
            "Optional translation; Afaan Oromoo stays authoritative."
        ),
    )
    geography_om = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Afaan Oromoo geography description"),
    )
    geography_en = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("English geography description"),
    )
    geography_am = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Amharic geography description"),
        help_text=_(
            "Optional translation; Afaan Oromoo stays authoritative."
        ),
    )
    attractions_om = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Afaan Oromoo attractions"),
    )
    attractions_en = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("English attractions"),
    )
    attractions_am = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Amharic attractions"),
        help_text=_(
            "Optional translation; Afaan Oromoo stays authoritative."
        ),
    )
    quick_facts = models.JSONField(
        default=list,
        blank=True,
        help_text=_(
            "List of objects shaped as {label_en, label_om, value, unit?, "
            "note_en?, note_om?}."
        ),
    )
    hero_image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
        help_text=_("Only an image with approved rights may be selected."),
    )
    latitude = models.FloatField(
        null=True,
        blank=True,
        help_text=_("Latitude of the woreda seat town."),
    )
    longitude = models.FloatField(
        null=True,
        blank=True,
        help_text=_("Longitude of the woreda seat town."),
    )
    notable_people = ParentalManyToManyField(
        "archive.Person",
        blank=True,
        related_name="profile_pages",
    )
    featured_image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
        help_text=_("Only an image with approved rights may be selected."),
    )

    parent_page_types = ["places.GeographyIndexPage"]
    subpage_types = []

    required_om_fields = (
        "introduction",
        "overview",
        "intro_om",
        "history_om",
        "economy_om",
        "culture_om",
        "geography_om",
        "attractions_om",
    )
    public_rich_text_fields = (
        "introduction",
        "overview",
        "naming_origin",
        "history",
        "area_location",
        "intro_om",
        "intro_en",
        "history_om",
        "history_en",
        "economy_om",
        "economy_en",
        "culture_om",
        "culture_en",
        "geography_om",
        "geography_en",
        "attractions_om",
        "attractions_en",
        "intro_am",
        "history_am",
        "economy_am",
        "culture_am",
        "geography_am",
        "attractions_am",
    )
    translation_invariant_fields = (
        "geography",
        "slug",
        "quick_facts",
        "latitude",
        "longitude",
    )

    api_fields = [
        APIField("geography_slug"),
        APIField("geography_name"),
        APIField("geography_level"),
        APIField("introduction"),
        APIField("overview"),
        APIField("naming_origin"),
        APIField("history"),
        APIField("area_location"),
        APIField("featured_image"),
        APIField("intro_om"),
        APIField("intro_en"),
        APIField("history_om"),
        APIField("history_en"),
        APIField("economy_om"),
        APIField("economy_en"),
        APIField("culture_om"),
        APIField("culture_en"),
        APIField("geography_om"),
        APIField("geography_en"),
        APIField("attractions_om"),
        APIField("attractions_en"),
        APIField("intro_am"),
        APIField("history_am"),
        APIField("economy_am"),
        APIField("culture_am"),
        APIField("geography_am"),
        APIField("attractions_am"),
        APIField("quick_facts"),
        APIField("hero_image"),
        APIField("latitude"),
        APIField("longitude"),
        APIField("notable_people_list"),
    ]

    @property
    def geography_slug(self):
        return self.geography.slug if self.geography_id else None

    @property
    def geography_name(self):
        return self.geography.canonical_name if self.geography_id else None

    @property
    def geography_level(self):
        return self.geography.level if self.geography_id else None

    @property
    def notable_people_list(self):
        return [
            {
                "slug": person.slug,
                "name_om": person.name_om,
                "name_en": person.name_en,
                "is_zone_notable": person.is_zone_notable,
            }
            for person in self.notable_people.all().order_by("name_om")
        ]

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("geography"),
                FieldPanel("introduction"),
                FieldPanel("overview"),
                FieldPanel("featured_image"),
            ],
            heading=_("Profile overview"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("naming_origin"),
                FieldPanel("history"),
                FieldPanel("area_location"),
            ],
            heading=_("Profile detail"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("intro_om"),
                FieldPanel("intro_en"),
                FieldPanel("history_om"),
                FieldPanel("history_en"),
                FieldPanel("economy_om"),
                FieldPanel("economy_en"),
                FieldPanel("culture_om"),
                FieldPanel("culture_en"),
                FieldPanel("geography_om"),
                FieldPanel("geography_en"),
                FieldPanel("attractions_om"),
                FieldPanel("attractions_en"),
            ],
            heading=_("Woreda profile sections"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("intro_am"),
                FieldPanel("history_am"),
                FieldPanel("economy_am"),
                FieldPanel("culture_am"),
                FieldPanel("geography_am"),
                FieldPanel("attractions_am"),
            ],
            heading=_("Amharic (optional translation)"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("quick_facts"),
                FieldPanel("hero_image"),
                FieldPanel("latitude"),
                FieldPanel("longitude"),
                FieldPanel("notable_people"),
            ],
            heading=_("Facts, hero, and notable people"),
        ),
    ]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.geography_id:
            if self.geography.level == GeographyLevel.ZONE:
                errors["geography"] = _(
                    "Qellem Wallaggaa uses the combined homepage, not a profile page."
                )
            if self.title != self.geography.canonical_name:
                errors["title"] = _(
                    "Use the canonical Afaan Oromoo geography name in every language."
                )
            if self.slug != self.geography.slug:
                errors["slug"] = _(
                    "The page slug must match the geography’s stable canonical slug."
                )

        if (
            self.geography_id
            and self.locale_id
            and GeographyProfilePage.objects.filter(
                geography_id=self.geography_id,
                locale_id=self.locale_id,
            )
            .exclude(pk=self.pk)
            .exists()
        ):
            errors.setdefault(NON_FIELD_ERRORS, []).append(
                _("This geography already has a profile in the selected language.")
            )

        validate_approved_image(self, "featured_image", errors)
        validate_approved_image(self, "hero_image", errors)

        self._validate_quick_facts(errors)

        if (self.latitude is None) != (self.longitude is None):
            errors["longitude"] = _(
                "Provide both latitude and longitude, or neither."
            )
        if self.latitude is not None and not -90 <= self.latitude <= 90:
            errors["latitude"] = _("Latitude must be between -90 and 90.")
        if self.longitude is not None and not -180 <= self.longitude <= 180:
            errors["longitude"] = _("Longitude must be between -180 and 180.")

        if errors:
            raise ValidationError(errors)

    QUICK_FACT_REQUIRED_KEYS = frozenset({"label_en", "label_om", "value"})
    QUICK_FACT_ALLOWED_KEYS = QUICK_FACT_REQUIRED_KEYS | {
        "unit",
        "note_en",
        "note_om",
    }

    def _validate_quick_facts(self, errors):
        facts = self.quick_facts
        if facts in (None, ""):
            self.quick_facts = []
            return
        if not isinstance(facts, list):
            errors["quick_facts"] = _(
                "Quick facts must be a list of fact objects."
            )
            return
        for position, fact in enumerate(facts, start=1):
            if not isinstance(fact, dict):
                errors["quick_facts"] = _(
                    "Quick fact %(position)s must be an object."
                ) % {"position": position}
                return
            missing = self.QUICK_FACT_REQUIRED_KEYS - fact.keys()
            unknown = fact.keys() - self.QUICK_FACT_ALLOWED_KEYS
            if missing:
                errors["quick_facts"] = _(
                    "Quick fact %(position)s is missing required keys: "
                    "%(missing)s."
                ) % {"position": position, "missing": ", ".join(sorted(missing))}
                return
            if unknown:
                errors["quick_facts"] = _(
                    "Quick fact %(position)s has unsupported keys: %(unknown)s."
                ) % {"position": position, "unknown": ", ".join(sorted(unknown))}
                return
            for label_key in ("label_en", "label_om"):
                if not str(fact[label_key]).strip():
                    errors["quick_facts"] = _(
                        "Quick fact %(position)s needs a non-empty "
                        "%(label_key)s."
                    ) % {"position": position, "label_key": label_key}
                    return


@register_snippet
class DatedStatistic(models.Model):
    """A source-backed historical statistic that never overwrites another year."""

    geography = models.ForeignKey(
        Geography,
        on_delete=models.PROTECT,
        related_name="dated_statistics",
    )
    indicator_om = models.CharField(
        max_length=255,
        verbose_name=_("Afaan Oromoo indicator"),
    )
    indicator_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("English indicator"),
    )
    value = models.DecimalField(max_digits=20, decimal_places=4)
    unit_om = models.CharField(
        max_length=120,
        verbose_name=_("Afaan Oromoo unit"),
    )
    unit_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name=_("English unit"),
    )
    subgroup_om = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Afaan Oromoo subgroup or definition"),
    )
    subgroup_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("English subgroup or definition"),
    )
    reference_year_ec = models.CharField(
        max_length=20,
        help_text=_("For example: 2016 E.C."),
    )
    reference_year_gc = models.CharField(
        max_length=20,
        help_text=_("For example: 2023/24 G.C."),
    )
    method_note_om = models.TextField(
        blank=True,
        verbose_name=_("Afaan Oromoo method or explanatory note"),
    )
    method_note_en = models.TextField(
        blank=True,
        verbose_name=_("English method or explanatory note"),
    )
    source = models.ForeignKey(
        "provenance.SourceRecord",
        on_delete=models.PROTECT,
        related_name="dated_statistics",
    )
    verification_status = models.CharField(
        max_length=12,
        choices=VerificationStatus.choices,
        default=VerificationStatus.UNVERIFIED,
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="reviewed_dated_statistics",
    )
    verified_on = models.DateField(null=True, blank=True)
    verification_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("geography"),
                FieldPanel("indicator_om"),
                FieldPanel("indicator_en"),
                FieldPanel("value"),
                FieldPanel("unit_om"),
                FieldPanel("unit_en"),
                FieldPanel("subgroup_om"),
                FieldPanel("subgroup_en"),
            ],
            heading=_("Statistic"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("reference_year_ec"),
                FieldPanel("reference_year_gc"),
                FieldPanel("method_note_om"),
                FieldPanel("method_note_en"),
                FieldPanel("source"),
            ],
            heading=_("Reference period and source"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("verification_status"),
                FieldPanel("reviewed_by"),
                FieldPanel("verified_on"),
                FieldPanel("verification_notes"),
            ],
            heading=_("Verification"),
        ),
    ]

    class Meta:
        ordering = [
            "geography__display_order",
            "indicator_om",
            "-reference_year_ec",
        ]
        verbose_name = _("dated statistic")
        verbose_name_plural = _("dated statistics")
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "geography",
                    "indicator_om",
                    "subgroup_om",
                    "reference_year_ec",
                    "reference_year_gc",
                ],
                name="places_statistic_unique_snapshot",
            )
        ]

    def __str__(self):
        return (
            f"{self.geography.canonical_name}: {self.indicator_om} "
            f"({self.reference_year_ec})"
        )

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.verification_status in {
            VerificationStatus.VERIFIED,
            VerificationStatus.REJECTED,
        }:
            if not self.reviewed_by_id:
                errors["reviewed_by"] = _(
                    "A completed statistic review requires a reviewer."
                )
            if not self.verified_on:
                errors["verified_on"] = _(
                    "A completed statistic review requires a verification date."
                )

        if self.verification_status == VerificationStatus.VERIFIED and self.source_id:
            if self.source.verification_status != VerificationStatus.VERIFIED:
                errors["source"] = _(
                    "Verify the linked source before verifying this statistic."
                )
            elif self.source.sensitivity_status != SensitivityStatus.CLEARED:
                errors["source"] = _(
                    "Clear the linked source’s sensitivity screening first."
                )

        if (
            self.verification_status == VerificationStatus.REJECTED
            and not self.verification_notes.strip()
        ):
            errors["verification_notes"] = _("Explain why this statistic was rejected.")

        if errors:
            raise ValidationError(errors)
