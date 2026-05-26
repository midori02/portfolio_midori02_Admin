# 自動テスト結果ログ

**実施日:** 2026-05-26  
**実施環境:** Node v18.20.8 / macOS  
**実施コマンド:** `scripts/run-automated-tests.sh`（各ブランチで `npm run build` + `npm run lint`）

---

## 1. ブランチ別結果

| ブランチ | build | lint | ESLint warnings（build 時） | 対応 PR |
|----------|-------|------|-----------------------------|---------|
| `upgrade/B-next-13` | PASS | PASS | 3 | （ベース） |
| `fix/issue-6-password-reset` | PASS | PASS | 3 | #32 |
| `fix/issue-1-auth-session` | PASS | PASS | 3 | #33 |
| `fix/issue-2-auth-user-guard` | PASS | PASS | 3 | #34 |
| `fix/issue-3-login-error-message` | PASS | PASS | 3 | #35 |
| `fix/issue-4-content-delete-guard` | PASS | PASS | 3 | #36 |
| `fix/issue-5-eslint-hooks-deps` | PASS | PASS | **0** | #37 |
| `fix/integration-all-fixes` | PASS | PASS | **0**（lint も警告なし） | 統合確認用 |

**ベースブランチの警告 3 件（#37 で解消）:**

- `PrimarySwitch.tsx` … `useCallback` と `checked`
- `ImageUploader.tsx` … `setImage` 依存
- `customHooks.ts` … `imageName` 依存

---

## 2. 統合ブランチ（全 PR 相当）

`fix/integration-all-fixes` = `upgrade/B-next-13` + #32〜#37 のマージ相当。

```
npm run build  → ✓ Compiled successfully
npm run lint   → ✔ No ESLint warnings or errors
```

※ ビルド時に Next の lockfile パッチに関するメッセージが出ることがあるが、ビルド自体は成功。

---

## 3. HTTP スモーク（未認証・dev サーバー）

dev 起動後、各パスが応答することを確認する項目（手動または curl）。

| パス | 期待 |
|------|------|
| `/` | 200（未ログイン時は login へ誘導される挙動） |
| `/login` | 200 |
| `/content` | 200 |
| `/setting` | 200 |

**2026-05-26 TEST_CASES §1 実施（Agent / fix/integration-all-fixes）:**

```
node -v          → v18.20.8
npm run build    → exit 0
npm run lint     → ✔ No ESLint warnings or errors
verify:smoke     → 6/6 routes PASS (200)
```

§3〜§7 は `docs/TEST_CASES.md` にコード・HTTP・§8 回帰結果を反映済み。

**2026-05-26 再実施（修正後・Node 18・dev @ 127.0.0.1:3000 単一プロセス）:**

```bash
nvm use 18
npm run verify:build          # build + lint → PASS
npm run verify:smoke          # 6 ルート HTTP → すべて PASS
# ページ遷移シミュレーション 25 リクエスト → PASS（missing required error なし）
```

| パス | ステータス | 備考 |
|------|------------|------|
| `/` | 200 PASS | |
| `/login` | 200 PASS | |
| `/login/reset` | 200 PASS | |
| `/login/reset/sent` | 200 PASS | |
| `/content` | 200 PASS | |
| `/setting` | 200 PASS | |

**再発原因（ユーザー環境）:** Node v16.20.2 で dev 起動 + ポート 3000/3001/3002 に複数 dev プロセス → `missing required error components, refreshing...`

**対策:** README「開発時のトラブルシュート」、`scripts/start-dev.sh`、`npm run verify:smoke` を参照。

**2026-05-26 初回実施（`fix/integration-all-fixes` + dev @ 127.0.0.1:3010）:****

| パス | ステータス |
|------|------------|
| `/` | 200 |
| `/login` | 200 |
| `/content` | 200 |
| `/setting` | 200 |

**注意:** ログイン・Firestore・Storage の成否は Firebase 依存のため、自動では検証していない。→ [TEST_CASES.md](./TEST_CASES.md) の手動項目で確認。

---

## 4. 再実行方法

```bash
nvm use 18
cd /path/to/portfolio_midori02_Admin
git fetch origin
bash scripts/run-automated-tests.sh
```

### マージ前チェック（推奨）

```bash
nvm use 18
npm run verify:build                    # dev 不要
bash scripts/start-dev.sh             # ターミナル A（1 プロセスのみ）
npm run verify:smoke                  # ターミナル B
```

統合ブランチのみ:

```bash
git checkout fix/integration-all-fixes
npm run build && npm run lint
```
