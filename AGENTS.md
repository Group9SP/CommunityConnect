# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

CommunityConnect (branded "Minority X-Change") is a React 18 + TypeScript SPA built with Vite. It uses Supabase as a cloud-hosted backend (PostgreSQL + Auth). There is no local backend server—only a Vite dev server serving the frontend.

### Key commands

See `docs/README.md` for full details. Quick reference:

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 5173) |
| Lint | `npm run lint` |
| Test | `npm test` (vitest, pure logic tests) |
| Build | `npm run build` |

### Non-obvious caveats

- **Host binding**: `vite.config.ts` sets `host: "localhost"`. To access the dev server from outside the container (e.g. for browser testing in a Cloud VM), start with `npx vite --host 0.0.0.0 --port 5173` instead of `npm run dev`.
- **Supabase fallback**: The app gracefully falls back to 4 hardcoded static businesses when the remote Supabase instance is unreachable. No local Supabase setup is needed for UI development or testing.
- **Lint pre-existing errors**: The codebase has 4 pre-existing ESLint errors (e.g. `no-explicit-any`, `no-empty-object-type`, `no-require-imports`). These are in existing code and not regressions.
- **README port mismatch**: `docs/README.md` mentions port 8080 but the actual Vite config uses port 5173.
- **Environment variables**: `.env` is committed with the Supabase project credentials. No additional secrets are needed for basic development.
