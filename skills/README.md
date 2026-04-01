# Skills index

Skills are short, task-focused guides for this repository. Use them when the description matches your task; combine with [AGENTS.md](../AGENTS.md) and [`.cursor/rules/README.md`](../.cursor/rules/README.md).

| Skill | Folder | When to use |
|-------|--------|-------------|
| Code review | [`code-review/`](code-review/SKILL.md) | Reviewing or preparing PRs — checklist, semver, tests, terminology. |
| Testing | [`testing/`](testing/SKILL.md) | Running Jest, understanding `test/` layout, fixtures, env. |
| TypeScript + DataSync filesystem SDK | [`typescript-datasync-filesystem/`](typescript-datasync-filesystem/SKILL.md) | Changing query behavior, config, or Stack internals in `src/`. |

There is no separate **framework** skill: the SDK does not use a dedicated HTTP client layer; behavior is filesystem- and query-library–centric.
