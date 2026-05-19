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

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/pets',      require('./routes/pets'));
app.use('/api/shelter',   require('./routes/shelter'));
app.use('/api/adoptions', require('./routes/adoptions'));
app.use('/api/admin',     require('./routes/admin'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
