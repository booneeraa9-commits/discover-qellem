from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from wagtail.admin.viewsets import viewsets
from wagtail.permissions import ModelPermissionPolicy
from wagtail.snippets.models import get_snippet_models

from editorial.choices import EditorialAction, EditorialSubject
from editorial.models import EditorialAssignment
from editorial.policy import editorial_policy
from editorial.rules import role_allows
from editorial.targets import (
    model_target,
    possible_subjects_for_model,
)

DJANGO_TO_EDITORIAL_ACTION = {
    "view": EditorialAction.VIEW,
    "add": EditorialAction.CREATE,
    "change": EditorialAction.EDIT,
    "delete": EditorialAction.ARCHIVE,
}


def editorial_action_for_model(model, action):
    subjects = possible_subjects_for_model(model)
    if subjects == {EditorialSubject.MEDIA}:
        return EditorialAction.MANAGE_MEDIA
    return DJANGO_TO_EDITORIAL_ACTION.get(action)


class ScopedSnippetPermissionPolicy(ModelPermissionPolicy):
    """Combine broad Django model access with exact editorial assignments."""

    def user_has_permission(self, user, action):
        editorial_action = editorial_action_for_model(self.model, action)
        if not editorial_action or not super().user_has_permission(user, action):
            return False
        return editorial_policy.can_any(
            user,
            editorial_action,
            subjects=possible_subjects_for_model(self.model),
        )

    def user_has_permission_for_instance(self, user, action, instance):
        editorial_action = editorial_action_for_model(self.model, action)
        target = model_target(instance)
        return bool(
            editorial_action
            and target
            and super().user_has_permission(user, action)
            and editorial_policy.can(user, editorial_action, target)
        )

    def instances_user_has_any_permission_for(self, user, actions):
        permitted_ids = []
        for instance in self.model._default_manager.all():
            if any(
                self.user_has_permission_for_instance(user, action, instance)
                for action in actions
            ):
                permitted_ids.append(instance.pk)
        return self.model._default_manager.filter(pk__in=permitted_ids)

    def users_with_any_permission(self, actions):
        editorial_actions = {
            editorial_action_for_model(self.model, action) for action in actions
        }
        editorial_actions.discard(None)
        if not editorial_actions:
            return get_user_model().objects.none()

        compatible_user_ids = []
        assignments = EditorialAssignment.objects.filter(
            user__is_active=True,
            user__is_staff=True,
            action__in=editorial_actions,
            subject__in=possible_subjects_for_model(self.model),
        ).select_related("user")
        for assignment in assignments:
            if assignment.is_effective_at() and role_allows(
                assignment.role,
                assignment.subject,
                assignment.action,
            ):
                compatible_user_ids.append(assignment.user_id)

        return (
            super()
            .users_with_any_permission(actions)
            .filter(pk__in=compatible_user_ids)
        )

    def users_with_any_permission_for_instance(self, actions, instance):
        candidates = self.users_with_any_permission(actions)
        return candidates.filter(
            pk__in=[
                user.pk
                for user in candidates
                if any(
                    self.user_has_permission_for_instance(user, action, instance)
                    for action in actions
                )
            ]
        )


def _scoped_chooser_class(base_class, method_name):
    if getattr(base_class, "_editorial_scoped", False):
        return base_class

    if method_name == "list":

        def get_object_list(view):
            policy = ScopedSnippetPermissionPolicy(view.model_class)
            return policy.instances_user_has_permission_for(view.request.user, "view")

        methods = {"get_object_list": get_object_list}
    elif method_name == "chosen":

        def get_object(view, pk):
            policy = ScopedSnippetPermissionPolicy(view.model_class)
            instance = super(scoped_class, view).get_object(pk)
            if not policy.user_has_permission_for_instance(
                view.request.user,
                "view",
                instance,
            ):
                raise PermissionDenied
            return instance

        methods = {"get_object": get_object}
    elif method_name == "chosen_multiple":

        def get_objects(view, pks):
            policy = ScopedSnippetPermissionPolicy(view.model_class)
            return policy.instances_user_has_permission_for(
                view.request.user,
                "view",
            ).filter(pk__in=pks)

        methods = {"get_objects": get_objects}
    else:

        def dispatch(view, request, *args, **kwargs):
            if not view.get_creation_form_class():
                raise PermissionDenied
            return super(scoped_class, view).dispatch(request, *args, **kwargs)

        def save_form(view, form):
            target = model_target(form.instance)
            action = editorial_action_for_model(view.model_class, "add")
            if not target or not action:
                raise PermissionDenied
            editorial_policy.require(view.request.user, action, target)
            return super(scoped_class, view).save_form(form)

        methods = {"dispatch": dispatch, "save_form": save_form}

    scoped_class = type(
        f"Scoped{base_class.__name__}",
        (base_class,),
        {"_editorial_scoped": True, **methods},
    )
    return scoped_class


def _configure_chooser_viewset(chooser_viewset):
    model = chooser_viewset.model
    if not possible_subjects_for_model(model):
        return
    chooser_viewset.permission_policy = ScopedSnippetPermissionPolicy(model)
    chooser_viewset.choose_view_class = _scoped_chooser_class(
        chooser_viewset.choose_view_class,
        "list",
    )
    chooser_viewset.choose_results_view_class = _scoped_chooser_class(
        chooser_viewset.choose_results_view_class,
        "list",
    )
    chooser_viewset.chosen_view_class = _scoped_chooser_class(
        chooser_viewset.chosen_view_class,
        "chosen",
    )
    chooser_viewset.chosen_multiple_view_class = _scoped_chooser_class(
        chooser_viewset.chosen_multiple_view_class,
        "chosen_multiple",
    )
    chooser_viewset.create_view_class = _scoped_chooser_class(
        chooser_viewset.create_view_class,
        "create",
    )


def configure_scoped_snippet_permission_policies():
    """Attach scoped policies after Wagtail builds snippet and chooser viewsets."""

    for model in get_snippet_models():
        if not possible_subjects_for_model(model):
            continue
        viewset = model.snippet_viewset
        base_class = viewset.__class__
        if getattr(base_class, "_editorial_scoped", False):
            continue

        def get_queryset(viewset, request):
            return viewset.permission_policy.instances_user_has_any_permission_for(
                request.user,
                ["view", "change", "delete"],
            )

        scoped_class = type(
            f"Scoped{base_class.__name__}",
            (base_class,),
            {
                "_editorial_scoped": True,
                "permission_policy": property(
                    lambda self: ScopedSnippetPermissionPolicy(self.model)
                ),
                "get_queryset": get_queryset,
            },
        )
        viewset.__class__ = scoped_class

    snippet_models = set(get_snippet_models())
    for registered_viewset in viewsets.viewsets:
        if getattr(registered_viewset, "model", None) in snippet_models and hasattr(
            registered_viewset, "choose_view_class"
        ):
            _configure_chooser_viewset(registered_viewset)
