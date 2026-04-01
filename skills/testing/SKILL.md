---
name: testing
description: Run and extend Jest tests for datasync-filesystem-sdk — build pretest, fixtures, temp dirs, ignores
---

# Testing skill

## Commands

```bash
npm test
```

`pretest` runs **`npm run build-ts`** (clean + `tsc`), then **Jest** runs with **coverage** (`jest.config.js`).

```bash
npm run build-ts   # alone if you only need dist/typings before debugging tests
```

## Layout

| Path | Role |
|------|------|
| `test/**/*.ts` | Test suites (see `testMatch` in `jest.config.js`) |
| `test/data/` | Static JSON fixtures — **ignored** as test files |
| `test/utils.ts` | `init`, populate helpers, `destroy` — **ignored** as a test file |
| Per-suite temp dirs | Created under `test/<suiteName>/` via `init(..., moduleName)` |

## Naming

- Suites use **`describe`** / **`it`** with readable labels (e.g. `# Core`).
- Not all files use `*.test.ts`; Jest discovers by path pattern, not name suffix.

## Environment

- **No API credentials** for core tests.
- **`APP_ROOT`:** only if exercising README-documented resolution behavior.

## Mocks

- Tests use **real filesystem writes** into temp directories, not HTTP mocks. Reuse **`populateAssets`**, **`populateContentTypes`**, **`pupulateEntries`** from `test/utils.ts` where applicable.

## Coverage and CI

- Coverage outputs to **`coverage/`** (HTML + JSON). Adjust **`jest.config.js`** only when changing collect rules deliberately.
