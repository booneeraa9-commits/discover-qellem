from django.db import models
from django.utils.translation import gettext_lazy as _


class CalendarSystem(models.TextChoices):
    ETHIOPIAN = "ec", _("Ethiopian calendar (E.C.)")
    GREGORIAN = "gc", _("Gregorian calendar (G.C.)")
    BOTH = "both", _("Both calendars")
    UNKNOWN = "unknown", _("Unknown")


class SourceDocumentType(models.TextChoices):
    PROFILE = "profile", _("Administrative profile")
    REPORT = "report", _("Report")
    BRIEF = "brief", _("Brief or summary")
    LETTER = "letter", _("Letter or official correspondence")
    DATASET = "dataset", _("Dataset or statistical table")
    WEB_PAGE = "web_page", _("Web page")
    OTHER = "other", _("Other")


class SourceLanguage(models.TextChoices):
    OROMO = "om", _("Afaan Oromoo")
    ENGLISH = "en", _("English")
    BILINGUAL = "om_en", _("Afaan Oromoo and English")
    OTHER = "other", _("Other")


class SourceSubject(models.TextChoices):
    HISTORY_NAMING = "history_naming", _("History and naming")
    CULTURE_HERITAGE = "culture_heritage", _("Culture and heritage")
    DEMOGRAPHICS = "demographics", _("Demographics and statistics")
    GEOGRAPHY_PLACES = "geography_places", _("Geography and places")
    NOTABLE_PEOPLE = "notable_people", _("Deceased notable people")
    GLOSSARY_LANGUAGE = "glossary_language", _("Glossary and language")
    ADMINISTRATION = "administration", _("Administration")
    MIXED = "mixed", _("Multiple subjects")
    OTHER = "other", _("Other")


class PermissionBasis(models.TextChoices):
    PENDING = "pending", _("Not yet confirmed")
    VERBAL = "verbal", _("Verbal permission")
    WRITTEN = "written", _("Written permission")
    LICENSE = "license", _("License")
    CREATOR_OWNED = "creator_owned", _("Supplied by the rights-owning creator")
    PUBLIC_DOMAIN = "public_domain", _("Verified public domain")
    OTHER = "other", _("Other documented basis")


class SensitivityStatus(models.TextChoices):
    NOT_SCREENED = "not_screened", _("Not screened")
    IN_REVIEW = "in_review", _("Screening in progress")
    CLEARED = "cleared", _("Cleared for editorial use")
    CONCERNS = "concerns", _("Concerns require resolution")
    RESTRICTED = "restricted", _("Restricted")


class VerificationStatus(models.TextChoices):
    UNVERIFIED = "unverified", _("Unverified")
    IN_REVIEW = "in_review", _("In review")
    VERIFIED = "verified", _("Verified")
    REJECTED = "rejected", _("Rejected")


class CitationDecision(models.TextChoices):
    PENDING = "pending", _("Pending fact review")
    VERIFIED = "verified", _("Claim verified")
    DISPUTED = "disputed", _("Claim disputed")
    REJECTED = "rejected", _("Citation rejected")


class ConsentStatus(models.TextChoices):
    NOT_APPLICABLE = "not_applicable", _("No people depicted")
    PENDING = "pending", _("Pending confirmation")
    CONFIRMED = "confirmed", _("Consent confirmed")
    NOT_REQUIRED = "not_required", _("Documented as not required")
    RESTRICTED = "restricted", _("Restricted use")
    DECLINED = "declined", _("Consent declined")


class MediaReviewStatus(models.TextChoices):
    PENDING = "pending", _("Pending review")
    IN_REVIEW = "in_review", _("In review")
    APPROVED = "approved", _("Approved for permitted public uses")
    REJECTED = "rejected", _("Rejected")
    EXPIRED = "expired", _("Approval expired or withdrawn")
