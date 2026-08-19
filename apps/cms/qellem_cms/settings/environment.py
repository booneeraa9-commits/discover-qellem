"""Environment-variable parsing helpers for Django settings."""

import os

from django.core.exceptions import ImproperlyConfigured


def required(name):
    """Return a required non-empty environment variable."""
    value = os.environ.get(name, "").strip()

    if not value:
        raise ImproperlyConfigured(
            f"Required environment variable {name!r} is not set."
        )

    return value


def value_list(name, default=""):
    """Return a comma-separated environment variable as a clean list."""
    raw_value = os.environ.get(name, default)

    return [
        item.strip()
        for item in raw_value.split(",")
        if item.strip()
    ]


def required_list(name):
    """Return a required comma-separated environment variable."""
    values = value_list(name)

    if not values:
        raise ImproperlyConfigured(
            f"Required list environment variable {name!r} is empty."
        )

    return values


def boolean(name, default=False):
    """Parse a conventional Boolean environment variable."""
    raw_value = os.environ.get(name)

    if raw_value is None:
        return default

    normalized = raw_value.strip().lower()

    if normalized in {"1", "true", "yes", "on"}:
        return True

    if normalized in {"0", "false", "no", "off"}:
        return False

    raise ImproperlyConfigured(
        f"Environment variable {name!r} must be a Boolean value."
    )


def integer(name, default, minimum=None):
    """Parse an integer environment variable with an optional minimum."""
    raw_value = os.environ.get(name, str(default)).strip()

    try:
        parsed = int(raw_value)
    except ValueError as error:
        raise ImproperlyConfigured(
            f"Environment variable {name!r} must be an integer."
        ) from error

    if minimum is not None and parsed < minimum:
        raise ImproperlyConfigured(
            f"Environment variable {name!r} must be at least {minimum}."
        )

    return parsed
