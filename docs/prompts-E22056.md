# Coding Agent Prompts — Δαμιανός Ζούμπος (Ε22056)

**Ρόλος:** Scrum Master · Backend Auth & Coordination  
**Branch:** `feature/auth`

---

## 2026-05-01 — Claude Code

**Task:** PB1–PB3 — DB Schema (Βήμα 1 / Phase 0)  
**Platform:** Claude Code (CLI)

**Prompt:**
> I'm building a pet adoption platform for a university project.
> Tech stack: Node.js + Express + PostgreSQL.
> Create the full database schema SQL file with these tables:
> users (id, name, email, password_hash, role, created_at),
> shelters (id, user_id FK, name, address, city, phone, description, created_at),
> pets (id, shelter_id FK, name, species, breed, age, gender, description, location, status, created_at, updated_at),
> photos (id, pet_id FK, url, is_primary, created_at),
> adoption_requests (id, user_id FK, pet_id FK, shelter_id FK, status, message, created_at, updated_at).
> Add appropriate constraints, indexes, and an auto-update trigger for updated_at.
> Role values: 'user', 'shelter', 'admin'. Status values: 'available', 'pending', 'adopted'.

**Αποτέλεσμα:**

- Παρήγαγε πλήρες `backend/src/db/schema.sql` με όλους τους πίνακες, constraints και trigger
- Πρόσθεσα χειροκίνητα το `CREATE EXTENSION IF NOT EXISTS "pgcrypto"` για μελλοντική χρήση
- Διόρθωσα το unique index στο `photos` ώστε να επιτρέπει μόνο μία primary φωτογραφία ανά ζώο

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting (δόθηκε πλήρης περιγραφή της αρχιτεκτονικής)
- [x] Review του παραγόμενου κώδικα πριν το commit
- [x] Iterative refinement (βελτίωση constraints μετά από δοκιμές)

---

## 2026-05-02 — Claude Code

**Task:** PB4–PB6 — Express Skeleton + Middleware (Βήμα 2 / Phase 0)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Set up a Node.js + Express backend for a pet adoption platform.
> Create: src/app.js (Express app with cors, dotenv, express.json, static uploads, health endpoint),
> src/server.js (entry point), src/db/index.js (pg Pool using DATABASE_URL),
> src/middleware/auth.js (JWT verify middleware with requireAuth and requireRole functions),
> src/middleware/errorHandler.js (global error handler).
> Use bcryptjs for passwords, jsonwebtoken for JWT. No routes yet — just the skeleton.

**Αποτέλεσμα:**

- Παρήγαγε πλήρη δομή backend με όλα τα middleware
- Η `requireRole` επέστρεφε array (για spread στα routes) — διατηρήθηκε αυτή η προσέγγιση
- Πρόσθεσα το `process.env.UPLOAD_DIR || 'uploads'` χειροκίνητα για flexibility

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting
- [x] Review πριν commit
- [ ] Iterative (έγινε σε 1 βήμα)

---

## 2026-05-03 — Claude Code

**Task:** — API Specification (Βήμα 3 / Phase 0)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Write a complete REST API specification in Markdown for a pet adoption platform.
> Endpoints needed: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me (protected),
> GET /api/pets (with query filters: species, age, gender, location), GET /api/pets/:id,
> POST /api/pets (shelter auth, multipart/form-data), PUT /api/pets/:id (shelter auth),
> POST /api/adoptions (user auth), GET /api/adoptions/user, GET /api/adoptions/shelter,
> PUT /api/adoptions/:id (shelter auth), GET /api/admin/stats (admin), GET /api/admin/report (admin).
> Include request/response JSON shapes, HTTP status codes, and error envelope format.
> This will be used by all 5 team members as the shared contract.

**Αποτέλεσμα:**

- Παρήγαγε πλήρες `docs/api-spec.md` με όλα τα endpoints
- Πρόσθεσα χειροκίνητα τον πίνακα query params για `GET /api/pets`
- Διόρθωσα το error status code για duplicate adoption (409 Conflict)

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting (δόθηκε λίστα endpoints πριν)
- [x] Review πριν commit (σύγκριση με DB schema)
- [x] Iterative (2 iterations για να καλυφθούν edge cases)

---

## 2026-05-10 — Claude Code

**Task:** PB7–PB9 — Auth Routes (register, login, me)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Create the Express router for authentication at routes/auth.js.
> POST /api/auth/register: validate name/email/password, hash with bcryptjs (salt 10),
> insert into users table, if role=shelter also insert into shelters table using shelter_name/city/phone from body,
> return JWT + user object. Handle 409 for duplicate email.
> POST /api/auth/login: find by email, compare password with bcryptjs, sign JWT, return token + user.
> GET /api/auth/me: protected (requireAuth), fetch user from DB + their adoption_requests with pet/shelter join.
> JWT payload: { id, email, role }. Use JWT_SECRET and JWT_EXPIRES_IN from env.

**Αποτέλεσμα:**

- Παρήγαγε πλήρες `routes/auth.js`
- Διόρθωσα το `signToken` helper ώστε να χρησιμοποιεί το `JWT_EXPIRES_IN` από `.env`
- Η εγγραφή shelter χρειάστηκε χειροκίνητη προσθήκη validation για `shelter_name`

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting
- [x] Review πριν commit (έλεγχος SQL injection protection — parameterized queries)
- [x] Iterative (2 iterations)

---

## 2026-05-12 — Claude Code

**Task:** — db:init script fix + Phase 3 connection  
**Platform:** Claude Code (CLI)

**Prompt:**
> The db:init npm script uses a bash inline node -e command that doesn't work cross-platform.
> Rewrite it as a dedicated scripts/db-init.js file that: loads .env with explicit absolute path,
> validates DATABASE_URL exists, runs psql with quoted paths to handle spaces on Windows/Mac.
> Also fix app.js to mount all routes: /api/auth, /api/pets, /api/shelter, /api/adoptions, /api/admin.
> Create a frontend/.env with VITE_PET_DATA_SOURCE=api and VITE_API_BASE_URL=http://localhost:8000.

**Αποτέλεσμα:**

- Παρήγαγε `scripts/db-init.js` και ενημέρωσε `package.json`
- Ενημέρωσε `app.js` με όλα τα mounted routes
- Δημιούργησε `frontend/.env`

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting
- [x] Review πριν commit
- [ ] Iterative

---

## 2026-05-19 — Claude Code (α)

**Task:** — Profile Page + Navbar Auth Logic
**Platform:** Claude Code (CLI)

**Prompt:**
> Create a ProfilePage.jsx for the pet adoption React app.
> Fetch user data from GET /api/auth/me with Authorization: Bearer token from localStorage.
> If not logged in, redirect to /auth using useNavigate.
> Layout — dashboard cards: (a) Hero card: purple gradient (135deg, #5c0258 → #790075 → #a0449d),
> 80px avatar circle with initials, name, role badge, email, member-since date, logout button right.
> (b) Three stat cards: Total requests (purple), Pending (yellow #fff8e6), Approved (green #eafaf1).
> (c) Adoption history table: pet name (link to /pets/:id), shelter name, date, status badge.
> On logout: clear localStorage token and user, navigate to /auth.
> Also update Navbar.jsx: use useLocation() so it re-renders on route change and always reads fresh
> localStorage. Show links conditionally — not logged in: Υιοθεσίες + Login/Register.
> role=user: + Οι αιτήσεις μου + avatar circle. role=shelter: + Καταφύγιο + avatar.
> role=admin: + Διαχείριση + avatar. Avatar is 36px purple circle with user initials linking to /profile.

**Αποτέλεσμα:**

- Παρήγαγε `ProfilePage.jsx`, `ProfilePage.css`, ενημέρωσε `Navbar.jsx` και `Navbar.css`
- Χρειάστηκε διόρθωση του `btn-logout` από `position: absolute` σε `margin-left: auto` ώστε να μη σκεπάζεται από το όνομα
- Πρόσθεσα `useLocation()` στο Navbar για αυτόματο re-render μετά από login/logout navigation

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting (δόθηκε layout, χρώματα και API shape)
- [x] Review πριν commit
- [x] Iterative (2 iterations για το CSS του logout button)

---

## 2026-05-19 — Claude Code (β)

**Task:** — Adoption Form activation + role guards
**Platform:** Claude Code (CLI)

**Prompt:**
> The adoption button in PetProfilePage.jsx is hardcoded disabled. Wire it up:
> Check if user is logged in (localStorage user). If not logged in: show "Συνδέσου" link to /auth.
> If role is shelter or admin: show info message.
> If role=user: show textarea for message + submit button that calls submitAdoption(petId, message)
> from adoptionService.js. Show loading state, success message with link to /profile,
> duplicate 409 error message, generic error message.
> Also add role guards to AdminPanelPage and ShelterDashboardPage: if user doesn't have the
> correct role, redirect to /auth immediately inside useEffect.

**Αποτέλεσμα:**

- Ενεργοποιήθηκε το adoption form στο `PetProfilePage.jsx`
- Προστέθηκαν role guards σε `AdminPanelPage.jsx` και `ShelterDashboardPage.jsx`
- Διορθώθηκε το AuthPage να κάνει `navigate('/pets')` μετά από επιτυχές login/register

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting
- [x] Review πριν commit (δοκιμή με test user + shelter + admin accounts)
- [x] Iterative (2 iterations)

---

## 2026-05-21 — Claude Code (α)

**Task:** — Database Seed Script
**Platform:** Claude Code (CLI)

**Prompt:**
> Create a seed script at backend/scripts/seed.js that inserts realistic sample data.
> Insert 2 shelter users (role=shelter) with their shelter profiles in the shelters table.
> Shelter 1: "Καταφύγιο Αθήνας" in Αθήνα. Shelter 2: "SOS Animals Θεσσαλονίκη" in Θεσσαλονίκη.
> Insert 8 pets across both shelters: mix of dogs, cats, one rabbit.
> Use Greek names and descriptions. Use ON CONFLICT DO UPDATE for users/shelters so the script
> is idempotent (safe to run multiple times). Skip pets that already exist by name+shelter_id.
> Add npm run db:seed to package.json. Print inserted pet names and test account credentials.

**Αποτέλεσμα:**

- Παρήγαγε `scripts/seed.js` με 2 καταφύγια και 8 ζώα
- Πρόσθεσα `end()` method στο `src/db/index.js` για να κλείνει το pool μετά το seed
- Επαληθεύτηκε ότι `GET /api/pets` επιστρέφει τα δεδομένα σωστά με όλα τα φίλτρα

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting (δόθηκε DB schema + είδη ζώων)
- [x] Review πριν commit (test με curl για κάθε φίλτρο)
- [ ] Iterative (1 βήμα)

---

## 2026-05-21 — Claude Code (β)

**Task:** — Docker Compose + Dockerfile (Phase 5 / Βήμα 17)
**Platform:** Claude Code (CLI)

**Prompt:**
> Complete the docker-compose.yml for the pet adoption platform. It currently only has postgres.
> Add a backend service: build from backend/Dockerfile, port 8000, env vars DATABASE_URL pointing
> to the postgres service, JWT_SECRET, PORT, UPLOAD_DIR. Mount ./backend/uploads as volume.
> Use depends_on with condition: service_healthy so backend waits for postgres healthcheck.
> Add a healthcheck to postgres: pg_isready -U postgres, interval 5s, retries 5.
> Add a frontend service: use node:22-alpine image, mount ./frontend as volume, run npm install
> && npm run dev --host, port 5173, VITE_API_BASE_URL and VITE_PET_DATA_SOURCE as env vars.
> Also create backend/Dockerfile: FROM node:22-alpine, WORKDIR /app, npm ci --omit=dev,
> copy src/ and scripts/, mkdir uploads, EXPOSE 8000, CMD node src/server.js.

**Αποτέλεσμα:**

- Παρήγαγε πλήρες `docker-compose.yml` με postgres + backend + frontend
- Παρήγαγε `backend/Dockerfile` (ήταν εντελώς απών)
- Η healthcheck condition στο depends_on εξασφαλίζει ότι το backend δεν ξεκινά πριν η DB είναι έτοιμη

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting (δόθηκε η υπάρχουσα δομή + τι έλειπε)
- [x] Review πριν commit
- [ ] Iterative (1 βήμα)

---

## 2026-05-22 — Claude Code

**Task:** — Adoption CTA fix (role-based visibility)
**Platform:** Claude Code (CLI)

**Prompt:**

> The adoption button in PetProfilePage.jsx shows "Σύνδεσου για να υποβάλεις αίτηση" hardcoded
> to everyone and always opens the AdoptionForm modal even when the user is not logged in.
> Fix the CTA section so it shows different content based on auth state:
> If not logged in: show "Σύνδεσου" message + button that navigates to /auth (no modal).
> If role=shelter or role=admin: show info message "Μόνο απλοί χρήστες μπορούν να υποβάλουν αίτηση".
> If role=user: show adoption message + button that opens the AdoptionForm modal.
> Read user from localStorage, use useNavigate for the redirect.

**Αποτέλεσμα:**

- Διορθώθηκε το `PetProfilePage.jsx` με τρεις διαφορετικές καταστάσεις CTA βάσει login state
- Προστέθηκε `useNavigate` για redirect στο `/auth` αντί για άνοιγμα modal σε αναξιοθανάτους χρήστες
- Shelter/admin χρήστες βλέπουν πλέον ενημερωτικό μήνυμα αντί για button

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting (δόθηκε screenshot + υπάρχων κώδικας)
- [x] Review πριν commit (έλεγχος και για τα 3 roles)
- [ ] Iterative (1 βήμα)

---

## 2026-05-22 — Claude Code (β)

**Task:** — Bug fix: adopted pets visible on profile page
**Platform:** Claude Code (CLI)

**Prompt:**

> Bug: navigating directly to /pets/:id for an adopted pet shows the full profile page.
> The backend already filters status='available' on the list endpoint, but GET /api/pets/:id
> returns the pet regardless of status.
> Fix PetProfilePage.jsx: if pet.status === 'adopted', do not render the normal profile.
> Instead show a friendly screen: "Το ζώο έχει ήδη υιοθετηθεί" with the pet name and
> a link back to /pets. Same pattern as the existing not-found screen.

**Αποτέλεσμα:**

- Προστέθηκε early-return στο `PetProfilePage.jsx` για `pet.status === 'adopted'`
- Εμφανίζεται φιλικό μήνυμα με το όνομα του ζώου και link επιστροφής στη λίστα
- Δεν αλλάχτηκε το backend — το φίλτρο γίνεται στο frontend για απευθείας πλοήγηση μέσω URL

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting (εντοπίστηκε ακριβώς πού γίνεται το φίλτρο status στο backend)
- [x] Review πριν commit
- [ ] Iterative (1 βήμα)

---

## 2026-05-22 — Claude Code (γ)

**Task:** — Διόρθωση περιγραφής ρόλων admin/shelter στο README
**Platform:** Claude Code (CLI)

**Prompt:**

> The README and SETUP.md test accounts table incorrectly describes the roles.
> Fix it: the shelter role is the one that views and approves/rejects adoption requests
> for its own pets (PUT /api/adoptions/:id — shelter only).
> The admin role only sees system-wide stats and a report (GET /api/admin/stats,
> GET /api/admin/report) — it does NOT approve requests.
> Update the test credentials table in README.md to add a "Τι κάνει" column
> that clearly describes what each role can actually do.

**Αποτέλεσμα:**

- Ενημερώθηκε ο πίνακας δοκιμαστικών λογαριασμών στο `README.md` με νέα στήλη "Τι κάνει"
- Διευκρινίστηκε ότι ο admin βλέπει μόνο στατιστικά και αναφορές
- Διευκρινίστηκε ότι το καταφύγιο είναι αυτό που εγκρίνει/απορρίπτει αιτήσεις
- Προστέθηκε περιγραφή και για τον απλό χρήστη (αναζήτηση + υποβολή αιτήσεων)

**Ορθές πρακτικές που ακολουθήθηκαν:**

- [x] Context-first prompting (ελέγχθηκαν backend routes + frontend pages πριν την αλλαγή)
- [x] Review πριν commit
- [ ] Iterative (1 βήμα)
