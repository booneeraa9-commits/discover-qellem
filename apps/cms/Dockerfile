# Build Python dependencies in a disposable stage.
FROM python:3.12-slim-bookworm AS builder

ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    PYTHONDONTWRITEBYTECODE=1

RUN apt-get update --yes --quiet \
    && apt-get install --yes --quiet --no-install-recommends \
        build-essential \
        libjpeg62-turbo-dev \
        libpq-dev \
        libwebp-dev \
        zlib1g-dev \
    && rm -rf /var/lib/apt/lists/* \
    && python -m venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /build

COPY requirements.txt ./

# Gunicorn and Psycopg are installed from the project-managed lock snapshot.
RUN python -m pip install --requirement requirements.txt


# Build the non-root production runtime image.
FROM python:3.12-slim-bookworm AS runtime

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DJANGO_SETTINGS_MODULE=qellem_cms.settings.production \
    PATH="/opt/venv/bin:$PATH" \
    PORT=8000

RUN apt-get update --yes --quiet \
    && apt-get install --yes --quiet --no-install-recommends \
        ca-certificates \
        libjpeg62-turbo \
        libpq5 \
        libwebp7 \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 10001 qellem \
    && useradd \
        --uid 10001 \
        --gid qellem \
        --create-home \
        --shell /usr/sbin/nologin \
        qellem

WORKDIR /app

RUN mkdir -p /app/media /app/static \
    && chown -R qellem:qellem /app

COPY --from=builder /opt/venv /opt/venv
COPY --chown=qellem:qellem . .

USER qellem

# Generate fingerprinted static assets without requiring runtime secrets
# or a database connection.
RUN DJANGO_SETTINGS_MODULE=qellem_cms.settings.build \
    python manage.py collectstatic --noinput --clear

EXPOSE 8000

ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Migrations are deliberately not run here. They must be executed as a
# separate, reviewed deployment step before a new application version starts.
CMD ["gunicorn", "qellem_cms.wsgi:application", "--bind=0.0.0.0:8000", "--workers=2", "--threads=2", "--timeout=60", "--graceful-timeout=30", "--keep-alive=5", "--access-logfile=-", "--error-logfile=-"]
