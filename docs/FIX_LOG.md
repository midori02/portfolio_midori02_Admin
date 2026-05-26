# 不具合・修正ログ

モダナイズ作業中に発見した問題と、その原因・修正内容を記録します。

---

## 記録フォーマット

| 項目 | 内容 |
|------|------|
| 日付 | 発見・修正日 |
| 現象 | ユーザーが見た症状 |
| 原因 | 技術的な根本原因 |
| 修正 | 実施した対応 |
| 関連 | Issue / PR / 変更ファイル |

---

## 2026-05-26 — Internal Server Error（localhost:3000）

| 項目 | 内容 |
|------|------|
| **現象** | ブラウザで `Internal Server Error` |
| **原因** | port 3000 に古い dev サーバーが残存。`next.config.js` の `distDir: '/.next'` がルート直下を指していた |
| **修正** | 古い Node プロセス停止、`.next` 削除、`distDir` を `'.next'` に変更、dev 再起動 |
| **関連** | `next.config.js` |

---

## 2026-05-26 — ログイン画面でローディングが終わらない

| 項目 | 内容 |
|------|------|
| **現象** | `/login` でスピナーが消えずフォームが出ない |
| **原因** | ① `LoginContainer` が `useQuery('auth')` を queryFn なしで呼び `isLoading` が解消されない ② `_app` の全画面 Loading が `auth` クエリ fetch 中も表示 ③ `fetchAuthUser` が Firebase 初期化前に `auth.currentUser` だけ参照 |
| **修正** | `fetchAuthUser` を `onAuthStateChanged` 待ちに変更、`Auth` に `publicRoute` 追加（login）、`LoginContainer` の Loading ガード削除、グローバル Loading から `auth` クエリを除外 |
| **関連** | #33, `src/lib/auth.ts`, `Auth.tsx`, `Loading.tsx`, `login.tsx`, `LoginContainer.tsx` |

---

## 2026-05-26 — 再設定メールボタンを押しても何も起こらない

| 項目 | 内容 |
|------|------|
| **現象** | 「再設定メールを送る」押下で反応なし |
| **原因** | ① `_app` の `useIsMutating()` が mutation 中に全画面オーバーレイを表示し操作・alert が見えない ② `reject(undefined)` で react-query の `onError` が不安定 ③ フィードバックが `alert` のみ |
| **修正** | グローバル Loading から mutation 監視を削除、`sendPasswordReset` で `Error` を throw、画面上の `Alert` で結果表示 |
| **関連** | #32, `Loading.tsx`, `auth.ts`, `LoginTemplate.tsx` |

---

## 2026-05-26 — パスワード再設定を3画面フローに変更

| 項目 | 内容 |
|------|------|
| **現象** | ログイン画面内で完結する再設定 UI では、入力→送信→完了の流れが分かりにくい |
| **原因** | 再設定処理が `LoginTemplate` 内の1ボタン＋Alert に集約されていた |
| **修正** | 3画面構成に分離（下記） |
| **関連** | #31, #32 |

### 画面フロー

```
/login
  └─「パスワードを忘れた方（再設定メールを送る）」
       ↓
/login/reset          … メールアドレス入力
       ↓ 送信成功
/login/reset/sent     … 送信完了（?email= 付き）
       ↓
/login                … ログイン画面へ戻る
```

### 追加・変更ファイル

| ファイル | 役割 |
|----------|------|
| `src/pages/login/reset.tsx` | メール入力画面 |
| `src/pages/login/reset/sent.tsx` | 送信完了画面 |
| `ResetPasswordTemplate.tsx` | メール入力 UI |
| `ResetPasswordSentTemplate.tsx` | 送信完了 UI |
| `AuthPageShell.tsx` | ログイン系画面の共通レイアウト |
| `LoginTemplate.tsx` | 再設定ボタン → `/login/reset` へ遷移のみ |

---

## 2026-05-26 — リロードが終わらない（404 / 500 / 真っ白）

| 項目 | 内容 |
|------|------|
| **現象** | ブラウザのリロードが完了しない、または真っ白な画面 |
| **原因** | ① `pages/login.tsx` と `pages/login/` ディレクトリが競合し `/login` が 404 になることがある ② 古い dev サーバーが 500 を返す ③ `auth` クエリの重複 fetch ④ 送信完了画面が `router.isReady` まで `null` を返し真っ白 |
| **修正** | `login.tsx` → `login/index.tsx` に移動、`useAuthQuery`（`staleTime: Infinity`）で auth 取得を統一、`fetchAuthUser` に 10 秒タイムアウト、`/login` 配下を Auth で自動 public 化、送信完了画面にローディング表示 |
| **関連** | `src/pages/login/index.tsx`, `src/lib/authQuery.ts`, `Auth.tsx`, `auth.ts`, `ResetPasswordSentTemplate.tsx` |

---

## 2026-05-26 — ログイン後 `Invalid <Link> with <a> child`

| 項目 | 内容 |
|------|------|
| **現象** | ログイン後トップ表示時に `Invalid <Link> with <a> child` ランタイムエラー |
| **原因** | `DrawerList.tsx` が Next.js 13 非対応の `<Link><a>...</a></Link>` パターンを使用（Next 13 では `Link` 自体が `<a>` を描画するため `<a>` 子要素は不可） |
| **修正** | サイドメニュー遷移を `next/link` から `router.push()` に変更（`ContentCard` と同じ方式） |
| **関連** | `src/components/Layouts/DrawerList.tsx` |

---

## 2026-05-26 — コンテンツ・設定の更新（Create/Update）が効かない

| 項目 | 内容 |
|------|------|
| **現象** | 削除はできるが、コンテンツの作成・更新や設定の更新が反映されない |
| **原因** | ① `useMutation(() => fn(フォーム値))` がクリック時の最新 state を渡せていない ② `skills` が `undefined` のとき `skills.length` で例外 ③ 画像バリデーションが `undefined` のみで空配列を見逃す ④ 失敗時の `onError` がなく UI に何も出ない |
| **修正** | `ContentTemplate` / `SettingTemplate` を `async/await` で直接 API 呼び出しに変更、`skills ?? []`、画像・skills のバリデーション強化、保存中/エラー表示を追加 |
| **関連** | `ContentTemplate.tsx`, `SettingTemplate.tsx`, `contents.ts`, `admin.ts` |

---

## 2026-05-26 — 画像アップロードができない

| 項目 | 内容 |
|------|------|
| **現象** | コンテンツ/設定画面で画像を選択してもアップロードされない |
| **原因** | ① ファイル未選択時 `files[0]` が `undefined` で例外 ② `put()` 失敗時の `catch` がなく UI にエラーが出ない ③ 固定 `id="image"` で input と label の関連が不安定 ④ アップロード中の表示がない |
| **修正** | ファイル存在チェック、`async/await` + エラー表示、`useId()` で input id をユニーク化、label 内に input 配置、`accept="image/*"`、アップロード中スピナー |
| **関連** | `ImageUploader.tsx`, `customHooks.ts` |

---

## 2026-05-26 — バリデーション/キャンセル時に誤ったエラー表示

| 項目 | 内容 |
|------|------|
| **現象** | 保存・更新・削除で入力不足や確認ダイアログのキャンセル後に「保存に失敗しました」等の赤いエラーが出る、操作が動かないように感じる |
| **原因** | `contents.ts` / `admin.ts` のバリデーション失敗・confirm キャンセル時に `reject(undefined)` しており、`ContentTemplate` / `SettingTemplate` の `catch` が誤って発火していた |
| **修正** | ユーザー操作による中断は `resolve(undefined)` に統一。編集時の confirm 文言を「更新しますか？」に変更。`useImageUpload` のコールバックを ref 化して再レンダー時の不安定化を防止。`SettingTemplate` の auth キャッシュ無効化を `AUTH_QUERY_KEY` に統一 |
| **関連** | `contents.ts`, `admin.ts`, `customHooks.ts`, `ImageUploader.tsx`, `SettingTemplate.tsx` |

---

## 2026-05-26 — サイドメニュー選択後にメイン画面が真っ白

| 項目 | 内容 |
|------|------|
| **現象** | 左サイドメニュー（All Contents / Add Content / My Setting）を選んでもメインエリアに何も表示されない |
| **原因** | ① 各 Container / Auth が `<Loading />` をページ読み込み表示に使っていたが、`Loading` は他クエリの fetch 中のみスピナーを出し、それ以外は空の `<></>` を返す ② モバイル幅でドロワーが開いたままコンテンツを覆う ③ トップ画面が contents 取得完了前に描画されデータ未定義になる可能性 |
| **修正** | 常にスピナーを出す `PageSpinner` を追加し Container / Auth で使用。DrawerList を Next.js 13 対応の `Link` + 選択状態表示に変更、タップ後にドロワーを閉じる。TopContainer で contents ロード完了を待つ |
| **関連** | `PageSpinner.tsx`, `Auth.tsx`, `TopContainser.tsx`, `SettingContainer.tsx`, `ContentContainer.tsx`, `DrawerList.tsx`, `BaseLayout.tsx` |

---

## 2026-05-26 — `missing required error components, refreshing...`

| 項目 | 内容 |
|------|------|
| **現象** | ページ遷移時に `missing required error components, refreshing...` が表示され、アプリが使えない |
| **原因** | ① **Node 16** で dev 起動（`engines: >=18` 違反）② **dev サーバー複数起動**（3000/3001/3002）で `.next` キャッシュ競合 ③ dev 実行中の `.next` 削除 ④ `_error.tsx` 未整備でエラー画面のフォールバックが不安定 |
| **修正** | `src/pages/_error.tsx` 追加、`scripts/check-node-version.js`（predev）、`scripts/start-dev.sh` / `smoke-test-routes.sh` 追加、DrawerList を `router.push` に戻す、README に再発防止ルールとマージ前チェックリストを記載 |
| **確認** | Node 18 + dev 1 プロセスで `npm run verify:build` PASS、`npm run verify:smoke` 6 ルート PASS、ページ遷移ループ 25 リクエスト PASS |
| **関連** | `_error.tsx`, `package.json`, `README.md`, `scripts/*`, `DrawerList.tsx` |

---

## 2026-05-26 — ログイン後もローディングが終わらない

| 項目 | 内容 |
|------|------|
| **現象** | Admin にアクセスしてもスピナーのまま画面が表示されない |
| **原因** | ① `Auth` が `isFetched` だけで子を描画し、未ログイン時に `/login` へリダイレクトしない ② `TopContainer` 等が `!user` のとき永遠に `PageSpinner` を表示 ③ グローバル `Loading` が `contents` / `histories` fetch 中も全画面オーバーレイを被せる |
| **修正** | `Auth` を「public ルート / 認証待ち / 未ログイン→login / ログイン済み」に整理。Container は auth 確定後のみデータ取得。グローバル `Loading` からページデータクエリを除外。`fetchAuthUser` に `currentUser`  fast path を追加 |
| **関連** | `Auth.tsx`, `auth.ts`, `TopContainser.tsx`, `SettingContainer.tsx`, `ContentContainer.tsx`, `Loading.tsx` |

---

## 2026-05-26 — 画像アップロード失敗（Storage Rules）

| 項目 | 内容 |
|------|------|
| **現象** | 画像選択後「画像のアップロードに失敗しました。ログイン状態と Firebase Storage の設定を確認してください。」 |
| **原因** | Firebase Console の Storage ルールが `allow write: if false;` のため、ログイン済みでも書き込みがすべて拒否されていた（Admin コードの問題ではない） |
| **修正** | `firebase/storage.rules` に正しいルール例を追加。Console で `content/` `admin/` 配下のみ `request.auth != null` で write 許可。エラー時に Storage ルール起因のメッセージを表示 |
| **関連** | `firebase/storage.rules`, `customHooks.ts`, `README.md` |

---

## 2026-05-26 — トップ一覧のコンテンツカード画像表示崩れ（Issue #39）

| 項目 | 内容 |
|------|------|
| **現象** | All Contents 一覧でサムネイル画像がカード幅をはみ出し、隣のカードと重なって表示される |
| **原因** | `ContentCard.tsx` の `next/image` が `width={500}` 固定で、カード幅（約 1/3 列）より大きく描画されていた |
| **修正** | 画像を固定高コンテナ内で `fill` + `objectFit: cover` に変更。カードに `overflow: hidden`。画像未設定時プレースホルダー |
| **関連** | `ContentCard.tsx`, `TopTemplate.tsx`, `docs/TEST_CASES.md` §8 R-6 |

---

## 2026-05-26 — 設定画面のプロフィール画像が表示されない（Issue #40）

| 項目 | 内容 |
|------|------|
| **現象** | `/setting` でプロフィール画像が壊れたアイコン（alt=admin）になる |
| **原因** | ① `next.config.js` が `firebasestorage.googleapis.com` のみ許可 ② Firestore の `image` が配列以外の形式の場合未正規化 ③ `ImageUploader` の表示失敗時フォールバックなし |
| **修正** | `remotePatterns` 追加、`normalizeImages()` 導入、`ImageUploader` を `fill` + `onError` フォールバックに変更。テストは §8 R-7 に統合 |
| **関連** | `next.config.js`, `imageUtils.ts`, `ImageUploader.tsx`, `auth.ts`, `SettingTemplate.tsx` |

---

## 2026-05-26 — 編集画面の画像プレビューが見切れる

| 項目 | 内容 |
|------|------|
| **現象** | コンテンツ編集画面でバナー等の横長画像が正方形プレビューで上下または左右が切れる |
| **原因** | `ImageUploader` が `object-fit: cover` + 250×250 の固定枠だった |
| **修正** | デフォルトを `contain` に変更。コンテンツ編集は 480×270 のプレビュー枠で全体表示 |
| **関連** | `ImageUploader.tsx`, `ContentTemplate.tsx`, `docs/TEST_CASES.md` §8 R-5 |

---

- 不具合修正・UX 変更のたびに **本ファイルに1エントリ追加**する
- 手動テスト項目の更新が必要なら `docs/TEST_CASES.md` も合わせて更新する
