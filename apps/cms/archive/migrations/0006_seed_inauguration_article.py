"""Seed the 2026-08-21 Dembi Dolo inauguration news article (issue #27).

Facts mirror qa/CONTENT_FACTS.md section 4 and are cited through a
provenance SourceRecord/SourceCitation pair. The Afaan Oromoo body is a
clearly labeled placeholder until the PM commits the verbatim Oromo text
(apps/cms/archive/fixtures/inauguration-2026-om.txt).

Gallery order is authoritative (fixes bug #61): project13, project6,
project3, project1, project2.
"""

import uuid
from pathlib import Path

from django.core.files import File
from django.db import migrations
from django.db.models import F

FIXTURE_IMAGE_DIR = Path(__file__).resolve().parent.parent / "fixtures" / "img"

ARTICLE_SLUG = "dembi-dollo-inauguration-2026"
TITLE_EN = "650M Birr in Projects Inaugurated in Dembi Dollo"
TITLE_OM = (
    "Pirojektiiwwan Qarshii Miliyoona 650 oliin Magaalaa Dambi Doollootti "
    "Eebbifaman"
)
PUBLISHED_DATE = "2026-08-21"

# TODO(PM): replace with the verbatim Oromo text once
# apps/cms/archive/fixtures/inauguration-2026-om.txt is committed.
BODY_OM = "<p>[OM body pending PM content]</p>"

BODY_EN = (
    "<p>Development projects worth more than 650 million Birr were "
    "inaugurated in Dembi Dolo on 21 August 2026.</p>"
    "<p>The centrepiece of the programme, the Oliqa Dingil Hall, was built "
    "at a cost of more than 425 million Birr. Its construction began in "
    "2016 E.C., and the complex contains 11 rooms and service units, a "
    "grand hall, a secondary hall, a cafeteria, and recreation areas.</p>"
    "<p>Mayor Girma Dangala said that more than 32 projects are currently "
    "underway in the town.</p>"
    "<p>Chief Administrator Gammachuu Gurmesa stated that 2,284 projects "
    "worth more than 17 billion Birr have been completed across Kellem "
    "Wollega during the four-year reform period.</p>"
    "<p>Dr. Utukana Odaa, Deputy Head of the Office of the President of "
    "Oromia Regional State, attended the inauguration and addressed the "
    "ceremony.</p>"
)

# Authoritative gallery order per qa/CONTENT_FACTS.md (fixes bug #61).
GALLERY = (
    (
        "project13.jpg",
        "Oliqa Dingil Hall during a large event",
        "Galma Oliiqaa Dingil yeroo taatee guddaa",
    ),
    (
        "project6.jpg",
        "Oliqa Dingil Grand Hall interior",
        "Keessa Galma Guddaa Oliiqaa Dingil",
    ),
    (
        "project3.jpg",
        "Inauguration ceremony",
        "Sirna eebbaa",
    ),
    (
        "project1.jpg",
        "Ribbon cutting",
        "Sirna baniinsaa",
    ),
    (
        "project2.jpg",
        "Main avenue of Dembi Dolo",
        "Daandii guddaa Magaalaa Dambi Doolloo",
    ),
)

SOURCE_ID = "SRC-027"
SOURCE_TITLE = "Kellem Wollega Zone Communication Office, 2026-08-21"
SEED_EDITOR_USERNAME = "content-seed-bot"

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


def _create_image(apps, filename, title):
    from django.core.files.storage import default_storage
    from PIL import Image as PillowImage

    Image = apps.get_model("wagtailimages", "Image")
    Collection = apps.get_model("wagtailcore", "Collection")

    root_collection = Collection.objects.filter(depth=1).order_by("path").first()
    fixture_path = FIXTURE_IMAGE_DIR / filename

    with PillowImage.open(fixture_path) as pillow_image:
        width, height = pillow_image.size

    # The historical Image model has no get_upload_to(), so store the file
    # through the default storage and assign the resulting name directly.
    with fixture_path.open("rb") as file_handle:
        stored_name = default_storage.save(
            f"original_images/inauguration-2026-{filename}",
            File(file_handle),
        )

    return Image.objects.create(
        title=title,
        file=stored_name,
        width=width,
        height=height,
        collection=root_collection,
    )


def seed_inauguration_article(apps, schema_editor):
    ContentType = apps.get_model("contenttypes", "ContentType")
    Page = apps.get_model("wagtailcore", "Page")
    ArchiveIndexPage = apps.get_model("archive", "ArchiveIndexPage")
    NewsArticle = apps.get_model("archive", "NewsArticle")
    NewsArticleGalleryImage = apps.get_model("archive", "NewsArticleGalleryImage")
    SourceRecord = apps.get_model("provenance", "SourceRecord")
    SourceCitation = apps.get_model("provenance", "SourceCitation")
    Geography = apps.get_model("places", "Geography")
    User = apps.get_model("auth", "User")

    if NewsArticle.objects.filter(slug=ARTICLE_SLUG).exists():
        return

    index = ArchiveIndexPage.objects.filter(slug="archive").order_by("pk").first()
    if index is None:
        return

    article_content_type, _ = ContentType.objects.get_or_create(
        app_label="archive",
        model="newsarticle",
    )

    article = NewsArticle.objects.create(
        title=TITLE_OM,
        draft_title=TITLE_OM,
        slug=ARTICLE_SLUG,
        content_type=article_content_type,
        path=_next_child_path(Page, index),
        depth=index.depth + 1,
        numchild=0,
        url_path=f"{index.url_path}{ARTICLE_SLUG}/",
        live=True,
        has_unpublished_changes=False,
        locale_id=index.locale_id,
        translation_key=uuid.uuid4(),
        title_om=TITLE_OM,
        title_en=TITLE_EN,
        body_om=BODY_OM,
        body_en=BODY_EN,
        category="development",
        published_date=PUBLISHED_DATE,
    )
    Page.objects.filter(pk=index.pk).update(numchild=F("numchild") + 1)

    for sort_order, (filename, caption_en, caption_om) in enumerate(GALLERY):
        image = _create_image(apps, filename, caption_en)
        NewsArticleGalleryImage.objects.create(
            page=article,
            image=image,
            sort_order=sort_order,
            caption_en=caption_en,
            caption_om=caption_om,
        )

    source_record, _ = SourceRecord.objects.get_or_create(
        source_id=SOURCE_ID,
        defaults={
            "title": SOURCE_TITLE,
            "issuing_organization": "Kellem Wollega Zone Communication Office",
            "source_date_text": PUBLISHED_DATE,
            "source_calendar": "gc",
            "document_type": "brief",
            "language": "om",
            "subject": "administration",
            "geography": Geography.objects.filter(slug="dambi-doolloo").first(),
            "private_description": (
                "Zone Communication Office announcement covering the "
                "2026-08-21 Dembi Dolo project inaugurations; basis for "
                "qa/CONTENT_FACTS.md section 4."
            ),
        },
    )

    seed_editor, created = User.objects.get_or_create(
        username=SEED_EDITOR_USERNAME,
        defaults={
            "is_active": False,
            "is_staff": False,
            "password": "!",  # Unusable password marker; account cannot log in.
        },
    )

    SourceCitation.objects.create(
        source=source_record,
        content_type=article_content_type,
        object_id=article.pk,
        claim_or_section=(
            "Total >650M Birr in inaugurated projects; Oliqa Dingil Hall "
            ">425M Birr, construction began 2016 E.C., 11 rooms/units plus "
            "grand hall, secondary hall, cafeteria, and recreation areas; "
            "Mayor Girma Dangala: >32 projects underway; Chief Administrator "
            "Gammachuu Gurmesa: 2,284 projects worth >17B Birr over the "
            "4-year reform; Dr. Utukana Odaa (Deputy Head, Office of the "
            "President, Oromia) attended and spoke."
        ),
        citing_editor=seed_editor,
    )


def remove_inauguration_article(apps, schema_editor):
    ContentType = apps.get_model("contenttypes", "ContentType")
    Page = apps.get_model("wagtailcore", "Page")
    NewsArticle = apps.get_model("archive", "NewsArticle")
    NewsArticleGalleryImage = apps.get_model("archive", "NewsArticleGalleryImage")
    Image = apps.get_model("wagtailimages", "Image")
    SourceRecord = apps.get_model("provenance", "SourceRecord")
    SourceCitation = apps.get_model("provenance", "SourceCitation")
    User = apps.get_model("auth", "User")

    article = NewsArticle.objects.filter(slug=ARTICLE_SLUG).first()
    if article is not None:
        article_content_type = ContentType.objects.filter(
            app_label="archive",
            model="newsarticle",
        ).first()
        if article_content_type is not None:
            SourceCitation.objects.filter(
                content_type=article_content_type,
                object_id=article.pk,
            ).delete()

        image_ids = list(
            NewsArticleGalleryImage.objects.filter(page=article).values_list(
                "image_id", flat=True
            )
        )
        NewsArticleGalleryImage.objects.filter(page=article).delete()

        parent_path = article.path[:-PATH_STEP_LENGTH]
        article.delete()
        Page.objects.filter(path=parent_path).update(numchild=F("numchild") - 1)
        Image.objects.filter(pk__in=image_ids).delete()

    source_record = SourceRecord.objects.filter(source_id=SOURCE_ID).first()
    if source_record is not None and not source_record.citations.exists():
        source_record.delete()

    seed_editor = User.objects.filter(username=SEED_EDITOR_USERNAME).first()
    if seed_editor is not None and not seed_editor.created_source_citations.exists():
        seed_editor.delete()


class Migration(migrations.Migration):
    dependencies = [
        ("archive", "0005_seed_zone_notable_people"),
        ("provenance", "0001_initial"),
        ("wagtailcore", "0097_baselogentry_uuid_action_timestamp_indexes"),
        ("wagtailimages", "0027_image_description"),
    ]

    operations = [
        migrations.RunPython(
            seed_inauguration_article,
            reverse_code=remove_inauguration_article,
        ),
    ]
