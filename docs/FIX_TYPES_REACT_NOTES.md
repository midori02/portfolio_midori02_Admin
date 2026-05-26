# Fix: @types/react exports workaround

Date: 2026-05-26
Branch: `fix/types-react-exports` (pushed to origin)
Commit: `9875cb40b5310c898f86c53cc9cd31becef69372`

## Summary
During local `next dev` / `next build`, Next.js flagged missing TypeScript dependencies because `require.resolve('@types/react/index.d.ts')` failed due to `exports` constraints in the installed `@types/react` package. To allow local development on Node 16 we applied a temporary workaround and recorded it in this file.

## What I changed
- Created branch `fix/types-react-exports` and committed the following files there:
  - `fix-types-react.js` (new) — small script that patches `node_modules/@types/react/package.json` to add an exports entry for `./index.d.ts`.
  - `package.json` (edited locally for testing; reverted on `develop`) — previously edited while debugging. The final code is stored in the feature branch.
  - `package-lock.json` (updated accordingly)

- Ran `node fix-types-react.js` to add the missing exports entry directly into `node_modules/@types/react/package.json` for the local environment.

## Why
Newer `@types/react` packages include an `exports` field which can prevent `require.resolve('@types/react/index.d.ts')` from resolving in Node < 18 unless the export path is defined. Next.js checks for `@types/react` by resolving that path, so the check failed and `next` reported missing type dependency even though `@types/react` existed in `node_modules`.

## How to reproduce the fix locally
1. Use Node 16 (we used `nvm`):

```bash
nvm install 16
nvm use 16
```

2. Install dependencies (from project root):

```bash
npm install
```

3. Apply the local patch script (runs on your machine after `npm install`):

```bash
node fix-types-react.js
```

4. Start dev server:

```bash
npm run dev
```

## How to revert / remove the workaround
- If you want to revert the local patch in `node_modules` run:

```bash
# restore node_modules for a clean slate
rm -rf node_modules package-lock.json
npm install
```

- The original source files are preserved on `develop`; the code changes are isolated in branch `fix/types-react-exports`.

## PR and follow-up
- Branch was pushed to origin: `fix/types-react-exports`.
- Create a PR from that branch for review; after review we can decide whether to keep the workaround, produce a `patch-package` patch that will be applied automatically after installs, or update dependencies / Node version requirements.
- PR creation URL (use the link shown when pushing):
  https://github.com/midori02/portfolio_midori02_Admin/pull/new/fix/types-react-exports

## Notes
- Commit `9875cb4` contains the changes committed to the feature branch.
- I restored `develop` to `origin/develop` and left the fix on the feature branch to preserve original source.

If you want, I can:
- create a proper `patches/` file using `patch-package` and add a `postinstall` hook, or
- open the PR and add a description + reviewers.
