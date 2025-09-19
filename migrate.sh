#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_PATH="$ROOT_DIR/src/database/config/config.js"
MIGRATIONS_DIR="$ROOT_DIR/src/database/migrations"
SEEDERS_DIR="$ROOT_DIR/src/database/seeders"

if [[ ! -d "$MIGRATIONS_DIR" ]]; then
  mkdir -p "$MIGRATIONS_DIR"
fi

SEQUELIZE_ENV="${NODE_ENV:-development}"

if [[ "${1:-}" == "--env" ]]; then
  shift
  if [[ $# -eq 0 ]]; then
    echo "Error: missing environment value after --env" >&2
    exit 1
  fi
  SEQUELIZE_ENV="$1"
  shift
fi

COMMAND="${1:-help}"
shift || true

usage() {
  cat <<USAGE
Usage: ./migrate.sh [--env <environment>] <command> [args]

Commands:
  create <name>     Create a new timestamped migration
  up                Run pending migrations
  down              Roll back the last migration
  refresh           Roll back all migrations then re-run them
  status            Show migration status
  seed              Run all seeders
  seed:undo         Undo the most recent seeder
  seed:undo:all     Undo all seeders
  help              Show this message

Environment defaults to "${SEQUELIZE_ENV}" (set NODE_ENV or use --env).
USAGE
}

run_cli() {
  npx sequelize-cli "$@" \
    --config "$CONFIG_PATH" \
    --env "$SEQUELIZE_ENV" \
    --migrations-path "$MIGRATIONS_DIR" \
    --seeders-path "$SEEDERS_DIR"
}

case "$COMMAND" in
  create)
    NAME="${1:-}"
    if [[ -z "$NAME" ]]; then
      echo "Error: migration name is required" >&2
      usage
      exit 1
    fi
    run_cli migration:create --name "$NAME"
    ;;
  up|migrate)
    run_cli db:migrate "$@"
    ;;
  down|rollback)
    run_cli db:migrate:undo "$@"
    ;;
  refresh|redo)
    run_cli db:migrate:undo:all
    run_cli db:migrate "$@"
    ;;
  status)
    run_cli db:migrate:status "$@"
    ;;
  seed)
    run_cli db:seed:all "$@"
    ;;
  seed:undo)
    run_cli db:seed:undo "$@"
    ;;
  seed:undo:all)
    run_cli db:seed:undo:all "$@"
    ;;
  help|*)
    usage
    ;;
 esac
