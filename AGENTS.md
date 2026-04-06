# Contentstack DataSync Filesystem SDK – Agent guide

**Universal entry point** for contributors and AI agents (Cursor, Copilot, CLI tools, or none). Conventions and detailed guidance live in **`skills/*/SKILL.md`**, not in editor-specific config, so the same instructions apply everywhere.

**Flow:** [`.cursor/rules/README.md`](.cursor/rules/README.md) (optional, Cursor only) → **`AGENTS.md`** (this file) → **`skills/<name>/SKILL.md`**

## What this repo is

| Field | Detail |
|-------|--------|
| *Name:* | [`@contentstack/datasync-filesystem-sdk`](https://github.com/contentstack/datasync-filesystem-sdk/) |
| *Purpose:* | TypeScript/JavaScript library to **query locally synced filesystem JSON** produced by [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync), typically after sync via `@contentstack/datasync-content-store-filesystem`. |
| *Out of scope (if any):* | **Not** the Contentstack Delivery (CDA) or Management (CMA) HTTP SDK; **no** REST calls for core behavior—reads disk and runs in-process queries (`lodash`, `sift`, `json-mask`). |

## Tech stack (at a glance)

| Area | Details |
|------|---------|
| Language | TypeScript `^4.9.5` (`package.json`); Node.js v20+ recommended (`README.md`) |
| Build | `tsc` → `dist/`; declarations in `typings/`; `tsconfig.json`; `npm run build-ts` / `compile` |
| Tests | Jest + ts-jest; `jest.config.js`; tests under `test/**/*.ts` (see `testMatch` / ignores) |
| Lint / coverage | `npm run lint` (ESLint per `package.json` on `src/**/*.ts`); Jest coverage to `coverage/` |
| Other | Core deps: `lodash`, `sift`, `json-mask`, `mkdirp`; docs: `npm run build-doc` → `docs/` |

## Commands (quick reference)

| Command type | Command |
|--------------|---------|
| Build | `npm run build-ts` (clean + compile) or `npm run compile` (`tsc` only) |
| Test | `npm test` (`pretest` runs `build-ts`, then Jest with coverage) |
| Lint | `npm run lint` |

Optional: CI and automation live under [`.github/workflows/`](.github/workflows/) (e.g. CodeQL, SCA, policy scans, version-bump checks—see each workflow for triggers).

## Where the documentation lives: skills

| Skill | Path | What it covers |
|-------|------|----------------|
| Dev workflow | [`skills/dev-workflow/SKILL.md`](skills/dev-workflow/SKILL.md) | Branches, hooks, build/test/lint, PR and version expectations |
| TypeScript (`src/`) | [`skills/typescript/SKILL.md`](skills/typescript/SKILL.md) | Compiler/lint, layout, JSDoc, dependencies—no HTTP/REST assumptions |
| DataSync filesystem SDK | [`skills/datasync-filesystem/SKILL.md`](skills/datasync-filesystem/SKILL.md) | Stack, config, query surface, DataSync vs CDA/CMA |
| Testing | [`skills/testing/SKILL.md`](skills/testing/SKILL.md) | Jest layout, fixtures, temp dirs, env, coverage |
| Code review | [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md) | PR checklist, semver, terminology, severity labels |

An index with “when to use” hints is in [`skills/README.md`](skills/README.md).

## Using Cursor (optional)

If you use *Cursor*, [`.cursor/rules/README.md`](.cursor/rules/README.md) only points to *[`AGENTS.md`](AGENTS.md)*—same docs as everyone else.
