from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from provenance.choices import ConsentStatus
from qellem_cms.content_validation import validate_approved_image
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.images import get_image_model_string
from wagtail.snippets.models import register_snippet


class PartnerKind(models.TextChoices):
    ORGANIZATION = "organization", _("Organization")
    PERSON = "person", _("Individual")


class PartnerDisplayMode(models.TextChoices):
    NAME_ONLY = "name_only", _("Approved name only")
    IMAGE_AND_NAME = "image_and_name", _("Approved logo or portrait with name")


class PublicDisplayStatus(models.TextChoices):
    PENDING = "pending", _("Pending review")
    APPROVED = "approved", _("Approved for public display")
    REJECTED = "rejected", _("Rejected")
    EXPIRED = "expired", _("Approval expired or withdrawn")


class PublicPartnerBase(models.Model):
    partner_kind = models.CharField(max_length=12, choices=PartnerKind.choices)
    display_name = models.CharField(max_length=255)
    website_url = models.URLField(blank=True)
    image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
        help_text=_("Approved public logo or portrait."),
    )
    display_mode = models.CharField(
        max_length=16,
        choices=PartnerDisplayMode.choices,
        default=PartnerDisplayMode.NAME_ONLY,
    )
    display_start = models.DateField(null=True, blank=True)
    display_end = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    display_order = models.PositiveSmallIntegerField(default=0)
    public_display_status = models.CharField(
        max_length=12,
        choices=PublicDisplayStatus.choices,
        default=PublicDisplayStatus.PENDING,
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    approval_notes = models.TextField(
        blank=True,
        help_text=_("Private evidence and decision notes; never public output."),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def clean(self):
        super().clean()
        errors = {}

        if self.display_name and self.display_name != self.display_name.strip():
            errors["display_name"] = _(
                "The public display name cannot begin or end with whitespace."
            )

        if self.display_start and self.display_end:
            if self.display_end < self.display_start:
                errors["display_end"] = _(
                    "The display end date cannot be before the start date."
                )

        if self.display_mode == PartnerDisplayMode.IMAGE_AND_NAME and not self.image_id:
            errors["image"] = _(
                "Select an approved logo or portrait for this display mode."
            )

        validate_approved_image(self, "image", errors)

        if self.public_display_status in {
            PublicDisplayStatus.APPROVED,
            PublicDisplayStatus.REJECTED,
            PublicDisplayStatus.EXPIRED,
        }:
            if not self.reviewed_by_id:
                errors["reviewed_by"] = _(
                    "A completed public-display review requires a reviewer."
                )
            if not self.reviewed_at:
                errors["reviewed_at"] = _(
                    "A completed public-display review requires a review time."
                )
            if not self.approval_notes.strip():
                errors["approval_notes"] = _(
                    "Record the evidence and reason for this public-display decision."
                )

        if errors:
            raise ValidationError(errors)


@register_snippet
class Sponsor(PublicPartnerBase):
    recognition_text_om = models.TextField(
        blank=True,
        verbose_name=_("Afaan Oromoo recognition text"),
    )
    recognition_text_en = models.TextField(
        blank=True,
        verbose_name=_("English recognition text"),
        help_text=_("Optional while English translation is pending."),
    )
    sponsorship_level = models.CharField(max_length=120, blank=True)

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("partner_kind"),
                FieldPanel("display_name"),
                FieldPanel("website_url"),
                FieldPanel("image"),
                FieldPanel("display_mode"),
                FieldPanel("recognition_text_om"),
                FieldPanel("recognition_text_en"),
                FieldPanel("sponsorship_level"),
            ],
            heading=_("Approved public recognition"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("display_start"),
                FieldPanel("display_end"),
                FieldPanel("is_active"),
                FieldPanel("display_order"),
                FieldPanel("public_display_status"),
                FieldPanel("reviewed_by"),
                FieldPanel("reviewed_at"),
                FieldPanel("approval_notes"),
            ],
            heading=_("Display approval"),
        ),
    ]

    class Meta:
        ordering = ["display_order", "display_name"]
        verbose_name = _("sponsor")
        verbose_name_plural = _("sponsors")

    def __str__(self):
        return self.display_name

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if (
            self.public_display_status == PublicDisplayStatus.APPROVED
            and not self.recognition_text_om.strip()
        ):
            errors["recognition_text_om"] = _(
                "Approved sponsor recognition requires Afaan Oromoo text."
            )

        if errors:
            raise ValidationError(errors)


@register_snippet
class Collaborator(PublicPartnerBase):
    role_om = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Afaan Oromoo contribution or role"),
    )
    role_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("English contribution or role"),
    )
    affiliation_om = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Afaan Oromoo affiliation"),
    )
    affiliation_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("English affiliation"),
    )
    contribution_period = models.CharField(max_length=160, blank=True)
    description_om = models.TextField(
        blank=True,
        verbose_name=_("Afaan Oromoo public description"),
    )
    description_en = models.TextField(
        blank=True,
        verbose_name=_("English public description"),
    )
    consent_status = models.CharField(
        max_length=16,
        choices=ConsentStatus.choices,
        default=ConsentStatus.NOT_APPLICABLE,
    )
    consent_notes = models.TextField(
        blank=True,
        help_text=_("Private public-recognition and portrait consent evidence."),
    )

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("partner_kind"),
                FieldPanel("display_name"),
                FieldPanel("website_url"),
                FieldPanel("image"),
                FieldPanel("display_mode"),
                FieldPanel("role_om"),
                FieldPanel("role_en"),
                FieldPanel("affiliation_om"),
                FieldPanel("affiliation_en"),
                FieldPanel("contribution_period"),
                FieldPanel("description_om"),
                FieldPanel("description_en"),
            ],
            heading=_("Approved public collaborator profile"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("consent_status"),
                FieldPanel("consent_notes"),
                FieldPanel("display_start"),
                FieldPanel("display_end"),
                FieldPanel("is_active"),
                FieldPanel("display_order"),
                FieldPanel("public_display_status"),
                FieldPanel("reviewed_by"),
                FieldPanel("reviewed_at"),
                FieldPanel("approval_notes"),
            ],
            heading=_("Consent and display approval"),
        ),
    ]

    class Meta:
        ordering = ["display_order", "display_name"]
        verbose_name = _("collaborator")
        verbose_name_plural = _("collaborators")

    def __str__(self):
        return self.display_name

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.partner_kind == PartnerKind.ORGANIZATION:
            if self.consent_status != ConsentStatus.NOT_APPLICABLE:
                errors["consent_status"] = _(
                    "Use ‘No people depicted’ for an organization record."
                )
        elif self.partner_kind == PartnerKind.PERSON:
            if self.consent_status == ConsentStatus.NOT_APPLICABLE:
                errors["consent_status"] = _(
                    "Record the public-recognition consent assessment."
                )
            if not self.consent_notes.strip():
                errors["consent_notes"] = _(
                    "Record private consent evidence for an individual collaborator."
                )

        if self.public_display_status == PublicDisplayStatus.APPROVED:
            if not self.role_om.strip():
                errors["role_om"] = _(
                    "Approved collaborator profiles require an Afaan Oromoo role."
                )
            if not self.description_om.strip():
                errors["description_om"] = _(
                    "Approved collaborator profiles require an Afaan Oromoo "
                    "description."
                )
            if self.partner_kind == PartnerKind.PERSON and self.consent_status not in {
                ConsentStatus.CONFIRMED,
                ConsentStatus.NOT_REQUIRED,
            }:
                errors["consent_status"] = _(
                    "Resolve consent before approving an individual collaborator."
                )

        if errors:
            raise ValidationError(errors)
