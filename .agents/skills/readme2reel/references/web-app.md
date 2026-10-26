# Web apps and services

Read this when the repo is a deployable app or service. Signals: framework config (`next.config.*`, `vite.config.*`, `svelte.config.*`, `nuxt.config.*`, `astro.config.*`, `manage.py`, `config/routes.rb`), a Dockerfile, a compose file, `Procfile`, or deploy config (`vercel.json`, `netlify.toml`, `fly.toml`, `render.yaml`, `wrangler.toml`). Also read `python-package.md` or `node-package.md` for the language side.

## Where the facts live

| Fact the docs state | Source of truth, in priority order | Watch for |
|---|---|---|
| Runtime version | `.nvmrc`, `.python-version`, `.tool-versions`, `mise.toml`, Dockerfile `FROM`, CI matrix | |
| Env vars | Code reads, then `.env.example` or sample config, then compose `environment:` | All three should agree with the README |
| Port | Server listen call or framework default, `PORT` env, compose `ports:`, Dockerfile `EXPOSE` | Compose maps host:container; the README needs the host side |
| Dev command | `scripts.dev` in package.json, `manage.py runserver`, `uvicorn` or `fastapi dev`, Procfile `web:` | |
| Database setup | Migration tool config: Prisma schema, Drizzle config, Alembic, Django migrations, Rails `db/` | Seed scripts |
| Services | Service names in the compose file | `docker compose` (v2) replaced `docker-compose` |
| Deploy | Deploy config files actually present | A removed Procfile means Heroku steps are stale |
| Routes | Route files, decorators, `app/` or `pages/` folders | Only routes the README already lists |

## Drift to check, most common first

1. **Missing env vars.** Grep the code for every env read: `process.env.`, `import.meta.env.`, `os.environ`, `os.getenv`, `ENV[`, `env(`. Any required var missing from the README or `.env.example` is a finding. Add it to the existing table, with "required" and no invented sample value.
2. **Client prefixes.** Frameworks only expose prefixed vars to the browser: `NEXT_PUBLIC_` (Next.js), `VITE_` (Vite), `PUBLIC_` (SvelteKit and Astro), `NUXT_PUBLIC_` (Nuxt runtime config), `EXPO_PUBLIC_` (Expo), `REACT_APP_` (legacy Create React App). If code reads `VITE_API_URL` and the README says `API_URL`, the README is wrong.
3. **Setup steps.** Compare install, migrate, and seed commands with scripts and tool configs. A README that skips a migration the app needs on first run is the classic "crashes for new contributors" bug.
4. **Port and URL.** Compare `localhost:NNNN` in the docs with the actual listen port or framework default. Next.js, Nuxt, and Remix default to 3000. Vite and SvelteKit default to 5173, Astro to 4321, Django and FastAPI with uvicorn to 8000, Flask to 5000, and Rails to 3000.
5. **Compose usage.** Service names in `docker compose up api` must exist. Prefer `docker compose` when the README already uses compose. Change `docker-compose` only on a line you are already fixing.
6. **Deploy section.** Compare against the deploy files that exist. Do not write a new deploy guide. Mark a removed platform's section with a TODO if you cannot tell what replaced it.
7. **Directory overview.** Compare listed folders with the tree. Next.js moved from `pages/` to `app/` in many repos.
8. **Listed endpoints.** Fix paths and methods for endpoints the README already lists. Do not generate an API reference.

## Gotchas

- `.env.example` is config, but it documents env vars. Update it alongside the README when the repo treats it as the env reference.
- Secrets never get real values in docs. Use the placeholder style the file already uses.
- A var read only in tests or scripts is not a runtime requirement.
- Frameworks load `.env`, `.env.local`, and mode-specific files. A var defined only in `.env.development` is still undocumented for production.
- Health check and webhook paths often live in deploy config, not route files. Check both before calling one stale.

## Example

Evidence: app/config.py:4 `WEATHER_API_KEY = os.environ["WEATHER_API_KEY"]`.

```diff
 | Variable | Purpose | Default |
 |---|---|---|
 | `PORT` | Port to listen on | `8000` |
+| `WEATHER_API_KEY` | Weather provider API key, required | none |
+<!-- TODO(readme2reel): which weather provider issues this key; not stated in the repo -->
```
