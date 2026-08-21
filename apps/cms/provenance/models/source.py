from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.snippets.models import register_snippet

from places.models import Geography
from provenance.choices import (
    CalendarSystem,
    CitationDecision,
    PermissionBasis,
    SensitivityStatus,
    SourceDocumentType,
    SourceLanguage,
    SourceSubject,
    VerificationStatus,
)

source_id_validator = RegexValidator(
    regex=r"^SRC-[0-9]{3,}$",
    message=_("Use an ID such as SRC-001 with at least three digits."),
)


@register_snippet
class SourceRecord(models.Model):
    """Private metadata for an owner-controlled source kept outside the CMS."""

    source_id = models.CharField(
        max_length=20,
        unique=True,
        validators=[source_id_validator],
        help_text=_(
            "Private stable identifier. The original writing must remain outside "
            "the CMS and Git repository."
        ),
    )
    title = models.CharField(max_length=255)
    issuing_organization = models.CharField(max_length=255)
    source_date_text = models.CharField(
        max_length=80,
        blank=True,
        help_text=_("Date exactly as stated by the source, without converting it."),
    )
    source_calendar = models.CharField(
        max_length=10,
        choices=CalendarSystem.choices,
        default=CalendarSystem.UNKNOWN,
    )
    document_type = models.CharField(
        max_length=20,
        choices=SourceDocumentType.choices,
    )
    language = models.CharField(
        max_length=10,
        choices=SourceLanguage.choices,
        default=SourceLanguage.OROMO,
    )
    subject = models.CharField(
        max_length=24,
        choices=SourceSubject.choices,
    )
    geography = models.ForeignKey(
        Geography,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="source_records",
        help_text=_(
            "Primary geography, or leave empty when the source is not place-specific."
        ),
    )
    private_description = models.TextField(
        help_text=_("Private catalogue summary; never expose this field publicly."),
    )
    permission_basis = models.CharField(
        max_length=20,
        choices=PermissionBasis.choices,
        default=PermissionBasis.PENDING,
    )
    permission_confirmed_on = models.DateField(null=True, blank=True)
    permission_confirmation_notes = models.TextField(
        blank=True,
        help_text=_(
            "Private record of who gave permission, to whom, and for what use."
        ),
    )
    sensitivity_status = models.CharField(
        max_length=16,
        choices=SensitivityStatus.choices,
        default=SensitivityStatus.NOT_SCREENED,
    )
    sensitivity_notes = models.TextField(
        blank=True,
        help_text=_("Private screening notes; never expose this field publicly."),
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
        related_name="reviewed_source_records",
    )
    verified_on = models.DateField(null=True, blank=True)
    verification_notes = models.TextField(
        blank=True,
        help_text=_("Private fact/source review notes."),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("source_id"),
                FieldPanel("title"),
                FieldPanel("issuing_organization"),
                FieldPanel("source_date_text"),
                FieldPanel("source_calendar"),
                FieldPanel("document_type"),
                FieldPanel("language"),
                FieldPanel("subject"),
                FieldPanel("geography"),
                FieldPanel("private_description"),
            ],
            heading=_("Private source catalogue"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("permission_basis"),
                FieldPanel("permission_confirmed_on"),
                FieldPanel("permission_confirmation_notes"),
            ],
            heading=_("Permission evidence"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("sensitivity_status"),
                FieldPanel("sensitivity_notes"),
                FieldPanel("verification_status"),
                FieldPanel("reviewed_by"),
                FieldPanel("verified_on"),
                FieldPanel("verification_notes"),
            ],
            heading=_("Private screening and verification"),
        ),
    ]

    class Meta:
        ordering = ["source_id"]
        verbose_name = _("private source record")
        verbose_name_plural = _("private source records")

    def __str__(self):
        return f"{self.source_id} — {self.title}"

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def clean(self):
        super().clean()
        errors = {}

        for field_name in ("source_id", "title", "issuing_organization"):
            value = getattr(self, field_name)
            if value and value != value.strip():
                errors[field_name] = _(
                    "This value cannot begin or end with whitespace."
                )

        if (
            self.source_date_text.strip()
            and self.source_calendar == CalendarSystem.UNKNOWN
        ):
            errors["source_calendar"] = _(
                "Select the calendar used by the recorded source date."
            )
        if (
            not self.source_date_text.strip()
            and self.source_calendar != CalendarSystem.UNKNOWN
        ):
            errors["source_date_text"] = _(
                "Record the source date stated in the selected calendar."
            )

        if (
            self.permission_basis != PermissionBasis.PENDING
            and not self.permission_confirmation_notes.strip()
        ):
            errors["permission_confirmation_notes"] = _(
                "Record the evidence for the selected permission basis."
            )

        if (
            self.permission_confirmed_on
            and self.permission_basis == PermissionBasis.PENDING
        ):
            errors["permission_basis"] = _(
                "Select the confirmed permission basis for this date."
            )

        if self.verification_status in {
            VerificationStatus.VERIFIED,
            VerificationStatus.REJECTED,
        }:
            if not self.reviewed_by_id:
                errors["reviewed_by"] = _("A completed review requires a reviewer.")
            if not self.verified_on:
                errors["verified_on"] = _(
                    "A completed review requires a verification date."
                )

        if (
            self.verification_status == VerificationStatus.REJECTED
            and not self.verification_notes.strip()
        ):
            errors["verification_notes"] = _("Explain why this source was rejected.")

        if errors:
            raise ValidationError(errors)


@register_snippet
class SourceCitation(models.Model):
    """Private link between a source and a claim-bearing CMS record."""

    source = models.ForeignKey(
        SourceRecord,
        on_delete=models.PROTECT,
        related_name="citations",
    )
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.PROTECT,
    )
    object_id = models.PositiveBigIntegerField()
    content_object = GenericForeignKey(
        "content_type",
        "object_id",
        for_concrete_model=False,
    )
    claim_or_section = models.TextField(
        help_text=_(
            "Private note identifying the claim, table, paragraph, or source section."
        ),
    )
    citing_editor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_source_citations",
    )
    decision = models.CharField(
        max_length=10,
        choices=CitationDecision.choices,
        default=CitationDecision.PENDING,
    )
    fact_reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="reviewed_source_citations",
    )
    verified_on = models.DateField(null=True, blank=True)
    reviewer_notes = models.TextField(
        blank=True,
        help_text=_("Private fact-review decision notes."),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("source"),
                FieldPanel("content_type"),
                FieldPanel("object_id"),
                FieldPanel("claim_or_section"),
                FieldPanel("citing_editor"),
            ],
            heading=_("Private citation"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("decision"),
                FieldPanel("fact_reviewer"),
                FieldPanel("verified_on"),
                FieldPanel("reviewer_notes"),
            ],
            heading=_("Fact review"),
        ),
    ]

    class Meta:
        ordering = ["source__source_id", "created_at"]
        verbose_name = _("private source citation")
        verbose_name_plural = _("private source citations")
        indexes = [
            models.Index(
                fields=["content_type", "object_id"],
                name="provenance_citation_target_idx",
            )
        ]

    def __str__(self):
        return (
            f"{self.source.source_id} citation for {self.content_type}:{self.object_id}"
        )

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def clean(self):
        super().clean()
        errors = {}

        if self.content_type_id and self.object_id:
            try:
                self.content_type.get_object_for_this_type(pk=self.object_id)
            except ObjectDoesNotExist:
                errors["object_id"] = _("The cited CMS record does not exist.")

        if self.decision != CitationDecision.PENDING:
            if not self.fact_reviewer_id:
                errors["fact_reviewer"] = _(
                    "A completed citation decision requires a fact reviewer."
                )
            if not self.verified_on:
                errors["verified_on"] = _(
                    "A completed citation decision requires a verification date."
                )

        if (
            self.decision
            in {
                CitationDecision.DISPUTED,
                CitationDecision.REJECTED,
            }
            and not self.reviewer_notes.strip()
        ):
            errors["reviewer_notes"] = _(
                "Explain a disputed or rejected citation decision."
            )

        if errors:
            raise ValidationError(errors)
