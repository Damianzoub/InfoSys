# Setup Guide — Pet Adoption Platform

## Quick start

After cloning the repo, run the setup script once from the project root:

```bash
bash setup.sh
```

This handles everything automatically (see details below).

---

## What the script does

### Step 1 — Backend dependencies

```bash
cd backend
npm install
```

Installs all Express packages declared in `backend/package.json`:

| Package | Purpose |
|---|---|
| `express` | HTTP server / routing |
| `cors` | Allow cross-origin requests from the React frontend |
| `dotenv` | Load environment variables from `.env` |
| `jsonwebtoken` | Sign and verify JWT tokens |
| `bcryptjs` | Hash user passwords |
| `multer` | Handle photo file uploads |
| `pg` | PostgreSQL client |
| `nodemon` *(dev)* | Auto-restart server on file changes |

### Step 2 — Backend `.env`

If `backend/.env` does not exist yet, the script copies `backend/.env.example` automatically.

> Open `backend/.env` and fill in the required values before running the server.

```env
PORT=8000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pet_adoption_db
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
```

### Step 3 — Frontend dependencies

If `frontend/package.json` exists, the script runs `npm install` inside `frontend/` automatically.

If the frontend has not been initialised yet (Phase 1), the script prints the commands to do it:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom
```

Frontend packages:

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP requests to the backend API |

---

## After setup — next steps

```bash
# 1. Edit environment variables
nano backend/.env        # set DATABASE_URL and JWT_SECRET

# 2. Start PostgreSQL via Docker
docker-compose up -d postgres

# 3. Initialise the database schema (run once)
cd backend
npm run db:init

# 4. Start the backend in dev mode
npm run dev
```

The backend will be available at `http://localhost:8000`.  
Health check: `http://localhost:8000/health`

---

## Running with Docker Compose (full stack)

```bash
docker-compose up --build
```

Services started:

- `backend` → `http://localhost:8000`
- `postgres` → `localhost:5432`

---

## Troubleshooting

**`npm install` fails** — make sure Node.js ≥ 18 is installed: `node -v`

**DB connection error** — verify PostgreSQL is running and `DATABASE_URL` in `.env` is correct.

**Port already in use** — change `PORT` in `backend/.env`.

**Uploads not saving** — make sure the `backend/uploads/` directory exists (the repo includes a `.gitkeep` to ensure this).
