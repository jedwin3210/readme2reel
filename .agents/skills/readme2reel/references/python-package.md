# Python packages

Read this when the repo has `pyproject.toml`, `setup.py`, or `setup.cfg`. If it is also a deployable service, such as FastAPI, Django, or Flask, read `web-app.md` too. If it is mostly notebooks, read `jupyter-course.md`.

## Where the facts live

| Fact the docs state | Source of truth, in priority order | Watch for |
|---|---|---|
| Install name | `[project].name` in pyproject.toml; `name=` in setup.py or setup.cfg | Differs from the import name and the command name |
| Import name | Top-level package folder under `src/` or the repo root | `src/` layout hides it one level down |
| Command name | `[project.scripts]` keys; `entry_points` `console_scripts` | `python -m pkg` needs `pkg/__main__.py` |
| Python version | `requires-python`, then classifiers, then the CI matrix | README often lags a dropped version |
| Optional features | `[project.optional-dependencies]` (extras) | Extras install with `pip install "pkg[extra]"`; PEP 735 `[dependency-groups]` are dev-only and never install from PyPI |
| Dev setup | Build backend and tool tables: `[tool.uv]`, `[tool.poetry]`, `[tool.hatch]`, `uv.lock`, `poetry.lock`, `pdm.lock` | The lockfile shows which tool the maintainers use |
| Flags | argparse `add_argument`, click `@click.option`, typer parameters | See the flag rules below |
| Env vars | `os.environ[...]`, `os.environ.get`, `os.getenv`, pydantic-settings classes | Required versus optional, and prefixes |
| Public API in examples | `__init__.py` imports and `__all__` | Renamed or moved functions |
| Test and lint commands | CI workflow `run:` steps, then `tox.ini`, `noxfile.py`, `Makefile`, `[tool.pytest.ini_options]` | CI is what actually runs |

## Drift to check, most common first

1. **Install name.** Projects get renamed on PyPI but keep their import name. Compare every `pip install`, `uv add`, `pipx install`, and `uv tool install` line with `[project].name`. Names normalize: `tidy_json`, `tidy-json`, and `Tidy.JSON` are the same distribution, but `tidyjson` is not. Fix the command only.
2. **Command name and entry point.** Grep code blocks for the command and compare with `[project.scripts]`. If the README says `python -m pkg`, confirm `__main__.py` exists.
3. **Flags.** Read the CLI definition and compare option strings exactly.
   - argparse uses the literal strings in `add_argument("-o", "--output")`. `dest` is internal and never a flag.
   - click turns `--dry-run` into the parameter `dry_run`. Boolean flags declared as `"--color/--no-color"` have both forms.
   - typer turns the parameter `output_dir` into `--output-dir`. Boolean options get a `--no-` variant unless declared otherwise. An `Annotated[..., typer.Option("--out", "-o")]` declaration overrides the derived name.
4. **Python version.** Compare stated minimums with `requires-python`. Do not trust a version badge. It may be generated from classifiers.
5. **Env vars.** `os.environ["X"]` raises when unset, so X is required. `os.environ.get("X", default)` and `os.getenv("X")` are optional; document the default if the docs have a defaults column. For pydantic-settings, a field without a default is required. The env name is `env_prefix` plus the field name, case-insensitive by default, unless `validation_alias` or `alias` sets it.
6. **Examples that import removed names.** Check each `from pkg import x` in the README against `__init__.py` and `__all__`.
7. **Dev setup.** If the repo has `uv.lock`, setup is `uv sync`; extras and groups use `--extra` and `--group`. With `poetry.lock`, it is `poetry install`. Otherwise `pip install -e ".[dev]"` works only if a `dev` extra exists. Recent pip installs PEP 735 groups with `pip install --group dev`.
8. **Test commands.** Copy the command from CI when the README's command no longer exists, such as a removed `make test` target or `tox` env.

## Gotchas

- Dynamic versions (`dynamic = ["version"]` with setuptools-scm or hatch-vcs) are set from git tags. Do not "fix" a version string in the README against a hard-coded value that does not exist.
- A package can expose both a console script and `python -m`. Both being documented is not drift.
- `setup.py` may exist only as a shim while pyproject.toml holds the metadata. Prefer pyproject.toml.
- Conda installs come from conda-forge recipes outside the repo. Leave `conda install` lines alone unless the repo contains the recipe.
- Sphinx or MkDocs pages generated from docstrings are out of scope. Fix the docstring only if the user asks.

## Example

Evidence: pyproject.toml:6 `name = "tidyjson"`.

~~~diff
 ## Install

 ```bash
-pip install tidy-json
+pip install tidyjson
 ```
~~~
