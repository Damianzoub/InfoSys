# Coding Agent Prompts — Κλαυδιανός Άγγελος (Ε22081)

**Ρόλος:** Team Member · Frontend Pet Browse  
**Branch:** `feature/pet-browse`

---

## 2026-05-05 — Claude Code

**Task:** PB13–PB16 — Pet List Page με mock data (Βήμα 7 / Phase 1)  
**Platform:** Claude Code (CLI)

**Prompt:**
> I'm building a React 18 pet adoption frontend.
> Create PetListPage.jsx that fetches pets from a service and displays them as cards.
> Each card shows: pet photo (or emoji fallback), name, breed, age, gender, location, shelter name.
> Cards link to /pets/:id. Handle loading state and empty results.
> Use a petService.js that supports both mock and API modes via VITE_PET_DATA_SOURCE env var.
> Mock mode: filter in-memory from mockPets.js array.
> API mode: GET /api/pets with query params species, gender, age, location using axios.
> Add JWT Authorization header from localStorage if token exists.

**Αποτέλεσμα:**
- Παρήγαγε `PetListPage.jsx`, `petService.js`, `mockPets.js`
- Πρόσθεσα χειροκίνητα τα SPECIES_EMOJI και GENDER_LABEL lookups
- Βελτίωσα το mock filter για να χρησιμοποιεί normalizeText (αφαίρεση τόνων για Greek location search)

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting (δόθηκε stack + API contract πριν)
- [x] Review πριν commit
- [x] Iterative (2 iterations για το mock filter)

---

## 2026-05-06 — Claude Code

**Task:** PB23–PB26 — Pet Profile Page (Βήμα 7 / Phase 1)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Create PetProfilePage.jsx for the pet adoption React app.
> Route: /pets/:id. Fetch pet details from petService.getPetById(id).
> Display: primary photo (or emoji), name, species/breed/gender/age tags, status badge,
> location, description, shelter info (name, city, phone), adoption CTA section, extra photos grid.
> The API response shape for GET /api/pets/:id is:
> { id, name, species, breed, age, gender, description, location, status,
>   shelter: { id, name, city, phone }, photos: [{ id, url, is_primary }] }
> Handle loading, error, and not-found states.

**Αποτέλεσμα:**
- Παρήγαγε πλήρες `PetProfilePage.jsx` με όλα τα sections
- Πρόσθεσα χειροκίνητα το `isCancelled` pattern στο useEffect για cleanup
- Το adoption CTA ήταν αρχικά disabled placeholder — συνδέθηκε αργότερα (Phase 4)

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first (δόθηκε το ακριβές API response shape)
- [x] Review πριν commit
- [ ] Iterative

---

## 2026-05-08 — Claude Code

**Task:** PB-Αgelos — JWT auth headers σε Axios calls (Βήμα 9 / Phase 2)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Update petService.js to add JWT Authorization headers to all API calls.
> The token is stored in localStorage under the key 'token'.
> Add a helper function authHeaders() that returns { Authorization: 'Bearer <token>' } or {}
> if no token exists. Apply it to getPets() and getPetById() axios calls.
> The headers should be sent even for public endpoints so the backend can optionally
> use the user identity for personalization.

**Αποτέλεσμα:**
- Παρήγαγε ενημερωμένο `petService.js` με `authHeaders()` helper
- Εφαρμόστηκε σε `getPets()` και `getPetById()`
- Επαληθεύτηκε ότι το token διαβάζεται σωστά από localStorage

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting
- [x] Review πριν commit
- [ ] Iterative (1 βήμα)
