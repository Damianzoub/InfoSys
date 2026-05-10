const express = require('express');
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ── POST /api/adoptions ───────────────────────────────────────────────────────
// Submit an adoption request (authenticated user only)
router.post('/', requireAuth, async (req, res, next) => {
    try {
        const { pet_id, message } = req.body;
        const user_id = req.user.id;

        if (!pet_id) {
            return res.status(400).json({ error: 'pet_id is required' });
        }

        // Fetch the pet to get its shelter_id and confirm it's available
        const petResult = await db.query(
            'SELECT id, shelter_id, status FROM pets WHERE id = $1',
            [pet_id]
        );

        if (petResult.rows.length === 0) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        const pet = petResult.rows[0];

        if (pet.status !== 'available') {
            return res.status(409).json({ error: 'Pet is not available for adoption' });
        }

        // Insert — the unique index adoption_requests_open_uq will raise a conflict
        // if the user already has a pending request for this pet.
        const result = await db.query(
            `INSERT INTO adoption_requests (user_id, pet_id, shelter_id, message)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, pet_id, shelter_id, status, message, created_at`,
            [user_id, pet_id, pet.shelter_id, message || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Unique index violation → duplicate pending request
        if (err.code === '23505') {
            return res.status(409).json({ error: 'You already have a pending request for this pet' });
        }
        next(err);
    }
});

// ── GET /api/adoptions/user ───────────────────────────────────────────────────
// Return all adoption requests made by the logged-in user
router.get('/user', requireAuth, async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT
                ar.id,
                ar.pet_id,
                p.name          AS pet_name,
                ph.url          AS pet_photo,
                s.name          AS shelter_name,
                ar.status,
                ar.created_at
             FROM adoption_requests ar
             JOIN pets     p  ON p.id  = ar.pet_id
             JOIN shelters s  ON s.id  = ar.shelter_id
             LEFT JOIN photos ph ON ph.pet_id = ar.pet_id AND ph.is_primary = TRUE
             WHERE ar.user_id = $1
             ORDER BY ar.created_at DESC`,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

// ── GET /api/adoptions/shelter ────────────────────────────────────────────────
// Return all pending adoption requests for the logged-in shelter's pets
router.get('/shelter', ...requireRole('shelter'), async (req, res, next) => {
    try {
        // Get the shelter record that belongs to this user
        const shelterResult = await db.query(
            'SELECT id FROM shelters WHERE user_id = $1',
            [req.user.id]
        );

        if (shelterResult.rows.length === 0) {
            return res.status(404).json({ error: 'Shelter profile not found for this account' });
        }

        const shelter_id = shelterResult.rows[0].id;

        const result = await db.query(
            `SELECT
                ar.id,
                ar.pet_id,
                p.name          AS pet_name,
                u.name          AS applicant_name,
                u.email         AS applicant_email,
                ar.message,
                ar.status,
                ar.created_at
             FROM adoption_requests ar
             JOIN pets  p ON p.id = ar.pet_id
             JOIN users u ON u.id = ar.user_id
             WHERE ar.shelter_id = $1
             ORDER BY ar.created_at DESC`,
            [shelter_id]
        );

        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

// ── PUT /api/adoptions/:id ────────────────────────────────────────────────────
// Approve or reject an adoption request (shelter only)
router.put('/:id', ...requireRole('shelter'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'status must be "approved" or "rejected"' });
        }

        // Verify the request exists and belongs to this shelter
        const shelterResult = await db.query(
            'SELECT id FROM shelters WHERE user_id = $1',
            [req.user.id]
        );

        if (shelterResult.rows.length === 0) {
            return res.status(404).json({ error: 'Shelter profile not found for this account' });
        }

        const shelter_id = shelterResult.rows[0].id;

        const check = await db.query(
            'SELECT id FROM adoption_requests WHERE id = $1 AND shelter_id = $2',
            [id, shelter_id]
        );

        if (check.rows.length === 0) {
            // Either does not exist or belongs to another shelter
            const exists = await db.query('SELECT id FROM adoption_requests WHERE id = $1', [id]);
            return exists.rows.length === 0
                ? res.status(404).json({ error: 'Adoption request not found' })
                : res.status(403).json({ error: 'This request does not belong to your shelter' });
        }

        const result = await db.query(
            `UPDATE adoption_requests
             SET status = $1
             WHERE id = $2
             RETURNING id, status, updated_at`,
            [status, id]
        );

        // If approved, mark the pet as adopted and reject all other pending requests for it
        if (status === 'approved') {
            const adoptedRequest = result.rows[0];

            // Get pet_id from the request
            const reqRow = await db.query(
                'SELECT pet_id FROM adoption_requests WHERE id = $1',
                [adoptedRequest.id]
            );
            const pet_id = reqRow.rows[0].pet_id;

            await db.query(
                `UPDATE pets SET status = 'adopted' WHERE id = $1`,
                [pet_id]
            );

            // Reject every other pending request for the same pet
            await db.query(
                `UPDATE adoption_requests
                 SET status = 'rejected'
                 WHERE pet_id = $1 AND status = 'pending' AND id != $2`,
                [pet_id, adoptedRequest.id]
            );
        }

        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
