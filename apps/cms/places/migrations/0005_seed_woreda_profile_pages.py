"""Seed the places index and all 12 woreda/town profile pages (issue #26).

Canonical OM slugs come from places/0002_seed_canonical_geographies.
Quick facts fall back to verified zone-level figures (qa/CONTENT_FACTS.md
section 1) with an explicit zone-level note on every entry. Coordinates
are the woreda seat approximations supplied by the PM, sourced from
OpenStreetMap Nominatim. Notable people links follow the PM mapping; the
six woredas without a verified notable person stay empty (documented
content gap). Hero images stay null so the frontend falls back to the
zone hero.
"""

import uuid

from django.db import migrations
from django.db.models import F

PATH_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
PATH_STEP_LENGTH = 4

INDEX_SLUG = "places"
INDEX_TITLE = "Aanaalee fi Bulchiinsa Magaalaa"
INDEX_INTRODUCTION = (
    "<p>Aanaalee kudha tokko fi bulchiinsa magaalaa tokko Godina Qellem "
    "Wallaggaa keessatti argaman.</p>"
)

FACTS_SOURCE_ID = "SRC-026"
FACTS_SOURCE_TITLE = "Kellem Wollega Zone verified profile facts, 2026"
COORDS_SOURCE_ID = "SRC-028"
COORDS_SOURCE_TITLE = "OpenStreetMap Nominatim woreda seat coordinates, 2026"
SEED_EDITOR_USERNAME = "content-seed-bot"

ZONE_NOTE_EN = "Zone-level figure."
ZONE_NOTE_OM = "Lakkoofsa sadarkaa godinaa."

ZONE_QUICK_FACTS = (
    ("Population", "Baay'ina Ummataa", 1254817, None),
    ("Area", "Bal'ina Lafaa", 9857, "km2"),
    ("Kebeles", "Gandoota", 289, None),
    ("Coffee production", "Oomisha Bunaa", 134213, "tonnes"),
    ("Beehives", "Gaagura Kanniisaa", 473300, None),
    ("Livestock", "Horii", 6721429, None),
    ("Primary schools", "Manneen Barnootaa Sadarkaa 1ffaa", 452, None),
    ("Secondary schools", "Manneen Barnootaa Sadarkaa 2ffaa", 50, None),
    ("Students", "Barattoota", 348516, None),
    ("Hospitals", "Hospitaalota", 4, None),
    ("Health centres", "Buufataalee Fayyaa", 51, None),
    ("Health posts", "Keellawwan Fayyaa", 256, None),
    ("Cooperatives", "Waldaalee Hojii Gamtaa", 817, None),
)

MINERAL_NAMES = {
    "gold": ("gold", "warqee"),
    "platinum": ("platinum", "plaatiniyeemii"),
    "tantalum": ("tantalum", "taantaalamii"),
    "uranium": ("uranium", "yuraaniyeemii"),
}

# slug -> (latitude, longitude, minerals, notable people slugs)
WOREDA_DATA = {
    "dambi-doolloo": (8.543, 34.795, (), ("dr-negasso-gidada",)),
    "sayyoo": (8.62, 34.38, ("gold", "tantalum", "uranium"),
               ("jote-tulu", "dr-negasso-gidada")),
    "haawwaa-galaan": (8.75, 34.58, ("gold",), ()),
    "daallee-sadii": (8.50, 34.33, (), ()),
    "daallee-waabaraa": (8.70, 34.80, ("gold",), ()),
    "gaawoo-qeebbee": (8.85, 35.05, (), ("jaal-laggasaa-wagii",)),
    "yamaalogii-walal": (8.72, 34.15, (), ("oliqa-dingil-booka",)),
    "anfilloo": (8.42, 34.55, ("gold", "uranium"), ()),
    "gidaamii": (8.98, 34.60, (), ("gidamii-guus-agaloo",)),
    "laaloo-qilee": (8.70, 34.47, ("gold", "platinum"), ()),
    "sadii-canqaa": (8.85, 34.60, (), ("sadii-akkayyuu",)),
    "jimmaa-horroo": (9.05, 35.20, (), ()),
}


def _quick_facts(minerals):
    facts = []
    for label_en, label_om, value, unit in ZONE_QUICK_FACTS:
        fact = {
            "label_en": label_en,
            "label_om": label_om,
            "value": value,
            "note_en": ZONE_NOTE_EN,
            "note_om": ZONE_NOTE_OM,
        }
        if unit:
            fact["unit"] = unit
        facts.append(fact)
    if minerals:
        facts.append(
            {
                "label_en": "Verified minerals",
                "label_om": "Albuudota Mirkanaa'an",
                "value": ", ".join(
                    MINERAL_NAMES[m][0] for m in minerals
                ).capitalize(),
                "note_en": "Woreda-specific verified occurrence.",
                "note_om": "Argannoo mirkanaa'e kan aanichaa.",
            }
        )
    return facts


def _sections(name, slug, latitude, longitude, minerals):
    is_town = slug == "dambi-doolloo"

    if is_town:
        intro_om = (
            f"<p>{name} bulchiinsa magaalaa fi teessoo Godina Qellem "
            "Wallaggaa, Oromiyaa lixaa ti.</p>"
        )
        intro_en = (
            f"<p>{name} (Dembi Dolo) is the town administration and the "
            "seat of the Kellem Wollega Zone in western Oromia, Ethiopia.</p>"
        )
        history_om = (
            f"<p>{name} kutaa naannoo seena-qabeessa Qellem, Wallaggaa "
            "lixaa keessatti argama. Magaalattiin waajjiraalee godinaa kan "
            "qabattu yoo ta'u, bara 2026 pirojektiiwwan misoomaa haaraan, "
            "kan akka Galma Oliiqaa Dingil, eebbifamaniiru.</p>"
        )
        history_en = (
            f"<p>{name} lies within the historic Qellem area of western "
            "Wallaga and hosts the institutions of the zone. In 2026 the "
            "town inaugurated new development projects, including the "
            "Oliqa Dingil Hall. A fuller, source-verified local history "
            "will be added as archival material is reviewed.</p>"
        )
        economy_om = (
            "<p>Akka teessoo godinaatti, magaalattiin giddugala daldalaa, "
            "tajaajilaa fi bulchiinsaa ti. Naannoon ishee qonna, "
            "keessumaa buna, irratti hundaa'a.</p>"
        )
        economy_en = (
            "<p>As the zone seat, the town is a centre of trade, services, "
            "and administration for the surrounding districts, whose "
            "economy is based on agriculture and coffee in particular.</p>"
        )
        attractions_om = (
            "<p>Iddoowwan beekamoo keessaa Galma Oliiqaa Dingil haaraa "
            "eebbifame fi daandii guddaa magaalattii ti.</p>"
        )
        attractions_en = (
            "<p>Landmarks include the newly inaugurated Oliqa Dingil Hall "
            "and the town's main avenue.</p>"
        )
    else:
        intro_om = (
            f"<p>{name} aanaa Godina Qellem Wallaggaa, Oromiyaa lixaa "
            "keessatti argamu dha.</p>"
        )
        intro_en = (
            f"<p>{name} is a district (woreda) of the Kellem Wollega Zone "
            "in western Oromia, Ethiopia.</p>"
        )
        history_om = (
            f"<p>{name} kutaa naannoo seena-qabeessa Qellem, Wallaggaa "
            "lixaa keessatti argama. Seenaan aanichaa bal'inaan madda "
            "mirkanaa'e irratti hundaa'ee ni dabalama.</p>"
        )
        history_en = (
            f"<p>{name} lies within the historic Qellem area of western "
            "Wallaga. A fuller, source-verified local history will be "
            "added as archival material is reviewed.</p>"
        )
        if slug == "sayyoo":
            history_om = history_om.replace(
                "</p>",
                " Bulchaa seenaa Jootee Tulluu waliin walqabatee "
                "yaadatama.</p>",
            )
            history_en = history_en.replace(
                "</p>",
                " It is remembered in connection with the historical "
                "ruler Jote Tulu.</p>",
            )
        economy_om = (
            "<p>Diinagdeen aanichaa qonna irratti hundaa'a. Bunni oomisha "
            "ijoo godinichaa ti; horsiisni kanniisaa fi horii horsiisuunis "
            "barbaachisoo dha.</p>"
        )
        economy_en = (
            "<p>The local economy is based on agriculture. Coffee is the "
            "leading product of the zone (134,213 tonnes from 484,841 "
            "hectares, zone-level figures); beekeeping and livestock are "
            "also important.</p>"
        )
        if minerals:
            mineral_list_en = ", ".join(MINERAL_NAMES[m][0] for m in minerals)
            mineral_list_om = ", ".join(MINERAL_NAMES[m][1] for m in minerals)
            economy_om = economy_om.replace(
                "</p>",
                f" Albuudota mirkanaa'an keessaa {mineral_list_om} aanaa "
                "kana keessatti ni argamu.</p>",
            )
            economy_en = economy_en.replace(
                "</p>",
                f" Verified mineral occurrences in the district include "
                f"{mineral_list_en}.</p>",
            )
        attractions_om = (
            "<p>Gaarran magariisaa, iddoowwan bunaa fi iddoowwan aadaa; "
            f"tarreeffamni hawwattoota {name} mirkanaa'e itti fufee ni "
            "qindaa'a.</p>"
        )
        attractions_en = (
            "<p>Green highlands, coffee landscapes, and local cultural "
            f"sites; a verified list of attractions for {name} is being "
            "compiled.</p>"
        )

    culture_om = (
        f"<p>Ummanni {name} aadaa Oromoo naannoo Qellem waliin qooddata; "
        "Afaan Oromoo afaan ummata godinichaa isa guddaa dha.</p>"
    )
    culture_en = (
        f"<p>The people of {name} share the Oromo culture of the wider "
        "Qellem area. Afaan Oromoo is the dominant language of the zone "
        "(96.31%), and Protestant, Orthodox, and Muslim communities live "
        "together (zone-level figures).</p>"
    )
    geography_om = (
        f"<p>{name} Godina Qellem Wallaggaa, Oromiyaa lixaa keessatti "
        f"argama. Magaalaan teessoo isaa tilmaamaan {latitude} Kaabaa fi "
        f"{longitude} Bahaatti argama.</p>"
    )
    geography_en = (
        f"<p>{name} is located in the Kellem Wollega Zone of western "
        "Oromia. The zone's climate mixes woyinadega (47%), kola (39%), "
        "and dega (14%) belts (zone-level figures). The seat town lies "
        f"near {latitude} N, {longitude} E.</p>"
    )

    return {
        "intro_om": intro_om,
        "intro_en": intro_en,
        "history_om": history_om,
        "history_en": history_en,
        "economy_om": economy_om,
        "economy_en": economy_en,
        "culture_om": culture_om,
        "culture_en": culture_en,
        "geography_om": geography_om,
        "geography_en": geography_en,
        "attractions_om": attractions_om,
        "attractions_en": attractions_en,
        "introduction": intro_om,
        "overview": (
            f"<p>Seenaa, diinagdee, aadaa fi teessuma lafaa {name} fuula "
            "kana irratti qindaa'ee jira.</p>"
        ),
    }


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


def _get_or_create_index(apps):
    ContentType = apps.get_model("contenttypes", "ContentType")
    Page = apps.get_model("wagtailcore", "Page")
    HomePage = apps.get_model("home", "HomePage")
    GeographyIndexPage = apps.get_model("places", "GeographyIndexPage")

    index = (
        GeographyIndexPage.objects.filter(slug=INDEX_SLUG).order_by("pk").first()
    )
    if index is not None:
        return index

    homepage = (
        HomePage.objects.filter(locale__language_code="om").order_by("pk").first()
        or HomePage.objects.order_by("pk").first()
    )
    if homepage is None:
        return None

    content_type, _ = ContentType.objects.get_or_create(
        app_label="places",
        model="geographyindexpage",
    )
    index = GeographyIndexPage.objects.create(
        title=INDEX_TITLE,
        draft_title=INDEX_TITLE,
        slug=INDEX_SLUG,
        content_type=content_type,
        path=_next_child_path(Page, homepage),
        depth=homepage.depth + 1,
        numchild=0,
        url_path=f"{homepage.url_path}{INDEX_SLUG}/",
        live=True,
        has_unpublished_changes=False,
        show_in_menus=True,
        locale_id=homepage.locale_id,
        translation_key=uuid.uuid4(),
        introduction=INDEX_INTRODUCTION,
    )
    Page.objects.filter(pk=homepage.pk).update(numchild=F("numchild") + 1)
    return index


def _get_or_create_sources(apps):
    SourceRecord = apps.get_model("provenance", "SourceRecord")
    Geography = apps.get_model("places", "Geography")
    zone = Geography.objects.filter(slug="qellem-wallaggaa").first()

    facts_source, _ = SourceRecord.objects.get_or_create(
        source_id=FACTS_SOURCE_ID,
        defaults={
            "title": FACTS_SOURCE_TITLE,
            "issuing_organization": "Kellem Wollega Zone Administration",
            "source_date_text": "2026",
            "source_calendar": "gc",
            "document_type": "profile",
            "language": "om_en",
            "subject": "demographics",
            "geography": zone,
            "private_description": (
                "PM-verified zone profile facts mirrored in "
                "qa/CONTENT_FACTS.md section 1: population, area, kebeles, "
                "coffee, hives, livestock, schools, students, health, "
                "cooperatives, climate, language, and per-woreda mineral "
                "occurrences."
            ),
        },
    )
    coords_source, _ = SourceRecord.objects.get_or_create(
        source_id=COORDS_SOURCE_ID,
        defaults={
            "title": COORDS_SOURCE_TITLE,
            "issuing_organization": "OpenStreetMap Nominatim",
            "source_date_text": "2026",
            "source_calendar": "gc",
            "document_type": "web_page",
            "language": "en",
            "subject": "geography_places",
            "geography": zone,
            "private_description": (
                "Approximate woreda seat coordinates confirmed by the PM "
                "against OpenStreetMap Nominatim lookups."
            ),
        },
    )
    return facts_source, coords_source


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


def seed_woreda_profiles(apps, schema_editor):
    ContentType = apps.get_model("contenttypes", "ContentType")
    Page = apps.get_model("wagtailcore", "Page")
    Geography = apps.get_model("places", "Geography")
    GeographyProfilePage = apps.get_model("places", "GeographyProfilePage")
    Person = apps.get_model("archive", "Person")
    SourceCitation = apps.get_model("provenance", "SourceCitation")

    index = _get_or_create_index(apps)
    if index is None:
        return

    facts_source, coords_source = _get_or_create_sources(apps)
    seed_editor = _get_seed_editor(apps)
    profile_content_type, _ = ContentType.objects.get_or_create(
        app_label="places",
        model="geographyprofilepage",
    )

    for slug, (latitude, longitude, minerals, people) in WOREDA_DATA.items():
        geography = Geography.objects.get(slug=slug)
        if GeographyProfilePage.objects.filter(
            slug=slug, locale_id=index.locale_id
        ).exists():
            continue

        name = geography.canonical_name
        sections = _sections(name, slug, latitude, longitude, minerals)

        page = GeographyProfilePage.objects.create(
            title=name,
            draft_title=name,
            slug=slug,
            content_type=profile_content_type,
            path=_next_child_path(Page, index),
            depth=index.depth + 1,
            numchild=0,
            url_path=f"{index.url_path}{slug}/",
            live=True,
            has_unpublished_changes=False,
            show_in_menus=True,
            locale_id=index.locale_id,
            translation_key=uuid.uuid4(),
            geography=geography,
            quick_facts=_quick_facts(minerals),
            latitude=latitude,
            longitude=longitude,
            **sections,
        )
        Page.objects.filter(pk=index.pk).update(numchild=F("numchild") + 1)

        linked_people = [
            person
            for person_slug in people
            if (person := Person.objects.filter(slug=person_slug).first())
            is not None
        ]
        # Historical models are not ClusterableModel subclasses, so
        # ParentalManyToManyField adds never commit; write the through
        # table directly instead.
        through = GeographyProfilePage._meta.get_field(
            "notable_people"
        ).remote_field.through
        for person in linked_people:
            through.objects.get_or_create(
                geographyprofilepage_id=page.pk,
                person_id=person.pk,
            )

        SourceCitation.objects.create(
            source=facts_source,
            content_type=profile_content_type,
            object_id=page.pk,
            claim_or_section=(
                f"{name}: zone-level quick facts (population 1,254,817; "
                "area ~9,857 km2; 289 kebeles; coffee 134,213 t from "
                "484,841 ha; 473,300 hives; 6,721,429 livestock; 452/50 "
                "schools; 348,516 students; 4/51/256 health facilities; "
                "817 cooperatives with 156,500 members; climate 47/39/14; "
                "language 96.31% Afaan Oromoo) and the mineral occurrences "
                "named in the economy section."
            ),
            citing_editor=seed_editor,
        )
        SourceCitation.objects.create(
            source=coords_source,
            content_type=profile_content_type,
            object_id=page.pk,
            claim_or_section=(
                f"{name}: seat coordinates {latitude} N, {longitude} E "
                "(approximate)."
            ),
            citing_editor=seed_editor,
        )


def remove_woreda_profiles(apps, schema_editor):
    ContentType = apps.get_model("contenttypes", "ContentType")
    Page = apps.get_model("wagtailcore", "Page")
    GeographyProfilePage = apps.get_model("places", "GeographyProfilePage")
    SourceCitation = apps.get_model("provenance", "SourceCitation")
    SourceRecord = apps.get_model("provenance", "SourceRecord")

    profile_content_type = ContentType.objects.filter(
        app_label="places",
        model="geographyprofilepage",
    ).first()

    for slug in WOREDA_DATA:
        page = GeographyProfilePage.objects.filter(slug=slug).first()
        if page is None:
            continue
        if profile_content_type is not None:
            SourceCitation.objects.filter(
                content_type=profile_content_type,
                object_id=page.pk,
            ).delete()
        parent_path = page.path[:-PATH_STEP_LENGTH]
        page.delete()
        Page.objects.filter(path=parent_path).update(numchild=F("numchild") - 1)

    for source_id in (FACTS_SOURCE_ID, COORDS_SOURCE_ID):
        source = SourceRecord.objects.filter(source_id=source_id).first()
        if source is not None and not source.citations.exists():
            source.delete()


class Migration(migrations.Migration):
    dependencies = [
        ("places", "0004_geographyprofilepage_attractions_en_and_more"),
        ("archive", "0005_seed_zone_notable_people"),
        ("provenance", "0001_initial"),
        ("home", "0005_configure_zone_homepage"),
        ("wagtailcore", "0097_baselogentry_uuid_action_timestamp_indexes"),
    ]

    operations = [
        migrations.RunPython(
            seed_woreda_profiles,
            reverse_code=remove_woreda_profiles,
        ),
    ]
