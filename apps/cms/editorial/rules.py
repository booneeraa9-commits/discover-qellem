from editorial.choices import EditorialAction, EditorialRole, EditorialSubject

ROLE_ACTIONS = {
    EditorialRole.SYSTEM_ADMINISTRATOR: frozenset(),
    EditorialRole.MANAGING_EDITOR: frozenset(EditorialAction.values),
    EditorialRole.SUBJECT_EDITOR: frozenset(
        {
            EditorialAction.VIEW,
            EditorialAction.CREATE,
            EditorialAction.EDIT,
            EditorialAction.SUBMIT,
            EditorialAction.ARCHIVE,
        }
    ),
    EditorialRole.NEWS_EDITOR: frozenset(
        {
            EditorialAction.VIEW,
            EditorialAction.CREATE,
            EditorialAction.EDIT,
            EditorialAction.SUBMIT,
            EditorialAction.ARCHIVE,
        }
    ),
    EditorialRole.TRANSLATOR: frozenset(
        {
            EditorialAction.VIEW,
            EditorialAction.CREATE,
            EditorialAction.EDIT,
            EditorialAction.SUBMIT,
        }
    ),
    EditorialRole.LANGUAGE_REVIEWER: frozenset(
        {
            EditorialAction.VIEW,
            EditorialAction.REVIEW,
            EditorialAction.APPROVE,
        }
    ),
    EditorialRole.FACT_REVIEWER: frozenset(
        {
            EditorialAction.VIEW,
            EditorialAction.REVIEW,
            EditorialAction.APPROVE,
        }
    ),
    EditorialRole.MEDIA_MANAGER: frozenset(
        {
            EditorialAction.VIEW,
            EditorialAction.REVIEW,
            EditorialAction.APPROVE,
            EditorialAction.MANAGE_MEDIA,
        }
    ),
    EditorialRole.FINANCE_VIEWER: frozenset({EditorialAction.VIEW}),
    EditorialRole.SUBMISSION_REVIEWER: frozenset(
        {
            EditorialAction.VIEW,
            EditorialAction.REVIEW,
            EditorialAction.APPROVE,
        }
    ),
}

CONTENT_SUBJECTS = frozenset(
    {
        EditorialSubject.HOME_ZONE,
        EditorialSubject.GEOGRAPHY,
        EditorialSubject.HISTORY_CULTURE,
        EditorialSubject.PEOPLE,
        EditorialSubject.GLOSSARY_LANGUAGE,
        EditorialSubject.STATISTICS,
        EditorialSubject.SOURCES,
        EditorialSubject.PARTNERS,
    }
)

ROLE_SUBJECTS = {
    EditorialRole.SYSTEM_ADMINISTRATOR: frozenset(),
    EditorialRole.MANAGING_EDITOR: frozenset(EditorialSubject.values),
    EditorialRole.SUBJECT_EDITOR: CONTENT_SUBJECTS | {EditorialSubject.MEDIA},
    EditorialRole.NEWS_EDITOR: frozenset({EditorialSubject.NEWS_FEED}),
    EditorialRole.TRANSLATOR: CONTENT_SUBJECTS | {EditorialSubject.MEDIA},
    EditorialRole.LANGUAGE_REVIEWER: CONTENT_SUBJECTS,
    EditorialRole.FACT_REVIEWER: CONTENT_SUBJECTS,
    EditorialRole.MEDIA_MANAGER: frozenset({EditorialSubject.MEDIA}),
    EditorialRole.FINANCE_VIEWER: frozenset({EditorialSubject.FINANCE}),
    EditorialRole.SUBMISSION_REVIEWER: frozenset({EditorialSubject.PUBLIC_SUBMISSIONS}),
}


def role_allows(role, subject, action):
    return action in ROLE_ACTIONS.get(role, ()) and subject in ROLE_SUBJECTS.get(
        role, ()
    )
