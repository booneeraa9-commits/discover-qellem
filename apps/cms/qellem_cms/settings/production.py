from urllib.parse import urlparse

from django.core.exceptions import ImproperlyConfigured

from .base import *
from .environment import (
    boolean,
    integer,
    required,
    required_list,
)

DEBUG = False

# Production identity and request boundaries.
SECRET_KEY = required("DJANGO_SECRET_KEY")
ALLOWED_HOSTS = required_list("DJANGO_ALLOWED_HOSTS")
CSRF_TRUSTED_ORIGINS = required_list(
    "DJANGO_CSRF_TRUSTED_ORIGINS"
)
WAGTAILADMIN_BASE_URL = required(
    "WAGTAILADMIN_BASE_URL"
).rstrip("/")

if "*" in ALLOWED_HOSTS:
    raise ImproperlyConfigured(
        "DJANGO_ALLOWED_HOSTS must not contain a wildcard in production."
    )

admin_url = urlparse(WAGTAILADMIN_BASE_URL)

if admin_url.scheme != "https" or not admin_url.netloc:
    raise ImproperlyConfigured(
        "WAGTAILADMIN_BASE_URL must be a complete HTTPS URL."
    )

for trusted_origin in CSRF_TRUSTED_ORIGINS:
    parsed_origin = urlparse(trusted_origin)

    if parsed_origin.scheme != "https" or not parsed_origin.netloc:
        raise ImproperlyConfigured(
            "Every production CSRF trusted origin must be a complete "
            f"HTTPS origin; received {trusted_origin!r}."
        )

# Production PostgreSQL values must be supplied explicitly.
for database_variable in (
    "POSTGRES_DB",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_HOST",
):
    required(database_variable)

DATABASES["default"]["CONN_MAX_AGE"] = integer(
    "POSTGRES_CONN_MAX_AGE",
    60,
    minimum=0,
)
DATABASES["default"]["CONN_HEALTH_CHECKS"] = True

# Caddy will terminate HTTPS and replace the incoming forwarding header.
SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO",
    "https",
)
SECURE_SSL_REDIRECT = True

SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = "Lax"

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
X_FRAME_OPTIONS = "DENY"

# Begin with a short HSTS lifetime. It can be increased deliberately after
# the final domain and all required HTTPS subdomains have been verified.
SECURE_HSTS_SECONDS = integer(
    "DJANGO_SECURE_HSTS_SECONDS",
    3600,
    minimum=0,
)
SECURE_HSTS_INCLUDE_SUBDOMAINS = boolean(
    "DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS",
    False,
)
SECURE_HSTS_PRELOAD = boolean(
    "DJANGO_SECURE_HSTS_PRELOAD",
    False,
)

# Fingerprinted static assets prevent stale admin files after deployment.
STORAGES["staticfiles"]["BACKEND"] = (
    "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"
)
