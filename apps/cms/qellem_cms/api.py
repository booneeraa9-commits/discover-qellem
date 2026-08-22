"""Public read-only Wagtail API v2 router for the frontend."""

from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet
from wagtail.images.api.v2.views import ImagesAPIViewSet


class PublicPagesAPIViewSet(PagesAPIViewSet):
    """Pages endpoint that hides unapproved community stories from anonymous users."""

    def get_base_queryset(self):
        from archive.models import CommunityStory

        queryset = super().get_base_queryset()

        if not self.request.user.is_authenticated:
            unapproved_story_ids = CommunityStory.objects.filter(
                approved=False
            ).values_list("pk", flat=True)
            queryset = queryset.exclude(pk__in=unapproved_story_ids)

        return queryset


api_router = WagtailAPIRouter("wagtailapi")

api_router.register_endpoint("pages", PublicPagesAPIViewSet)
api_router.register_endpoint("images", ImagesAPIViewSet)
api_router.register_endpoint("documents", DocumentsAPIViewSet)
