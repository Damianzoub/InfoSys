const express = require('express');
const multer = require('multer');
const db = require('../db'); // Σύνδεση με τη βάση δεδομένων
const { requireRole } = require('../middleware/auth'); // Ελέγχει ρόλους χρηστών

const router = express.Router();

// ── Στήσιμο του Multer για ανέβασμα φωτογραφιών (για αργότερα) ──
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ── 1. GET /api/pets ─────────────────────────────────────────
// Επιστρέφει όλα τα διαθέσιμα ζώα. Δέχεται και φίλτρα αναζήτησης!
router.get('/', async (req, res, next) => {
    try {
        // Παίρνουμε τα φίλτρα από το URL (π.χ. ?species=dog&age=2)
        const { species, age, gender, location } = req.query;

        // Το βασικό μας ερώτημα SQL (query). Ενώνει 3 πίνακες: pets, shelters, photos
        let queryText = `
            SELECT 
                pets.id, pets.name, pets.species, pets.breed, pets.age, pets.gender, pets.location, pets.status,
                shelters.name AS shelter_name,
                photos.url AS primary_photo
            FROM pets
            JOIN shelters ON pets.shelter_id = shelters.id
            LEFT JOIN photos ON photos.pet_id = pets.id AND photos.is_primary = TRUE
            WHERE pets.status = 'available'
        `;
        
        const queryParams = [];
        let paramIndex = 1;

        // --- Εφαρμογή Φίλτρων (αν ο χρήστης έβαλε κάποιο) ---
        if (species) {
            queryText += ` AND pets.species = $${paramIndex}`;
            queryParams.push(species);
            paramIndex++;
        }
        if (gender) {
            queryText += ` AND pets.gender = $${paramIndex}`;
            queryParams.push(gender);
            paramIndex++;
        }
        if (age) {
            queryText += ` AND pets.age <= $${paramIndex}`; // Ζώα μέχρι αυτή την ηλικία
            queryParams.push(age);
            paramIndex++;
        }
        if (location) {
            queryText += ` AND pets.location ILIKE $${paramIndex}`; // ILIKE για να μην νοιάζεται για κεφαλαία/μικρά
            queryParams.push(`%${location}%`);
            paramIndex++;
        }

        queryText += ` ORDER BY pets.created_at DESC`; // Τα πιο πρόσφατα πρώτα

        // Εκτελούμε την εντολή στη βάση δεδομένων
        const result = await db.query(queryText, queryParams);

        // Στέλνουμε πίσω στον χρήστη τα αποτελέσματα σε μορφή JSON
        res.json(result.rows);
    } catch (err) {
        next(err); // Αν γίνει λάθος, το στέλνουμε στον errorHandler του Δαμιανού
    }
});

// Εξάγουμε το router για να το δει το app.js
module.exports = router;
