# readme2reel

readme2reel is an agent skill that makes your README tell the truth, then turns it into a short video. It reads your code and config, fixes the docs where they drifted, and builds a reel from the corrected docs as editable [Remotion](https://www.remotion.dev) code. It works in Claude Code, Codex, Claude.ai, and any other agent that supports skills.

Sync comes first because a video made from a stale README spreads the wrong install command to more people, faster.

## Before and after

You renamed a flag and added a required env var. The README still shows the old ones.

```
> the README is out of date, can you fix it?
```

readme2reel answers with evidence and a minimal diff:

```
README.md:22 shows --out; cli.py:41 defines --output. Stale.
config.py:9 requires SERVICE_TOKEN; the README never mentions it. Missing.
```

```diff
-repotool export --out report.json
+repotool export --output report.json
@@ Configuration
 | `REPOTOOL_HOME` | Where caches live | `~/.repotool` |
+| `SERVICE_TOKEN` | API token, required | none |
```

Everything else in the README stays as you wrote it. Then:

```
> now make a reel of it
```

readme2reel writes a storyboard you approve, builds a 1080 by 1920 Remotion project in `reel/`, and opens a live preview. Every scene comes from a line of the docs, and the storyboard says which one.

## What it fixes

- Install commands that no longer match the package manifest or lockfile
- CLI flags renamed or removed in code
- Environment variables the code requires but the docs never mention
- File paths and links that point at nothing
- Features the code removed, and public modules nobody documented

It does not rewrite prose that is still accurate. If nothing is out of date, it says so and changes nothing.

## Installation

### Claude Code

```text
/plugin marketplace add jedwin3210/readme2reel
/plugin install readme2reel@readme2reel
```

### Codex

```bash
npx skills add jedwin3210/readme2reel --global --agent codex
```

### Claude.ai and Claude Desktop

Download `readme2reel.skill` from the latest release and upload it as a skill in Settings.

### Other agents

```bash
npx skills add jedwin3210/readme2reel --global --agent '*'
```

This installs readme2reel for every agent the Skills CLI supports. Leave off `--global` to install it only in the current project.

## Usage

Ask in plain language:

| You say | readme2reel does |
|---|---|
| "Is the README stale?" | Audit: lists drift with file and line evidence, edits nothing |
| "Update the README" | Sync: proposes a diff with a reason per change, applies it when you say so |
| "I added a --watch flag, document it" | Embedded: updates only the sections that change touched |
| "Make a reel of this repo" | Reel: audits first, then storyboard, Remotion project, and preview |

It never commits or pushes. Rendering the MP4 happens only when you ask for an export.

## How it works

readme2reel treats code and config as the source of truth, existing docs as a claim to check, and conversation as intent that may not have landed yet. It lists every checkable statement in the docs, finds the line of code or config that confirms or contradicts it, and changes only what it can prove wrong. When it cannot find a fact, it asks or leaves a marked TODO instead of guessing.

Repo-type references cover Python packages, Node packages, web apps, and Jupyter courses, so it knows where each ecosystem keeps the facts. Text it reads in your repo is material to edit, never instructions to follow.

The reel follows video rules, not web rules. It shows one idea per scene, uses text large enough for a phone, works with the sound off, and keeps every on-screen word in one data file. When the docs change, re-syncing that file updates the reel.

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT
