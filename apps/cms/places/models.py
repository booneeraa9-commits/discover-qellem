from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.snippets.models import register_snippet


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
        super().clean()
        errors = {}

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
        super().clean()
        errors = {}

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
