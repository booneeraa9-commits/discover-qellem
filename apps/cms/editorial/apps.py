from django.apps import AppConfig


class EditorialConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "editorial"
    verbose_name = "Editorial authorization"

    def ready(self):
        from editorial import signals  # noqa: F401
        from editorial.admin_permissions import (
            configure_scoped_snippet_permission_policies,
        )

        configure_scoped_snippet_permission_policies()
