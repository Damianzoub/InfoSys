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
// ── 2. GET /api/pets/:id ─────────────────────────────────────
// Επιστρέφει τα πλήρη στοιχεία ενός συγκεκριμένου ζώου (μαζί με το καταφύγιο και τις φωτογραφίες του)
router.get('/:id', async (req, res, next) => {
    try {
        const petId = req.params.id;

        // 1. Βρίσκουμε το ζώο και τα στοιχεία του καταφυγίου του
        const petQuery = `
            SELECT 
                pets.id, pets.name, pets.species, pets.breed, pets.age, pets.gender, 
                pets.description, pets.location, pets.status, pets.created_at,
                shelters.id AS shelter_id, shelters.name AS shelter_name, 
                shelters.city AS shelter_city, shelters.phone AS shelter_phone
            FROM pets
            JOIN shelters ON pets.shelter_id = shelters.id
            WHERE pets.id = $1
        `;
        const petResult = await db.query(petQuery, [petId]);

        // Αν δεν βρεθεί το ζώο στη βάση, επιστρέφουμε 404 (Σφάλμα)
        if (petResult.rows.length === 0) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        const petData = petResult.rows[0];

        // 2. Βρίσκουμε τις φωτογραφίες του ζώου από τον πίνακα photos
        const photosQuery = `SELECT id, url, is_primary FROM photos WHERE pet_id = $1`;
        const photosResult = await db.query(photosQuery, [petId]);

        // 3. Φτιάχνουμε το τελικό "πακέτο" δεδομένων όπως ακριβώς το ζητάει το api-spec.md της ομάδας
        const finalResponse = {
            id: petData.id,
            name: petData.name,
            species: petData.species,
            breed: petData.breed,
            age: Number(petData.age),
            gender: petData.gender,
            description: petData.description,
            location: petData.location,
            status: petData.status,
            created_at: petData.created_at,
            shelter: {
                id: petData.shelter_id,
                name: petData.shelter_name,
                city: petData.shelter_city,
                phone: petData.shelter_phone
            },
            photos: photosResult.rows
        };

        res.json(finalResponse);
    } catch (err) {
        next(err);
    }
});


// Εξάγουμε το router για να το δει το app.js
module.exports = router;
