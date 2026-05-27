# Coding Agent Prompts — Χρήστος Μπινάς (Ε22114)

**Ρόλος:** Team Member · Backend Pets & Shelter  
**Branch:** `feature/shelter`

---

## 2026-05-05 — Claude Code

**Task:** PB42–PB46 — Pet CRUD Endpoints (Βήμα 4 / Phase 1)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Create Express router routes/pets.js for a pet adoption backend.
> Stack: Node.js + Express + PostgreSQL (pg pool from ../db).
> Implement these endpoints:
> GET /api/pets — list available pets with optional filters: species, age (max), gender, location (ILIKE).
>   Join pets + shelters + photos (primary only). Return array matching api-spec.md format.
> GET /api/pets/:id — full pet detail with shelter info and all photos array.
> POST /api/pets — shelter auth required (requireRole('shelter')).
>   Multipart/form-data with multer (up to 5 photos). Find shelter by user_id, insert pet, insert photos.
> PUT /api/pets/:id — shelter auth. COALESCE update. Verify pet belongs to this shelter.
> Use parameterized queries everywhere. Add Greek comments for team readability.

**Αποτέλεσμα:**
- Παρήγαγε πλήρες `routes/pets.js` με όλα τα endpoints
- Πρόσθεσα χειροκίνητα τον έλεγχο ότι το ζώο ανήκει στο καταφύγιο που κάνει PUT
- Διόρθωσα τη multer config ώστε να χρησιμοποιεί το `UPLOAD_DIR` από env

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting (δόθηκε api-spec.md + DB schema)
- [x] Review πριν commit (έλεγχος parameterized queries)
- [x] Iterative (3 iterations για τα filters + photo handling)

---

## 2026-05-07 — Claude Code

**Task:** PB47–PB51 — Shelter Route (GET/PUT /api/shelter/me)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Create Express router routes/shelter.js for shelter profile management.
> GET /api/shelter/me — shelter role required. Return shelter profile for logged-in user
>   (id, name, address, city, phone, description, created_at). 404 if not found.
> PUT /api/shelter/me — shelter role required. COALESCE update of name/address/city/phone/description.
>   WHERE user_id = req.user.id. Return updated profile.
> Use requireRole('shelter') from middleware/auth.js (spread with ...).

**Αποτέλεσμα:**
- Παρήγαγε `routes/shelter.js` με GET και PUT /me
- Επαληθεύτηκε η σύνδεση με τον πίνακα `shelters` μέσω `user_id`
- Δοκιμάστηκε με curl χρησιμοποιώντας shelter JWT token

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting
- [x] Review πριν commit
- [ ] Iterative (1 βήμα)

---

## 2026-05-15 — Claude Code

**Task:** — ShelterDashboardPage integration  
**Platform:** Claude Code (CLI)

**Prompt:**
> I have a ShelterDashboardPage.jsx that currently uses mock data.
> Connect it to the real backend APIs:
> - GET /api/adoptions/shelter → list of pending adoption requests for this shelter's pets
> - PUT /api/adoptions/:id with body { status: 'approved' | 'rejected' } → approve/reject request
> The user is a shelter role, JWT token is in localStorage.
> Show each request with pet name, applicant name, email, message, date, and Approve/Reject buttons.
> Disable buttons after action. Show success/error feedback inline.

**Αποτέλεσμα:**
- Ενημερώθηκε `ShelterDashboardPage.jsx` με real API calls
- Πρόσθεσα χειροκίνητα το optimistic UI update (αλλαγή status στο local state μετά το approve)
- Δοκιμάστηκε end-to-end με test shelter account

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting
- [x] Review πριν commit
- [x] Iterative (2 iterations)
