"""Public read-only Wagtail API v2 router for the frontend."""

from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet

from archive.api import PersonAPIViewSet, TimelineEventAPIViewSet
from partners.api import SponsorAPIViewSet, SupporterAPIViewSet
from qellem_cms.i18n_api import LanguageAwareAPIViewSetMixin
from qellem_cms.images_api import RenditionedImagesAPIViewSet
from qellem_cms.media_urls import MediaURLAwareAPIViewSetMixin


class PublicPagesAPIViewSet(
    MediaURLAwareAPIViewSetMixin, LanguageAwareAPIViewSetMixin, PagesAPIViewSet
):
    """Pages endpoint that hides unapproved community stories from anonymous users."""

    known_query_parameters = PagesAPIViewSet.known_query_parameters.union(
        ["lang"]
    )

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
api_router.register_endpoint("images", RenditionedImagesAPIViewSet)
api_router.register_endpoint("documents", DocumentsAPIViewSet)
api_router.register_endpoint("people", PersonAPIViewSet)
api_router.register_endpoint("timeline", TimelineEventAPIViewSet)
api_router.register_endpoint("sponsors", SponsorAPIViewSet)
api_router.register_endpoint("supporters", SupporterAPIViewSet)
