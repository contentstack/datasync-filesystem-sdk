---
name: code-review
description: PR review checklist for @contentstack/datasync-filesystem-sdk — API docs, compatibility, tests, DataSync terminology
---

# Code review (expanded)

Use this skill when reviewing or authoring changes to [**@contentstack/datasync-filesystem-sdk**](https://github.com/contentstack/datasync-filesystem-sdk/). Align with [`.cursor/rules/code-review.mdc`](../../.cursor/rules/code-review.mdc).

## Scope clarity

- Confirm the change targets **local DataSync filesystem querying**, not CDA/CMA HTTP APIs, unless the diff is documentation comparing ecosystems.

## Public API

- **JSDoc** on exports: purpose, parameters, return values, examples where helpful.
- **README** and **example/** snippets reflect real `Contentstack.Stack` config and method chains.

## Compatibility

- **Semver:** breaking changes to public methods, config shape, or default behavior likely require a **major** bump; additive features **minor**; fixes **patch** — follow team policy.
- Avoid silent changes to projection defaults, locale handling, or reference resolution depth.

## Errors and UX

- User-facing strings should flow through **`messages.ts`** where possible.
- Thrown errors should be debuggable (include context, avoid leaking sensitive paths in production if your deployment cares).

## Correctness and safety

- **Filesystem:** race-free assumptions, `existsSync` / read patterns consistent with `fs.ts`.
- **Queries:** `sift` / lodash behavior matches intended Mongo-like operators documented or implied by tests.

## Dependencies

- New packages: license, maintenance, size — and run org security processes (**Snyk**, etc.).

## Tests

- **`src/`** behavior changes need **Jest** updates under **`test/`** with filesystem fixtures — not network mocks for Contentstack APIs.

## Optional severity

| Level | Examples |
|-------|----------|
| Blocker | Wrong query results, security issue, broken published API |
| Major | Missing regression tests, breaking change without version strategy |
| Minor | Comments, internal refactors, doc typos |
