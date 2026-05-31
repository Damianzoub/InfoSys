# Πλατφόρμα Υιοθεσίας Κατοικιδίων (Pet Adoption Platform)

Πανεπιστημιακό ομαδικό project για το μάθημα  
**Μεθοδολογίες Ανάπτυξης Πληροφοριακών Συστημάτων**

---

## Περιγραφή Project

Το project αφορά την ανάπτυξη μιας **πλατφόρμας υιοθεσίας κατοικιδίων** όπου τα καταφύγια ζώων μπορούν να δημοσιεύουν ζώα προς υιοθεσία και οι ενδιαφερόμενοι χρήστες μπορούν να αναζητούν ζώα και να υποβάλλουν αιτήσεις υιοθεσίας.

Η πλατφόρμα στοχεύει στη δημιουργία ενός οργανωμένου πληροφοριακού συστήματος που διευκολύνει:

- την προβολή ζώων προς υιοθεσία
- την αναζήτηση ζώων με φίλτρα
- τη διαδικασία υποβολής αιτήσεων υιοθεσίας
- τη διαχείριση αιτήσεων από τα καταφύγια

---

## Στόχος του Συστήματος

Ο στόχος του συστήματος είναι να δημιουργηθεί ένα πληροφοριακό σύστημα που:

- επιτρέπει στα καταφύγια να δημοσιεύουν ζώα
- επιτρέπει στους χρήστες να βρίσκουν ζώα προς υιοθεσία
- οργανώνει τις αιτήσεις υιοθεσίας
- βελτιώνει την επικοινωνία μεταξύ υιοθετών και καταφυγίων

---

## Βασικές Λειτουργίες

Το σύστημα θα υποστηρίζει τις εξής βασικές λειτουργίες:

- Προφίλ ζώων
- Φίλτρα αναζήτησης
- Αίτηση υιοθεσίας
- Διαχείριση καταφυγίου
- Διαχείριση χρηστών

---

## Ρόλοι Χρηστών

### Υποψήφιος Υιοθέτης
- δημιουργία λογαριασμού
- αναζήτηση ζώων
- προβολή πληροφοριών ζώου
- υποβολή αίτησης υιοθεσίας

### Καταφύγιο
- δημιουργία προφίλ ζώου
- ενημέρωση στοιχείων ζώου
- διαχείριση αιτήσεων υιοθεσίας

### Διαχειριστής
- εποπτεία συστήματος
- διαχείριση χρηστών
- διαχείριση περιεχομένου

---

## Μεθοδολογία Ανάπτυξης

Η ανάπτυξη του project ακολουθεί τη μεθοδολογία **Scrum (Agile methodology)**.

Η ανάπτυξη γίνεται σε μικρούς κύκλους εργασίας που ονομάζονται **Sprints**.

Σε κάθε Sprint υλοποιείται ένα συγκεκριμένο μέρος του συστήματος.

Παραδείγματα Sprint:

- Ανάλυση απαιτήσεων
- Σχεδιασμός μοντέλου δεδομένων
- Υλοποίηση βασικών λειτουργιών
- Testing
- CI/CD pipeline

Περισσότερες πληροφορίες υπάρχουν στο αρχείο:
[[docs/scrum.md]]

---

## Τεχνολογίες

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | React 18 + React Router + Axios               |
| Backend  | Node.js + Express                             |
| Database | PostgreSQL 16                                 |
| Auth     | JWT + bcryptjs                                |
| DevOps   | Docker + Docker Compose + GitHub Actions (CI) |

---

## Continuous Integration (CI)

Το έργο χρησιμοποιεί GitHub Actions για αυτοματοποιημένο έλεγχο ποιότητας κώδικα και επικύρωση της εφαρμογής σε κάθε Push ή Pull Request.

## Pipeline Έλεγχοι
Το CI pipeline εκτελεί:
- Backend Unit & Integration Tests
- Coverage Report Generation
- ESLint Code Quality Checks
- Prettier Formatting Validation
- Frontend Build Validation
- Docker Compose Configuration Validation

## Code Quality
Για τη διασφάλιση ποιότητας κώδικα χρησιμοποιούνται:
- ESLint για στατικό έλεγχο JavaScript / React κώδικα
- Prettier για ενιαία μορφοποίηση κώδικα
- GitHub Actions για αυτοματοποιημένο έλεγχο πριν την ενσωμάτωση αλλαγών

## Secrets Management
Τα ευαίσθητα δεδομένα δεν αποθηκεύονται στον πηγαίο κώδικα.
Χρησιμοποιούνται αρχεία περιβάλλοντος (.env) τα οποία εξαιρούνται από το αποθετήριο μέσω των κατάλληλων ρυθμίσεων.

## Οδηγίες Εκκίνησης

## Επιλογή Α — Με Docker (συνιστάται)

> Απαιτείται: Docker Desktop ή Colima εγκατεστημένο και σε λειτουργία.

```bash
# 1. Αντιγραφή αρχείου περιβάλλοντος
cp backend/.env.example backend/.env

# 2. Εκκίνηση βάσης δεδομένων
docker-compose up -d postgres

# 3. Αρχικοποίηση schema
cd backend && npm install && npm run db:init

# 4. Εισαγωγή δεδομένων (ζώα + λογαριασμοί καταφυγίων)
npm run db:seed

# 5. Εκκίνηση backend
npm run dev

# 6. Σε νέο terminal — εκκίνηση frontend
cd ../frontend && npm install && npm run dev
```

## Επιλογή Β — Χωρίς Docker (local PostgreSQL)

```bash
# 1. Εγκατάσταση PostgreSQL (macOS)
brew install postgresql@16
brew services start postgresql@16
createdb pet_adoption_db

# 2. Αντιγραφή και ρύθμιση .env
cp backend/.env.example backend/.env
# Άνοιξε backend/.env και ρύθμισε:
# DATABASE_URL=postgresql://localhost:5432/pet_adoption_db

# 3. Αρχικοποίηση schema
cd backend && npm install && npm run db:init

# 4. Εισαγωγή δεδομένων (ζώα + λογαριασμοί καταφυγίων)
npm run db:seed

# 5. Εκκίνηση backend
npm run dev

# 6. Σε νέο terminal — εκκίνηση frontend
cd ../frontend && npm install && npm run dev
```

## Environment Variables (`backend/.env`)

| Μεταβλητή      | Προεπιλογή                                          | Περιγραφή                        |
|----------------|-----------------------------------------------------|----------------------------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/pet_adoption_db` | PostgreSQL connection string |
| `JWT_SECRET`   | `change_this_to_a_long_random_string`               | Μυστικό για JWT signing           |
| `JWT_EXPIRES_IN` | `7d`                                              | Διάρκεια JWT token               |
| `PORT`         | `8000`                                              | Backend server port              |
| `UPLOAD_DIR`   | `uploads/`                                          | Φάκελος για φωτογραφίες ζώων     |

## Frontend Environment (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_PET_DATA_SOURCE=api
```

> `VITE_PET_DATA_SOURCE=mock` για ανάπτυξη χωρίς backend.

## Δοκιμαστικοί Λογαριασμοί

Τρέξε `npm run db:seed` στον φάκελο `backend/` για να δημιουργηθούν αυτόματα τα παρακάτω:

| Ρόλος | Email | Password | Πρόσβαση | Τι κάνει |
|-------|-------|----------|----------|----------|
| **Admin** | `admin@test.com` | `admin123` | `/admin` | Στατιστικά συστήματος (χρήστες, ζώα, αιτήσεις) + αναφορά καταφυγίων — **δεν** εγκρίνει αιτήσεις |
| **Καταφύγιο 1** | `shelter.athina@petadopt.gr` | `shelter123` | `/shelter-dashboard` | Βλέπει αιτήσεις υιοθεσίας για τα ζώα του και τις **εγκρίνει ή απορρίπτει** |
| **Καταφύγιο 2** | `sos.animals@petadopt.gr` | `shelter123` | `/shelter-dashboard` | Βλέπει αιτήσεις υιοθεσίας για τα ζώα του και τις **εγκρίνει ή απορρίπτει** |
| **Χρήστης** | δημιουργία μέσω `/auth` | — | `/my-adoptions`, `/profile` | Αναζήτηση ζώων και υποβολή αιτήσεων υιοθεσίας |

Ο admin λογαριασμός δημιουργείται ξεχωριστά:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@test.com","password":"admin123","role":"admin"}'
```

---

## Repository Structure

```text
InfoSys/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app + middleware
│   │   ├── server.js           # Entry point (PORT 8000)
│   │   ├── db/
│   │   │   ├── index.js        # pg Pool
│   │   │   └── schema.sql      # CREATE TABLE definitions
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verify + requireRole
│   │   │   └── errorHandler.js
│   │   └── routes/
│   │       ├── auth.js         # /api/auth
│   │       ├── pets.js         # /api/pets
│   │       ├── adoptions.js    # /api/adoptions
│   │       ├── shelter.js      # /api/shelter
│   │       └── admin.js        # /api/admin
│   ├── scripts/
│   │   └── db-init.js          # npm run db:init
│   ├── uploads/                # multer destination (gitignored)
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── pages/              # PetListPage, PetProfilePage, AuthPage, ProfilePage, ...
│       ├── components/         # Navbar
│       └── services/           # petService.js, adoptionService.js, adminService.js
├── docs/
│   ├── api-spec.md             # Canonical API contract
│   ├── prompts-E22056.md       # Δαμιανός — Coding Agent prompts
│   ├── prompts-E22081.md       # Άγγελος — Coding Agent prompts
│   ├── prompts-E22043.md       # Αλεσία — Coding Agent prompts
│   ├── prompts-E22114.md       # Χρήστος — Coding Agent prompts
│   └── prompts-E22164.md       # Ιωάννης — Coding Agent prompts
├── docker-compose.yml
├── DEVELOPMENT_ORDER.md
└── SPRINT3_PLANNING.md
```

