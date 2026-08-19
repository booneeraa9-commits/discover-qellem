from django.contrib.auth.models import Group, Permission
from django.db import connections, transaction
from django.db.migrations.recorder import MigrationRecorder
from django.db.models import Q
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from wagtail.models import (
    Collection,
    GroupCollectionPermission,
    GroupPagePermission,
    Page,
)

from editorial.groups import (
    BASELINE_GROUPS,
    FACT_REVIEWERS,
    FINANCE_VIEWERS,
    LANGUAGE_REVIEWERS,
    MANAGING_EDITORS,
    MEDIA_MANAGERS,
    NEWS_EDITORS,
    SUBJECT_EDITORS,
    SUBMISSION_REVIEWERS,
    SYSTEM_ADMINISTRATORS,
    TRANSLATORS,
)

CONTENT_APP_LABELS = ("home", "places", "archive", "provenance", "partners")
CONTENT_GROUPS = (
    MANAGING_EDITORS,
    SUBJECT_EDITORS,
    NEWS_EDITORS,
    TRANSLATORS,
    LANGUAGE_REVIEWERS,
    FACT_REVIEWERS,
    MEDIA_MANAGERS,
    FINANCE_VIEWERS,
    SUBMISSION_REVIEWERS,
)
PAGE_PERMISSION_TYPES = {
    MANAGING_EDITORS: ("add", "change", "publish", "lock", "unlock"),
    SUBJECT_EDITORS: ("add", "change", "lock", "unlock"),
    NEWS_EDITORS: ("add", "change", "lock", "unlock"),
    TRANSLATORS: ("add", "change", "lock", "unlock"),
    LANGUAGE_REVIEWERS: ("change", "lock", "unlock"),
    FACT_REVIEWERS: ("change", "lock", "unlock"),
}


def _add_permissions(group, queryset):
    group.permissions.add(*queryset)


@receiver(
    post_migrate,
    dispatch_uid="editorial.ensure_baseline_cms_groups",
)
def ensure_baseline_cms_groups(app_config=None, **kwargs):
    """Create broad CMS access once; scoped assignments remain authoritative."""

    if app_config is not None and app_config.label != "editorial":
        return

    database_alias = kwargs.get("using", "default")
    recorder = MigrationRecorder(connections[database_alias])
    if not recorder.migration_qs.filter(
        app="editorial",
        name="0001_initial",
    ).exists():
        return

    with transaction.atomic(using=database_alias):
        groups = {
            name: Group.objects.get_or_create(name=name)[0] for name in BASELINE_GROUPS
        }

        access_admin = Permission.objects.filter(codename="access_admin")
        for group_name in CONTENT_GROUPS + (SYSTEM_ADMINISTRATORS,):
            _add_permissions(groups[group_name], access_admin)

        system_permissions = Permission.objects.filter(
            Q(content_type__app_label="auth", content_type__model__in=("user", "group"))
            | Q(
                content_type__app_label="editorial",
                content_type__model="editorialassignment",
            )
        )
        _add_permissions(groups[SYSTEM_ADMINISTRATORS], system_permissions)

        content_permissions = Permission.objects.filter(
            content_type__app_label__in=CONTENT_APP_LABELS
        )
        _add_permissions(groups[MANAGING_EDITORS], content_permissions)
        for group_name in (SUBJECT_EDITORS, NEWS_EDITORS):
            _add_permissions(
                groups[group_name],
                content_permissions.filter(
                    codename__regex=r"^(add|change|view|delete)_"
                ),
            )
        for group_name in (TRANSLATORS, LANGUAGE_REVIEWERS, FACT_REVIEWERS):
            _add_permissions(
                groups[group_name],
                content_permissions.filter(codename__regex=r"^(add|change|view)_"),
            )

        media_rights_permissions = Permission.objects.filter(
            content_type__app_label="provenance",
            content_type__model="mediarights",
        )
        _add_permissions(groups[MEDIA_MANAGERS], media_rights_permissions)

        root_page = Page.get_first_root_node()
        if root_page:
            page_permissions = Permission.objects.filter(
                content_type__app_label="wagtailcore",
                content_type__model="page",
            )
            for group_name, permission_types in PAGE_PERMISSION_TYPES.items():
                for permission_type in permission_types:
                    permission = page_permissions.filter(
                        codename=f"{permission_type}_page"
                    ).first()
                    if permission:
                        GroupPagePermission.objects.get_or_create(
                            group=groups[group_name],
                            page=root_page,
                            permission=permission,
                        )

        root_collection = Collection.get_first_root_node()
        if root_collection:
            choose_permissions = Permission.objects.filter(
                codename__in=("choose_image", "choose_document")
            )
            for group_name in (
                MANAGING_EDITORS,
                SUBJECT_EDITORS,
                NEWS_EDITORS,
                TRANSLATORS,
                LANGUAGE_REVIEWERS,
                FACT_REVIEWERS,
            ):
                for permission in choose_permissions:
                    GroupCollectionPermission.objects.get_or_create(
                        group=groups[group_name],
                        collection=root_collection,
                        permission=permission,
                    )

            media_permissions = Permission.objects.filter(
                codename__in=(
                    "add_image",
                    "change_image",
                    "delete_image",
                    "choose_image",
                    "add_document",
                    "change_document",
                    "delete_document",
                    "choose_document",
                )
            )
            for group_name in (MANAGING_EDITORS, MEDIA_MANAGERS):
                for permission in media_permissions:
                    GroupCollectionPermission.objects.get_or_create(
                        group=groups[group_name],
                        collection=root_collection,
                        permission=permission,
                    )
