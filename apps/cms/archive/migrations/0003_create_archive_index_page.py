"""Create the single archive index page beneath the zone homepage."""

import uuid

from django.db import migrations
from django.db.models import F

ARCHIVE_SLUG = "archive"
ARCHIVE_TITLE = "Kuusaa"
ARCHIVE_INTRODUCTION = (
    "<p>Kuusaa oduu, taateewwanii fi seenaa hawaasa Qellem Wallaggaa.</p>"
)

# Treebeard's default materialized-path alphabet, used by Wagtail pages.
PATH_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
PATH_STEP_LENGTH = 4


def _next_child_path(page_model, parent):
    last_child_path = (
        page_model.objects.filter(
            depth=parent.depth + 1,
            path__startswith=parent.path,
        )
        .order_by("-path")
        .values_list("path", flat=True)
        .first()
    )

    if last_child_path is None:
        return parent.path + "1".rjust(PATH_STEP_LENGTH, "0")

    tail = last_child_path[len(parent.path) :]
    number = 0
    for character in tail:
        number = number * len(PATH_ALPHABET) + PATH_ALPHABET.index(character)
    number += 1

    encoded = ""
    while number:
        number, remainder = divmod(number, len(PATH_ALPHABET))
        encoded = PATH_ALPHABET[remainder] + encoded

    return parent.path + encoded.rjust(len(tail), "0")


def create_archive_index_page(apps, schema_editor):
    ContentType = apps.get_model("contenttypes", "ContentType")
    Page = apps.get_model("wagtailcore", "Page")
    HomePage = apps.get_model("home", "HomePage")
    ArchiveIndexPage = apps.get_model("archive", "ArchiveIndexPage")

    if ArchiveIndexPage.objects.filter(slug=ARCHIVE_SLUG).exists():
        return

    homepage = (
        HomePage.objects.filter(locale__language_code="om").order_by("pk").first()
        or HomePage.objects.order_by("pk").first()
    )
    if homepage is None:
        return

    content_type, _ = ContentType.objects.get_or_create(
        app_label="archive",
        model="archiveindexpage",
    )

    ArchiveIndexPage.objects.create(
        title=ARCHIVE_TITLE,
        draft_title=ARCHIVE_TITLE,
        slug=ARCHIVE_SLUG,
        content_type=content_type,
        path=_next_child_path(Page, homepage),
        depth=homepage.depth + 1,
        numchild=0,
        url_path=f"{homepage.url_path}{ARCHIVE_SLUG}/",
        live=True,
        has_unpublished_changes=False,
        show_in_menus=True,
        locale_id=homepage.locale_id,
        translation_key=uuid.uuid4(),
        introduction=ARCHIVE_INTRODUCTION,
    )

    Page.objects.filter(pk=homepage.pk).update(numchild=F("numchild") + 1)


def remove_archive_index_page(apps, schema_editor):
    Page = apps.get_model("wagtailcore", "Page")
    ArchiveIndexPage = apps.get_model("archive", "ArchiveIndexPage")

    for index_page in ArchiveIndexPage.objects.filter(slug=ARCHIVE_SLUG):
        parent_path = index_page.path[:-PATH_STEP_LENGTH]
        index_page.delete()
        Page.objects.filter(path=parent_path).update(numchild=F("numchild") - 1)


class Migration(migrations.Migration):
    dependencies = [
        ("archive", "0002_archiveindexpage_communitystory_event_newsarticle_and_more"),
        ("home", "0005_configure_zone_homepage"),
    ]

    operations = [
        migrations.RunPython(
            create_archive_index_page,
            reverse_code=remove_archive_index_page,
        ),
    ]
