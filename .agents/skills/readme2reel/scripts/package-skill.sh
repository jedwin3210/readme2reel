#!/usr/bin/env bash
# Build dist/readme2reel.skill for Claude.ai upload. Only the files the skill
# reads at run time go in, under one top-level folder named after the skill.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
stage="$root/dist/readme2reel"
rm -rf "$root/dist"
mkdir -p "$stage"
cp "$root/SKILL.md" "$root/LICENSE" "$stage/"
cp -R "$root/references" "$stage/references"
(cd "$root/dist" && zip -qr readme2reel.skill readme2reel -x '*.DS_Store')
echo "Built $root/dist/readme2reel.skill"
unzip -l "$root/dist/readme2reel.skill"
