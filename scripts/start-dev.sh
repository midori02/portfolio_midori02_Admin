#!/usr/bin/env bash
# 開発サーバーを安全に1つだけ起動する（Node 18・ポート競合解消）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${DEV_PORT:-3000}"
HOST="${DEV_HOST:-127.0.0.1}"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck source=/dev/null
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use 18 >/dev/null
else
  echo "[WARN] nvm not found. Ensure Node.js >= 18 is active."
fi

node scripts/check-node-version.js

pid="$(lsof -t -i:"${PORT}" 2>/dev/null || true)"
if [ -n "$pid" ]; then
  echo "Port ${PORT} is in use (pid: ${pid}). Stop it first:"
  echo "  kill ${pid}"
  echo "Or: lsof -t -i:${PORT} | xargs kill"
  exit 1
fi

echo "Starting dev server at http://${HOST}:${PORT}"
exec npm run dev -- --hostname "${HOST}" --port "${PORT}"
