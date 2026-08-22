from html import unescape

from django.core.exceptions import NON_FIELD_ERRORS, ValidationError
from django.db import models
from django.utils.html import strip_tags
from django.utils.translation import gettext_lazy as _

PUBLIC_RICH_TEXT_FEATURES = [
    "h2",
    "h3",
    "h4",
    "bold",
    "italic",
    "ol",
    "ul",
    "hr",
    "blockquote",
    "link",
]

_FORBIDDEN_PUBLIC_RICH_TEXT_MARKERS = (
    "<embed",
    "<img",
    'linktype="document"',
    "linktype='document'",
)


def text_has_meaning(value) -> bool:
    """Return whether plain or rich text contains visible non-whitespace content."""

    visible_text = unescape(strip_tags(str(value or ""))).replace("\xa0", " ")
    return bool(visible_text.strip())


def validate_approved_image(instance, field_name, errors):
    """Reject an image selection unless its complete rights record is approved."""

    # Import lazily because the provenance models themselves reference geographies.
    from provenance.services import image_is_approved_for_public_use

    has_image = getattr(instance, f"{field_name}_id", None)
    if has_image and not image_is_approved_for_public_use(
        getattr(instance, field_name)
    ):
        errors[field_name] = _(
            "Select an image with a complete, approved provenance and rights record."
        )


class MultilingualPageMixin(models.Model):
    """Validate authoritative Oromo content and linkage of English page copies.

    Afaan Oromoo is the only required language; English and Amharic are
    optional reviewed translations (issue #84). Amharic is carried on
    ``*_am`` companion fields of the Afaan Oromoo page rather than a
    separate Wagtail locale.
    """

    required_languages = ("om",)
    optional_languages = ("en", "am")

    required_om_fields = ()
    public_rich_text_fields = ()
    translation_invariant_fields = ()

    class Meta:
        abstract = True

    def clean(self):
        errors = {}
        try:
            super().clean()
        except ValidationError as error:
            error.update_error_dict(errors)

        language_code = self.locale.language_code if self.locale_id else None
        if language_code == "om":
            for field_name in self.required_om_fields:
                if not text_has_meaning(getattr(self, field_name, "")):
                    errors[field_name] = _(
                        "Authoritative Afaan Oromoo content is required."
                    )
        elif language_code == "en":
            original = (
                type(self)
                .objects.filter(
                    translation_key=self.translation_key,
                    locale__language_code="om",
                )
                .exclude(pk=self.pk)
                .first()
            )
            if original is None:
                errors.setdefault(NON_FIELD_ERRORS, []).append(
                    _(
                        "An English page must be created as the linked translation "
                        "of an Afaan Oromoo original."
                    )
                )
            else:
                missing_authoritative_fields = [
                    field_name
                    for field_name in self.required_om_fields
                    if not text_has_meaning(getattr(original, field_name, ""))
                ]
                if missing_authoritative_fields:
                    errors.setdefault(NON_FIELD_ERRORS, []).append(
                        _(
                            "Complete the linked authoritative Afaan Oromoo content "
                            "before adding English content."
                        )
                    )

                for field_name in self.translation_invariant_fields:
                    model_field = self._meta.get_field(field_name)
                    attribute_name = model_field.attname
                    if getattr(self, attribute_name) != getattr(
                        original, attribute_name
                    ):
                        errors[field_name] = _(
                            "This identity field must match the linked Afaan Oromoo "
                            "original."
                        )
        elif language_code:
            errors.setdefault(NON_FIELD_ERRORS, []).append(
                _("Only Afaan Oromoo and English content locales are supported.")
            )

        if self.pk and self.depth > 1:
            parent = self.get_parent()
            allowed_parent_types = {
                model_label.lower() for model_label in self.parent_page_types
            }
            if (
                allowed_parent_types
                and parent.specific._meta.label_lower not in allowed_parent_types
            ):
                errors.setdefault(NON_FIELD_ERRORS, []).append(
                    _("This page is not placed beneath an allowed parent page type.")
                )

            if self.max_count_per_parent:
                sibling_count = (
                    type(self).objects.child_of(parent).exclude(pk=self.pk).count()
                )
                if sibling_count >= self.max_count_per_parent:
                    errors.setdefault(NON_FIELD_ERRORS, []).append(
                        _("Only one page of this type is allowed beneath this parent.")
                    )

        for field_name in self.public_rich_text_fields:
            value = str(getattr(self, field_name, "") or "").lower()
            if any(marker in value for marker in _FORBIDDEN_PUBLIC_RICH_TEXT_MARKERS):
                errors[field_name] = _(
                    "Embedded images, documents, and media are not allowed here. "
                    "Use a dedicated image field with approved rights metadata."
                )

        if errors:
            raise ValidationError(errors)


# Backwards-compatible alias for the pre-Amharic mixin name.
AuthoritativeOromoPageMixin = MultilingualPageMixin
