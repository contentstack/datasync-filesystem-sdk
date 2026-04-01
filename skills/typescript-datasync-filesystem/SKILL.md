---
name: typescript-datasync-filesystem
description: Mental model for the DataSync Filesystem SDK — Stack, config, queries, file layout in src/
---

# TypeScript DataSync Filesystem SDK

## What you are editing

**Package:** `@contentstack/datasync-filesystem-sdk`  
**Role:** Query **JSON content on disk** produced by DataSync / content-store-filesystem — **not** live CDA or CMA HTTP calls.

## Entry flow

1. **`Contentstack.Stack(userConfig)`** in `src/index.ts` merges config and returns **`Stack`** (`src/stack.ts`).
2. Call **`Stack.connect()`** before running queries (async chain).
3. Build queries from **`contentType('uid')`**, **`assets()`**, then filters, references, pagination, projections — see `src/stack.ts`.

## Configuration

- Defaults in **`src/config.ts`** (`defaultConfig`): `contentStore.baseDir`, `patterns`, `locale`, `referenceDepth`, `projections`, etc.
- **`getConfig` / `setConfig`** allow inspecting or merging global options.
- Path helpers live in **`src/utils.ts`**; low-level reads in **`src/fs.ts`**.

## Query execution

- **Filtering:** **`sift`** for predicate matching; **`lodash`** for sorting/merging; **`json-mask`** for projections when used.
- **References:** depth controlled by config / `includeReferences` patterns in `stack.ts`.

## Where to change behavior

| Concern | Start here |
|---------|------------|
| New query operator or filter | `src/stack.ts` (large file — search existing similar methods) |
| Path resolution / base dir | `src/config.ts`, `src/utils.ts`, `README` for `APP_ROOT` |
| FS read/cache behavior | `src/fs.ts` |
| User-visible errors | `src/messages.ts` |
| Public exports | `src/index.ts` |

## Tests

- Mirror changes with **`test/`** suites and fixtures under **`test/data/`** — see [`../testing/SKILL.md`](../testing/SKILL.md).

## Official context

- [DataSync documentation](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) explains sync; this SDK assumes that pipeline has already written files.
