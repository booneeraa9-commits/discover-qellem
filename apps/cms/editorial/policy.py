from dataclasses import dataclass

from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from editorial.choices import EditorialLanguage
from editorial.models import EditorialAssignment
from editorial.rules import role_allows
from places.models import Geography, GeographyLevel


@dataclass(frozen=True)
class EditorialTarget:
    """Framework-neutral authorization coordinates for one protected object."""

    subject: str
    geography_id: int | None
    language: str


class EditorialAuthorizationPolicy:
    """Central default-deny policy used by Wagtail now and APIs later."""

    denial_message = _(
        "You do not have an active editorial assignment for this action and scope."
    )

    def active_assignments(self, user, *, at=None):
        if (
            not user
            or not user.is_authenticated
            or not user.is_active
            or not user.is_staff
        ):
            return EditorialAssignment.objects.none()

        at = at or timezone.now()
        return EditorialAssignment.objects.filter(
            user=user,
            is_active=True,
            starts_at__lte=at,
        ).filter(Q(ends_at__isnull=True) | Q(ends_at__gte=at))

    def can(self, user, action, target, *, at=None):
        if not isinstance(target, EditorialTarget):
            return False
        if not target.subject or not target.geography_id or not target.language:
            return False

        languages = self._covering_languages(target.language)
        if not languages:
            return False

        assignments = self.active_assignments(user, at=at).filter(
            subject=target.subject,
            action=action,
            language__in=languages,
        )
        geography = (
            Geography.objects.filter(pk=target.geography_id)
            .values("level", "parent_id")
            .first()
        )
        if not geography:
            return False
        covering_geography_ids = {target.geography_id}
        if geography["level"] != GeographyLevel.ZONE and geography["parent_id"]:
            covering_geography_ids.add(geography["parent_id"])
        assignments = assignments.filter(geography_id__in=covering_geography_ids)
        return any(
            role_allows(assignment.role, target.subject, action)
            for assignment in assignments.only("role")
        )

    def can_any(self, user, action, *, subjects, language=None, at=None):
        """Authorize an unbound screen without granting an object action."""

        subjects = frozenset(subjects)
        if not subjects:
            return False
        assignments = self.active_assignments(user, at=at).filter(
            subject__in=subjects,
            action=action,
        )
        if language:
            languages = self._covering_languages(language)
            if not languages:
                return False
            assignments = assignments.filter(language__in=languages)
        return any(
            role_allows(assignment.role, assignment.subject, action)
            for assignment in assignments.only("role", "subject")
        )

    def require(self, user, action, target, *, at=None):
        if not self.can(user, action, target, at=at):
            raise PermissionDenied(self.denial_message)

    def require_any(self, user, action, *, subjects, language=None, at=None):
        if not self.can_any(
            user,
            action,
            subjects=subjects,
            language=language,
            at=at,
        ):
            raise PermissionDenied(self.denial_message)

    @staticmethod
    def normalize_language(language_code):
        code = (language_code or "").lower().replace("_", "-").split("-", 1)[0]
        if code == EditorialLanguage.OROMO:
            return EditorialLanguage.OROMO
        if code == EditorialLanguage.ENGLISH:
            return EditorialLanguage.ENGLISH
        if code == EditorialLanguage.BOTH:
            return EditorialLanguage.BOTH
        return ""

    @staticmethod
    def _covering_languages(target_language):
        if target_language in {
            EditorialLanguage.OROMO,
            EditorialLanguage.ENGLISH,
            EditorialLanguage.BOTH,
        }:
            return (target_language,)
        return ()


editorial_policy = EditorialAuthorizationPolicy()
