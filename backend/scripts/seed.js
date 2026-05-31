const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const db = require('../src/db');

async function seed() {
    console.log('Seeding database...');

    // ── Shelter user ────────────────────────────────────────────
    const passwordHash = await bcrypt.hash('shelter123', 10);

    const userRes = await db.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'shelter')
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        ['Καταφύγιο Αθήνας Admin', 'shelter.athina@petadopt.gr', passwordHash]
    );
    const userId = userRes.rows[0].id;

    const shelterRes = await db.query(
        `INSERT INTO shelters (user_id, name, address, city, phone, description)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [
            userId,
            'Καταφύγιο Αθήνας',
            'Λεωφόρος Αλεξάνδρας 45',
            'Αθήνα',
            '210-1234567',
            'Το μεγαλύτερο καταφύγιο ζώων στην Αττική. Φροντίζουμε σκύλους, γάτες και μικρά ζώα.',
        ]
    );
    const shelterId = shelterRes.rows[0].id;
    console.log(`  Shelter ready (id=${shelterId})`);

    // ── Second shelter ───────────────────────────────────────────
    const pw2 = await bcrypt.hash('shelter123', 10);
    const user2Res = await db.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'shelter')
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        ['SOS Animals Admin', 'sos.animals@petadopt.gr', pw2]
    );
    const shelter2Res = await db.query(
        `INSERT INTO shelters (user_id, name, address, city, phone, description)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [
            user2Res.rows[0].id,
            'SOS Animals Θεσσαλονίκη',
            'Εγνατία 112',
            'Θεσσαλονίκη',
            '2310-987654',
            'Φιλοζωική οργάνωση στη Θεσσαλονίκη με πάνω από 200 ζώα.',
        ]
    );
    const shelter2Id = shelter2Res.rows[0].id;
    console.log(`  Shelter 2 ready (id=${shelter2Id})`);

    // ── Pets ─────────────────────────────────────────────────────
    const pets = [
        // Shelter 1 — Αθήνα
        {
            shelter_id: shelterId,
            name: 'Ρεξ',
            species: 'dog',
            breed: 'Λαμπραντόρ',
            age: 2.0,
            gender: 'male',
            description: 'Ο Ρεξ είναι ένας φιλικός και εκπαιδευμένος σκύλος. Αγαπά τα παιδιά και τις βόλτες στο πάρκο. Ψάχνει για μια οικογένεια με κήπο.',
            location: 'Αθήνα',
        },
        {
            shelter_id: shelterId,
            name: 'Λούνα',
            species: 'cat',
            breed: 'Περσική',
            age: 1.5,
            gender: 'female',
            description: 'Η Λούνα είναι μια ήρεμη και ласкατая γάτα. Ιδανική για διαμέρισμα. Τα πάει πολύ καλά με άλλες γάτες.',
            location: 'Αθήνα',
        },
        {
            shelter_id: shelterId,
            name: 'Μπόμπι',
            species: 'dog',
            breed: 'Μπιγκλ',
            age: 3.0,
            gender: 'male',
            description: 'Ο Μπόμπι είναι ένα παιχνιδιάρικο Μπιγκλ με ατελείωτη ενέργεια. Χρειάζεται αρκετή άσκηση και αγαπά τη συντροφιά.',
            location: 'Πειραιάς',
        },
        {
            shelter_id: shelterId,
            name: 'Σνόουμπολ',
            species: 'rabbit',
            breed: 'Κουνέλι Angora',
            age: 0.5,
            gender: 'female',
            description: 'Η Σνόουμπολ είναι ένα μικροσκοπικό κουνελάκι Angora. Πολύ ήσυχη, ιδανική για παιδιά. Χρειάζεται καθημερινό χτένισμα.',
            location: 'Αθήνα',
        },
        {
            shelter_id: shelterId,
            name: 'Άρης',
            species: 'dog',
            breed: 'Γερμανικός Ποιμενικός',
            age: 4.0,
            gender: 'male',
            description: 'Ο Άρης είναι ένας έξυπνος και πιστός Γερμανικός Ποιμενικός. Εκπαιδευμένος σε βασικές εντολές. Ψάχνει για έναν ενεργό ιδιοκτήτη.',
            location: 'Αθήνα',
        },
        // Shelter 2 — Θεσσαλονίκη
        {
            shelter_id: shelter2Id,
            name: 'Μίλο',
            species: 'cat',
            breed: 'Μιξ',
            age: 2.0,
            gender: 'male',
            description: 'Ο Μίλο βρέθηκε στο δρόμο και αναζητά σπίτι. Είναι πολύ κοινωνικός και αγαπά να κάθεται στην αγκαλιά.',
            location: 'Θεσσαλονίκη',
        },
        {
            shelter_id: shelter2Id,
            name: 'Νάλα',
            species: 'dog',
            breed: 'Χρυσός Ρετρίβερ',
            age: 1.0,
            gender: 'female',
            description: 'Η Νάλα είναι ένα νεαρό και χαρούμενο Χρυσό Ρετρίβερ. Αγαπά το νερό, τα παιχνίδια και τους ανθρώπους. Ιδανική για οικογένεια.',
            location: 'Θεσσαλονίκη',
        },
        {
            shelter_id: shelter2Id,
            name: 'Μαύρος',
            species: 'cat',
            breed: 'Βρετανικός Κοντότριχος',
            age: 5.0,
            gender: 'male',
            description: 'Ο Μαύρος είναι ένας ώριμος και ήρεμος γάτος. Δεν χρειάζεται πολύ ενέργεια — αγαπά τον ύπνο και τις χάδια. Ιδανικός για ζευγάρια.',
            location: 'Θεσσαλονίκη',
        },
    ];

    let inserted = 0;
    for (const pet of pets) {
        const existing = await db.query(
            'SELECT id FROM pets WHERE name = $1 AND shelter_id = $2',
            [pet.name, pet.shelter_id]
        );
        if (existing.rows.length > 0) {
            console.log(`  Skipping "${pet.name}" (already exists)`);
            continue;
        }
        await db.query(
            `INSERT INTO pets (shelter_id, name, species, breed, age, gender, description, location)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [pet.shelter_id, pet.name, pet.species, pet.breed, pet.age, pet.gender, pet.description, pet.location]
        );
        console.log(`  Inserted pet: ${pet.name} (${pet.species})`);
        inserted++;
    }

    console.log(`\nDone. ${inserted} pets inserted.`);
    console.log('\nTest accounts:');
    console.log('  Shelter 1: shelter.athina@petadopt.gr / shelter123');
    console.log('  Shelter 2: sos.animals@petadopt.gr  / shelter123');
    await db.end();
}

seed().catch(err => { console.error(err); process.exit(1); });
