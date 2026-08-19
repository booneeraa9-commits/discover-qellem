from django.db import models
from django.utils.translation import gettext_lazy as _


class EditorialRole(models.TextChoices):
    SYSTEM_ADMINISTRATOR = "system_admin", _("System administrator")
    MANAGING_EDITOR = "managing_editor", _("Managing editor")
    SUBJECT_EDITOR = "subject_editor", _("Subject editor")
    NEWS_EDITOR = "news_editor", _("News and feed editor (reserved)")
    TRANSLATOR = "translator", _("Translator")
    LANGUAGE_REVIEWER = "language_reviewer", _("Language reviewer")
    FACT_REVIEWER = "fact_reviewer", _("Fact and source reviewer")
    MEDIA_MANAGER = "media_manager", _("Media manager")
    FINANCE_VIEWER = "finance_viewer", _("Finance viewer (reserved)")
    SUBMISSION_REVIEWER = (
        "submission_reviewer",
        _("Public-submission reviewer (reserved)"),
    )


class EditorialSubject(models.TextChoices):
    HOME_ZONE = "home_zone", _("Combined homepage and zone profile")
    GEOGRAPHY = "geography", _("Geography profiles and identities")
    HISTORY_CULTURE = "history_culture", _("History, naming, culture, and heritage")
    PEOPLE = "people", _("People")
    GLOSSARY_LANGUAGE = "glossary_language", _("Glossary and language")
    STATISTICS = "statistics", _("Dated statistics")
    SOURCES = "sources", _("Private sources and citations")
    MEDIA = "media", _("Media and rights")
    PARTNERS = "partners", _("Sponsors and collaborators")
    NEWS_FEED = "news_feed", _("News and feed (reserved)")
    FINANCE = "finance", _("Finance (reserved)")
    PUBLIC_SUBMISSIONS = "public_submissions", _("Public submissions (reserved)")


class EditorialLanguage(models.TextChoices):
    OROMO = "om", _("Afaan Oromoo")
    ENGLISH = "en", _("English")
    BOTH = "both", _("Both languages / locale-neutral record")


class EditorialAction(models.TextChoices):
    VIEW = "view", _("View")
    CREATE = "create", _("Create")
    EDIT = "edit", _("Edit")
    SUBMIT = "submit", _("Submit for review")
    REVIEW = "review", _("Review")
    APPROVE = "approve", _("Approve review")
    PUBLISH = "publish", _("Publish")
    ARCHIVE = "archive", _("Archive or unpublish")
    MANAGE_MEDIA = "manage_media", _("Manage media")
