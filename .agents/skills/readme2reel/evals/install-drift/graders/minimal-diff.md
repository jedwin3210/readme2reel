---
type: llm
focus: { source: file, path: README.md }
---

This is README.md after the agent ran. The original was identical except that its install block said `pip install tidy-json`. Pass only if the install block now says `pip install tidyjson` and every other line matches the original: the title, the sentence "Pretty-print and validate JSON files from the command line. Keys come out sorted, so diffs stay small.", "Requires Python 3.10 or newer.", the usage block `tidyjson data.json --indent 4`, the Python import `from tidyjson import format_text`, and the License section saying MIT. Fail on any added section, badge, reworded sentence, or reordering.
