from django.core.exceptions import PermissionDenied
from wagtail.models import Page

from editorial.choices import EditorialAction
from editorial.policy import editorial_policy
from editorial.targets import media_target, page_target


class EditorialScopeMiddleware:
    """Backend guards for Wagtail routes that do not expose enforcement hooks."""

    PAGE_VIEW_ROUTES = frozenset(
        {
            "wagtailadmin_pages:view_draft",
            "wagtailadmin_pages:preview_on_edit",
            "wagtailadmin_pages:revisions_view",
            "wagtailadmin_pages:revisions_compare",
            "wagtailadmin_pages:workflow_preview",
            "wagtailadmin_pages:workflow_history",
            "wagtailadmin_pages:workflow_history_detail",
        }
    )
    WORKFLOW_ROUTES = frozenset(
        {
            "wagtailadmin_pages:workflow_action",
            "wagtailadmin_pages:collect_workflow_action_data",
            "wagtailadmin_pages:confirm_workflow_cancellation",
        }
    )

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        if not request.path_info.startswith("/admin/"):
            return

        if request.path_info.startswith(("/admin/images/", "/admin/documents/")):
            action = (
                EditorialAction.VIEW
                if "/chooser/" in request.path_info
                else EditorialAction.MANAGE_MEDIA
            )
            editorial_policy.require(request.user, action, media_target())
            return

        match = request.resolver_match
        view_name = match.view_name if match else ""
        if view_name == "wagtailsnippets:index":
            raise PermissionDenied(editorial_policy.denial_message)
        if view_name in self.PAGE_VIEW_ROUTES:
            page = self._get_page(view_kwargs, view_args)
            editorial_policy.require(
                request.user,
                EditorialAction.VIEW,
                page_target(page),
            )
        elif view_name in self.WORKFLOW_ROUTES:
            page = self._get_page(view_kwargs, view_args)
            action = (
                EditorialAction.APPROVE
                if view_kwargs.get("action_name") == "approve"
                else EditorialAction.REVIEW
            )
            editorial_policy.require(request.user, action, page_target(page))
        return

    @staticmethod
    def _get_page(view_kwargs, view_args=()):
        # Wagtail's revision-comparison route still uses positional URL groups.
        page_id = view_kwargs.get("page_id") or (view_args[0] if view_args else None)
        if not page_id:
            raise PermissionDenied(editorial_policy.denial_message)
        return Page.objects.get(pk=page_id).specific
