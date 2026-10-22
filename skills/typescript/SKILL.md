---
name: typescript
description: TypeScript conventions for src/—tsconfig, ESLint, layout, JSDoc, no HTTP/REST assumptions
---

# TypeScript (`src/`) – Contentstack DataSync Filesystem SDK

## When to use

- Editing or adding files under `src/`
- Aligning with compiler and lint settings
- Choosing where new code belongs (`index.ts`, `stack.ts`, `utils.ts`, etc.)

## Instructions

### Tooling

- **Compiler:** `tsconfig.json` — `module` CommonJS, `target` ES6, unused locals/parameters, `noImplicitReturns`, declarations emitted to `typings/`.
- **Lint:** `npm run lint` uses ESLint with the config referenced in `package.json` (a `.eslintrc` may also exist at repo root).
- **Formatting:** `.jsbeautifyrc` at repo root; match neighboring code (indentation, quotes, semicolons).

### Layout

- Keep the public surface in `src/index.ts`; heavy logic stays in `stack.ts`, `utils.ts`, `fs.ts`, `config.ts`, `messages.ts`.
- Prefer **JSDoc** on exported symbols (`@public`, `@description`, `@api`) for `npm run build-doc`.
- Use **error/warning** patterns from `messages.ts` instead of ad hoc user-facing strings where appropriate.

### Logging

- Avoid `console` noise in library code; tests may use `debug` (see `test/utils.ts`).

### Dependencies

- Do not add HTTP clients or REST assumptions — this SDK targets **local filesystem** content and in-process queries. New deps must align with `package.json` and team policy.

## References

- [`../datasync-filesystem/SKILL.md`](../datasync-filesystem/SKILL.md) — SDK behavior and Stack API
- [`../../AGENTS.md`](../../AGENTS.md)
