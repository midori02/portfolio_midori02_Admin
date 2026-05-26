# Dependency review: goal and checklist

目的: 将来的に `fix-types-react-exports` のようなローカルパッチが不要になるよう、依存関係と環境要件を整理します。

推奨 Node バージョン: >=18（`package.json` の `engines` と `.nvmrc` に設定済み）

チェックリスト:

- [ ] Node バージョンの周知（README とリポジトリのドキュメントに追加）
- [ ] CI の Node バージョンを >=18 に設定（GitHub Actions 等）
- [ ] 主要パッケージの見直し:
  - `next` を最新版または LTS に更新検討（互換性を確認）
  - `@types/react` / `@types/node` のバージョン整合性を確認
  - `firebase` の v8 系から v9 や modular SDK への移行検討（時間とリスクを評価）
- [ ] devdeps の不要なパッケージを精査（eslint、core-js 等の警告に対応）
- [ ] 依存更新のテスト手順を定義（小さな PR で段階的に反映）

実行手順（提案）:

1. このリポジトリの CI を Node 18 に切り替える PR を作成。
2. `next` と `@types/react` をそれぞれ最新互換バージョンに上げる PR を段階的に作成、各 PR で `npm run build` と `npm run dev` を確認。
3. 問題がなければ `fix/types-react-exports` の内容を取り除く（不要になれば `fix-types-react.js` を削除）

参考: 現在の一時対応は `docs/FIX_TYPES_REACT_NOTES.md` と `fix/types-react-exports` ブランチに記録済みです。
