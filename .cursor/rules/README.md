# Cursor rules for this repository

Rules live in this directory. Each file documents **what** it covers, **when** it applies (`alwaysApply`, `globs`), and how to use it in chat.

## How to @-reference

In Cursor, type `@` and choose **Rules** (or the rule name if listed), or reference a path such as `@.cursor/rules/typescript.mdc` to pull that rule into context.

## Rule index

| File | `alwaysApply` | `globs` | When it applies |
|------|---------------|---------|-----------------|
| [`dev-workflow.md`](dev-workflow.md) | no | *(none)* | Branch/PR workflow, scripts, lint/test commands, versioning/release notes. Loaded from the rule picker; not auto-scoped to a single glob. |
| [`typescript.mdc`](typescript.mdc) | no | `src/**/*.ts` | Editing TypeScript under `src/` — style, structure, tooling. |
| [`datasync-filesystem-sdk.mdc`](datasync-filesystem-sdk.mdc) | no | `src/**/*.ts` | DataSync filesystem SDK patterns (Stack, config, paths, queries) — core library only, not `example/`. |
| [`testing.mdc`](testing.mdc) | no | `test/**/*.ts` | Jest tests, fixtures, temp dirs, `test/data/`. |
| [`code-review.mdc`](code-review.mdc) | **yes** | *(none)* | Every session — PR/checklist mindset for this repo. |

## Related docs

- Root agent entry point: [`../../AGENTS.md`](../../AGENTS.md)
- Skills index: [`../../skills/README.md`](../../skills/README.md)
