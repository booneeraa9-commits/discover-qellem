"""Seed seven more news articles and four timeline events (issue #28).

Articles mirror the PM-approved frontend content in
``apps/web/src/lib/news-data.ts``; bilingual bodies are carried over
verbatim except that figures absent from qa/CONTENT_FACTS.md section 1
(372 drug vendors, the 1:43,960 doctor ratio, the 339,193 hive count for
2016 E.C., and the teachers' college) are trimmed pending PM
verification. Three frontend categories (environment, minerals,
agriculture) do not exist on NewsArticle, so those articles are mapped
to Economy temporarily - flagged to the PM in the pull request.

Timeline events mirror ``apps/web/src/lib/timeline-data.ts`` (the
Dembi Dolo arc); primary-source verification is tracked through the
demo-mirror SourceRecord SRC-029.
"""

import uuid
from datetime import date

from django.db import migrations
from django.db.models import F

PATH_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
PATH_STEP_LENGTH = 4

MIRROR_SOURCE_ID = "SRC-029"
MIRROR_SOURCE_TITLE = (
    "Discover Qellem PM-approved demo content mirror "
    "(news-data.ts / timeline-data.ts), 2026"
)
FACTS_SOURCE_ID = "SRC-026"
INAUGURATION_SOURCE_ID = "SRC-027"
SEED_EDITOR_USERNAME = "content-seed-bot"

# slug -> (category, published_date, title_om, title_en,
#          body_om, body_en, cites_zone_facts)
ARTICLES = {
    "coffee-2026": (
        "economy",
        date(2026, 8, 8),
        "Oomishni buna godinaa toonnii 134,213 gahe",
        "Zone coffee production recorded at 134,213 tonnes",
        "<p>Akka ragaa waajjira godinaatti, bara 2016 A.L.I hektaara "
        "484,841 bunaan uwwifamee toonnii 134,213 oomishame. Waldaaleen "
        "817 miseensota 156,500 waliin oomisha gabaaf qopheessu.</p>",
        "<p>According to the zone profile, 484,841 ha were under coffee "
        "in 2016 E.C., producing 134,213 tonnes. 817 cooperatives with "
        "156,500 members channel the harvest to market.</p>",
        True,
    ),
    "walal-2026": (
        "economy",
        date(2026, 7, 14),
        "Paarkiin Dhaatii Walaal — mana dhiisaa bineensota baduuf jiraniif",
        "Dati Walal Park — a last home for species at risk",
        "<p>Paarkiin Dhaatii Walaal labsii 87/2005tiin hundeeffame; "
        "Caamsaa 25, 2012 beekame. Roobii, gafarsa fi leenca — IUCN'n "
        "balaaf saaxilamoo — of keessaa qaba.</p>",
        "<p>Dati Walal was established by proclamation 87/2005 and "
        "gazetted 25 May 2012. It is home to hippo, buffalo and lion — "
        "IUCN-listed vulnerable species.</p>",
        True,
    ),
    "gold-2026": (
        "economy",
        date(2026, 6, 3),
        "Warqee aanaalee shan keessatti argama",
        "Gold recorded in five woredas",
        "<p>Mineraalonni godina keessatti argaman warqee, pilaatiiniyam "
        "(Laaloo Qilee), tantaalam (Sayyoo) fi yuureniyam (Anfilloo, "
        "Sayyoo) dha. Pilaatiiniyamiin Laaloo Qilee keessatti baasuun "
        "jalqabaa jira.</p>",
        "<p>Known minerals include gold, platinum (Lalo Kile), tantalum "
        "(Sayo) and uranium (Anfillo, Sayo). Platinum extraction is "
        "beginning in Lalo Kile.</p>",
        True,
    ),
    "honey-2026": (
        "economy",
        date(2026, 5, 19),
        "Gaagura dammaa 473,300 — qabeenya guddaa",
        "473,300 beehives — honey's big potential",
        "<p>Gaagurri dammaa 473,300 (2015 A.L.I) jira. Oomishni garuu "
        "gadi aanaa dha — gaagurri ammayyaa guddina oomishaa fida.</p>",
        "<p>The zone counts 473,300 beehives (2015 E.C.). Output remains "
        "low — modern hives will significantly raise production.</p>",
        True,
    ),
    "health-2026": (
        "health",
        date(2026, 4, 22),
        "Fayyaa godinaa lakkoofsota ragaa irraa",
        "Zone health in numbers",
        "<p>Hospitaalota 4, buufata fayyaa 51 fi kellaa fayyaa 256 "
        "godinicha keessa jiru.</p>",
        "<p>The zone has 4 hospitals, 51 health centres and 256 health "
        "posts.</p>",
        True,
    ),
    "schools-2026": (
        "education",
        date(2026, 3, 9),
        "Barattoota 348,516 godina keessatti baratu",
        "348,516 students learning across the zone",
        "<p>Bara 2016 A.L.I manneen barumsaa 1–8 mootummaa 452, manneen "
        "barumsaa 9–12 50 fi yuunivarsiitiin 1 jiru — barattoonni "
        "348,516 barachaa jiru.</p>",
        "<p>In 2016 E.C. the zone had 452 government primary schools, "
        "50 secondary schools and one university — 348,516 students "
        "enrolled.</p>",
        True,
    ),
    "irreecha-2026": (
        "culture",
        date(2026, 9, 27),
        "Ayyaana Irreechaa",
        "Irreecha celebration",
        "<p>Hawaasni Qeellam Irreecha madda bishaanii irratti kabaja — "
        "galata, faaruu fi walga'ii hawaasaa.</p>",
        "<p>Communities across Kellem mark Irreecha at local water "
        "sites — thanksgiving, song and gathering.</p>",
        False,
    ),
}

# (year_int, year_om, year_en, text_om, text_en, cites_inauguration)
TIMELINE_EVENTS = (
    (
        1898,
        "1898/1903",
        "1898/1903",
        "Ragaaleen afaanii hundeeffama Dambi Doolloo bara 1898 ykn 1903 "
        "dubbatu — muka dambii jalatti Obbo Dolloo fi daldaltoonni "
        "boqatan.",
        "Oral records place Dembi Dolo's founding in 1898 or 1903 — "
        "beneath the dambi tree where Obbo Dolloo and traders rested.",
        False,
    ),
    (
        1933,
        "1933 A.L.I",
        "1933 E.C.",
        "Bulchiinsi magaalaa Dambi Doolloo bara 1933 A.L.I hundeefame.",
        "Dembi Dolo municipal administration was founded in 1933 E.C.",
        False,
    ),
    (
        1998,
        "1998",
        "1998",
        "Dambi Doolloo bara 1998 magaalaa guddittii godinaa taate; "
        "Gaawoo Qeebbee fi Yamaalogii Walal Amajjii 1998 adda baafaman.",
        "Dembi Dolo became zonal capital in 1998; Gawo Kebe and "
        "Yemalogi Welel were demarcated in January 1998.",
        False,
    ),
    (
        2026,
        "2026",
        "2026",
        "Pirojektoonni qarshii Miliyoona 650 oliin ijaaraman — Galma "
        "Oliiqaa Dingil, kooridarii magaalaa, kilaasterota, Kaaffee "
        "Tekinooloojii fi marfata magaalichaa — eebbifaman.",
        "Projects worth more than 650 million Birr were inaugurated — "
        "the Grand Oliqa Dingil Hall, city corridor, clusters, the "
        "Science Café and the city road network.",
        True,
    ),
)


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


def _get_seed_editor(apps):
    User = apps.get_model("auth", "User")
    seed_editor, _ = User.objects.get_or_create(
        username=SEED_EDITOR_USERNAME,
        defaults={
            "is_active": False,
            "is_staff": False,
            "password": "!",  # Unusable password marker.
        },
    )
    return seed_editor


def _get_mirror_source(apps):
    SourceRecord = apps.get_model("provenance", "SourceRecord")
    Geography = apps.get_model("places", "Geography")
    zone = Geography.objects.filter(slug="qellem-wallaggaa").first()

    source, _ = SourceRecord.objects.get_or_create(
        source_id=MIRROR_SOURCE_ID,
        defaults={
            "title": MIRROR_SOURCE_TITLE,
            "issuing_organization": "Discover Qellem project (PM-approved)",
            "source_date_text": "2026",
            "source_calendar": "gc",
            "document_type": "other",
            "language": "om_en",
            "subject": "mixed",
            "geography": zone,
            "private_description": (
                "PM-approved demo content mirrored from js/data.js into "
                "apps/web/src/lib/news-data.ts and timeline-data.ts. "
                "Primary-source verification for narrative claims is "
                "pending; numeric facts trace to SRC-026 "
                "(qa/CONTENT_FACTS.md section 1)."
            ),
        },
    )
    return source


def seed_news_and_timeline(apps, schema_editor):
    ContentType = apps.get_model("contenttypes", "ContentType")
    Page = apps.get_model("wagtailcore", "Page")
    ArchiveIndexPage = apps.get_model("archive", "ArchiveIndexPage")
    NewsArticle = apps.get_model("archive", "NewsArticle")
    TimelineEvent = apps.get_model("archive", "TimelineEvent")
    SourceRecord = apps.get_model("provenance", "SourceRecord")
    SourceCitation = apps.get_model("provenance", "SourceCitation")

    index = ArchiveIndexPage.objects.filter(slug="archive").order_by("pk").first()
    if index is None:
        return

    seed_editor = _get_seed_editor(apps)
    mirror_source = _get_mirror_source(apps)
    facts_source = SourceRecord.objects.filter(
        source_id=FACTS_SOURCE_ID
    ).first()
    inauguration_source = SourceRecord.objects.filter(
        source_id=INAUGURATION_SOURCE_ID
    ).first()

    article_content_type, _ = ContentType.objects.get_or_create(
        app_label="archive",
        model="newsarticle",
    )

    for slug, (
        category,
        published_date,
        title_om,
        title_en,
        body_om,
        body_en,
        cites_zone_facts,
    ) in ARTICLES.items():
        if NewsArticle.objects.filter(slug=slug).exists():
            continue

        article = NewsArticle.objects.create(
            title=title_om,
            draft_title=title_om,
            slug=slug,
            content_type=article_content_type,
            path=_next_child_path(Page, index),
            depth=index.depth + 1,
            numchild=0,
            url_path=f"{index.url_path}{slug}/",
            live=True,
            has_unpublished_changes=False,
            locale_id=index.locale_id,
            translation_key=uuid.uuid4(),
            title_om=title_om,
            title_en=title_en,
            body_om=body_om,
            body_en=body_en,
            category=category,
            published_date=published_date,
        )
        Page.objects.filter(pk=index.pk).update(numchild=F("numchild") + 1)

        SourceCitation.objects.create(
            source=mirror_source,
            content_type=article_content_type,
            object_id=article.pk,
            claim_or_section=(
                f"{slug}: bilingual article text mirrored from the "
                "PM-approved frontend news data."
            ),
            citing_editor=seed_editor,
        )
        if cites_zone_facts and facts_source is not None:
            SourceCitation.objects.create(
                source=facts_source,
                content_type=article_content_type,
                object_id=article.pk,
                claim_or_section=(
                    f"{slug}: numeric figures per the verified zone "
                    "profile facts (qa/CONTENT_FACTS.md section 1)."
                ),
                citing_editor=seed_editor,
            )

    timeline_content_type, _ = ContentType.objects.get_or_create(
        app_label="archive",
        model="timelineevent",
    )

    for (
        year_int,
        year_om,
        year_en,
        text_om,
        text_en,
        cites_inauguration,
    ) in TIMELINE_EVENTS:
        event, created = TimelineEvent.objects.get_or_create(
            year_int=year_int,
            year_om=year_om,
            defaults={
                "year_en": year_en,
                "text_om": text_om,
                "text_en": text_en,
            },
        )
        if not created:
            continue

        SourceCitation.objects.create(
            source=mirror_source,
            content_type=timeline_content_type,
            object_id=event.pk,
            claim_or_section=(
                f"Timeline {year_om}: bilingual text mirrored from the "
                "PM-approved frontend timeline data."
            ),
            citing_editor=seed_editor,
        )
        if cites_inauguration and inauguration_source is not None:
            SourceCitation.objects.create(
                source=inauguration_source,
                content_type=timeline_content_type,
                object_id=event.pk,
                claim_or_section=(
                    "Timeline 2026: inauguration figures per the Kellem "
                    "Wollega Zone Communication Office, 2026-08-21."
                ),
                citing_editor=seed_editor,
            )


def remove_news_and_timeline(apps, schema_editor):
    ContentType = apps.get_model("contenttypes", "ContentType")
    Page = apps.get_model("wagtailcore", "Page")
    NewsArticle = apps.get_model("archive", "NewsArticle")
    TimelineEvent = apps.get_model("archive", "TimelineEvent")
    SourceCitation = apps.get_model("provenance", "SourceCitation")
    SourceRecord = apps.get_model("provenance", "SourceRecord")

    article_content_type = ContentType.objects.filter(
        app_label="archive",
        model="newsarticle",
    ).first()
    for slug in ARTICLES:
        article = NewsArticle.objects.filter(slug=slug).first()
        if article is None:
            continue
        if article_content_type is not None:
            SourceCitation.objects.filter(
                content_type=article_content_type,
                object_id=article.pk,
            ).delete()
        parent_path = article.path[:-PATH_STEP_LENGTH]
        article.delete()
        Page.objects.filter(path=parent_path).update(
            numchild=F("numchild") - 1
        )

    timeline_content_type = ContentType.objects.filter(
        app_label="archive",
        model="timelineevent",
    ).first()
    for year_int, year_om, *_rest in TIMELINE_EVENTS:
        event = TimelineEvent.objects.filter(
            year_int=year_int, year_om=year_om
        ).first()
        if event is None:
            continue
        if timeline_content_type is not None:
            SourceCitation.objects.filter(
                content_type=timeline_content_type,
                object_id=event.pk,
            ).delete()
        event.delete()

    mirror_source = SourceRecord.objects.filter(
        source_id=MIRROR_SOURCE_ID
    ).first()
    if mirror_source is not None and not mirror_source.citations.exists():
        mirror_source.delete()


class Migration(migrations.Migration):
    dependencies = [
        ("archive", "0007_timelineevent"),
        ("places", "0005_seed_woreda_profile_pages"),
        ("provenance", "0001_initial"),
        ("wagtailcore", "0097_baselogentry_uuid_action_timestamp_indexes"),
    ]

    operations = [
        migrations.RunPython(
            seed_news_and_timeline,
            reverse_code=remove_news_and_timeline,
        ),
    ]
