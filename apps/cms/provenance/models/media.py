from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.images import get_image_model_string
from wagtail.snippets.models import register_snippet

from provenance.choices import (
    ConsentStatus,
    MediaReviewStatus,
    PermissionBasis,
)


@register_snippet
class MediaRights(models.Model):
    """Provenance, permission, and public-use review for one Wagtail image."""

    image = models.OneToOneField(
        get_image_model_string(),
        on_delete=models.PROTECT,
        related_name="discover_qellem_rights",
    )
    creator_name = models.CharField(
        max_length=255,
        blank=True,
        help_text=_("Photographer or creator, when known."),
    )
    rights_owner_name = models.CharField(max_length=255, blank=True)
    supplier_name = models.CharField(
        max_length=255,
        blank=True,
        help_text=_("Person or organization that supplied the image."),
    )
    provenance_notes = models.TextField(
        blank=True,
        help_text=_("Private chain-of-custody and source notes."),
    )
    capture_date = models.DateField(null=True, blank=True)
    capture_location = models.CharField(max_length=255, blank=True)
    permission_basis = models.CharField(
        max_length=20,
        choices=PermissionBasis.choices,
        default=PermissionBasis.PENDING,
    )
    permission_date = models.DateField(null=True, blank=True)
    permitted_uses = models.TextField(
        blank=True,
        help_text=_(
            "State the approved channels and purposes, such as this website only."
        ),
    )
    restrictions = models.TextField(
        blank=True,
        help_text=_("Private restrictions, expiry, cropping, or reuse conditions."),
    )
    credit_line = models.CharField(max_length=255, blank=True)
    caption_om = models.TextField(
        blank=True,
        verbose_name=_("Afaan Oromoo caption"),
    )
    caption_en = models.TextField(
        blank=True,
        verbose_name=_("English caption"),
        help_text=_("Optional while English translation is pending."),
    )
    alt_text_om = models.CharField(
        max_length=500,
        blank=True,
        verbose_name=_("Afaan Oromoo alternative text"),
    )
    alt_text_en = models.CharField(
        max_length=500,
        blank=True,
        verbose_name=_("English alternative text"),
        help_text=_("Optional while English translation is pending."),
    )
    people_depicted = models.BooleanField(default=False)
    minors_depicted = models.BooleanField(default=False)
    consent_status = models.CharField(
        max_length=16,
        choices=ConsentStatus.choices,
        default=ConsentStatus.NOT_APPLICABLE,
    )
    consent_notes = models.TextField(
        blank=True,
        help_text=_("Private consent assessment where people appear."),
    )
    review_status = models.CharField(
        max_length=12,
        choices=MediaReviewStatus.choices,
        default=MediaReviewStatus.PENDING,
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="reviewed_media_rights",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(
        blank=True,
        help_text=_("Private media-review notes."),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("image"),
                FieldPanel("creator_name"),
                FieldPanel("rights_owner_name"),
                FieldPanel("supplier_name"),
                FieldPanel("provenance_notes"),
                FieldPanel("capture_date"),
                FieldPanel("capture_location"),
            ],
            heading=_("Image provenance"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("permission_basis"),
                FieldPanel("permission_date"),
                FieldPanel("permitted_uses"),
                FieldPanel("restrictions"),
                FieldPanel("credit_line"),
            ],
            heading=_("Rights and permitted uses"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("caption_om"),
                FieldPanel("caption_en"),
                FieldPanel("alt_text_om"),
                FieldPanel("alt_text_en"),
            ],
            heading=_("Public caption and accessibility text"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("people_depicted"),
                FieldPanel("minors_depicted"),
                FieldPanel("consent_status"),
                FieldPanel("consent_notes"),
            ],
            heading=_("People and consent"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("review_status"),
                FieldPanel("reviewed_by"),
                FieldPanel("reviewed_at"),
                FieldPanel("review_notes"),
            ],
            heading=_("Media review"),
        ),
    ]

    class Meta:
        ordering = ["image__title"]
        verbose_name = _("image provenance and rights record")
        verbose_name_plural = _("image provenance and rights records")

    def __str__(self):
        return f"Rights for {self.image.title}"

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def clean(self):
        super().clean()
        errors = {}

        if self.minors_depicted and not self.people_depicted:
            errors["people_depicted"] = _(
                "An image marked as depicting minors must also depict people."
            )

        if (
            not self.people_depicted
            and self.consent_status != ConsentStatus.NOT_APPLICABLE
        ):
            errors["consent_status"] = _(
                "Use ‘No people depicted’ when the image does not depict people."
            )

        if self.people_depicted:
            if self.consent_status == ConsentStatus.NOT_APPLICABLE:
                errors["consent_status"] = _(
                    "Record the consent assessment for people shown in the image."
                )
            if not self.consent_notes.strip():
                errors["consent_notes"] = _(
                    "Record private consent notes when people are depicted."
                )

        if self.minors_depicted and self.consent_status != ConsentStatus.CONFIRMED:
            errors["consent_status"] = _(
                "Media depicting minors requires confirmed consent before approval."
            )

        if self.review_status in {
            MediaReviewStatus.APPROVED,
            MediaReviewStatus.REJECTED,
            MediaReviewStatus.EXPIRED,
        }:
            if not self.reviewed_by_id:
                errors["reviewed_by"] = _(
                    "A completed media review requires a reviewer."
                )
            if not self.reviewed_at:
                errors["reviewed_at"] = _(
                    "A completed media review requires a review time."
                )

        if self.review_status == MediaReviewStatus.APPROVED:
            required_text_fields = {
                "rights_owner_name": _("Record the rights owner."),
                "supplier_name": _("Record who supplied the image."),
                "provenance_notes": _("Record the image provenance."),
                "permitted_uses": _("Record the permitted public uses."),
                "credit_line": _("Provide the approved public credit line."),
                "caption_om": _("Provide the authoritative Afaan Oromoo caption."),
                "alt_text_om": _(
                    "Provide authoritative Afaan Oromoo alternative text."
                ),
            }
            for field_name, message in required_text_fields.items():
                if not getattr(self, field_name).strip():
                    errors[field_name] = message

            if self.permission_basis == PermissionBasis.PENDING:
                errors["permission_basis"] = _(
                    "Confirm the permission or license basis before approval."
                )
            if not self.permission_date:
                errors["permission_date"] = _(
                    "Record the permission confirmation date before approval."
                )
            if self.people_depicted and self.consent_status not in {
                ConsentStatus.CONFIRMED,
                ConsentStatus.NOT_REQUIRED,
            }:
                errors["consent_status"] = _(
                    "Resolve the consent assessment before public-use approval."
                )

        if (
            self.review_status == MediaReviewStatus.REJECTED
            and not self.review_notes.strip()
        ):
            errors["review_notes"] = _("Explain why this image was rejected.")

        if errors:
            raise ValidationError(errors)
