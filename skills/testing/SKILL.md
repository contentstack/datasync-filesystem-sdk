---
name: testing
description: Jest tests for datasync-filesystem-sdk—pretest build, fixtures, test/utils, ignores, coverage, no live API
---

# Testing – Contentstack DataSync Filesystem SDK

## When to use

- Adding or changing tests under `test/`
- Debugging failures after `src/` changes
- Understanding why a path is ignored in Jest or how temp dirs are created

## Instructions

### Commands

- `npm test` — `pretest` runs `npm run build-ts`, then Jest with coverage (`jest.config.js`).
- `npm run build-ts` — use alone when you need `dist/` / `typings/` before debugging tests.

### Runner and config

- **Jest** with **ts-jest**, **Node** environment (`jest.config.js`).
- **Coverage:** enabled; output under `coverage/` (`collectCoverage` true).
- **Ignored from test discovery:** `test/data/*`, `test/utils.ts`, and paths in `testPathIgnorePatterns` — change only together with `jest.config.js`.

### Layout

| Path | Role |
|------|------|
| `test/**/*.ts` | Test suites (`testMatch` in `jest.config.js`) |
| `test/data/` | Static JSON fixtures (ignored as test files) |
| `test/utils.ts` | `init`, `populate*`, `destroy` (ignored as a test file) |
| Per-suite dirs | Temp content under `test/<suiteName>/` via `init(Contentstack, config, moduleName)` |

### Naming and style

- Suites use `describe` / `it` with labels like `# Core`, `# Queries` (existing convention).
- File names need not be `*.test.ts`; Jest matches by path pattern.
- **No live HTTP** — tests exercise the SDK against **written files** only.

### Environment and credentials

- **No** Delivery or Management API keys for default tests.
- Optional: `APP_ROOT` only if a test exercises README-documented root resolution.

### Mocks and I/O

- Tests write **real files** under temp directories; reuse `populateAssets`, `populateContentTypes`, `pupulateEntries` from `test/utils.ts` where applicable.

### Coverage

- Reports under `coverage/`; change `jest.config.js` only when intentionally adjusting collect rules.

### Notifications

- Jest `notify: true` may use `node-notifier` locally — notification failures are normal if unavailable in CI.

## References

- [`../datasync-filesystem/SKILL.md`](../datasync-filesystem/SKILL.md) — what `src/` is doing under test
- [`../../AGENTS.md`](../../AGENTS.md)
