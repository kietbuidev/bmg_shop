#!/bin/sh
set -e

APP_ENV=${APP_ENV:-develop}
ENV_DIR="/app/docker/env"
ENV_FILE="$ENV_DIR/.env.${APP_ENV}"
FALLBACK_ENV="/app/.env"

load_env_file() {
  if [ -f "$1" ]; then
    echo "Loading environment variables from $1"
    set -a
    # shellcheck disable=SC1090
    . "$1"
    set +a
  fi
}

if [ -f "$ENV_FILE" ]; then
  load_env_file "$ENV_FILE"
else
  echo "Environment file $ENV_FILE not found."
  load_env_file "$FALLBACK_ENV"
fi

# Quan trọng: chuyển quyền điều khiển cho lệnh CMD
exec "$@"