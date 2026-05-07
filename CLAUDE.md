# CLAUDE.md — Pet Adoption Platform

## Project Overview

Academic project for "Μεθοδολογίες Ανάπτυξης Πληροφοριακών Συστημάτων", Sprint 3.
A full-stack pet adoption web app.

## Tech Stack

| Layer     | Technology                                     |
|-----------|------------------------------------------------|
| Frontend  | React 18 + React Router + Axios                |
| Backend   | Node.js + Express                              |
| Database  | PostgreSQL                                     |
| Auth      | JWT + bcrypt                                   |
| DevOps    | Docker + Docker Compose + GitHub Actions (CI)  |
| Hosting   | localhost / Docker                             |

## Team & Branches

| Name               | AM     | Role         | Branch                  |
|--------------------|--------|--------------|-------------------------|
| Δαμιανός Ζούμπος   | Ε22056 | Scrum Master | `feature/auth`          |
| Κλαυδιανός Άγγελος | Ε22081 | Team Member  | `feature/pet-browse`    |
| Αλεσία Γκίνι       | Ε22043 | Team Member  | `feature/auth-ui`       |
| Χρήστος Μπινάς     | Ε22114 | Team Member  | `feature/shelter`       |
| Ιωάννης Ταχμαζίδης | Ε22164 | Team Member  | `feature/adoption-admin`|

## Project Structure

```
InfoSys/
├── backend/
│   ├── src/
│   │   ├── app.js            # Express app + middleware
│   │   ├── server.js         # Entry point
│   │   ├── db/
│   │   │   ├── index.js      # pg Pool
│   │   │   └── schema.sql    # CREATE TABLE definitions
│   │   ├── middleware/
│   │   │   ├── auth.js       # JWT verify
│   │   │   └── errorHandler.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── pets.js
│   │       ├── adoptions.js
│   │       ├── shelter.js
│   │       └── admin.js
│   ├── uploads/              # multer destination (gitignored)
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── docs/
│   └── api-spec.md           # Canonical API contract
├── docker-compose.yml
├── DEVELOPMENT_ORDER.md
└── SPRINT3_PLANNING.md
```

## Key Conventions

- **No direct push to `main`** — always via Pull Request reviewed by Scrum Master (Δαμιανός).
- Commit format: `feat(scope): message` / `fix(scope): message` / `docs(scope): message`
- Each PR references the Jira task ID (e.g., `Closes PB-13`).
- Frontend uses **mock JSON** until the backend endpoint is ready (see `docs/api-spec.md`).
- Each team member documents their Coding Agent prompts in `docs/prompts-<AM>.md`.

## Backend Environment Variables

See `backend/.env.example`. Key vars:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — secret for signing tokens
- `PORT` — default 8000
- `UPLOAD_DIR` — multer destination (default `uploads/`)

## Development Order

See `DEVELOPMENT_ORDER.md`. **Phase 0 must be complete before anyone writes feature code.**

- Βήμα 1 — DB schema (`backend/src/db/schema.sql`)
- Βήμα 2 — Express skeleton + middleware
- Βήμα 3 — API spec (`docs/api-spec.md`)
