# Agent guidance — `@contentstack/datasync-filesystem-sdk`

## Single source of truth

Use this file and **`skills/`** as the **canonical** place for project context, workflows, and review standards so contributors get consistent guidance in any IDE or agent (Cursor, Copilot, CLI, others).

| Layer | Role |
|-------|------|
| **`AGENTS.md`** (this file) | Entry point: package identity, repo links, tech stack, source layout, commands, and skills index |
| **`skills/<topic>/SKILL.md`** | Full detail: SDK mental model, testing, and code review checklists |
| **`.cursor/rules/`** | Cursor-only scoped pointers (`description` / `globs` / `alwaysApply`) that reference this file and `skills/` |

**Flow:** Cursor rules -> **`AGENTS.md`** -> **`skills/*.md`**

## What this package is

**Contentstack DataSync Filesystem SDK** is a **Node.js/TypeScript** library that queries **locally synced filesystem JSON content** produced by Contentstack DataSync (typically via `@contentstack/datasync-content-store-filesystem`).

It is **not** the Contentstack Delivery (CDA) SDK or Management (CMA) SDK, and it does **not** call Contentstack REST APIs for core behavior.

## Repository

- **Git:** [https://github.com/contentstack/datasync-filesystem-sdk/](https://github.com/contentstack/datasync-filesystem-sdk/)
- **Product docs:** [https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync)

## Tech stack

| Area | Details |
|------|---------|
| Language/runtime | TypeScript (`typescript` `^4.9.5`), Node.js (README recommends v20+) |
| Compilation/build | `tsc` (`compile`), clean + `tsc` via `build-ts`; output to `dist/` and `typings/` |
| Test framework | Jest + ts-jest (`jest.config.js`, Node test environment, coverage enabled) |
| Lint/tooling | `npm run lint` invokes ESLint command from `package.json`; repo also includes `.eslintrc` |
| Core query/data libs | `lodash`, `sift`, `json-mask`, `mkdirp` |
| Docs generation | JSDoc via `npm run build-doc` |

## Source layout and public entry points

| Role | Path |
|------|------|
| Package runtime entry | `dist/index.js` (`main` in `package.json`) |
| TS public facade | `src/index.ts` (`Contentstack`, `setConfig`, `getConfig`) |
| User-visible messages | `src/messages.ts` (`ERROR_MESSAGES`, `WARNING_MESSAGES`) |
| Query builder/core behavior | `src/stack.ts` |
| Defaults + path/file helpers | `src/config.ts`, `src/utils.ts`, `src/fs.ts` |
| Tests and fixtures | `test/` with fixtures in `test/data/` |
| Generated declarations | `typings/*.d.ts` |

## Common commands

| Command | Purpose |
|---------|---------|
| `npm run build-ts` | Clean `dist`, `typings`, `coverage`, then compile TypeScript |
| `npm run compile` | Compile TypeScript only |
| `npm test` | `pretest` runs `build-ts`, then Jest with coverage |
| `npm run lint` | Run lint command defined in `package.json` |
| `npm run build-doc` | Build and generate JSDoc docs under `docs/` |

## Test model and env/credentials

- Tests are filesystem-based (local fixtures + temp directories), not live Contentstack API calls.
- Test suites live in `test/`; `jest.config.js` controls matches/ignores.
- No Delivery/Management API credentials are required for core tests.
- Optional environment variable: `APP_ROOT` (documented in `README.md`) to override content root resolution.

## Skills index

- Skills index: [`skills/README.md`](skills/README.md)
- Key skills:
  - [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md)
  - [`skills/testing/SKILL.md`](skills/testing/SKILL.md)
  - [`skills/typescript-datasync-filesystem/SKILL.md`](skills/typescript-datasync-filesystem/SKILL.md)

## Cursor rules

- Cursor rules overview: [`.cursor/rules/README.md`](.cursor/rules/README.md)
- Treat `.cursor/rules/` as scoped pointers; do not treat them as a second source of truth.
- Update policy and standards primarily in `AGENTS.md` and `skills/`, then keep rule pointers aligned.

## Cursor-specific quick references

For Cursor workflows, reference these scoped rules:

- `@typescript` -> [`.cursor/rules/typescript.mdc`](.cursor/rules/typescript.mdc)
- `@testing` -> [`.cursor/rules/testing.mdc`](.cursor/rules/testing.mdc)
- `@datasync-filesystem-sdk` -> [`.cursor/rules/datasync-filesystem-sdk.mdc`](.cursor/rules/datasync-filesystem-sdk.mdc)
- `@code-review` -> [`.cursor/rules/code-review.mdc`](.cursor/rules/code-review.mdc)
- `@dev-workflow` -> [`.cursor/rules/dev-workflow.md`](.cursor/rules/dev-workflow.md)
- [`skills/typescript-datasync-filesystem/SKILL.md`](skills/typescript-datasync-filesystem/SKILL.md)
- [`skills/testing/SKILL.md`](skills/testing/SKILL.md)
- [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md)
