# BossOS

BossOS is the operational software platform for the business behind Urban Mechanical and Urban Spray Foam. This monorepo contains the live admin app, live field app, and API that now power the post-migration system.

## Highlights

- Live Next.js admin and field apps
- Dedicated API service for auth, records, and data workflows
- Clear separation between live apps and retained legacy Vite apps
- Manual release flow documented for Vercel, Railway, Neon, and Drizzle
- Root-level helper scripts for local development, builds, and database tasks

## Repository structure

### Live apps

These are the active application surfaces and normal release targets:

- `apps/admin-web-next`
- `apps/field-web-next`
- `apps/api`

### Legacy apps

These older Vite apps are retained for controlled reference only:

- `apps/admin-web`
- `apps/field-web`

Do not build normal feature work in the legacy apps unless the task is specifically about archival, comparison, or recovery.

## Tech stack

- Next.js for the live admin and field frontends
- React and TypeScript across the frontend apps
- Express and TypeScript for the API
- Railway for API deployment
- Vercel for frontend deployment
- Neon for hosted Postgres
- Drizzle for schema and migration workflow
- pnpm for workspace package management

## Quick start

### 1. Install dependencies

From the repo root:

```bash
pnpm install
```

### 2. Configure environment variables

Before running anything locally, make sure environment variables are set for:

- `apps/admin-web-next`
- `apps/field-web-next`
- `apps/api`

> Environment file names still need to be documented from the real repo. Do not guess them. Add the exact filenames once confirmed.

### 3. Start the system locally

Recommended startup order:

1. API
2. Admin app
3. Field app

Run from repo root:

```bash
pnpm dev:api
```

```bash
pnpm dev:admin
```

```bash
pnpm dev:field
```

## Core commands

### Local development

```bash
pnpm dev:api
pnpm dev:admin
pnpm dev:field
```

### Production builds

```bash
pnpm build:api
pnpm build:admin
pnpm build:field
```

### Database tasks

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed-admin
```

## Developer workflow

The full setup, branch flow, testing flow, merge flow, release flow, and deployment runbook live here:

- `docs/DEVELOPER-RUNBOOK.md`

## Working rules

- Prefer `apps/admin-web-next` for admin UI work
- Prefer `apps/field-web-next` for field UI work
- Prefer `apps/api` for backend, data, and schema work
- Avoid touching legacy Vite apps unless the task is explicitly legacy-related
- Keep changes narrow and controlled
- Prefer one release concern at a time

## Release targets

- Admin frontend -> Vercel
- Field frontend -> Vercel
- API -> Railway
- Database -> Neon
- Schema/migrations -> Drizzle through the API workflow