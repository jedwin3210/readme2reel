---
type: llm
---

The response proposes changing both the usage example and the flag table from `--out`/`-d` to `--output-dir`/`-o`, cites bin/shotlist.js as evidence, shows the change as a diff, and asks before applying it. Fail if it proposes changing anything else, such as the description, install command, or the other flags, or if it says it already edited the file.
