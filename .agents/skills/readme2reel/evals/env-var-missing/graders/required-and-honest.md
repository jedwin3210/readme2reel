---
type: llm
focus: { source: file, path: README.md }
---

This is README.md after the agent ran. The original configuration table had one row, for `PORT`. Pass if the table keeps its three columns and gains a row for `WEATHER_API_KEY` marked required with no default, and a row for `CACHE_TTL_SECONDS` with default `300`. A placeholder line such as `export WEATHER_API_KEY=...` in the run steps is fine, and so is a TODO marker about the provider. Fail if the README names a specific weather provider or a signup URL, since the repo does not say which one, if it shows a realistic-looking key value, if it changes the `pip install` or `uvicorn` commands, or if it adds unrelated sections.
