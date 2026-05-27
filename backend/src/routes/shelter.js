const express = require('express');
const db = require('../db');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/shelter/me ───────────────────────────────────────────────────────
router.get('/me', ...requireRole('shelter'), async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT s.id, s.name, s.address, s.city, s.phone, s.description, s.created_at
             FROM shelters s
             WHERE s.user_id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shelter profile not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

// ── PUT /api/shelter/me ───────────────────────────────────────────────────────
router.put('/me', ...requireRole('shelter'), async (req, res, next) => {
    try {
        const { name, address, city, phone, description } = req.body;

        const result = await db.query(
            `UPDATE shelters
             SET
                 name        = COALESCE($1, name),
                 address     = COALESCE($2, address),
                 city        = COALESCE($3, city),
                 phone       = COALESCE($4, phone),
                 description = COALESCE($5, description)
             WHERE user_id = $6
             RETURNING id, name, address, city, phone, description, created_at`,
            [name, address, city, phone, description, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shelter profile not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
