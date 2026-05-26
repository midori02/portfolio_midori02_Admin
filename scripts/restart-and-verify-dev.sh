#!/usr/bin/env bash
# dev サーバーを停止→再起動→HTTP スモークまで一括実行（Agent / 修正後の確認用）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${DEV_PORT:-3000}"
HOST="${DEV_HOST:-127.0.0.1}"
BASE="http://${HOST}:${PORT}"
LOG="${DEV_LOG:-/tmp/portfolio-midori02-dev.log}"
WAIT_SEC="${DEV_WAIT_SEC:-90}"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck source=/dev/null
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use 18 >/dev/null
else
  echo "[WARN] nvm not found. Ensure Node.js >= 18 is active."
fi

node scripts/check-node-version.js

stop_port() {
  local p="$1"
  local pid
  pid="$(lsof -t -i:"${p}" 2>/dev/null || true)"
  if [ -n "$pid" ]; then
    echo "Stopping process on port ${p} (pid: ${pid})"
    kill "$pid" 2>/dev/null || true
    sleep 1
    pid="$(lsof -t -i:"${p}" 2>/dev/null || true)"
    if [ -n "$pid" ]; then
      kill -9 "$pid" 2>/dev/null || true
    fi
  fi
}

for p in 3000 3001 3002; do
  stop_port "$p"
done

if ! npm ls @types/react >/dev/null 2>&1; then
  echo "Fixing node_modules (@types/react mismatch)..."
  npm install
fi

echo "Starting dev server at ${BASE} (log: ${LOG})"
: > "$LOG"
nohup npm run dev -- --hostname "${HOST}" --port "${PORT}" >>"$LOG" 2>&1 &
DEV_PID=$!
echo "Dev PID: ${DEV_PID}"

deadline=$((SECONDS + WAIT_SEC))
ready=0
while [ "$SECONDS" -lt "$deadline" ]; do
  if ! kill -0 "$DEV_PID" 2>/dev/null; then
    echo "Dev server exited early. Last log lines:"
    tail -30 "$LOG" || true
    exit 1
  fi
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 3 "${BASE}/login" 2>/dev/null || echo "000")"
  if echo "$code" | grep -qE '^(200|307|308)$'; then
    ready=1
    break
  fi
  sleep 2
done

if [ "$ready" -ne 1 ]; then
  echo "Dev server did not become ready within ${WAIT_SEC}s. Last log lines:"
  tail -30 "$LOG" || true
  exit 1
fi

echo "Dev server ready (${BASE})"
echo ""
SMOKE_HOST="${HOST}" SMOKE_PORT="${PORT}" bash scripts/smoke-test-routes.sh
