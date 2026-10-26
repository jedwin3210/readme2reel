# Guide for agents

This file explains how to change readme2reel without breaking its package or prompt.

## What this repo contains

readme2reel is an agent skill written in Markdown. `SKILL.md` is the prompt agents read. `references/` holds files the skill loads on demand. The repo has no build step.

Keep the skill portable. Do not write instructions that limit it to one agent tool.

## Key files

- `SKILL.md` is the source of truth: metadata, ground rules, modes, and the sync and reel procedures.
- `references/` holds one file per repo type plus `reel.md`. SKILL.md says when to read each one.
- `README.md` explains installation and use.
- `CHANGELOG.md` holds release notes, newest first.
- `.claude-plugin/plugin.json` and `marketplace.json` package the skill for Claude Code. Claude Code loads the root `SKILL.md` without a `skills` path, and leaving the path out keeps `evals/` from overlapping the skill folder.
- `.cursor-plugin/plugin.json` describes the Cursor plugin.
- `agents/openai.yaml` holds the display name and default prompt for Codex.
- `evals/` holds `claude plugin eval` cases. Each case copies its fixture repo from `files/` into the sandbox with `scaffold.sh`.
- `scripts/validate-package.py` checks package files and shared values.

## Rules for changes

- **Version:** Keep one version in `SKILL.md` under `metadata.version`, the first `CHANGELOG.md` heading, and both plugin manifests.
- **Description:** The manifests use the first sentence of the `SKILL.md` description. The description must stay under 1,024 characters with no angle brackets.
- **Length:** Every word of `SKILL.md` is read on each use. Keep it under 400 lines. Move ecosystem detail into a reference.
- **Evals:** A behavior change needs an eval that would have caught the old behavior. Keep fixture repos tiny. Grade file contents with `target: { source: file, path: ... }`. The runner's `files` target came back empty in these scaffolded cases even when README.md changed, so a `files` check passes whether or not anything changed.
- **History:** Add a `CHANGELOG.md` note for any behavior change.
- **Checks:** Before publishing, run these:

```bash
python3 scripts/validate-package.py
npx skills add . --list
claude plugin validate --strict .
claude plugin eval . --scaffold --allow-tools Edit Write --runs 1 --ablation none
```

Do not install this skill into the repo via `npx skills add` (that creates `.agents/` and makes `claude plugin eval` discover the suite twice). Eval runs real Claude Code sessions on your plan; `--ablation none` skips the no-plugin baseline and roughly halves quota use. Re-run after a session-limit reset if the suite aborts early.

## Writing style

Use plain language: lead with the main point, use common words and active voice, keep sentences short, and keep exact identifiers, commands, and paths.
