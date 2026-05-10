require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static uploads ───────────────────────────────────────────────────────────
const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadDir));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// ── Routes (added per phase) ──────────────────────────────────────────────────
// Phase 1: mount /api/auth, /api/pets, /api/adoptions, /api/shelter, /api/admin

// Step 5 — Ιωάννης: Adoption requests + Admin stats/report
const adoptionsRouter = require('./routes/adoptions');
const adminRouter     = require('./routes/admin');

app.use('/api/adoptions', adoptionsRouter);
app.use('/api/admin',     adminRouter);

// Step 4 — Χρήστος: /api/pets + /api/shelter (pending)
// app.use('/api/pets',    require('./routes/pets'));
// app.use('/api/shelter', require('./routes/shelter'));

// Step 0 — Δαμιανός: /api/auth (pending)
// app.use('/api/auth',   require('./routes/auth'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
