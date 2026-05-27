const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, role = 'user', shelter_name, shelter_city, shelter_phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email and password are required' });
        }

        const validRoles = ['user', 'shelter', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'role must be user, shelter, or admin' });
        }

        if (role === 'shelter' && !shelter_name) {
            return res.status(400).json({ error: 'shelter_name is required when role is shelter' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const userResult = await db.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role, created_at`,
            [name, email, password_hash, role]
        );
        const user = userResult.rows[0];

        if (role === 'shelter') {
            await db.query(
                `INSERT INTO shelters (user_id, name, city, phone)
                 VALUES ($1, $2, $3, $4)`,
                [user.id, shelter_name, shelter_city || null, shelter_phone || null]
            );
        }

        res.status(201).json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already in use' });
        }
        next(err);
    }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        const result = await db.query(
            'SELECT id, name, email, role, password_hash FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        next(err);
    }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res, next) => {
    try {
        const userResult = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        const adoptionsResult = await db.query(
            `SELECT ar.id, ar.pet_id, p.name AS pet_name, s.name AS shelter_name, ar.status, ar.created_at
             FROM adoption_requests ar
             JOIN pets     p ON p.id = ar.pet_id
             JOIN shelters s ON s.id = ar.shelter_id
             WHERE ar.user_id = $1
             ORDER BY ar.created_at DESC`,
            [req.user.id]
        );

        res.json({ ...user, adoption_requests: adoptionsResult.rows });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
