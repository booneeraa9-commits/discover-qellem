from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from wagtail.admin.forms.models import WagtailAdminModelForm

from editorial.groups import SYSTEM_ADMINISTRATORS


class EditorialAssignmentForm(WagtailAdminModelForm):
    """Records the authenticated administrator as the original grantor."""

    def clean(self):
        cleaned_data = super().clean()
        if not self.instance.pk:
            grantor = self.for_user
            if not grantor or not grantor.is_authenticated:
                raise ValidationError(
                    _("An authenticated granting administrator is required.")
                )
            if not (
                grantor.is_superuser
                or grantor.groups.filter(name=SYSTEM_ADMINISTRATORS).exists()
            ):
                raise ValidationError(
                    _("Only a system administrator may grant an editorial assignment.")
                )
            self.instance.granted_by = grantor
        return cleaned_data
