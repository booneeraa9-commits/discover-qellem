#!/bin/sh
set -eu

python - <<'PY'
import os
import sys
import time

import psycopg

host = os.environ.get("POSTGRES_HOST", "database")
port = os.environ.get("POSTGRES_PORT", "5432")
database = os.environ.get("POSTGRES_DB", "discover_qellem")
user = os.environ.get("POSTGRES_USER", "discover_qellem")
password = os.environ.get("POSTGRES_PASSWORD", "")
timeout = int(os.environ.get("POSTGRES_STARTUP_TIMEOUT", "60"))
deadline = time.monotonic() + timeout

print(f"Waiting for PostgreSQL at {host}:{port}...", flush=True)
while True:
    try:
        with psycopg.connect(
            host=host,
            port=port,
            dbname=database,
            user=user,
            password=password,
            connect_timeout=3,
        ):
            print("PostgreSQL is ready.", flush=True)
            break
    except psycopg.OperationalError as error:
        if time.monotonic() >= deadline:
            print(
                f"PostgreSQL did not become ready within {timeout} seconds: {error}",
                file=sys.stderr,
            )
            raise SystemExit(1) from error
        time.sleep(2)
PY

exec "$@"
