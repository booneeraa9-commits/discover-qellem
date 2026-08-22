from django.core.exceptions import PermissionDenied
from django.urls import reverse
from django.utils.text import capfirst
from wagtail import hooks
from wagtail.admin.menu import MenuItem

from editorial.choices import EditorialAction, EditorialSubject
from editorial.models import EditorialAssignment
from editorial.policy import editorial_policy
from editorial.targets import (
    media_target,
    model_create_target,
    model_target,
    page_create_target,
    page_target,
    possible_subjects_for_model,
)


def _require_page_request_actions(request, target):
    if request.method != "POST":
        return
    if request.POST.get("action-submit"):
        editorial_policy.require(request.user, EditorialAction.SUBMIT, target)
    if request.POST.get("action-publish"):
        editorial_policy.require(request.user, EditorialAction.PUBLISH, target)
    if request.POST.get("action-cancel-workflow"):
        editorial_policy.require(request.user, EditorialAction.REVIEW, target)
    if request.POST.get("action-workflow-action"):
        workflow_action = request.POST.get("workflow-action-name")
        action = (
            EditorialAction.APPROVE
            if workflow_action == "approve"
            else EditorialAction.REVIEW
        )
        editorial_policy.require(request.user, action, target)


def _require_target_or_create_screen(request, action, target, *, subjects=None):
    if target and target.geography_id:
        editorial_policy.require(request.user, action, target)
        return
    if not target or request.method == "POST":
        raise PermissionDenied(editorial_policy.denial_message)
    editorial_policy.require_any(
        request.user,
        action,
        subjects=subjects or {target.subject},
        language=target.language,
    )


@hooks.register("before_create_page")
def enforce_page_create_scope(request, parent_page, page_class):
    target = page_create_target(
        page_class,
        parent_page,
        data=request.POST if request.method == "POST" else request.GET,
    )
    _require_target_or_create_screen(request, EditorialAction.CREATE, target)
    _require_page_request_actions(request, target)


@hooks.register("before_edit_page")
def enforce_page_edit_scope(request, page):
    target = page_target(page, data=request.POST if request.method == "POST" else None)
    editorial_policy.require(request.user, EditorialAction.EDIT, target)
    _require_page_request_actions(request, target)


@hooks.register("before_publish_page")
def enforce_page_publish_scope(request, page):
    editorial_policy.require(
        request.user,
        EditorialAction.PUBLISH,
        page_target(page),
    )


@hooks.register("before_unpublish_page")
def enforce_page_unpublish_scope(request, page):
    editorial_policy.require(
        request.user,
        EditorialAction.ARCHIVE,
        page_target(page),
    )


@hooks.register("before_delete_page")
def enforce_page_delete_scope(request, page):
    editorial_policy.require(
        request.user,
        EditorialAction.ARCHIVE,
        page_target(page),
    )


@hooks.register("before_copy_page")
def enforce_page_copy_scope(request, page):
    target = page_target(page)
    editorial_policy.require(request.user, EditorialAction.VIEW, target)
    editorial_policy.require(request.user, EditorialAction.CREATE, target)


@hooks.register("before_move_page")
def enforce_page_move_scope(request, page, destination):
    editorial_policy.require(
        request.user,
        EditorialAction.EDIT,
        page_target(page),
    )


@hooks.register("before_create_snippet")
def enforce_snippet_create_scope(request, model):
    if model is EditorialAssignment:
        return
    target = model_create_target(
        model,
        data=request.POST if request.method == "POST" else request.GET,
    )
    if not target:
        return
    action = (
        EditorialAction.MANAGE_MEDIA
        if target.subject == EditorialSubject.MEDIA
        else EditorialAction.CREATE
    )
    _require_target_or_create_screen(
        request,
        action,
        target,
        subjects=possible_subjects_for_model(model),
    )


@hooks.register("before_edit_snippet")
def enforce_snippet_edit_scope(request, instance):
    if isinstance(instance, EditorialAssignment):
        return
    target = model_target(
        instance,
        data=request.POST if request.method == "POST" else None,
    )
    if not target:
        return
    action = (
        EditorialAction.MANAGE_MEDIA
        if target.subject == EditorialSubject.MEDIA
        else EditorialAction.EDIT
    )
    editorial_policy.require(request.user, action, target)


@hooks.register("before_delete_snippet")
def enforce_snippet_delete_scope(request, instances):
    for instance in instances:
        if isinstance(instance, EditorialAssignment):
            continue
        target = model_target(instance)
        if not target:
            continue
        action = (
            EditorialAction.MANAGE_MEDIA
            if target.subject == EditorialSubject.MEDIA
            else EditorialAction.ARCHIVE
        )
        editorial_policy.require(request.user, action, target)


def _is_structural_page(page):
    from archive.models import (
        GlossaryIndexPage,
        HistoryCultureIndexPage,
        PeopleIndexPage,
    )
    from home.models import HomePage
    from places.models import GeographyIndexPage

    return page.is_root() or isinstance(
        page,
        (
            HomePage,
            GeographyIndexPage,
            HistoryCultureIndexPage,
            PeopleIndexPage,
            GlossaryIndexPage,
        ),
    )


def _permitted_page_ids(queryset, user):
    has_any_assignment = editorial_policy.active_assignments(user).exists()
    permitted_ids = []
    for page in queryset.specific().select_related("locale"):
        if (_is_structural_page(page) and has_any_assignment) or editorial_policy.can(
            user, EditorialAction.VIEW, page_target(page)
        ):
            permitted_ids.append(page.pk)
    return permitted_ids


@hooks.register("before_bulk_action")
def enforce_bulk_action_scope(request, action_type, objects, action_class):
    from wagtail.documents.models import Document
    from wagtail.images import get_image_model
    from wagtail.models import Page

    action_map = {
        "move": EditorialAction.EDIT,
        "publish": EditorialAction.PUBLISH,
        "unpublish": EditorialAction.ARCHIVE,
        "delete": EditorialAction.ARCHIVE,
        # Partner bulk approval (#120) needs the same editorial power as
        # flipping the record through the ordinary snippet edit form.
        "approve_for_display": EditorialAction.EDIT,
    }
    action = action_map.get(action_type)
    for instance in objects:
        if isinstance(instance, Page):
            if not action:
                raise PermissionDenied(editorial_policy.denial_message)
            target = page_target(instance)
            editorial_policy.require(request.user, action, target)
            if request.POST.get("include_descendants"):
                for descendant in instance.get_descendants().specific():
                    editorial_policy.require(
                        request.user,
                        action,
                        page_target(descendant),
                    )
        elif isinstance(instance, (get_image_model(), Document)):
            if action_type not in {"delete", "add_tags", "add_to_collection"}:
                raise PermissionDenied(editorial_policy.denial_message)
            editorial_policy.require(
                request.user,
                EditorialAction.MANAGE_MEDIA,
                media_target(),
            )
        elif (target := model_target(instance)) is not None:
            if target.subject == EditorialSubject.MEDIA:
                if action_type not in {"delete", "add_tags", "add_to_collection"}:
                    raise PermissionDenied(editorial_policy.denial_message)
                instance_action = EditorialAction.MANAGE_MEDIA
            else:
                instance_action = action
            if not instance_action:
                raise PermissionDenied(editorial_policy.denial_message)
            editorial_policy.require(request.user, instance_action, target)


@hooks.register("construct_explorer_page_queryset")
def filter_explorer_pages(parent_page, pages, request):
    return pages.filter(pk__in=_permitted_page_ids(pages, request.user))


@hooks.register("construct_page_chooser_queryset")
def filter_page_chooser(pages, request):
    return pages.filter(pk__in=_permitted_page_ids(pages, request.user))


@hooks.register("construct_main_menu")
def replace_unscoped_snippet_index(request, menu_items):
    from wagtail.snippets.models import get_snippet_models

    snippet_index_url = reverse("wagtailsnippets:index")
    menu_items[:] = [item for item in menu_items if item.url != snippet_index_url]

    for order, model in enumerate(get_snippet_models(), start=700):
        policy = model.snippet_viewset.permission_policy
        if not policy.user_has_any_permission(
            request.user,
            {"add", "change", "delete", "view"},
        ):
            continue
        opts = model._meta
        menu_items.append(
            MenuItem(
                capfirst(opts.verbose_name_plural),
                reverse(model.snippet_viewset.get_url_name("list")),
                name=f"scoped-{opts.app_label}-{opts.model_name}",
                icon_name=model.snippet_viewset.icon,
                order=order,
            )
        )
