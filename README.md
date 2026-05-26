# portfolio_midori02 Admin

Next.js 13 + Firebase（Auth / Firestore / Storage）の管理画面アプリです。

---

## 前提条件

| 項目 | 必須 |
|------|------|
| **Node.js** | **18 以上**（`.nvmrc` 参照） |
| npm | 8 以上 |
| Firebase プロジェクト | `portfolio-midori02` |

> **重要:** Node 16 では動きません。ターミナルで `node -v` が `v16.x` の場合は必ず切り替えてください。

```bash
nvm use 18          # .nvmrc に 18 が書いてあります
node -v             # v18.x.x であることを確認
```

---

## セットアップ

```bash
git clone <repository-url>
cd portfolio_midori02_Admin
nvm use 18
npm install
```

---

## 開発サーバーの起動

### 推奨: 安全起動スクリプト

```bash
nvm use 18
bash scripts/start-dev.sh
```

- Node 18 を確認してから起動します
- ポート 3000 が既に使用中なら **エラーで止まります**（二重起動を防ぐ）

### 手動起動

```bash
nvm use 18
npm run dev
```

ブラウザ: [http://localhost:3000](http://localhost:3000)

---

## マージ前の確認（必須）

PR をマージする前に、**必ず以下を実行**してください。

### 1. ビルド & Lint（dev サーバー不要）

```bash
nvm use 18
npm run verify:build
```

### 2. dev 再起動 + HTTP スモーク（推奨・1 コマンド）

修正後は **再起動と疎通確認をセット** で実行する（Agent 作業時も同様）:

```bash
nvm use 18
npm run verify:dev
```

旧 dev を停止 → 3000 で再起動 → 6 ルートスモークまで自動実行。

### 2b. 手動で分ける場合

**ターミナル A** — dev サーバーを **1つだけ** 起動:

```bash
nvm use 18
bash scripts/start-dev.sh
```

**ターミナル B** — ルート疎通確認:

```bash
npm run verify:smoke
```

6 ルート（`/`, `/login`, `/content`, `/setting` 等）がすべて `PASS` になること。

### 3. 手動テスト

`docs/TEST_CASES.md` のチェックリストに沿って確認してください。

---

## 開発時のトラブルシュート

### `missing required error components, refreshing...` が出る

Next.js の dev サーバーが **壊れた状態** になっています。以下が主な原因です。

| 原因 | 対処 |
|------|------|
| **Node 16 で起動している** | `nvm use 18` してから再起動 |
| **dev サーバーが複数起動している** | すべて停止して **1つだけ** 起動（下記参照） |
| **`.next` を dev 実行中に削除した** | dev を止めて `.next` 削除 → 再起動 |
| **`npm run build` と `npm run dev` を同時実行** | build 完了後に dev だけ起動 |
| **ポート 3000 がゾンビプロセスで占有** | 下記「サーバー完全リセット」 |

#### サーバー完全リセット手順

```bash
# 1. すべての npm run dev を Ctrl+C で停止

# 2. ポート解放（Mac）
lsof -t -i:3000 -i:3001 -i:3002 | xargs kill -9 2>/dev/null

# 3. キャッシュ削除 & 再起動
nvm use 18
rm -rf .next
npm run dev
```

`npm run dev` 実行中に **`Port 3000 is in use, trying 3001`** と出たら、古いサーバーが残っています。3001 ではなく、上記手順で 3000 を空けてから起動してください。

---

### `Cannot find module './chunks/vendor-chunks/next.js'`

**Firebase 設定変更とは無関係** です。`.next` フォルダ（Next.js のビルドキャッシュ）が壊れています。

```bash
# dev をすべて Ctrl+C で停止してから
nvm use 18
lsof -t -i:3000 -i:3001 -i:3002 | xargs kill -9 2>/dev/null
rm -rf .next
npm run dev
```

dev 実行中に `.next` を削除したり、複数の `npm run dev` を同時に動かしたりすると起きやすいです。

---

### 画像アップロードが失敗する

**症状:** 「画像のアップロードに失敗しました…」または Storage 権限エラー

**原因:** Firebase Storage のルールで `allow write: if false;` になっていると、**誰もアップロードできません**（Admin のコード不具合ではありません）。

**修正手順:**

1. [Firebase Console → Storage → ルール](https://console.firebase.google.com/project/portfolio-midori02/storage/rules) を開く
2. 以下に差し替え（リポジトリの `firebase/storage.rules` と同じ内容）
3. **公開** をクリック

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /content/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /admin/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**ルールプレイグラウンドでの確認:**

| 項目 | 設定 |
|------|------|
| シミュレーションタイプ | `create` または `write` |
| 認証済み | **ON** |
| 場所 | `/b/portfolio-midori02.appspot.com/o/content/test.jpg` |

→ **許可** になれば OK。Admin から再度画像を選択して確認してください。

---

### サイドメニューを選んでも真っ白になる

- ページ読み込み中は `PageSpinner`（スピナー）が表示されます
- グローバル `Loading` コンポーネントは **fetch オーバーレイ専用** です。ページ本体の待ち表示には使わないでください（空画面になるため）

関連: `src/components/utility/PageSpinner.tsx`

---

### ターミナルに入力・ペーストできない

`npm run dev` **実行中のターミナル** ではコマンドは打てません。

- **＋** ボタンで **新しいターミナルタブ** を開く
- または **Ctrl+C** で dev を止めてから入力

---

## 同じ間違いを防ぐためのルール

開発・レビュー時は以下を守ってください。

1. **Node 18 固定** — `nvm use 18` を dev / build / lint の前に毎回実行
2. **dev サーバーは常に 1 プロセス** — 複数起動しない（Cursor の古いターミナルも含む）
3. **dev 実行中に `.next` を削除しない**
4. **Next.js 13 の Link** — `<Link><a>` の入れ子は禁止。サイドメニューは `router.push()` を使用（`DrawerList.tsx`）
5. **ページ読み込み** — `PageSpinner` を使う。`Loading` は `_app.tsx` のグローバル overlay 専用
6. **修正の記録** — 不具合修正は `docs/FIX_LOG.md` に追記
7. **マージ前** — `npm run verify:build` + `npm run verify:smoke` + 手動テスト

---

## プロジェクト構成（主要）

```
src/
  pages/           # ルーティング（pages router）
  components/
    Layouts/       # BaseLayout, DrawerList
    containers/    # データ取得 + テンプレート呼び出し
    templates/     # 画面 UI
    utility/       # Auth, Loading, PageSpinner
  lib/             # Firebase, auth, CRUD
docs/
  TEST_CASES.md    # 手動テスト項目
  FIX_LOG.md       # 不具合・修正ログ
scripts/
  start-dev.sh     # 安全な dev 起動
  smoke-test-routes.sh  # HTTP 疎通確認
  check-node-version.js # Node 18 チェック
```

---

## 関連ドキュメント

- [docs/TEST_CASES.md](docs/TEST_CASES.md) — 手動テストチェックリスト
- [docs/FIX_LOG.md](docs/FIX_LOG.md) — 不具合修正履歴
- [docs/AUTOMATED_TEST_RESULTS.md](docs/AUTOMATED_TEST_RESULTS.md) — 自動テスト結果

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
