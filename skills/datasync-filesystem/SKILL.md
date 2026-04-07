---
name: datasync-filesystem
description: DataSync Filesystem SDK mental model—Stack, contentStore paths, queries in src/; not CDA/CMA HTTP
---

# SDK core and queries – Contentstack DataSync Filesystem SDK

## When to use

- Implementing or changing query behavior, filters, or references in `src/stack.ts`
- Adjusting defaults, paths, or locale handling (`src/config.ts`, `src/utils.ts`, `src/fs.ts`)
- Adding exports or user-facing errors (`src/index.ts`, `src/messages.ts`)

## Instructions

### Product model

- This is the **filesystem query SDK** for **DataSync-stored** JSON — **not** the Contentstack **Delivery** or **Management** REST SDK.
- **Stack** here means the in-memory/query facade over **disk**, not an API stack or region endpoint.
- **`@contentstack/datasync-filesystem-sdk`** reads JSON after DataSync / `@contentstack/datasync-content-store-filesystem` sync; it does **not** call Contentstack REST APIs for core behavior.

### Entry flow

1. **`Contentstack.Stack(userConfig)`** in `src/index.ts` merges config and returns **`Stack`** (`src/stack.ts`).
2. **`Stack.connect()`** resolves when the stack is ready to query; use `.then()` / `.catch()` as in README examples.
3. Queries from **`contentType('uid')`**, **`assets()`**, then filters, references, pagination, projections — see `src/stack.ts`.

### Configuration

- **`Contentstack.Stack(config)`** merges into internal config (`setConfig` / `getConfig` in `src/index.ts`).
- Typical shape: `contentStore.baseDir`, `contentStore.patterns` (assets, content_types, entries), `locale`, `referenceDepth`, `projections`, `defaultSortingField` — see `src/config.ts` defaults and README.
- Optional **env:** `APP_ROOT` can influence where content resolves (README).
- Path helpers: **`src/utils.ts`**; promisified reads and FS helpers: **`src/fs.ts`**.

### Query execution

- Entry points: **`contentType(uid)`**, **`assets()`**, query builders (filters, references, sort, skip/limit, projections) in **`src/stack.ts`**.
- **Filtering:** `sift`; **sort/merge:** `lodash`; **projections:** `json-mask` where used.
- **References:** depth from config and `includeReferences` behavior in `stack.ts`.

### Scope

- **`src/`** SDK core is canonical; **`example/`** is illustrative only — not the source of API design.

### Where to change code

| Concern | Start here |
|---------|------------|
| New operator or filter | `src/stack.ts` |
| Path / base dir / `APP_ROOT` | `src/config.ts`, `src/utils.ts`, `README.md` |
| FS reads | `src/fs.ts` |
| User-visible messages | `src/messages.ts` |
| Public API surface | `src/index.ts` |

## References

- [DataSync guide](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync)
- [SDK query examples](https://contentstack.github.io/datasync-filesystem-sdk/) (when linked from repo README)
- [`../typescript/SKILL.md`](../typescript/SKILL.md) — TypeScript and `src/` conventions
- [`../testing/SKILL.md`](../testing/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
