# Node packages

Read this when the repo has a `package.json` with `bin`, `main`, `exports`, or `workspaces`. If it is a deployable app, such as Next.js, Vite, or an Express server, read `web-app.md` too.

## Where the facts live

| Fact the docs state | Source of truth, in priority order | Watch for |
|---|---|---|
| Install name | `name` in package.json | Scoped names (`@org/pkg`) |
| Command name | `bin` in package.json | String form: the command is the name without its scope. Object form: the keys are the commands |
| Package manager | Lockfile: `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock` or `bun.lockb`; then the `packageManager` field | Dev setup commands must use this manager |
| Node version | `engines.node`, then `.nvmrc`, `.node-version`, `.tool-versions`, then the CI matrix | |
| Import style | `type`, `exports`, `main`, `types` | `"type": "module"` means examples should use `import` |
| Import paths | Keys of the `exports` map | Subpaths not in `exports` cannot be imported |
| Scripts | `scripts` in package.json | README `npm run x` must name a script that exists |
| Flags | commander, yargs, meow, `node:util` `parseArgs`, oclif, cac, citty | See the flag rules below |
| Env vars | `process.env.X`, dotenv, zod or valibot env schemas, t3-env `createEnv`, envalid | Required versus optional |
| Changelog | `.changeset/` folder, release-please config, semantic-release config | These generate CHANGELOG.md; do not edit it |

## Drift to check, most common first

1. **Install name.** Compare `npm install x` lines with `name`. Global CLIs use `npm install -g x` or `npx x`. Libraries go in dependencies, and dev tools use `-D`.
2. **Command name.** Compare commands in code blocks with `bin`. A renamed key in the `bin` object is a common silent break.
3. **Flags.** Compare option strings exactly.
   - commander: `.option("-o, --output-dir <dir>")` defines `-o` and `--output-dir`; the value is `opts.outputDir`. `.option("--no-color")` defines a negatable flag. Required values use `<x>`, optional ones `[x]`.
   - yargs: keys of `.option()` plus `alias`. yargs accepts both camelCase and kebab-case by default.
   - meow: flags are declared in camelCase and used on the command line in kebab-case.
   - `parseArgs`: the `options` object keys, with `short` for single letters.
   - oclif: `Flags.string({char: "o"})` under the key in `static flags`.
4. **Scripts.** Every `npm run x`, `pnpm x`, or `yarn x` in the docs must exist in `scripts`. `npm test`, `npm start`, and `npm install` do not need `run`.
5. **Package manager.** If the lockfile is pnpm, dev setup in the README should say `pnpm install`. Keep `npm install x` in the user-facing install section. Users install with whatever they use.
6. **Import examples.** Check named imports against the entry file's exports, and subpath imports against the `exports` map. `require()` examples break when the package is ESM-only.
7. **Node version.** Compare with `engines.node`. Update the README to the stricter value when they disagree.
8. **Env vars.** A schema field without `.optional()` or a default is required. `process.env.X!` or an explicit throw marks it required.

## Gotchas

- Corepack no longer ships with recent Node releases. Do not add `corepack enable` unless the repo already documents it.
- In workspaces, each package has its own README. Fix the package README for package facts and the root README for repo-wide setup.
- TypeScript sources compile to `dist/`. Check `bin` and `exports` paths, not the `src/` paths.
- A package published to JSR as well has `jsr.json` or `deno.json`. Its `deno add jsr:@scope/pkg` line is not drift.
- Peer dependencies the user must install themselves belong in the install section if the README already lists dependencies.

## Example

Evidence: bin/shotlist.js:8 `.option("-o, --output-dir <dir>", ...)`.

```diff
-shotlist urls.txt --out shots/ --width 1440 --full-page
+shotlist urls.txt --output-dir shots/ --width 1440 --full-page
```
