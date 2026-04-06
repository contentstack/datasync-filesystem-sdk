---
name: code-review
description: PR review checklist for DataSync Filesystem SDK—API docs, compatibility, tests, terminology (not CDA/CMA HTTP SDK)
---

# Code review – Contentstack DataSync Filesystem SDK

## When to use

- Reviewing a pull request that touches `src/`, `test/`, or public docs
- Preparing your own PR and self-checking before request for review
- Verifying semver impact or regression risk for query/config behavior

## Instructions

### Scope and terminology

- This package is the **DataSync Filesystem SDK** (local synced content). Do **not** describe it as the **CDA** or **CMA** HTTP client unless the change explicitly documents comparison or migration.
- Distinguish **in-memory/filesystem** queries from **REST** or **CDN** behavior.
- Confirm behavior changes are covered by **filesystem-based** Jest tests, not live API calls.

### Public API and docs

- Exported APIs should have accurate **JSDoc** (`@public`, parameters, return shape).
- **README** and **example/** snippets must match real `Contentstack.Stack` usage and config keys.

### Compatibility

- Avoid breaking query result shape, config schema, or public method signatures without a **semver-major** plan and changelog intent.
- Deprecations: comment + document clearly.

### Errors and messages

- Prefer centralized strings from **`src/messages.ts`** (`ERROR_MESSAGES`, `WARNING_MESSAGES`); keep messages actionable.

### Correctness and null safety

- Guard missing files, empty arrays, and malformed JSON consistently with patterns in `stack.ts` / `fs.ts`.

### Dependencies and security

- New dependencies need justification (bundle size, maintenance). Align with **`package.json`**.
- Consider **Snyk** / org policy — `pretest` does not replace dependency review.

### Tests

- Behavioral changes in **`src/`** need matching updates under **`test/`** with fixtures in **`test/data/`** — not live API calls.

### Optional severity

| Level | Examples |
|-------|----------|
| Blocker | Wrong query results, data loss risk, security issue, broken public API contract |
| Major | Missing tests for core behavior, breaking change without version/docs strategy |
| Minor | Style, non-user-facing refactors, doc nits |

## References

- [`../testing/SKILL.md`](../testing/SKILL.md)
- [`../datasync-filesystem/SKILL.md`](../datasync-filesystem/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
