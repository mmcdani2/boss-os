$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  $fullPath = Join-Path (Get-Location).Path $Path
  $dir = Split-Path $fullPath -Parent
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($fullPath, $Content, $utf8NoBom)
}

$readme = @'
# 🧰 BossOS

> *Operational software for the business behind Urban Mechanical and Urban Spray Foam.*

BossOS is the internal monorepo for the live admin app, live field app, and API that now power the post-migration system.

---

## 📚 Table of Contents

- [🌟 Highlights](#-highlights)
- [ℹ️ Overview](#ℹ️-overview)
- [🗂️ Repository Structure](#️-repository-structure)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Core Commands](#️-core-commands)
- [🧭 Developer Workflow](#-developer-workflow)
- [📦 Release Targets](#-release-targets)
- [📖 Documentation Map](#-documentation-map)
- [🧱 Legacy Note](#-legacy-note)

---

## 🌟 Highlights

- ✅ Live Next.js admin and field apps
- ✅ Dedicated API service for auth, records, and operational workflows
- ✅ Clear live-versus-legacy boundary after migration
- ✅ Root-level helper scripts for local development, builds, and database tasks
- ✅ Release and deployment workflow documented for Vercel, Railway, Neon, and Drizzle

---

## ℹ️ Overview

BossOS is the operational platform for the business behind Urban Mechanical and Urban Spray Foam. The repository now centers on the migrated Next.js frontends and the API service, while the older Vite apps are retained only for controlled reference.

The goal of this repo is straightforward: keep the live system stable, keep boundaries clear, and make normal development, testing, and release work easy to follow.

<details>
<summary><strong>Why this repo is structured this way</strong></summary>

The migration is complete for the live admin and field apps, but legacy Vite apps are still retained for fallback reference and controlled cleanup. That means this repo has two responsibilities:

1. support normal work in the live apps
2. preserve enough legacy context to avoid reckless cleanup

</details>

---

## 🗂️ Repository Structure

### ✅ Live apps

These are the active application surfaces and the only normal release targets:

- `apps/admin-web-next`
- `apps/field-web-next`
- `apps/api`

### 🧱 Legacy apps

These older Vite apps are retained for controlled reference only:

- `apps/admin-web`
- `apps/field-web`

Do not build normal feature work in the legacy apps unless the task is explicitly about archival, migration comparison, or recovery.

<details>
<summary><strong>Tech stack</strong></summary>

- Next.js for the live admin and field frontends
- React and TypeScript across the frontend apps
- Express and TypeScript for the API
- Vercel for frontend deployment
- Railway for API deployment
- Neon for hosted Postgres
- Drizzle for schema and migration workflow
- pnpm for workspace package management

</details>

---

## 🚀 Quick Start

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

> Exact env filenames still need to be filled in from the real repo. Do not guess them.

### 3. Start the system locally

Recommended startup order:

1. API
2. Admin app
3. Field app

```bash
pnpm dev:api
pnpm dev:admin
pnpm dev:field
```

<details>
<summary><strong>Why this startup order matters</strong></summary>

Both frontends depend on the API for auth and data. Starting the backend first avoids fake frontend failures caused by a dead API.

</details>

---

## 🛠️ Core Commands

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

---

## 🧭 Developer Workflow

A new developer should follow this order:

1. install dependencies
2. configure environment variables
3. start the API first
4. start the admin or field app
5. switch to `development`
6. pull latest `development`
7. merge latest `main` into `development`
8. make one controlled change
9. run the correct build/test checks
10. merge back to `main` after validation
11. release the affected app

The full branch, testing, merge, deployment, and database workflow lives in the runbook below.

---

## 📦 Release Targets

- Admin frontend → Vercel
- Field frontend → Vercel
- API → Railway
- Database → Neon
- Schema and migrations → Drizzle through the API workflow

<details>
<summary><strong>Versioning approach</strong></summary>

Use semantic versioning:

- patch = fixes and cleanup
- minor = backward-compatible features
- major = breaking changes

Recommended pattern:

- root `package.json` = repo milestone/version marker
- app `package.json` = app release version

</details>

---

## 📖 Documentation Map

- Developer runbook: `docs/DEVELOPER-RUNBOOK.md`

That runbook covers:

- branch workflow
- testing flow
- merge flow
- release flow
- Vercel workflow
- Railway workflow
- Neon workflow
- Drizzle workflow

---

## 🧱 Legacy Note

Legacy Vite apps remain in the repo for controlled reference only. Keep cleanup deliberate. Prefer archival or isolation over blind deletion when risk exists.

---

## 🤝 Working Rules

- Prefer `apps/admin-web-next` for admin UI work
- Prefer `apps/field-web-next` for field UI work
- Prefer `apps/api` for backend, data, and schema work
- Avoid touching legacy Vite apps unless the task is explicitly legacy-related
- Keep changes narrow and controlled
- Prefer one release concern at a time
'@

Write-Utf8NoBom -Path "README.md" -Content $readme

Write-Host "Updated README.md with a polished template-style front door"
