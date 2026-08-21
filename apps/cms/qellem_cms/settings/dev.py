import os

from .base import *
from .environment import boolean, value_list

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

# Cross-origin API access for the local frontend development server only.
# The corsheaders app is wired exclusively in this development settings
# module, so production can never serve CORS headers.
INSTALLED_APPS = [*INSTALLED_APPS, "corsheaders"]
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    *MIDDLEWARE,
]

# Gate: set DJANGO_CORS_ENABLED=false to switch the API CORS headers off.
CORS_ALLOWED_ORIGINS = (
    value_list("DJANGO_CORS_ALLOWED_ORIGINS", "http://localhost:3000")
    if boolean("DJANGO_CORS_ENABLED", True)
    else []
)

# Only the public API may be called cross-origin; admin and page routes stay
# same-origin.
CORS_URLS_REGEX = r"^/api/"
