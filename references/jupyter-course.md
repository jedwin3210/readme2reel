# Jupyter courses and notebook repos

Read this when the repo is a course, workshop, tutorial, or book built from notebooks. Signals: many `.ipynb` files, often numbered; `environment.yml`; a `binder/` or `.binder/` folder; Jupyter Book config (`myst.yml` for Jupyter Book 2, `_config.yml` plus `_toc.yml` for Jupyter Book 1); `_quarto.yml`; nbgrader or otter-grader config. Students copy setup commands verbatim, so a wrong environment name or link fails a whole class at once.

## Where the facts live

| Fact the docs state | Source of truth, in priority order | Watch for |
|---|---|---|
| Environment name | `name:` in `environment.yml` | `conda activate x` must match |
| Python version | `python=` pin in `environment.yml`, `runtime.txt`, `.python-version` | |
| Packages | `environment.yml`, `requirements.txt`, `binder/` files | The two files disagree |
| Lesson list and order | Notebook filenames, then the book's table of contents | Renamed, added, removed, or reordered notebooks |
| Kernel | `metadata.kernelspec.name` and `display_name` in each notebook | |
| Launch links | Binder, Colab, and nbgitpuller URLs | Each encodes owner, repo, branch, and path |
| Data | Paths the notebooks open, then download scripts | |

## Drift to check, most common first

1. **Lesson table.** Compare the README syllabus with the notebook files and the book's table of contents. Fix names, links, and order. Add a missing notebook as one line in the existing list.
2. **Launch links after a move.** A Colab URL has the form `https://colab.research.google.com/github/OWNER/REPO/blob/BRANCH/PATH.ipynb`. A Binder URL has the form `https://mybinder.org/v2/gh/OWNER/REPO/BRANCH` with an optional `?urlpath=` or `?labpath=`. A branch rename from `master` to `main` or a moved notebook breaks every badge. Check each link's path against the tree and the default branch from `git symbolic-ref refs/remotes/origin/HEAD` or CI triggers.
3. **Environment name and activation.** `conda activate` must use the `name:` field. If the README offers `pip install -r requirements.txt` too, check that the file exists.
4. **Data paths.** Grep notebook sources for `read_csv(`, `open(`, `np.load(`, `Path(`, and `load_dataset(`. Compare with the README's data instructions and the files in `data/`. Report a path that exists nowhere. Do not invent a download URL.
5. **Packages used but not installed.** If notebooks import a package absent from the environment files, report it. Do not add a version pin without evidence.
6. **Launch command.** `jupyter lab` and `jupyter notebook` both work on current installs. Change one only when the environment lacks the package it needs.

## Reading notebooks

A notebook is JSON. Read `cells[].source` and the kernelspec metadata. Ignore `outputs`. They show the last run, which may be stale, so outputs are never evidence of current behavior.

## Gotchas

- Due dates, office hours, grading policy, schedules, and staff names cannot be checked from code. Leave them alone unless a config file in the repo states them.
- Solutions often live on another branch or in a hidden folder. A missing solutions notebook in the main branch is not drift.
- Course content is often licensed CC BY while code is MIT. Do not merge license statements.
- Jupyter Book 2 uses `myst.yml`. Do not tell students to edit `_toc.yml` in a repo that has migrated.

## Example

Evidence: `notebooks/03-regression.ipynb` exists; `notebooks/03-linear-models.ipynb` does not.

```diff
-3. [Linear models](notebooks/03-linear-models.ipynb)
+3. [Regression](notebooks/03-regression.ipynb)
```
