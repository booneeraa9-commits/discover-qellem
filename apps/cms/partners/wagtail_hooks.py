"""Admin bulk actions for partner snippets (issue #120).

"Approve for display" lets an editor flip a whole selection of sponsors
or supporters to publicly displayed in one step, instead of opening 16
records one by one. The action:

- sets ``public_display_status`` to approved, ``is_active`` to True,
  and stamps ``reviewed_by`` / ``reviewed_at`` with the acting editor;
- keeps an existing ``approval_notes`` text, writing a default note
  only when the field is empty (the model requires a non-empty note on
  every completed review);
- saves through the model's ``save()`` -> ``full_clean()`` path, so a
  record that fails validation (e.g. a sponsor without Afaan Oromoo
  recognition text) is skipped rather than force-approved.

Access is gated per object by the scoped editorial snippet permission
policy — the same policy that guards the ordinary edit views.
"""

from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.translation import ngettext
from wagtail import hooks
from wagtail.snippets.bulk_actions.snippet_bulk_action import SnippetBulkAction

from partners.models import Collaborator, PublicDisplayStatus, Sponsor

DEFAULT_BULK_APPROVAL_NOTE = (
    "Approved for public display via the admin bulk action; roster "
    "membership matches the PM-approved support page."
)


@hooks.register("register_bulk_action")
class ApproveForDisplayBulkAction(SnippetBulkAction):
    display_name = _("Approve for display")
    aria_label = _("Approve selected partners for public display")
    action_type = "approve_for_display"
    template_name = "partners/bulk_actions/confirm_bulk_approve.html"
    models = [Sponsor, Collaborator]
    action_priority = 10

    def check_perm(self, obj):
        policy = self.model.snippet_viewset.permission_policy
        return policy.user_has_permission_for_instance(
            self.request.user, "change", obj
        )

    @classmethod
    def execute_action(cls, objects, self=None, **kwargs):
        user = self.request.user if self is not None else kwargs.get("user")
        now = timezone.now()
        approved_count = 0
        skipped = []
        for partner in objects:
            partner.public_display_status = PublicDisplayStatus.APPROVED
            partner.is_active = True
            partner.reviewed_by = user
            partner.reviewed_at = now
            if not partner.approval_notes.strip():
                partner.approval_notes = DEFAULT_BULK_APPROVAL_NOTE
            try:
                partner.save()
            except ValidationError:
                skipped.append(str(partner))
                continue
            approved_count += 1
        if self is not None:
            self.skipped_partners = skipped
        return approved_count, 0

    def get_success_message(self, num_parent_objects, num_child_objects):
        message = ngettext(
            "%(count)d partner has been approved for public display.",
            "%(count)d partners have been approved for public display.",
            num_parent_objects,
        ) % {"count": num_parent_objects}
        skipped = getattr(self, "skipped_partners", ())
        if skipped:
            message += " " + _(
                "Skipped (failed validation, fix and retry): %(names)s."
            ) % {"names": ", ".join(skipped)}
        return message
