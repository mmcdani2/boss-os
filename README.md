# BossOS Monorepo

BossOS is the internal monorepo for the live admin app, live field app, and API.

## 1. What is live

These are the active apps and the only normal release targets:

- `apps/admin-web-next`
- `apps/field-web-next`
- `apps/api`

These older Vite apps are legacy only:

- `apps/admin-web`
- `apps/field-web`

Do not build new feature work in the legacy Vite apps unless the task is explicitly about legacy comparison, archival, or recovery.

## 2. First-day developer setup

### Prerequisites

Install:

- Node.js
- pnpm
- Git

### Install dependencies

From repo root:

```bash
pnpm install
```

### Environment variables

Before running the apps, make sure the required environment variables are present for:

- `apps/admin-web-next`
- `apps/field-web-next`
- `apps/api`

At minimum, verify the frontend apps point to the correct API base URL and the API points to the correct database and auth secrets.

## 3. Main commands from repo root

### Run apps locally

Admin app:
```bash
pnpm dev:admin
```

Field app:
```bash
pnpm dev:field
```

API:
```bash
pnpm dev:api
```

### Build apps locally

Admin app:
```bash
pnpm build:admin
```

Field app:
```bash
pnpm build:field
```

API:
```bash
pnpm build:api
```

### Database commands

Generate a Drizzle migration:
```bash
pnpm db:generate
```

Apply a Drizzle migration:
```bash
pnpm db:migrate
```

Seed the admin user:
```bash
pnpm db:seed-admin
```

## 4. Branch workflow

### Starting work

Fetch the latest remote state:

```bash
git fetch origin --prune
```

Switch to development:

```bash
git switch development
```

If your local `development` branch does not exist yet:

```bash
git switch -c development --track origin/development
```

Pull the latest `development` branch:

```bash
git pull origin development
```

### Keep development current with main

Before or during active work, make sure `development` contains the latest `main`:

```bash
git fetch origin --prune
git switch development
git pull origin development
git merge origin/main
```

Push the updated development branch if needed:

```bash
git push origin development
```

## 5. Normal development flow

1. Start from `development`
2. Make one controlled change at a time
3. Prefer the live apps:
   - `apps/admin-web-next`
   - `apps/field-web-next`
   - `apps/api`
4. Avoid touching legacy apps unless the task is specifically legacy-related
5. Run the local checks for the app you changed
6. Commit narrow, reviewable changes

## 6. Testing before merge

### Frontend checks

If you changed the admin app:

```bash
pnpm build:admin
```

If you changed the field app:

```bash
pnpm build:field
```

### API checks

If you changed the API:

```bash
pnpm build:api
```

If you changed schema/data access code, also verify:

- the API still boots cleanly
- the database connection still works
- auth/login still works
- the affected endpoint or workflow still works

### Manual smoke testing

Admin app:
- login works
- protected routes load
- dashboard renders
- shell/navigation renders correctly

Field app:
- login works
- protected routes load
- shell/navigation renders correctly
- changed workflow works on desktop and mobile viewport

API:
- service boots
- auth path works
- a known protected flow still works
- changed endpoints behave correctly

## 7. Merge flow back to main

After testing is complete and `development` is ready, merge back into `main`.

Fetch latest remote state:

```bash
git fetch origin --prune
```

Update `development` one more time if needed:

```bash
git switch development
git pull origin development
git merge origin/main
```

Switch to main:

```bash
git switch main
```

Pull latest main:

```bash
git pull origin main
```

Merge development into main:

```bash
git merge development
```

Push main:

```bash
git push origin main
```

## 8. Release workflow

BossOS uses a simple manual release process.

### What to version

Use semantic versioning:

- patch = fixes, cleanup, non-breaking small improvements
- minor = new backward-compatible features
- major = breaking changes

Recommended pattern:

- root `package.json` = repo milestone/version marker
- app `package.json` = app release version

### Normal release steps

1. Confirm the app that changed
2. Run the build/test checks
3. Bump the version for the app being released
4. Optionally bump the root repo version
5. Commit the version change
6. Merge tested work into `main`
7. Push `main`
8. Confirm deployment on the correct platform
9. Smoke test production

### Example release commit messages

- `chore(release): bump admin-web-next to 0.0.2`
- `chore(release): bump field-web-next to 0.0.2`
- `chore(release): bump api to 0.0.2`
- `chore(release): bump boss-os repo to 0.0.2`

## 9. Deployment runbook

### Vercel

Vercel is for the live Next frontends only:

- `apps/admin-web-next`
- `apps/field-web-next`

#### Frontend deploy flow

1. Confirm the correct frontend app changed
2. Run the local build
3. Bump version if this is a real release
4. Commit and push to the branch used by the connected Vercel project
5. Open Vercel and verify the correct project deployed
6. Verify the project root directory is correct:
   - admin -> `apps/admin-web-next`
   - field -> `apps/field-web-next`
7. Verify required environment variables are present
8. Open the live site and smoke test

### Railway

Railway is for the backend service:

- `apps/api`

#### API deploy flow

1. Confirm the change is in `apps/api`
2. Run the local API verification flow
3. Bump version if this is a real release
4. Commit and push to the branch connected to Railway
5. Open Railway and verify the correct service deployed
6. Verify environment variables and secrets are present
7. Verify the database connection settings are correct
8. Check deploy logs for startup or runtime failures
9. Hit a known-good API path or run your normal auth/API smoke test

## 10. Database workflow

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

1. Change schema in code under the API
2. Generate the migration:
   ```bash
   pnpm db:generate
   ```
3. Review the migration SQL carefully
4. Confirm the target database/environment
5. Apply the migration:
   ```bash
   pnpm db:migrate
   ```
6. Verify the API still boots and the affected flow still works
7. Seed admin if needed:
   ```bash
   pnpm db:seed-admin
   ```

### Database safety checklist

Before running schema work, verify:

- correct Neon project
- correct database/environment
- correct connection string
- whether the migration is destructive
- whether backfill or seed work is needed
- whether the frontend and API expect the old shape

## 11. Operational guardrails

- Do not release legacy Vite apps by accident
- Do not make broad changes when a narrow change will do
- Do not mix unrelated schema work with unrelated frontend cleanup
- Do not assume Vercel, Railway, or Neon settings are correct after repo or branch changes
- Prefer one controlled change at a time
- Prefer one controlled release at a time