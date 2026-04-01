---
description: Branch and PR workflow, npm scripts, lint/tests, and version bumps for releases
alwaysApply: false
---

# Development workflow

## Branches

Use your team’s Git branching model (e.g. feature branches off the default branch). Keep commits focused; this repo uses **Husky** hooks that expect **Talisman** and **Snyk** to be installed locally unless you bypass with `SKIP_HOOK=1` (see `.husky/pre-commit`).

## Install and build

```bash
npm install
npm run build-ts
```

## Lint and tests

```bash
npm run lint    # ESLint — see package.json for config path and globs
npm test        # pretest runs build-ts, then Jest with coverage
```

- **Unit/integration:** Jest runs all `test/**/*.ts` except ignored paths in `jest.config.js` (e.g. `test/data/*`, `test/utils.ts`). Suites use on-disk fixtures under `test/data/` and temp trees per module (see `test/utils.ts`).

## PR expectations

- Run **build**, **lint**, and **tests** before opening or updating a PR.
- Avoid committing secrets; Talisman runs on pre-commit when configured.
- For **release-impacting** changes to library behavior or `src/`, coordinate a **`package.json` version bump** with maintainers. If a **Check Version Bump** (or similar) workflow is enabled for this repo, follow its rules for when `version` must change.

## Docs

- `npm run build-doc` — JSDoc site (requires successful `build-ts` first).
