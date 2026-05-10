const express = require('express');
const db = require('../db');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
// Return platform-wide statistics (admin only)
router.get('/stats', ...requireRole('admin'), async (req, res, next) => {
    try {
        const [usersRes, sheltersRes, petsRes, adoptionsRes] = await Promise.all([
            db.query(`SELECT COUNT(*) AS count FROM users WHERE role = 'user'`),
            db.query(`SELECT COUNT(*) AS count FROM shelters`),
            db.query(`SELECT COUNT(*) AS count FROM pets`),
            db.query(`
                SELECT
                    COUNT(*)                                          AS total,
                    COUNT(*) FILTER (WHERE status = 'pending')       AS pending,
                    COUNT(*) FILTER (WHERE status = 'approved')      AS approved,
                    COUNT(*) FILTER (WHERE status = 'rejected')      AS rejected
                FROM adoption_requests
            `),
        ]);

        const adoptions = adoptionsRes.rows[0];

        res.json({
            users:     parseInt(usersRes.rows[0].count, 10),
            shelters:  parseInt(sheltersRes.rows[0].count, 10),
            pets:      parseInt(petsRes.rows[0].count, 10),
            adoptions: {
                total:    parseInt(adoptions.total, 10),
                pending:  parseInt(adoptions.pending, 10),
                approved: parseInt(adoptions.approved, 10),
                rejected: parseInt(adoptions.rejected, 10),
            },
        });
    } catch (err) {
        next(err);
    }
});

// ── GET /api/admin/report ─────────────────────────────────────────────────────
// Full data dump for reporting (admin only)
router.get('/report', ...requireRole('admin'), async (req, res, next) => {
    try {
        const [sheltersRes, adoptionsRes] = await Promise.all([
            // Per-shelter summary
            db.query(`
                SELECT
                    s.id,
                    s.name,
                    s.city,
                    COUNT(DISTINCT p.id)                                          AS total_pets,
                    COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'approved')   AS total_adoptions
                FROM shelters s
                LEFT JOIN pets             p  ON p.shelter_id  = s.id
                LEFT JOIN adoption_requests ar ON ar.shelter_id = s.id
                GROUP BY s.id, s.name, s.city
                ORDER BY s.name
            `),
            // 50 most recent adoption requests
            db.query(`
                SELECT
                    ar.id,
                    p.name  AS pet_name,
                    s.name  AS shelter_name,
                    u.name  AS applicant_name,
                    ar.status,
                    ar.created_at
                FROM adoption_requests ar
                JOIN pets     p ON p.id = ar.pet_id
                JOIN shelters s ON s.id = ar.shelter_id
                JOIN users    u ON u.id = ar.user_id
                ORDER BY ar.created_at DESC
                LIMIT 50
            `),
        ]);

        res.json({
            generated_at:      new Date().toISOString(),
            shelters:          sheltersRes.rows.map(r => ({
                id:               r.id,
                name:             r.name,
                city:             r.city,
                total_pets:       parseInt(r.total_pets, 10),
                total_adoptions:  parseInt(r.total_adoptions, 10),
            })),
            recent_adoptions:  adoptionsRes.rows,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
