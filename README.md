# Pet Adoption Platform 🐾

[![Pet Adoption CI/CD Pipeline](https://github.com/Damianzoub/InfoSys/actions/workflows/pipeline.yml/badge.svg)](https://github.com/Damianzoub/InfoSys/actions/workflows/pipeline.yml)

Ακαδημαϊκό project για το μάθημα **Μεθοδολογίες Ανάπτυξης Πληροφοριακών Συστημάτων** — Sprint 3.  
Πλήρης web εφαρμογή υιοθεσίας κατοικίδιων ζώων με CI/CD pipeline και cloud deployment.

---

## 🌐 Live Deployment

| Service | URL |
|---|---|
| **Frontend** | https://infosys-production-e27a.up.railway.app |
| **Backend API** | https://pet-adoption-frontend-production-c743.up.railway.app |
| **Health Check** | https://pet-adoption-frontend-production-c743.up.railway.app/health |

---

## 👥 Ομάδα

| Όνομα | ΑΜ | Ρόλος | Branch |
|---|---|---|---|
| Δαμιανός Ζούμπος | Ε22056 | Scrum Master | `feature/auth` |
| Κλαυδιανός Άγγελος | Ε22081 | Team Member | `feature/pet-browse` |
| Αλεσία Γκίνι | Ε22043 | Team Member | `feature/auth-ui` |
| Χρήστος Μπινάς | Ε22114 | Team Member | `feature/shelter` |
| Ιωάννης Ταχμαζίδης | Ε22164 | Team Member | `feature/adoption-admin` |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + React Router + Axios + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL 16 |
| Auth | JWT + bcrypt |
| DevOps | Docker + Docker Compose + GitHub Actions |
| Hosting | Railway |
| Code Quality | ESLint + Prettier |

---

## 🔄 CI/CD Pipeline

The pipeline runs automatically on every push to `main` and on Pull Requests.

**Stages:**
1. **Install & Test** — `npm ci` + Jest (unit & integration tests with coverage)
2. **Frontend Build** — `npm run build` (Vite production build)
3. **Lint** — ESLint checks for code errors
4. **Format Check** — Prettier enforces consistent code style
5. **Deploy** — Railway auto-deploys from `main` on every push

Pipeline config: [`.github/workflows/pipeline.yml`](.github/workflows/pipeline.yml)

---

## 🚀 Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 22+

### Run with Docker Compose

```bash
git clone https://github.com/Damianzoub/InfoSys.git
cd InfoSys

cp backend/.env.example backend/.env
# Edit backend/.env with your values

docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| PostgreSQL | localhost:5432 |

### Initialize the database

```bash
# Run once after first docker compose up
docker compose exec backend node scripts/db-init.js

# Optional: seed with sample data
docker compose exec backend node scripts/seed.js
```

---

## 🧪 Running Tests

```bash
cd backend
npm ci
npm test              # run tests
npm run test:ci       # run with coverage (used in CI)
```

---

## 📁 Project Structure

```
InfoSys/
├── .github/workflows/
│   └── pipeline.yml          # CI/CD pipeline
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── db/
│   │   │   ├── index.js
│   │   │   └── schema.sql
│   │   ├── middleware/
│   │   └── routes/
│   ├── scripts/
│   │   ├── db-init.js
│   │   └── seed.js
│   ├── Dockerfile
│   └── railway.toml
├── frontend/
│   ├── src/
│   ├── Caddyfile
│   └── package.json
├── docs/
│   ├── api-spec.md
│   ├── continuous-delivery.md
│   ├── code-quality-E22043.md
│   ├── devops-strategy-E22164.md
│   └── prompts-E22056.md
├── docker-compose.yml
└── render.yaml
```

---

## 🔑 Test Accounts (after seeding)

| Email | Password | Ρόλος | Τι κάνει |
|---|---|---|---|
| `shelter1@test.com` | `password123` | shelter | Διαχείριση ζώων, έγκριση/απόρριψη αιτήσεων |
| `shelter2@test.com` | `password123` | shelter | Διαχείριση ζώων, έγκριση/απόρριψη αιτήσεων |
| *(εγγραφή μέσω UI)* | — | user | Αναζήτηση ζώων, υποβολή αιτήσεων υιοθεσίας |

---

## 📄 Documentation

- [API Specification](docs/api-spec.md)
- [Continuous Delivery](docs/continuous-delivery.md)
- [CI/CD Strategy](docs/ci_cd.md)
- [Code Quality — E22043](docs/code-quality-E22043.md)
- [DevOps Strategy — E22164](docs/devops-strategy-E22164.md)
