# Coding Agent Prompts — Ιωάννης Ταχμαζίδης (Ε22164)

**Ρόλος:** Team Member · Backend Adoption & Admin  
**Branch:** `feature/adoption-admin`

---

## 2026-05-05 — Claude Code

**Task:** PB27–PB41 — Adoption Request Endpoints (Βήμα 5 / Phase 1)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Create Express router routes/adoptions.js for a pet adoption platform.
> POST /api/adoptions — user auth. Body: { pet_id, message }.
>   Check pet exists and is 'available'. Insert adoption_request (user_id, pet_id, shelter_id, message).
>   Handle unique index violation (status=pending per user per pet) → 409.
> GET /api/adoptions/user — user auth. Return user's requests joined with pet name, photo, shelter name.
> GET /api/adoptions/shelter — shelter auth. Find shelter by user_id, return all requests for its pets
>   joined with applicant name, email, pet name, message.
> PUT /api/adoptions/:id — shelter auth. Accept status: 'approved' | 'rejected'.
>   Verify request belongs to this shelter. If approved: mark pet as 'adopted',
>   reject all other pending requests for same pet.
> Use parameterized queries. Add Greek comments.

**Αποτέλεσμα:**
- Παρήγαγε πλήρες `routes/adoptions.js`
- Η λογική approve (reject others + mark pet adopted) χρειάστηκε 2 iterations
- Πρόσθεσα χειροκίνητα τον διπλό έλεγχο (exists vs belongs to shelter) για το 403/404

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting (δόθηκε DB schema + api-spec.md)
- [x] Review πριν commit (έλεγχος race conditions στο approve)
- [x] Iterative (3 iterations)

---

## 2026-05-06 — Claude Code

**Task:** PB52–PB59 — Admin Stats & Report Endpoints (Βήμα 5 / Phase 1)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Create Express router routes/admin.js with two endpoints, both admin role only.
> GET /api/admin/stats — return counts: users (role='user'), shelters, pets, adoptions broken down
>   by status (total, pending, approved, rejected). Use Promise.all for parallel queries.
>   Return integers, not strings (parseInt).
> GET /api/admin/report — return generated_at timestamp, shelters array with per-shelter
>   total_pets and total_adoptions (approved only), and recent_adoptions (last 50)
>   with pet name, shelter name, applicant name, status, date. Use LEFT JOIN for shelters.

**Αποτέλεσμα:**
- Παρήγαγε πλήρες `routes/admin.js` με Promise.all για parallel DB queries
- Διόρθωσα το `COUNT FILTER WHERE status='approved'` syntax για PostgreSQL
- Επαληθεύτηκε η επιστροφή integers (parseInt) και όχι strings

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting
- [x] Review πριν commit (test με curl + admin JWT)
- [x] Iterative (2 iterations για το report query)

---

## 2026-05-15 — Claude Code

**Task:** — MyAdoptionsPage + AdminPanelPage UI  
**Platform:** Claude Code (CLI)

**Prompt:**
> Create MyAdoptionsPage.jsx for a React pet adoption app.
> Fetch GET /api/adoptions/user (Authorization: Bearer token).
> Show a list of the user's adoption requests with: pet photo (or emoji), pet name (link to /pets/:id),
> shelter name, submission date, status badge (pending=yellow, approved=green, rejected=red).
> If no requests, show an empty state with link to /pets.
> Also create AdminPanelPage.jsx that fetches GET /api/admin/stats and GET /api/admin/report.
> Stats section: show users, shelters, pets, adoption breakdown as metric cards.
> Report section: table of shelters with total_pets and total_adoptions,
> and a table of recent_adoptions with pet, shelter, applicant, status, date.
> Both pages use the purple theme (#790075, #5c0258).

**Αποτέλεσμα:**
- Παρήγαγε `MyAdoptionsPage.jsx`, `AdminPanelPage.jsx` και αντίστοιχα CSS
- Πρόσθεσα χειροκίνητα guard για το case που ο user δεν είναι admin (redirect)
- Βελτίωσα τα status badges να ταιριάζουν με το design system

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting (δόθηκε API response shape + color palette)
- [x] Review πριν commit
- [x] Iterative (2 iterations)

---

## 2026-05-16 — Claude Code

**Task:** — AdoptionForm modal component  
**Platform:** Claude Code (CLI)

**Prompt:**
> Create AdoptionForm.jsx React component for a pet adoption platform.
> Props: petId (number).
> Show a form with a textarea for the adoption message (required).
> On submit: POST http://localhost:8000/api/adoptions with { pet_id, message }
>   and Authorization: Bearer token from localStorage.
> Show loading state on button, success message on submit, error message on failure.
> Style as a split card matching the auth page: left side purple gradient with motivational text,
> right side with the form.

**Αποτέλεσμα:**
- Παρήγαγε `AdoptionForm.jsx` και `AdoptionForm.css`
- Ενσωματώθηκε ως modal overlay στο `PetProfilePage.jsx`
- Δοκιμάστηκε end-to-end: submit → backend → DB insert → confirmation

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting
- [x] Review πριν commit
- [ ] Iterative (1 βήμα)
