# Sprint 3 — Πλάνο Ανάπτυξης & Κατανομή Εργασιών

**Μάθημα:** Μεθοδολογίες Ανάπτυξης Πληροφοριακών Συστημάτων  
**Ομάδα:** 3  
**Sprint:** 3 (Υλοποίηση)  
**Εργαλείο διαχείρισης:** Jira  

---

## Μέλη Ομάδας & Ρόλοι

| Όνομα | AM | Ρόλος | Domain |
|---|---|---|---|
| Δαμιανός Ζούμπος | Ε22056 | **Scrum Master** | Backend · Auth & Coordination |
| Κλαυδιανός Άγγελος | Ε22081 | Team Member | Frontend · Pet Browse |
| Αλεσία Γκίνι | Ε22043 | Team Member | Frontend · Auth UI & Profile |
| Χρήστος Μπινάς | Ε22114 | Team Member | Backend · Pets & Shelter |
| Ιωάννης Ταχμαζίδης | Ε22164 | Team Member | Backend · Adoption & Admin |

---

## Τεχνολογική Στοίβα

```
Frontend:   React 18 + React Router + Axios
Backend:    Node.js + Express
Database:   PostgreSQL
Auth:       JWT + bcrypt
DevOps:     Docker + Docker Compose + GitHub Actions (CI)
Hosting:    localhost / Docker
```

Η επιλογή αυτή εξυπηρετεί άμεσα το DFD Level 1 της 2ης εργασίας:
- **Process 1 (User Registration)** → Express `/api/auth` routes
- **Process 2 (Pet Search)** → React filter components + Express `/api/pets`
- **Process 3 (Adoption Request)** → React form + Express `/api/adoptions`
- **Process 4 (Shelter Management)** → React shelter dashboard + Express `/api/shelter`
- **Process 5 (Admin Control)** → React admin panel + Express `/api/admin`

---

## API Contract (Shared)

> Ο Scrum Master ορίζει τα endpoints πριν ξεκινήσει κανείς frontend.  
> Frontend developers χρησιμοποιούν mock data μέχρι το backend είναι έτοιμο.

### Auth
```
POST   /api/auth/register     → { name, email, password }
POST   /api/auth/login        → { email, password } → JWT token
GET    /api/auth/me           → (auth) → user profile + requests
```

### Pets
```
GET    /api/pets              → ?species=&age=&gender=&location= → [pets]
GET    /api/pets/:id          → pet detail + photos
POST   /api/pets              → (shelter auth) → create pet
PUT    /api/pets/:id          → (shelter auth) → update pet
```

### Adoptions
```
POST   /api/adoptions         → (user auth) → submit request
GET    /api/adoptions/shelter → (shelter auth) → pending requests
PUT    /api/adoptions/:id     → (shelter auth) → approve / reject
GET    /api/adoptions/user    → (user auth) → user's requests
```

### Admin
```
GET    /api/admin/stats       → (admin auth) → { users, shelters, adoptions }
GET    /api/admin/report      → (admin auth) → full report data
```

---

## Κατανομή Tasks ανά Μέλος

### Δαμιανός Ζούμπος — Scrum Master · Backend Auth

**User Stories:** US1.1, US1.2  
**Jira Epics:** PB1–PB12  

| Task ID | Περιγραφή | Priority |
|---|---|---|
| PB1 | Σχεδίαση φόρμας εγγραφής | High |
| PB2–PB5 | Υλοποίηση πεδίων + validation + backend εγγραφής | High |
| PB7–PB11 | Login UI + backend authentication + session | High |
| — | Jira setup, sprint planning, merge coordination | — |

**Branch:** `feature/auth`

---

### Κλαυδιανός Άγγελος — Frontend · Pet Browse

**User Stories:** US2.1, US2.2, US2.3  
**Jira Epics:** PB13–PB26  

| Task ID | Περιγραφή | Priority |
|---|---|---|
| PB13–PB16 | Σελίδα λίστας κατοικιδίων + βασικά στοιχεία | High |
| PB17–PB22 | Φίλτρα (είδος, ηλικία, φύλο, τοποθεσία) | Medium |
| PB23–PB26 | Σελίδα προφίλ ζώου + φωτογραφίες | High |

**Branch:** `feature/pet-browse`

---

### Αλεσία Γκίνι — Frontend · Auth UI & Profile

**User Stories:** US1.1, US1.2  
**Jira Epics:** PB1–PB12 (frontend μέρος)  

| Task ID | Περιγραφή | Priority |
|---|---|---|
| PB1 | Register form UI (React) | High |
| PB3, PB6 | Client-side validation + feedback messages | High |
| PB7 | Login form UI | High |
| PB12 | User profile page + ιστορικό αιτήσεων | Medium |

**Branch:** `feature/auth-ui`

---

### Χρήστος Μπινάς — Backend · Pets & Shelter

**User Stories:** US4.1, US4.2  
**Jira Epics:** PB42–PB51  

| Task ID | Περιγραφή | Priority |
|---|---|---|
| PB42–PB46 | Φόρμα προσθήκης ζώου + image upload (multer) + αποθήκευση | High |
| PB47–PB49 | Επεξεργασία στοιχείων ζώου + update DB | High |
| PB50–PB51 | Αλλαγή κατάστασης (Διαθέσιμο / Υιοθετήθηκε) | High |
| — | PostgreSQL schema (tables: pets, shelters, photos) | High |

**Branch:** `feature/shelter`

---

### Ιωάννης Ταχμαζίδης — Backend · Adoption & Admin

**User Stories:** US3.1–US3.4, US5.1–US5.2  
**Jira Epics:** PB27–PB41, PB52–PB59  

| Task ID | Περιγραφή | Priority |
|---|---|---|
| PB27–PB31 | Adoption request API + αποθήκευση | High |
| PB32–PB33 | Confirmation feedback (status submitted) | Medium |
| PB34–PB36 | Shelter dashboard — λίστα αιτήσεων | High |
| PB37–PB41 | Approve/Reject logic + ενημέρωση χρήστη | High |
| PB52–PB55 | Admin dashboard API + stats | Medium |
| PB56–PB59 | Reports generation | Low |

**Branch:** `feature/adoption-admin`

---

## Git Workflow — Ασύγχρονη Συνεργασία

```
main
├── feature/auth              (Δαμιανός)
├── feature/pet-browse        (Άγγελος)
├── feature/auth-ui           (Αλεσία)
├── feature/shelter           (Χρήστος)
└── feature/adoption-admin    (Ιωάννης)
```

### Κανόνες

1. **Κανείς δεν κάνει push απευθείας στο `main`.**
2. Κάθε μέλος ανοίγει **Pull Request** όταν ολοκληρώσει ένα task.
3. Ο Scrum Master (Δαμιανός) κάνει review + merge.
4. Κάθε PR πρέπει να έχει:
   - Σύντομη περιγραφή τι υλοποιήθηκε
   - Αναφορά στο Jira task ID (π.χ. `Closes PB-13`)
   - Screenshot ή output log αν υπάρχει UI

### Commit format

```
feat(pet-browse): add filter by species and age
fix(auth): handle duplicate email on register
docs(planning): update API contract
```

---

## Τεκμηρίωση Coding Agents

Κάθε μέλος κρατάει **ατομικό αρχείο** `docs/prompts-<AM>.md` με τα prompts που χρησιμοποίησε.

### Template για κάθε prompt

```markdown
## [Ημερομηνία] - [Tool: Claude Code / GitHub Copilot / άλλο]

**Task:** PB-XX — Σύντομη περιγραφή
**Platform:** Claude.ai / VS Code Copilot / ...

**Prompt:**
> [Ακριβές κείμενο του prompt]

**Αποτέλεσμα:**
- Τι κώδικα παρήγαγε
- Τι άλλαξες χειροκίνητα και γιατί
- Αν το αποτέλεσμα ήταν σωστό ή χρειάστηκε iteration

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [ ] Context-first prompting (δόθηκε αρχιτεκτονική/stack πριν ζητηθεί κώδικας)
- [ ] Iterative refinement (βελτιώθηκε σταδιακά)
- [ ] Review του παραγόμενου κώδικα πριν το commit
```

### Παράδειγμα συμπληρωμένου entry

```markdown
## 2025-05-10 - Claude Code

**Task:** PB-13 — Σελίδα λίστας κατοικιδίων
**Platform:** Claude.ai

**Prompt:**
> I'm building a React app for a pet adoption platform.
> Stack: React 18, React Router, Axios, REST API at /api/pets.
> Create a PetList component that fetches all available pets and
> displays them as cards with name, species, age, and a thumbnail.
> Each card links to /pets/:id. Handle loading and empty states.

**Αποτέλεσμα:**
- Παρήγαγε PetList.jsx με useEffect + Axios
- Άλλαξα το card layout για να ταιριάζει με το Tailwind setup
- Πρόσθεσα manually το "Δεν βρέθηκαν αποτελέσματα" message (US2.2 criterion)

**Ορθές πρακτικές:**
- [x] Context-first (έδωσα stack + API πριν ζητήσω κώδικα)
- [x] Review πριν commit
- [ ] Iterative (έγινε σε 1 βήμα)
```

---

## Sprint Retrospective (template — συμπληρώνεται στο τέλος)

### Τι πήγε καλά
- 
- 

### Τι δυσκόλεψε
- 
- 

### Coding Agents — βοήθεια ή εμπόδιο;
- 
- 

### Τι θα κάναμε διαφορετικά στο επόμενο Sprint
- 
- 

---

## Definition of Done

Ένα task θεωρείται **ολοκληρωμένο** όταν:

- [ ] Ο κώδικας είναι στο branch και έχει γίνει Push
- [ ] Υπάρχει PR με περιγραφή και Jira reference
- [ ] Έχει γίνει code review από τουλάχιστον 1 άλλο μέλος
- [ ] Υπάρχει screenshot ή demo που αποδεικνύει το αντίστοιχο Κριτήριο Ολοκλήρωσης
- [ ] Το entry στο `docs/prompts-<AM>.md` είναι συμπληρωμένο

---

*Τελευταία ενημέρωση: Sprint 3 kickoff*
