# BossOS Developer Runbook

This document is the operational guide for developers working in the BossOS monorepo.

## 1. Purpose

Use this runbook to:

- get the project running locally
- work from the correct branch
- test changes safely
- merge work back into `main`
- release the correct app
- operate the Vercel, Railway, Neon, and Drizzle workflow cleanly

## 2. Live app boundaries

### Live applications

These are the active apps and normal release targets:

- `apps/admin-web-next`
- `apps/field-web-next`
- `apps/api`

### Legacy applications

These are legacy-only reference apps:

- `apps/admin-web`
- `apps/field-web`

Do not treat them as active release targets.

## 3. Prerequisites

Install the following first:

- Node.js
- pnpm
- Git

## 4. Install dependencies

From repo root:

```bash
pnpm install
```

## 5. Environment setup

Environment variables are required for:

- `apps/admin-web-next`
- `apps/field-web-next`
- `apps/api`

At minimum, verify:

- frontend apps point to the correct API base URL
- API points to the correct Neon database
- API auth secrets are present
- deployment-specific variables are set in the correct platform

### Remaining documentation gap

The exact local env file names were not provided in the repo review inputs. Add them here once confirmed from the real codebase.

Suggested section to complete later:

- admin app env filename: `TODO`
- field app env filename: `TODO`
- api env filename: `TODO`

## 6. Root commands

### Start local development

API:
```bash
pnpm dev:api
```

Admin:
```bash
pnpm dev:admin
```

Field:
```bash
pnpm dev:field
```

### Build locally

API:
```bash
pnpm build:api
```

Admin:
```bash
pnpm build:admin
```

Field:
```bash
pnpm build:field
```

### Database tasks

Generate migration:
```bash
pnpm db:generate
```

Apply migration:
```bash
pnpm db:migrate
```

Seed admin user:
```bash
pnpm db:seed-admin
```

## 7. Startup order

Recommended local startup order:

1. Start the API first
2. Start the admin app second
3. Start the field app third

Why:
- both frontends depend on the API
- auth and data requests should have a live backend ready first

## 8. Branch workflow

### Start from development

Fetch latest remote state:

```bash
git fetch origin --prune
```

Switch to `development`:

```bash
git switch development
```

If the local branch does not exist yet:

```bash
git switch -c development --track origin/development
```

Pull latest:

```bash
git pull origin development
```

## 9. Keep development current with main

Before or during active work, make sure `development` contains the latest `main`:

```bash
git fetch origin --prune
git switch development
git pull origin development
git merge origin/main
```

Push updated `development` if needed:

```bash
git push origin development
```

## 10. Normal development flow

1. Start from `development`
2. Make one controlled change at a time
3. Work in the live app that actually owns the change
4. Avoid legacy app edits unless the task explicitly requires them
5. Run the correct local validation
6. Commit narrow changes

## 11. Testing before merge

### If you changed the admin app

```bash
pnpm build:admin
```

Manual smoke checks:
- login works
- protected routes render
- dashboard loads
- shell/navigation renders correctly

### If you changed the field app

```bash
pnpm build:field
```

Manual smoke checks:
- login works
- protected routes render
- shell/navigation renders correctly
- changed workflow works on desktop and mobile viewport

### If you changed the API

```bash
pnpm build:api
```

Also verify:
- API boots cleanly
- database connection works
- auth/login path works
- changed endpoint or protected flow works

### If you changed schema/data access

Also verify:
- migration SQL looks correct
- target Neon environment is correct
- API still boots after migration
- affected app flow still works end to end

## 12. Merge flow back to main

When `development` is tested and ready:

Fetch latest remote state:

```bash
git fetch origin --prune
```

Update `development` again if needed:

```bash
git switch development
git pull origin development
git merge origin/main
```

Switch to `main`:

```bash
git switch main
```

Pull latest main:

```bash
git pull origin main
```

Merge `development` into `main`:

```bash
git merge development
```

Push `main`:

```bash
git push origin main
```

## 13. Release workflow

BossOS uses a manual release process.

### Versioning rule

Use semantic versioning:

- patch = fixes, cleanup, non-breaking improvements
- minor = backward-compatible features
- major = breaking changes

### What to version

Recommended pattern:

- root `package.json` = repo milestone/version marker
- app `package.json` = actual app release version

### Normal release steps

1. Confirm which app changed
2. Run build/test checks
3. Bump the changed app version
4. Optionally bump the root repo version
5. Commit the version change
6. Merge to `main`
7. Push `main`
8. Confirm the correct deployment
9. Smoke test production

### Example release commit messages

- `chore(release): bump admin-web-next to 0.0.2`
- `chore(release): bump field-web-next to 0.0.2`
- `chore(release): bump api to 0.0.2`
- `chore(release): bump boss-os repo to 0.0.2`

## 14. Deployment runbook

### Vercel

Vercel is for the live Next frontends only:

- `apps/admin-web-next`
- `apps/field-web-next`

#### Frontend release flow

1. Confirm the correct frontend app changed
2. Run the local build
3. Bump version if this is a real release
4. Commit and push to the branch connected to Vercel
5. Open Vercel and verify the correct project deployed
6. Confirm the project root directory is correct
   - admin -> `apps/admin-web-next`
   - field -> `apps/field-web-next`
7. Verify environment variables are present
8. Open the live site and smoke test

### Railway

Railway is for the backend service:

- `apps/api`

#### API release flow

1. Confirm the change is in `apps/api`
2. Run local API verification
3. Bump version if this is a real release
4. Commit and push to the branch connected to Railway
5. Open Railway and verify the correct service deployed
6. Verify secrets and environment variables
7. Verify database connection settings
8. Check deploy logs for startup/runtime issues
9. Hit a known-good endpoint or auth flow

## 15. Database workflow

### Neon

Neon is the hosted Postgres source of truth.

Use Neon for:

- managed Postgres hosting
- environment-specific database instances
- connection strings used by the API

Operational rules:

- do not make casual schema edits directly in Neon
- verify the exact environment before doing anything risky
- treat production Neon as controlled infrastructure

### Drizzle

Drizzle is the schema and migration workflow layer.

Use Drizzle for:

- schema definition in code
- migration generation
- migration review
- migration application

### Recommended schema change flow

1. Make the schema change in the API codebase
2. Generate the migration:
   ```bash
   pnpm db:generate
   ```
3. Review the generated SQL carefully
4. Confirm the target Neon environment/database
5. Apply the migration:
   ```bash
   pnpm db:migrate
   ```
6. Verify the API still boots
7. Verify the affected app flow still works
8. Seed admin if needed:
   ```bash
   pnpm db:seed-admin
   ```

### Database safety checklist

Before schema work, verify:

- correct Neon project
- correct database/environment
- correct connection string
- whether the migration is destructive
- whether backfill is required
- whether seed data is required
- whether frontend/API code still expects the old shape

## 16. Operational guardrails

- Do not release legacy Vite apps by accident
- Do not make broad changes when a narrow change will do
- Do not mix unrelated schema work with unrelated frontend cleanup
- Do not assume Vercel, Railway, or Neon settings are correct after repo or branch changes
- Prefer one controlled change at a time
- Prefer one controlled release at a time