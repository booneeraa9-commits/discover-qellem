import os

from .base import *
from .environment import value_list

# Local development only.
DEBUG = True

# This fallback is intentionally unsafe and must never be used in production.
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-discover-qellem-local-development-only",
)

# Do not use a wildcard. Additional development hosts can be supplied
# explicitly as a comma-separated environment variable.
ALLOWED_HOSTS = value_list(
    "DJANGO_ALLOWED_HOSTS",
    "localhost,127.0.0.1,[::1]",
)

CSRF_TRUSTED_ORIGINS = value_list(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    "http://localhost:8000,http://127.0.0.1:8000",
)

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
