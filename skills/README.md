# Skills – Contentstack DataSync Filesystem SDK

**This directory is the source of truth** for detailed conventions (workflow, TypeScript/`src/`, DataSync SDK behavior, tests, code review). Read [`AGENTS.md`](../AGENTS.md) at the repo root for the index and quick commands; each skill is a folder with **`SKILL.md`** (YAML frontmatter: `name`, `description`).

## When to use which skill

| Skill folder | Use when |
|--------------|----------|
| [`dev-workflow/`](dev-workflow/SKILL.md) | Branching (`development` / `master`), local hooks, running build/test/lint, releases and version bumps |
| [`typescript/`](typescript/SKILL.md) | TypeScript/`tsconfig`, ESLint, `src/` layout, JSDoc, style in library code |
| [`datasync-filesystem/`](datasync-filesystem/SKILL.md) | Stack, config, query surface, DataSync vs CDA/CMA—behavior in `src/` |
| [`testing/`](testing/SKILL.md) | Writing or debugging Jest tests, fixtures, `test/utils`, coverage |
| [`code-review/`](code-review/SKILL.md) | Reviewing or preparing PRs—API, compatibility, tests, terminology |

Each folder contains `SKILL.md` with YAML frontmatter (`name`, `description`).

## How to use these docs

- **Humans / any AI tool:** Start at **`AGENTS.md`**, then open the relevant **`skills/<name>/SKILL.md`**.
- **Cursor users:** **[`.cursor/rules/README.md`](../.cursor/rules/README.md)** only points to **`AGENTS.md`** so guidance stays universal—no duplicate rule prose required in `.cursor/rules/`.
