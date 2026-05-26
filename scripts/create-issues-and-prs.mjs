#!/usr/bin/env node
/**
 * Creates GitHub issues and PRs for auth/login fixes.
 * Requires GITHUB_TOKEN env or git credential for github.com.
 */
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

const REPO = 'midori02/portfolio_midori02_Admin'
const BASE = 'upgrade/B-next-13'

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  const out = execSync(
    'printf "protocol=https\\nhost=github.com\\n\\n" | git credential fill',
    { encoding: 'utf8' }
  )
  const line = out.split('\n').find((l) => l.startsWith('password='))
  if (!line) throw new Error('No GitHub token from git credential')
  return line.replace('password=', '')
}

async function gh(method, path, body) {
  const token = getToken()
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

const ISSUES = [
  {
    title: 'fix(auth): ログイン後に auth クエリが更新されず /login に戻る',
    body: `## 現象\nメール/パスワードでログイン成功後、\`/\` へ遷移してもすぐ \`/login\` に戻る。\n\n## 原因\n- \`listenAuthState\` が未ログイン時に reject し react-query がエラー状態のまま\n- ログイン後に auth クエリが更新されない\n\n## 受け入れ条件\n- [ ] ログイン後トップが表示され /login に戻らない`,
    branch: 'fix/issue-1-auth-session',
  },
  {
    title: 'fix(auth): user 未設定時の admin_id 参照でクラッシュ',
    body: `## 現象\n\`admin_id\` 参照でクラッシュする。\n\n## 対応\nContainer で useQuery('auth') とガード\n\n## 受け入れ条件\n- [ ] 認証読込中・未ログインでクラッシュしない`,
    branch: 'fix/issue-2-auth-user-guard',
    baseBranch: 'fix/issue-1-auth-session',
  },
  {
    title: 'fix(login): ログイン失敗時のエラーメッセージが不正確',
    body: `## 原因\nonError で error === undefined を判定している\n\n## 受け入れ条件\n- [ ] 失敗時に分かりやすいメッセージ`,
    branch: 'fix/issue-3-login-error-message',
  },
  {
    title: 'fix(content): コンテンツ未取得時の削除処理をガード',
    body: `## 受け入れ条件\n- [ ] 未読込時に削除でクラッシュしない`,
    branch: 'fix/issue-4-content-delete-guard',
  },
  {
    title: 'chore(lint): react-hooks/exhaustive-deps 警告の解消',
    body: `PrimarySwitch, ImageUploader, customHooks の警告解消`,
    branch: 'fix/issue-5-eslint-hooks-deps',
  },
  {
    title: 'feat(login): ログイン画面からパスワード再設定メールを送信',
    body: `## 受け入れ条件\n- [ ] 再設定メール送信できる\n- [ ] 成功/失敗を通知`,
    branch: 'fix/issue-6-password-reset',
  },
]

async function main() {
  const only = process.argv[2] // 'issues' | 'prs' | issue number
  const created = JSON.parse(
    readFileSync('.github/issue-map.json', 'utf8').catch?.() ||
      '{}'
  ).catch?.() 

  let map = {}
  try {
    map = JSON.parse(readFileSync('.github/issue-map.json', 'utf8'))
  } catch {
    map = {}
  }

  if (!only || only === 'issues') {
    for (const spec of ISSUES) {
      if (map[spec.branch]) continue
      const issue = await gh('POST', '/issues', {
        title: spec.title,
        body: spec.body,
      })
      map[spec.branch] = { number: issue.number, url: issue.html_url }
      console.log(`Issue #${issue.number}: ${spec.title}`)
    }
    writeFileSync('.github/issue-map.json', JSON.stringify(map, null, 2))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
