from editorial.choices import EditorialRole

SYSTEM_ADMINISTRATORS = "Discover Qellem — System Administrators"
MANAGING_EDITORS = "Discover Qellem — Managing Editors"
SUBJECT_EDITORS = "Discover Qellem — Subject Editors"
NEWS_EDITORS = "Discover Qellem — News and Feed Editors (Reserved)"
TRANSLATORS = "Discover Qellem — Translators"
LANGUAGE_REVIEWERS = "Discover Qellem — Language Reviewers"
FACT_REVIEWERS = "Discover Qellem — Fact and Source Reviewers"
MEDIA_MANAGERS = "Discover Qellem — Media Managers"
FINANCE_VIEWERS = "Discover Qellem — Finance Viewers (Reserved)"
SUBMISSION_REVIEWERS = "Discover Qellem — Public-Submission Reviewers (Reserved)"

BASELINE_GROUPS = (
    SYSTEM_ADMINISTRATORS,
    MANAGING_EDITORS,
    SUBJECT_EDITORS,
    NEWS_EDITORS,
    TRANSLATORS,
    LANGUAGE_REVIEWERS,
    FACT_REVIEWERS,
    MEDIA_MANAGERS,
    FINANCE_VIEWERS,
    SUBMISSION_REVIEWERS,
)

ROLE_GROUPS = {
    EditorialRole.SYSTEM_ADMINISTRATOR: SYSTEM_ADMINISTRATORS,
    EditorialRole.MANAGING_EDITOR: MANAGING_EDITORS,
    EditorialRole.SUBJECT_EDITOR: SUBJECT_EDITORS,
    EditorialRole.NEWS_EDITOR: NEWS_EDITORS,
    EditorialRole.TRANSLATOR: TRANSLATORS,
    EditorialRole.LANGUAGE_REVIEWER: LANGUAGE_REVIEWERS,
    EditorialRole.FACT_REVIEWER: FACT_REVIEWERS,
    EditorialRole.MEDIA_MANAGER: MEDIA_MANAGERS,
    EditorialRole.FINANCE_VIEWER: FINANCE_VIEWERS,
    EditorialRole.SUBMISSION_REVIEWER: SUBMISSION_REVIEWERS,
}
