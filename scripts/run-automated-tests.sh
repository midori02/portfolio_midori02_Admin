#!/usr/bin/env bash
# 各 fix ブランチで npm run build / npm run lint を実行する
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 18 >/dev/null 2>&1 || true

BRANCHES=(
  "origin/upgrade/B-next-13"
  "origin/fix/issue-6-password-reset"
  "origin/fix/issue-1-auth-session"
  "origin/fix/issue-2-auth-user-guard"
  "origin/fix/issue-3-login-error-message"
  "origin/fix/issue-4-content-delete-guard"
  "origin/fix/issue-5-eslint-hooks-deps"
)

git fetch origin --quiet 2>/dev/null || true

echo "branch,build,lint,warnings"
for ref in "${BRANCHES[@]}"; do
  name="${ref#origin/}"
  git checkout -q "$ref"
  build_ok="FAIL"
  lint_ok="FAIL"
  warnings="?"
  if npm run build > /tmp/autotest-build.log 2>&1; then
    build_ok="PASS"
  fi
  if npm run lint > /tmp/autotest-lint.log 2>&1; then
    lint_ok="PASS"
  fi
  warnings=$(grep -c "Warning:" /tmp/autotest-build.log 2>/dev/null || echo 0)
  echo "$name,$build_ok,$lint_ok,$warnings"
done
