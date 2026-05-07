#!/usr/bin/env bash
# setup.sh — run once after cloning the repo
# Usage: bash setup.sh

set -e

echo ""
echo "=== Pet Adoption Platform — Setup ==="
echo ""

# ── Backend ───────────────────────────────────────────────────────────────────
echo "[1/3] Installing backend dependencies..."
cd backend
npm install
cd ..
echo "      Done."

# ── Backend .env ──────────────────────────────────────────────────────────────
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "[2/3] Created backend/.env from .env.example"
    echo "      ⚠  Open backend/.env and set DATABASE_URL and JWT_SECRET before running."
else
    echo "[2/3] backend/.env already exists — skipped."
fi

# ── Frontend ──────────────────────────────────────────────────────────────────
if [ -f frontend/package.json ]; then
    echo "[3/3] Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo "      Done."
else
    echo "[3/3] frontend/ not initialised yet (Phase 1)."
    echo "      When ready, run:"
    echo "        npm create vite@latest frontend -- --template react"
    echo "        cd frontend && npm install && npm install axios react-router-dom"
fi

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Edit backend/.env  (DATABASE_URL, JWT_SECRET)"
echo "  2. Start PostgreSQL:  docker-compose up -d postgres"
echo "  3. Init DB schema:    cd backend && npm run db:init"
echo "  4. Start backend:     cd backend && npm run dev"
echo ""
