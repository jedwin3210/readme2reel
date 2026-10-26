#!/usr/bin/env python3
"""Check readme2reel's package files without external dependencies."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NAME = "readme2reel"


def read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except OSError as error:
        raise SystemExit(f"Cannot read {path.relative_to(ROOT)}: {error}")


def load_json(rel: str) -> dict:
    try:
        return json.loads(read(ROOT / rel))
    except json.JSONDecodeError as error:
        raise SystemExit(f"Fix the JSON in {rel}: {error}")


def need(match, message):
    if match is None:
        raise SystemExit(message)
    return match


SKILL = read(ROOT / "SKILL.md")
CHANGELOG = read(ROOT / "CHANGELOG.md")
PLUGIN = load_json(".claude-plugin/plugin.json")
MARKET = load_json(".claude-plugin/marketplace.json")
CURSOR = load_json(".cursor-plugin/plugin.json")

meta = need(re.match(r"\A---\n(.*?)\n---\n", SKILL, re.DOTALL), "SKILL.md must begin with YAML metadata").group(1)
for field in ("version:", "compatibility:", "allowed-tools:"):
    if re.search(rf"(?m)^{re.escape(field)}", meta):
        raise SystemExit(f"Remove top-level YAML field: {field[:-1]}")

name = need(re.search(r"(?m)^name:\s*(\S+)\s*$", meta), "Add name to SKILL.md").group(1)
if name != NAME:
    raise SystemExit(f"Set the SKILL.md name to {NAME}, not {name}")

version = need(re.search(r'(?m)^\s+version:\s*["\']?(\d+\.\d+\.\d+)["\']?\s*$', meta), "Add metadata.version as a three-part version").group(1)
changelog_version = need(re.search(r"(?m)^## (\d+\.\d+\.\d+)$", CHANGELOG), "Add a version heading to CHANGELOG.md").group(1)
versions = {version, changelog_version, str(PLUGIN.get("version", "")), str(CURSOR.get("version", ""))}
if len(versions) != 1:
    raise SystemExit(f"Use one package version in all files: {sorted(versions)}")

description = " ".join(need(re.search(r"(?m)^description: \|\n((?:  .*\n)+)", meta + "\n"), "Write the description as an indented block").group(1).split())
if len(description) > 1024:
    raise SystemExit(f"Keep the description at 1,024 characters or fewer; it has {len(description)}")
if "<" in description or ">" in description:
    raise SystemExit("Remove angle brackets from the description")

manifest_descriptions = {str(PLUGIN.get("description", "")), str(CURSOR.get("description", ""))}
manifest_descriptions |= {str(p.get("description", "")) for p in MARKET.get("plugins", [])}
if len(manifest_descriptions) != 1 or not description.startswith(next(iter(manifest_descriptions))):
    raise SystemExit(f"Use the first sentence of the SKILL.md description in every manifest: {sorted(manifest_descriptions)}")

for label, manifest in (("Claude", PLUGIN), ("Cursor", CURSOR)):
    if manifest.get("name") != NAME:
        raise SystemExit(f"Set the {label} plugin name to {NAME}")
if "skills" in PLUGIN or "skills" in CURSOR:
    raise SystemExit("Omit skills from the plugin manifests so the root SKILL.md loads and evals/ stays outside the skill path")

skip_parts = {".git", "dist", ".agents", ".claude", ".cursor", ".codex", "node_modules"}
skill_files = {p.relative_to(ROOT) for p in ROOT.rglob("SKILL.md") if not skip_parts & set(p.parts)}
if skill_files != {Path("SKILL.md")}:
    raise SystemExit(f"Keep one SKILL.md at the repo root; found {sorted(map(str, skill_files))}")

for ref in sorted(set(re.findall(r"references/([a-z0-9-]+\.md)", SKILL))):
    if not (ROOT / "references" / ref).is_file():
        raise SystemExit(f"SKILL.md points at references/{ref}, which does not exist")

lines = SKILL.count("\n")
if lines > 400:
    raise SystemExit(f"Keep SKILL.md under 400 lines; it has {lines}")

for case in sorted((ROOT / "evals").glob("*/")):
    if case.name == "results":
        continue
    for required in ("prompt.md", "case.yaml", "scaffold.sh"):
        if not (case / required).is_file():
            raise SystemExit(f"evals/{case.name} is missing {required}")
    if not any((case / "graders").glob("*.md")):
        raise SystemExit(f"evals/{case.name}/graders has no grader files")
    if not (case / "files").is_dir():
        raise SystemExit(f"evals/{case.name} is missing its files/ fixture repo")

print(f"readme2reel package v{version} is valid ({lines} SKILL.md lines, {len(description)} description characters)")
