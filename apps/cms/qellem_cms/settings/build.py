"""Settings used only while building static assets into the container."""

from .base import *

DEBUG = False

# This value is only used during collectstatic. This settings module must
# never be used to run the deployed application.
SECRET_KEY = "build-process-only-not-a-runtime-secret"

ALLOWED_HOSTS = []

STORAGES["staticfiles"]["BACKEND"] = (
    "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"
)
