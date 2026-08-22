from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.api import APIField
from wagtail.fields import RichTextField
from wagtail.images import get_image_model_string
from wagtail.models import Orderable, Page
from wagtail.search import index

from places.models import Geography
from qellem_cms.content_validation import (
    PUBLIC_RICH_TEXT_FEATURES,
    AuthoritativeOromoPageMixin,
    text_has_meaning,
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


class NewsCategory(models.TextChoices):
    """PM-approved 9-category taxonomy; keys match the frontend categoryKey."""

    DEVELOPMENT = "development", _("Development / Misooma")
    ECONOMY = "economy", _("Economy / Dinagdee")
    ENVIRONMENT = "environment", _("Environment / Naannoo")
    MINERALS = "minerals", _("Minerals / Mineraala")
    AGRICULTURE = "agriculture", _("Agriculture / Qonna")
    HEALTH = "health", _("Health / Fayyaa")
    EDUCATION = "education", _("Education / Barnoota")
    CULTURE = "culture", _("Culture / Aadaa")
    TRADE = "trade", _("Trade / Daldala")


class BilingualCompanionFieldsMixin(models.Model):
    """Reject English content whose Afaan Oromoo counterpart is missing."""

    # Pairs of (english_field_name, oromo_field_name).
    bilingual_field_pairs = ()

    class Meta:
        abstract = True

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        for en_field, om_field in self.bilingual_field_pairs:
            if text_has_meaning(getattr(self, en_field, "")) and not text_has_meaning(
                getattr(self, om_field, "")
            ):
                errors.setdefault(
                    om_field,
                    _(
                        "Provide the authoritative Afaan Oromoo content before "
                        "adding the English version."
                    ),
                )

        if errors:
            raise ValidationError(errors)


class ArchiveIndexPage(AuthoritativeOromoPageMixin, Page):
    """Single parent page for news, events, and community stories."""

    introduction = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
    )

    parent_page_types = ["home.HomePage"]
    subpage_types = [
        "archive.NewsArticle",
        "archive.Event",
        "archive.CommunityStory",
    ]
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

        if self.slug != "archive":
            errors["slug"] = _("Use the stable 'archive' slug in every language.")

        if errors:
            raise ValidationError(errors)


class NewsArticle(BilingualCompanionFieldsMixin, AuthoritativeOromoPageMixin, Page):
    """A bilingual news article with a category, date, and ordered gallery."""

    title_om = models.CharField(
        max_length=255,
        verbose_name=_("Afaan Oromoo title"),
    )
    title_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("English title"),
    )
    body_om = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Afaan Oromoo body"),
    )
    body_en = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("English body"),
    )
    category = models.CharField(
        max_length=20,
        choices=NewsCategory.choices,
    )
    published_date = models.DateField()
    featured_image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
        help_text=_("Only an image with approved rights may be selected."),
    )

    parent_page_types = ["archive.ArchiveIndexPage"]
    subpage_types = []

    required_om_fields = ("title_om", "body_om")
    public_rich_text_fields = ("body_om", "body_en")
    translation_invariant_fields = ("category", "published_date", "slug")
    bilingual_field_pairs = (
        ("title_en", "title_om"),
        ("body_en", "body_om"),
    )

    api_fields = [
        APIField("title_om"),
        APIField("title_en"),
        APIField("body_om"),
        APIField("body_en"),
        APIField("category"),
        APIField("published_date"),
        APIField("featured_image"),
        APIField("gallery_images"),
    ]

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("title_om"),
                FieldPanel("title_en"),
                FieldPanel("category"),
                FieldPanel("published_date"),
                FieldPanel("featured_image"),
            ],
            heading=_("Article identity"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("body_om"),
                FieldPanel("body_en"),
            ],
            heading=_("Article body"),
        ),
        InlinePanel("gallery_images", label=_("Gallery images")),
    ]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.title_om and self.title != self.title_om:
            errors["title"] = _(
                "The page title must match the authoritative Afaan Oromoo title."
            )

        validate_approved_image(self, "featured_image", errors)

        if errors:
            raise ValidationError(errors)


class NewsArticleGalleryImage(Orderable):
    """One ordered gallery image belonging to a news article."""

    page = ParentalKey(
        NewsArticle,
        on_delete=models.CASCADE,
        related_name="gallery_images",
    )
    image = models.ForeignKey(
        get_image_model_string(),
        on_delete=models.PROTECT,
        related_name="+",
    )
    caption_om = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Afaan Oromoo caption"),
    )
    caption_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("English caption"),
    )

    api_fields = [
        APIField("image"),
        APIField("caption_om"),
        APIField("caption_en"),
    ]

    panels = [
        FieldPanel("image"),
        FieldPanel("caption_om"),
        FieldPanel("caption_en"),
    ]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)
        if self.caption_en and not self.caption_om:
            errors["caption_om"] = _(
                "Provide the authoritative Afaan Oromoo caption before "
                "adding the English version."
            )
        if errors:
            raise ValidationError(errors)


class Event(BilingualCompanionFieldsMixin, AuthoritativeOromoPageMixin, Page):
    """A bilingual public event with a schedule and an optional location."""

    title_om = models.CharField(
        max_length=255,
        verbose_name=_("Afaan Oromoo title"),
    )
    title_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("English title"),
    )
    body_om = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Afaan Oromoo body"),
    )
    body_en = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("English body"),
    )
    event_start = models.DateTimeField()
    event_end = models.DateTimeField(null=True, blank=True)
    location_text_om = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Afaan Oromoo location"),
    )
    location_text_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("English location"),
    )
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    featured_image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
        help_text=_("Only an image with approved rights may be selected."),
    )

    parent_page_types = ["archive.ArchiveIndexPage"]
    subpage_types = []

    required_om_fields = ("title_om", "body_om")
    public_rich_text_fields = ("body_om", "body_en")
    translation_invariant_fields = (
        "event_start",
        "event_end",
        "latitude",
        "longitude",
        "slug",
    )
    bilingual_field_pairs = (
        ("title_en", "title_om"),
        ("body_en", "body_om"),
        ("location_text_en", "location_text_om"),
    )

    api_fields = [
        APIField("title_om"),
        APIField("title_en"),
        APIField("body_om"),
        APIField("body_en"),
        APIField("event_start"),
        APIField("event_end"),
        APIField("location_text_om"),
        APIField("location_text_en"),
        APIField("latitude"),
        APIField("longitude"),
        APIField("featured_image"),
    ]

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("title_om"),
                FieldPanel("title_en"),
                FieldPanel("event_start"),
                FieldPanel("event_end"),
                FieldPanel("featured_image"),
            ],
            heading=_("Event identity"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("location_text_om"),
                FieldPanel("location_text_en"),
                FieldPanel("latitude"),
                FieldPanel("longitude"),
            ],
            heading=_("Location"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("body_om"),
                FieldPanel("body_en"),
            ],
            heading=_("Event body"),
        ),
    ]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.title_om and self.title != self.title_om:
            errors["title"] = _(
                "The page title must match the authoritative Afaan Oromoo title."
            )

        if self.event_end and self.event_start and self.event_end < self.event_start:
            errors["event_end"] = _("The event cannot end before it starts.")

        if (self.latitude is None) != (self.longitude is None):
            errors["longitude"] = _(
                "Provide both latitude and longitude, or neither."
            )
        if self.latitude is not None and not -90 <= self.latitude <= 90:
            errors["latitude"] = _("Latitude must be between -90 and 90.")
        if self.longitude is not None and not -180 <= self.longitude <= 180:
            errors["longitude"] = _("Longitude must be between -180 and 180.")

        validate_approved_image(self, "featured_image", errors)

        if errors:
            raise ValidationError(errors)


class CommunityStory(AuthoritativeOromoPageMixin, Page):
    """A community-submitted story that is public only after approval."""

    author_name = models.CharField(max_length=255)
    story_om = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Afaan Oromoo story"),
    )
    story_en = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("English story"),
    )
    submitted_at = models.DateTimeField(default=timezone.now)
    approved = models.BooleanField(
        default=False,
        help_text=_(
            "Unapproved stories are hidden from the anonymous public API even "
            "when the page is live."
        ),
    )

    parent_page_types = ["archive.ArchiveIndexPage"]
    subpage_types = []

    required_om_fields = ("story_om",)
    public_rich_text_fields = ("story_om", "story_en")
    translation_invariant_fields = ("author_name", "submitted_at", "approved", "slug")

    api_fields = [
        APIField("author_name"),
        APIField("story_om"),
        APIField("story_en"),
        APIField("submitted_at"),
        APIField("approved"),
    ]

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("author_name"),
                FieldPanel("submitted_at"),
                FieldPanel("approved"),
            ],
            heading=_("Submission"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("story_om"),
                FieldPanel("story_en"),
            ],
            heading=_("Story"),
        ),
    ]

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.story_en and not text_has_meaning(self.story_om):
            errors.setdefault(
                "story_om",
                _(
                    "Provide the authoritative Afaan Oromoo story before "
                    "adding the English version."
                ),
            )

        if errors:
            raise ValidationError(errors)


class Person(index.Indexed, ClusterableModel):
    """A notable person shown on woreda pages and zone-wide listings."""

    name_om = models.CharField(
        max_length=255,
        verbose_name=_("Afaan Oromoo name"),
    )
    name_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("English name"),
    )
    slug = models.SlugField(
        max_length=255,
        unique=True,
        help_text=_("Stable identifier used by the public API; do not recycle."),
    )
    birth_year = models.IntegerField(
        null=True,
        blank=True,
        help_text=_("Leave empty until the year is verified against a source."),
    )
    death_year = models.IntegerField(
        null=True,
        blank=True,
        help_text=_("Leave empty when the person is alive or the year is unverified."),
    )
    bio_om = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("Afaan Oromoo biography"),
    )
    bio_en = RichTextField(
        blank=True,
        features=PUBLIC_RICH_TEXT_FEATURES,
        verbose_name=_("English biography"),
    )
    photo = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
        help_text=_("Only an image with approved rights may be selected."),
    )
    woredas = models.ManyToManyField(
        Geography,
        through="archive.PersonPlacement",
        related_name="notable_people",
        blank=True,
    )
    is_zone_notable = models.BooleanField(
        default=False,
        help_text=_("Show this person on zone-wide notable people listings."),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    api_fields = [
        APIField("name_om"),
        APIField("name_en"),
        APIField("slug"),
        APIField("birth_year"),
        APIField("death_year"),
        APIField("bio_om"),
        APIField("bio_en"),
        APIField("photo"),
        APIField("woreda_slugs"),
        APIField("is_zone_notable"),
    ]

    search_fields = [
        index.SearchField("name_om"),
        index.SearchField("name_en"),
        index.FilterField("slug"),
        index.FilterField("is_zone_notable"),
    ]

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("name_om"),
                FieldPanel("name_en"),
                FieldPanel("slug"),
                FieldPanel("birth_year"),
                FieldPanel("death_year"),
                FieldPanel("photo"),
                FieldPanel("is_zone_notable"),
            ],
            heading=_("Identity"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("bio_om"),
                FieldPanel("bio_en"),
            ],
            heading=_("Biography"),
        ),
        InlinePanel("placements", label=_("Woreda placements")),
    ]

    class Meta:
        ordering = ["name_om"]
        verbose_name = _("notable person")
        verbose_name_plural = _("notable people")

    def __str__(self):
        return self.name_om or self.slug

    @property
    def woreda_slugs(self):
        return [
            placement.geography.slug
            for placement in self.placements.all().select_related("geography")
        ]

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if not text_has_meaning(self.name_om):
            errors["name_om"] = _("The authoritative Afaan Oromoo name is required.")

        if self.bio_en and not text_has_meaning(self.bio_om):
            errors["bio_om"] = _(
                "Provide the authoritative Afaan Oromoo biography before "
                "adding the English version."
            )

        if (
            self.birth_year is not None
            and self.death_year is not None
            and self.death_year < self.birth_year
        ):
            errors["death_year"] = _("The death year cannot precede the birth year.")

        validate_approved_image(self, "photo", errors)

        if errors:
            raise ValidationError(errors)


class PersonPlacement(Orderable):
    """Ordered link between a person and one woreda or town geography."""

    person = ParentalKey(
        Person,
        on_delete=models.CASCADE,
        related_name="placements",
    )
    geography = models.ForeignKey(
        Geography,
        on_delete=models.PROTECT,
        related_name="person_placements",
        limit_choices_to={"level__in": ["woreda", "town"]},
    )

    panels = [FieldPanel("geography")]

    class Meta(Orderable.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["person", "geography"],
                name="archive_person_placement_unique",
            ),
        ]

    def __str__(self):
        return f"{self.person} - {self.geography}"


class TimelineEvent(index.Indexed, models.Model):
    """One entry on the zone history timeline (issue #28).

    Afaan Oromoo is authoritative: the OM year label and text are
    required, the English companions are optional reviewed translations.
    ``year_int`` is the numeric sort key for labels such as "1898/1903".
    """

    year_om = models.CharField(
        max_length=40,
        verbose_name=_("Afaan Oromoo year label"),
    )
    year_en = models.CharField(
        max_length=40,
        blank=True,
        verbose_name=_("English year label"),
        help_text=_("Optional while the English translation is pending."),
    )
    year_int = models.IntegerField(
        help_text=_("Numeric year used to order the timeline."),
    )
    text_om = models.TextField(
        verbose_name=_("Afaan Oromoo text"),
    )
    text_en = models.TextField(
        blank=True,
        verbose_name=_("English text"),
        help_text=_("Optional while the English translation is pending."),
    )

    panels = [
        FieldPanel("year_om"),
        FieldPanel("year_en"),
        FieldPanel("year_int"),
        FieldPanel("text_om"),
        FieldPanel("text_en"),
    ]

    search_fields = [
        index.SearchField("year_om"),
        index.SearchField("year_en"),
        index.SearchField("text_om"),
        index.SearchField("text_en"),
    ]

    class Meta:
        ordering = ["year_int", "pk"]
        verbose_name = _("timeline event")
        verbose_name_plural = _("timeline events")

    def __str__(self):
        return f"{self.year_om}: {self.text_om[:60]}"

    def clean(self):
        super().clean()
        errors = {}
        if self.year_om and self.year_om != self.year_om.strip():
            errors["year_om"] = _(
                "The year label cannot begin or end with whitespace."
            )
        if self.text_om and not self.text_om.strip():
            errors["text_om"] = _("The Afaan Oromoo text cannot be blank.")
        if errors:
            raise ValidationError(errors)
