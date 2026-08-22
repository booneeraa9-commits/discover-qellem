"""Replace the inauguration article placeholder body with PM-verified OM text.

Reads apps/cms/archive/fixtures/inauguration-2026-om.txt verbatim and
wraps each blank-line-separated paragraph in <p> tags to match Wagtail
RichTextField storage. Reversible to a clearly-labeled placeholder so
rollback does not leave production content.

Bug reference: #61 gallery order was already set correctly in 0006;
this migration only fixes body_om content.
"""

from pathlib import Path

from django.db import migrations

FIXTURE = (
    Path(__file__).resolve().parent.parent / "fixtures" / "inauguration-2026-om.txt"
)
ARTICLE_SLUG = "dembi-dollo-inauguration-2026"
PLACEHOLDER = "<p>[OM body pending PM content]</p>"


def _load_body_om() -> str:
    text = FIXTURE.read_text(encoding="utf-8").strip()
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    return "".join(f"<p>{p}</p>" for p in paragraphs)


def set_body_om(apps, schema_editor):
    NewsArticle = apps.get_model("archive", "NewsArticle")
    body = _load_body_om()
    updated = NewsArticle.objects.filter(slug=ARTICLE_SLUG).update(body_om=body)
    if updated != 1:
        # The article must exist; if not, fail loudly rather than silently
        # leaving placeholder content in the database.
        raise NewsArticle.DoesNotExist(
            f"Expected 1 NewsArticle with slug={ARTICLE_SLUG!r}, found {updated}"
        )


def reset_body_om(apps, schema_editor):
    NewsArticle = apps.get_model("archive", "NewsArticle")
    NewsArticle.objects.filter(slug=ARTICLE_SLUG).update(body_om=PLACEHOLDER)


class Migration(migrations.Migration):
    dependencies = [
        ("archive", "0008_seed_news_and_timeline"),
    ]

    operations = [
        migrations.RunPython(set_body_om, reverse_code=reset_body_om),
    ]
