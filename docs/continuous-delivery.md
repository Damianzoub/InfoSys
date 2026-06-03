# Continuous Delivery / Deployment

## What is Continuous Delivery?

Continuous Delivery is the practice of keeping your codebase in a state where it can be deployed at any moment. Every time a developer pushes code, an automated pipeline runs, checks that everything works, packages the application, and gets it ready to ship — without anyone having to do it manually.

The idea is simple: the more you automate the path from code to production, the less room there is for human error, and the faster the team can move.

It's worth clarifying the difference between two terms that often get confused:

- **Continuous Delivery** — the pipeline automatically prepares and packages the app. A human decides when to deploy.
- **Continuous Deployment** — everything is automatic, including the final push to production.

This project uses Continuous Delivery. Every merge to `main` automatically builds and publishes a Docker image. Deploying it is then a deliberate step.

---

## How the Application is Packaged

The backend is packaged as a **Docker image** — essentially a self-contained snapshot of the application and everything it needs to run: the Node.js runtime, the installed dependencies, and the source code.

The reason we chose Docker is straightforward: it eliminates the "it works on my machine" problem. Whether the backend runs on a developer's laptop, a GitHub Actions runner, or a Railway server in California, it behaves exactly the same way.

The image is defined in [`backend/Dockerfile`](../backend/Dockerfile):

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/
COPY scripts/ ./scripts/

RUN mkdir -p uploads

EXPOSE 8000

CMD ["node", "src/server.js"]
```

A few decisions worth explaining:

- **`node:22-alpine`** — Alpine Linux is a minimal base image. It keeps the final image small (under 200 MB) and reduces the attack surface.
- **Copy `package.json` before source code** — Docker builds in layers. By installing dependencies before copying the source files, we avoid reinstalling all packages every time we change a line of code. Only a change to `package.json` triggers a full reinstall.
- **`npm ci --omit=dev`** — `npm ci` is stricter than `npm install`; it installs exactly what's in the lock file. `--omit=dev` strips test frameworks and development tools that have no place in a production image.

---

## How the Application is Delivered

We use two GitHub Actions workflows that each serve a different purpose.

### CI — Quality Gate (`ci.yml`)

This runs on every push to a feature branch and on every Pull Request targeting `main`. It makes sure nothing is broken before code reaches the main branch:

1. Installs dependencies with `npm ci`
2. Runs the full test suite with coverage (`jest --ci --coverage`)
3. Validates the `docker-compose.yml` file (`docker compose config`)
4. Uploads the coverage report as a build artifact

No broken code can reach `main` without passing these checks.

### CD — Build and Publish (`cd.yml`)

This runs only when code is merged to `main` — meaning it has already been reviewed and tested. It builds the Docker image and pushes it to the GitHub Container Registry (GHCR):

```
Developer merges PR to main
         │
         ▼
GitHub Actions starts cd.yml
         │
         ├── Checkout repository
         ├── Log in to GHCR (using GITHUB_TOKEN — no stored passwords)
         ├── Compute image tags: latest + sha-<commit>
         ├── Build Docker image from backend/Dockerfile
         └── Push image to ghcr.io/damianzoub/infosys/backend
```

Every image gets two tags:
- **`latest`** — always points to the most recent build
- **`sha-<commit>`** — an immutable reference tied to the exact commit. Useful if you ever need to roll back to a specific version.

---

## Deployment on Railway

We deployed the full application on [Railway](https://railway.app), a free cloud platform that supports Docker natively.

The live setup consists of three services running in the same Railway project:

| Service | Type | URL |
|---|---|---|
| **Backend** (Express API) | Docker container | `pet-adoption-frontend-production-c743.up.railway.app` |
| **PostgreSQL** | Managed database | Internal to Railway |
| **Frontend** (React/Vite) | Static site via Caddy | `infosys-production-e27a.up.railway.app` |

### How the backend is configured

The backend is defined in [`backend/railway.toml`](../backend/railway.toml):

```toml
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

Railway builds the Docker image directly from the Dockerfile, injects the `DATABASE_URL` from the managed PostgreSQL service automatically, and monitors the `/health` endpoint to confirm the app is running before routing traffic to it.

### How the frontend is served

The frontend is a standard Vite/React build. Railway detects it automatically, runs `npm run build`, and serves the resulting `dist/` folder through Caddy (a lightweight web server).

We added a [`frontend/Caddyfile`](../frontend/Caddyfile) to handle React Router:

```
:{$PORT:80} {
    root * /app/dist
    encode gzip
    try_files {path} /index.html
    file_server
}
```

Without `try_files`, refreshing any page other than `/` would return a 404, because the file doesn't exist on disk — React Router handles routing in the browser, not on the server.

### Environment variables and secrets

No secrets are hardcoded anywhere in the repository.

- `DATABASE_URL` is injected automatically by Railway when the PostgreSQL service is linked to the backend
- `JWT_SECRET` is set manually in the Railway dashboard (a randomly generated 64-character hex string)
- `VITE_API_BASE_URL` is a build-time variable on the frontend, pointing to the backend's Railway URL

### Database initialisation

The database schema is defined in [`backend/src/db/schema.sql`](../backend/src/db/schema.sql). After the first deployment, it was applied by temporarily running:

```bash
node scripts/db-init.js
```

This script connects to the database using the `pg` package and executes the schema SQL, creating all tables and indexes. Once the schema was in place, the normal server start command was restored.

---

## What This Looks Like End-to-End

```
Developer pushes code to a feature branch
         │
         ▼
ci.yml runs — tests pass, Docker Compose validates
         │
         ▼
Developer opens Pull Request → reviewed by Scrum Master
         │
         ▼
PR merged to main
         │
         ▼
cd.yml runs — Docker image built and pushed to GHCR
         │
         ▼
Railway detects new commit on main
         │
         ├── Backend: rebuilds Docker image, health check passes → Active
         └── Frontend: runs npm run build, Caddy serves dist/ → Active
                   │
                   ▼
         Application live at
         infosys-production-e27a.up.railway.app
```

---

## Key Takeaways

The main thing this setup achieves is that **deployment is no longer a manual, error-prone process**. Once the infrastructure is in place, getting code from a developer's machine to a live URL is entirely automatic — the only human steps are writing the code and approving the Pull Request.

A few concrete benefits:

- Every deployment is identical. There's no risk of one team member's machine producing a different result than another's.
- Rollback is always possible. Because every image is tagged with the commit hash, reverting to a previous version means pulling a specific tag.
- Secrets never touch the codebase. Railway and GitHub handle credentials at the platform level.
- The team can deploy as often as needed. There's no "deployment window" or manual checklist.

---

*Δαμιανός Ζούμπος — Ε22056 | Scrum Master*
*Μεθοδολογίες Ανάπτυξης Πληροφοριακών Συστημάτων — Sprint 3*
