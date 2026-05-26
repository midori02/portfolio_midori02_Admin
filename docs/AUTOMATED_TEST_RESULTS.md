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

**2026-05-26 実施結果（`fix/integration-all-fixes` + dev @ 127.0.0.1:3010）:**

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

統合ブランチのみ:

```bash
git checkout fix/integration-all-fixes
npm run build && npm run lint
```
