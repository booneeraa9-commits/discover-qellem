from django.contrib.auth import get_user_model
from django.utils import timezone

from editorial.choices import (
    EditorialAction,
    EditorialLanguage,
    EditorialRole,
    EditorialSubject,
)
from editorial.models import EditorialAssignment
from places.models import Geography


class EditorialTestMixin:
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        user_model = get_user_model()
        cls.grantor = user_model.objects.create_superuser(
            username=f"grantor-{cls.__name__.lower()}",
            email=f"{cls.__name__.lower()}@example.invalid",
            password="test-only-password",
        )
        cls.editor = user_model.objects.create_user(
            username=f"editor-{cls.__name__.lower()}",
            is_staff=True,
        )
        cls.super_editor = user_model.objects.create_superuser(
            username=f"super-{cls.__name__.lower()}",
            email=f"super-{cls.__name__.lower()}@example.invalid",
            password="test-only-password",
        )
        cls.zone = Geography.objects.get(slug="qellem-wallaggaa")
        cls.dambi = Geography.objects.get(slug="dambi-doolloo")
        cls.sayyo = Geography.objects.get(slug="sayyoo")

    @classmethod
    def assignment(
        cls,
        *,
        user=None,
        role=EditorialRole.SUBJECT_EDITOR,
        subject=EditorialSubject.GEOGRAPHY,
        geography=None,
        language=EditorialLanguage.BOTH,
        action=EditorialAction.VIEW,
        starts_at=None,
        ends_at=None,
        is_active=True,
    ):
        return EditorialAssignment.objects.create(
            user=user or cls.editor,
            role=role,
            subject=subject,
            geography=geography or cls.dambi,
            language=language,
            action=action,
            starts_at=starts_at or timezone.now(),
            ends_at=ends_at,
            is_active=is_active,
            reason="Required test assignment.",
            granted_by=cls.grantor,
        )
