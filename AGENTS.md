# Agent guide — `@contentstack/datasync-filesystem-sdk`

## What this package is

**Contentstack DataSync Filesystem SDK** — a **Node.js/TypeScript** library to **query content stored on disk** after synchronization with [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) (typically via `@contentstack/datasync-content-store-filesystem`). It is **not** the Delivery (CDA) or Management (CMA) **HTTP** SDK; it does not call Contentstack REST APIs. It reads JSON and uses in-process querying (`sift`, `lodash`, `json-mask`) over configured filesystem paths.

**Repository:** [https://github.com/contentstack/datasync-filesystem-sdk/](https://github.com/contentstack/datasync-filesystem-sdk/)

## Tech stack

| Area | Details |
|------|---------|
| Language | TypeScript (`typescript` ~4.9 in `package.json`), compiles to `dist/` (CommonJS, ES6 target) |
| Runtime | Node.js — README recommends **v20+** |
| Build | `tsc` → `dist/`, declarations in `typings/` |
| Tests | **Jest** + **ts-jest**, Node environment (`jest.config.js`) |
| Main libraries | `lodash`, `sift`, `json-mask`, `mkdirp` — **no HTTP client** dependency for core behavior |
| API docs | JSDoc → `npm run build-doc` (outputs under `docs/`) |

## Public API and source layout

| Role | Path |
|------|------|
| Package entry | `main`: `dist/index.js` — build from `src/index.ts` |
| Facade | `Contentstack`, `setConfig`, `getConfig`, `ERROR_MESSAGES`, `WARNING_MESSAGES` — `src/index.ts`, `src/messages.ts` |
| Stack & queries | `src/stack.ts` (large query builder surface) |
| Defaults & paths | `src/config.ts`, `src/utils.ts`, `src/fs.ts` |
| Published types | `typings/*.d.ts` (generated) |

## Commands

| Command | Purpose |
|---------|---------|
| `npm run build-ts` | Clean `dist/`, `typings/`, `coverage/`, then `tsc` |
| `npm run compile` | `tsc` only |
| `npm test` | Runs `pretest` → `build-ts`, then `jest --coverage` |
| `npm run lint` | ESLint on `src/**/*.ts` (see `package.json`; config file name should match the repo) |
| `npm run build-doc` | Build then JSDoc HTML docs |

Tests live under `test/` (see `jest.config.js` `testMatch` and `testPathIgnorePatterns`). There is a small **`example/`** script — not the main library surface.

## Credentials and live tests

There are **no API keys or Delivery/Management tokens** for this SDK’s core behavior. Tests use **local temp directories** under `test/` (e.g. per-suite folders) populated from `test/data/` fixtures.

Optional **environment** (see `README.md`): `APP_ROOT` can override where content is resolved from (defaults to the current working directory).

## Further reading for agents

- **Cursor rules (scopes, globs, @-references):** [`.cursor/rules/README.md`](.cursor/rules/README.md)
- **Skills (workflows and deep dives):** [`skills/README.md`](skills/README.md)
