from wagtail.models import Page


class HomePage(Page):
    # The homepage is also the single Qellem Wallaggaa zone profile.
    max_count = 1
    parent_page_types = ["wagtailcore.Page"]
