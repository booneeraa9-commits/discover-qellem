"""Public community-story submission endpoint (issue #32).

Anonymous visitors POST a story in any of the three site languages.
Submissions are created as unpublished, unapproved ``CommunityStory``
pages under the archive index; editors review and approve them in the
Wagtail admin before they become publicly visible.

Abuse controls: a scoped rate limit and a honeypot field (``website``)
that silently accepts-and-drops bot submissions.
"""

from django.db import transaction
from django.utils.crypto import get_random_string
from django.utils.html import escape
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from archive.models import ArchiveIndexPage, CommunityStory
from places.models import Geography
from qellem_cms.content_validation import text_has_meaning

MAX_STORY_LENGTH = 10_000
STORY_FIELDS = ("story_om", "story_en", "story_am")


def plain_text_to_rich_text(value):
    """Escape anonymous plain-text input into safe rich-text paragraphs."""

    paragraphs = [
        escape(line.strip()) for line in value.splitlines() if line.strip()
    ]
    return "".join(f"<p>{paragraph}</p>" for paragraph in paragraphs)


class CommunityStorySubmissionSerializer(serializers.Serializer):
    author_name = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default=""
    )
    place = serializers.SlugField(
        max_length=255, required=False, allow_blank=True, default=""
    )
    story_om = serializers.CharField(
        max_length=MAX_STORY_LENGTH,
        required=False,
        allow_blank=True,
        default="",
        trim_whitespace=True,
    )
    story_en = serializers.CharField(
        max_length=MAX_STORY_LENGTH,
        required=False,
        allow_blank=True,
        default="",
        trim_whitespace=True,
    )
    story_am = serializers.CharField(
        max_length=MAX_STORY_LENGTH,
        required=False,
        allow_blank=True,
        default="",
        trim_whitespace=True,
    )
    # Honeypot: real visitors never see or fill this field.
    website = serializers.CharField(
        required=False, allow_blank=True, default=""
    )

    def validate_place(self, value):
        if not value:
            return None
        geography = Geography.objects.filter(slug=value).first()
        if geography is None:
            raise serializers.ValidationError("Unknown place slug.")
        return geography

    def validate(self, attrs):
        if not any(text_has_meaning(attrs[field]) for field in STORY_FIELDS):
            raise serializers.ValidationError(
                {
                    "story_om": (
                        "Provide the story in at least one language "
                        "(Afaan Oromoo preferred)."
                    )
                }
            )
        return attrs


class CommunityStorySubmissionView(APIView):
    """POST /api/v2/community-stories/ for anonymous story submissions."""

    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "community_story_submissions"

    def post(self, request):
        serializer = CommunityStorySubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        response_body = {
            "received": True,
            "detail": (
                "Galatoomaa! Your story was received and is awaiting "
                "editorial review."
            ),
        }

        if data["website"]:
            # Honeypot tripped: pretend success, store nothing.
            return Response(response_body, status=status.HTTP_201_CREATED)

        parent = (
            ArchiveIndexPage.objects.live()
            .filter(locale__language_code="om")
            .first()
        )
        if parent is None:
            return Response(
                {"detail": "Story submissions are not open yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        preferred_text = next(
            data[field] for field in STORY_FIELDS if text_has_meaning(data[field])
        )
        title = " ".join(preferred_text.split())[:70] or "Seenaa hawaasaa"

        story = CommunityStory(
            title=title,
            slug=f"community-story-{get_random_string(12).lower()}",
            author_name=data["author_name"].strip(),
            geography=data["place"],
            story_om=plain_text_to_rich_text(data["story_om"]),
            story_en=plain_text_to_rich_text(data["story_en"]),
            story_am=plain_text_to_rich_text(data["story_am"]),
            approved=False,
            live=False,
            locale=parent.locale,
        )
        with transaction.atomic():
            parent.add_child(instance=story)
            story.save_revision()

        return Response(response_body, status=status.HTTP_201_CREATED)
