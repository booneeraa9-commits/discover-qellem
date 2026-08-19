from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.snippets.models import register_snippet

from editorial.choices import (
    EditorialAction,
    EditorialLanguage,
    EditorialRole,
    EditorialSubject,
)
from editorial.forms import EditorialAssignmentForm
from editorial.groups import SYSTEM_ADMINISTRATORS
from editorial.rules import role_allows


@register_snippet
class EditorialAssignment(models.Model):
    """An explicit, time-bounded editorial grant with one unambiguous scope."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="editorial_assignments",
        limit_choices_to={"is_active": True, "is_staff": True},
    )
    role = models.CharField(max_length=24, choices=EditorialRole.choices)
    subject = models.CharField(max_length=24, choices=EditorialSubject.choices)
    geography = models.ForeignKey(
        "places.Geography",
        on_delete=models.PROTECT,
        related_name="editorial_assignments",
        help_text=_(
            "The Qellem Wallaggaa zone grants zone-wide scope. A woreda or the "
            "town administration grants only that geography."
        ),
    )
    language = models.CharField(max_length=4, choices=EditorialLanguage.choices)
    action = models.CharField(max_length=16, choices=EditorialAction.choices)
    starts_at = models.DateTimeField(default=timezone.now)
    ends_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text=_("Leave empty only for a grant with no scheduled end."),
    )
    is_active = models.BooleanField(
        default=True,
        help_text=_("Disable immediately to revoke this assignment."),
    )
    granted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        editable=False,
        on_delete=models.PROTECT,
        related_name="granted_editorial_assignments",
    )
    reason = models.TextField(
        help_text=_("Required administrative reason for this grant."),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    base_form_class = EditorialAssignmentForm

    panels = [
        MultiFieldPanel(
            [
                FieldPanel("user"),
                FieldPanel("role"),
                FieldPanel("subject"),
                FieldPanel("geography"),
                FieldPanel("language"),
                FieldPanel("action"),
            ],
            heading=_("Editorial scope"),
        ),
        MultiFieldPanel(
            [
                FieldPanel("starts_at"),
                FieldPanel("ends_at"),
                FieldPanel("is_active"),
                FieldPanel("reason"),
            ],
            heading=_("Grant period and reason"),
        ),
    ]

    class Meta:
        ordering = ["user__username", "subject", "geography__display_order", "action"]
        verbose_name = _("scoped editorial assignment")
        verbose_name_plural = _("scoped editorial assignments")
        indexes = [
            models.Index(
                fields=["user", "is_active", "subject", "action"],
                name="editorial_scope_lookup_idx",
            ),
            models.Index(
                fields=["starts_at", "ends_at"],
                name="editorial_scope_dates_idx",
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=Q(ends_at__isnull=True)
                | Q(ends_at__gt=models.F("starts_at")),
                name="editorial_scope_end_after_start",
            )
        ]

    def __str__(self):
        return (
            f"{self.user}: {self.get_role_display()} / {self.get_subject_display()} / "
            f"{self.geography} / {self.get_language_display()} / "
            f"{self.get_action_display()}"
        )

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def is_effective_at(self, moment=None):
        moment = moment or timezone.now()
        return (
            self.is_active
            and self.starts_at <= moment
            and (self.ends_at is None or self.ends_at >= moment)
        )

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        if self.user_id and not (self.user.is_active and self.user.is_staff):
            errors["user"] = _("Editorial assignments require an active staff account.")

        if self.granted_by_id and not (
            self.granted_by.is_superuser
            or self.granted_by.groups.filter(name=SYSTEM_ADMINISTRATORS).exists()
        ):
            errors["granted_by"] = _(
                "The granting account must be a system administrator."
            )

        if self.pk:
            original_grantor_id = (
                type(self)
                .objects.filter(pk=self.pk)
                .values_list("granted_by_id", flat=True)
                .first()
            )
            if (
                original_grantor_id is not None
                and self.granted_by_id != original_grantor_id
            ):
                errors["granted_by"] = _(
                    "The original granting administrator cannot be changed."
                )

        if self.ends_at and self.starts_at and self.ends_at <= self.starts_at:
            errors["ends_at"] = _("The end must be later than the start.")

        if not self.reason.strip():
            errors["reason"] = _("Record the administrative reason for this grant.")

        if (
            self.role
            and self.subject
            and self.action
            and not role_allows(self.role, self.subject, self.action)
        ):
            errors["action"] = _(
                "This role cannot receive this action for the selected subject."
            )

        if (
            self.action == EditorialAction.PUBLISH
            and self.role != EditorialRole.MANAGING_EDITOR
        ):
            errors["role"] = _(
                "Only a managing-editor assignment can grant final publication."
            )

        if errors:
            raise ValidationError(errors)
