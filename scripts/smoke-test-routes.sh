#!/usr/bin/env bash
# dev サーバー起動後の HTTP スモークテスト（missing required error components 等を検出）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

HOST="${SMOKE_HOST:-127.0.0.1}"
PORT="${SMOKE_PORT:-3000}"
BASE="http://${HOST}:${PORT}"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 18 >/dev/null 2>&1 || true

node scripts/check-node-version.js

ROUTES=(
  "/"
  "/login"
  "/login/reset"
  "/login/reset/sent"
  "/content"
  "/setting"
)

echo "Smoke test: ${BASE}"
fail=0

for route in "${ROUTES[@]}"; do
  body="$(mktemp)"
  code="$(curl -sS -o "$body" -w '%{http_code}' --max-time 10 "${BASE}${route}" || echo "000")"
  if echo "$code" | grep -qE '^(200|307|308)$'; then
    if grep -q 'missing required error components' "$body"; then
      echo "FAIL ${route} HTTP ${code} — missing required error components"
      fail=1
    else
      echo "PASS ${route} HTTP ${code}"
    fi
  else
    echo "FAIL ${route} HTTP ${code}"
    head -c 200 "$body" 2>/dev/null || true
    echo
    fail=1
  fi
  rm -f "$body"
done

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "Smoke test FAILED. See README.md「開発時のトラブルシュート」"
  exit 1
fi

echo ""
echo "Smoke test PASSED (${#ROUTES[@]} routes)"
