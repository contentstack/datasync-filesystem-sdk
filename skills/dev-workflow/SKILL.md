---
name: dev-workflow
description: Branches, Husky hooks, build/test/lint commands, PR expectations, and version bumps for this repo
---

# Dev workflow – Contentstack DataSync Filesystem SDK

## When to use

- Setting up the repo locally or onboarding
- Before opening or updating a PR
- Planning a release or changing `package.json` version

## Instructions

### Branches

- Use **feature branches** for new work; open pull requests against **`development`** to integrate changes.
- For a **release**, open a pull request from **`development`** into **`master`**. Releases to npm are driven from **`master`**.
- Alternatively, follow your team’s current branch policy if it differs.

### Install and build

```bash
npm install
npm run build-ts
```

`npm run build-ts` cleans `dist/`, `typings/`, `coverage/` and runs `tsc` (`package.json`).

### Quality gates

```bash
npm run lint    # ESLint — see package.json for config path and globs
npm test        # pretest runs build-ts, then Jest with coverage
```

- Jest runs `test/**/*.ts` except ignored paths in `jest.config.js` (e.g. `test/data/*`, `test/utils.ts`). Suites use fixtures under `test/data/` and temp trees per module (see `test/utils.ts`).

### PR expectations

- Run **build**, **lint**, and **tests** before opening or updating a PR.
- Avoid committing secrets; **Talisman** runs on pre-commit when configured.
- For **release-impacting** changes to library behavior or `src/`, coordinate a **`package.json` version bump** with maintainers. If **Check Version Bump** (or similar) in `.github/workflows/` applies, follow its rules.

### Hooks (`.husky/`)

- `.husky/pre-commit` runs **Talisman** and **Snyk** when those tools are installed; use `SKIP_HOOK=1` only when your team allows bypassing checks.

### Docs

- `npm run build-doc` — JSDoc site (requires successful `build-ts` first).

### CI

- Workflows under `.github/workflows/` include CodeQL, SCA, policy scans, version-bump checks—see each file for triggers.

## References

- [`../testing/SKILL.md`](../testing/SKILL.md) — Jest and test layout
- [`../../AGENTS.md`](../../AGENTS.md) — entry point and commands table
