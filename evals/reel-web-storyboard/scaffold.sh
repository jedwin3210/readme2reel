#!/usr/bin/env bash
# Copy this case's fixture repo into the eval sandbox and commit it, so the
# skill sees a clean git repo and graders see only the skill's changes.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
cp -R "$here/files/." .
git init -q -b main
git add -A
git commit -q -m "fixture"
