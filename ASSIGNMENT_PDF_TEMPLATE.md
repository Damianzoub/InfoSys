# Ατομικό Παραδοτέο Sprint 4

**Μάθημα:** Μεθοδολογίες Ανάπτυξης Πληροφοριακών Συστημάτων  
**Project:** Pet Adoption Platform  
**Ομάδα:** 3  
**Φοιτητής/τρια:** `[Ονοματεπώνυμο]`  
**ΑΜ:** `[ΑΜ]`  
**Ρόλος στο Sprint:** `[Scrum Master / Team Member]`  
**Ημερομηνία:** `[Ημερομηνία παράδοσης]`  
**Git Repository:** `[Σύνδεσμος GitHub/GitLab repository]`  
**Project Management Tool:** `[Zenhub/Jira link ή screenshot αναφοράς]`

> **Σημείωση πριν τη μετατροπή σε PDF:** Αντικατάστησε όλα τα πεδία σε `[ ]`, κράτησε τις ενότητες που αφορούν τη δική σου συνεισφορά, πρόσθεσε screenshots όπου ζητούνται και βεβαιώσου ότι ο σύνδεσμος του repository είναι ενεργός.

---

## 1. Sprint Planning & Κατανομή Εργασιών

### 1.1 Στόχοι Sprint 4

Στόχος του Sprint 4 ήταν η εφαρμογή πρακτικών DevOps πάνω στο υπάρχον πληροφοριακό σύστημα που αναπτύχθηκε στο Sprint 3. Οι βασικοί στόχοι ήταν:
- Αυτοματοποιημένος έλεγχος (Automated Testing)
- Continuous Integration (CI)
- Continuous Delivery / Deployment (CD)
- Code Quality & Linting
- Dockerization της εφαρμογής
- Ενημέρωση τεκμηρίωσης και αποθετηρίου

### 1.2 Κατανομή Εργασιών Ομάδας

| Μέλος | ΑΜ | Ρόλος | Κύρια ευθύνη |
|---|---|---|---|

| Δαμιανός Ζούμπος | Ε22056 | Team Member | (Continuous Delivery/Deployment), Docker Images, Docker Compose, Deployment σε Railway|

| Κλαυδιανός Άγγελος | Ε22081 | Team Member | Αυτοματοποιημένος Έλεγχος (Automated Testing), Unit Tests, Integration Tests, Test Coverage |

| Αλεσία Γκίνι | Ε22043 | Team Member |Διασφάλιση Ποιότητας Κώδικα (Code Quality), ESLint, Prettier, Frontend Validation, README Updates |

| Χρήστος Μπινάς | Ε22114 | Team Member | Σχεδιασμός & Υλοποίηση CI/CD Pipeline, Workflow Design, Pipeline Stages, GitHub Actions Configuration |

| Ιωάννης Ταχμαζίδης | Ε22164 | Team Member | Στρατηγική DevOps & Διαχείριση Εκδόσεων, GitHub Actions, Branching Strategy, Version Control|

### 1.3 Προσωπική Συνεισφορά

| Task | Τι υλοποίησα προσωπικά | Αρχεία/ενότητες κώδικα | Κατάσταση |
|---|---|---|---|
| `[π.χ. PB27 / US3.1]` | `[Περιγραφή εργασίας]` | `[π.χ. backend/src/routes/adoptions.js]` | `[Ολοκληρώθηκε/Μερικώς]` |
| `[Task]` | `[Περιγραφή]` | `[Αρχεία]` | `[Κατάσταση]` |

---

## 2. Αρχιτεκτονική & Τεχνολογική Στοίβα

### 2.1 Τεχνολογίες που χρησιμοποιήθηκαν
Tεχνολογία|	Ρόλος στο σύστημα

- GitHub Actions|	Εκτέλεση CI/CD pipeline
- Docker|	Containerization εφαρμογής
- Docker Compose|	Multi-container orchestration
- Railway|	Deployment
- ESLint|	Στατικός έλεγχος JavaScript / React κώδικα
- Prettier|	Ενιαία μορφοποίηση κώδικα
- Git / GitHub|	Version control και συνεργασία ομάδας
- Markdown|	Τεκμηρίωση README και CI/CD documentation

## 3. Τεκμηρίωση Ανάπτυξης με Coding Agents

### 3.1 Εργαλεία που χρησιμοποιήθηκαν

| Εργαλείο / Πλατφόρμα | Χρήση | Παραδείγματα εργασιών |
|---|---|---|
| `[π.χ. Claude Code]` | `[Παραγωγή/διόρθωση κώδικα]` | `[π.χ. Express routes, React components]` |
| `[π.χ. GitHub Copilot]` | `[Autocomplete/βοήθεια υλοποίησης]` | `[π.χ. helper functions, CSS]` |
| `[π.χ. ChatGPT]` | `[Ανάλυση, debugging, documentation]` | `[π.χ. README, retrospective]` |

### 3.2 Προσωπικό ιστορικό prompts

> Πρόσθεσε τα σημαντικότερα prompts που χρησιμοποίησες. Δεν αρκεί να αναφέρεις ότι χρησιμοποιήθηκε AI· πρέπει να φαίνεται τι ζητήθηκε, τι παρήχθη και τι άλλαξες χειροκίνητα.

#### Prompt 1

**Ημερομηνία:** `[YYYY-MM-DD]`  
**Tool:** `[Claude Code / Copilot / ChatGPT / άλλο]`  
**Task:** `[Task ID ή User Story]`  

**Prompt που δόθηκε:**

```text
[Ακριβές ή αντιπροσωπευτικό prompt]
```

**Αποτέλεσμα:**

- `[Τι κώδικα/τεκμηρίωση παρήγαγε το εργαλείο]`
- `[Τι έλεγξα ή τροποποίησα χειροκίνητα]`
- `[Αν χρειάστηκε δεύτερο prompt ή debugging]`

**Ορθές πρακτικές που ακολουθήθηκαν:**

- `[π.χ. Δόθηκε context για stack/API πριν ζητηθεί κώδικας]`
- `[π.χ. Έγινε review πριν ενσωματωθεί]`
- `[π.χ. Έγινε δοκιμή με build/lint/manual flow]`

#### Prompt 2

**Ημερομηνία:** `[YYYY-MM-DD]`  
**Tool:** `[Tool]`  
**Task:** `[Task ID ή User Story]`  

**Prompt που δόθηκε:**

```text
[Prompt]
```

**Αποτέλεσμα:**

- `[Αποτέλεσμα]`
- `[Χειροκίνητες αλλαγές]`
- `[Έλεγχος/δοκιμή]`

---

## 4. Ιχνηλασιμότητα & Κριτήρια Ολοκλήρωσης

### 4.1 Πίνακας αντιστοίχισης  με αποδείξεις

Ενέργεια|Υλοποίηση|Απόδειξη|Screenshot|Σχόλια
T1|	DevOps Strategy & Branching Strategy             |screenshot|Σχόλια
T2|	Automated Testing                                |screenshot|Σχόλια
T3|	CI/CD Pipeline                                   |screenshot|Σχόλια
T4|	Continuous Delivery / Deployment                 |screenshot|Σχόλια
T5|	Code Quality – ESLint / Prettier and README Badge|screenshot|Σχόλια

### 4.2 Screenshots εφαρμογής

Για την τελική μορφή του PDF μπορούν να προστεθούν τα παρακάτω screenshots:
GitHub Actions Pipeline
README CI/CD Badge
Pipeline Workflow File
Code Quality Checks
CI/CD Documentation


### 4.3 Έλεγχοι που εκτελέστηκαν
Έλεγχος	Εντολή | Διαδικασία	Αποτέλεσμα
Frontend build	cd frontend && npm run build          |επιβεβαιώθηκε μέσω pipeline ή τοπικού ελέγχου
Frontend lint	cd frontend && npm run lint             |επιβεβαιώθηκε μέσω pipeline ή τοπικού ελέγχου
Frontend formatting check	cd frontend && npm run format:check   |επιβεβαιώθηκε μέσω pipeline ή τοπικού ελέγχου
Backend tests	cd backend && npm test                  |Εκτελούνται μέσα στο GitHub Actions pipeline
CI Pipeline validation	GitHub Actions Workflow	      |Το pipeline εκτελείται αυτόματα στο GitHub
README badge validation	Έλεγχος στο GitHub repository |Το badge εμφανίζει την κατάσταση του pipeline

## 5. Sprint Retrospective

### 5.1 Τι πήγε καλά

- `[Παράδειγμα: Η ύπαρξη API spec βοήθησε το frontend και backend να δουλεύουν παράλληλα.]`
- `[Παράδειγμα: Η κατανομή εργασιών ανά ρόλο μείωσε τις συγκρούσεις στο git.]`
- `[Προσωπική παρατήρηση]`

### 5.2 Τι δυσκόλεψε την ομάδα

- `[Παράδειγμα: Ρυθμίσεις Docker/PostgreSQL ή διαφορετικά local environments.]`
- `[Παράδειγμα: Ενοποίηση frontend με πραγματικά endpoints.]`
- `[Προσωπική δυσκολία]`

### 5.3 Τι έμαθα από τη διαδικασία

- `[Τεχνική γνώση που απέκτησα]`
- `[Τι έμαθα για συνεργασία με git/project management]`
- `[Τι έμαθα για σωστή χρήση Coding Agents]`

### 5.4 Τι θα βελτιώναμε σε επόμενο Sprint

- `[Πρόταση βελτίωσης 1]`
- `[Πρόταση βελτίωσης 2]`
- `[Πρόταση βελτίωσης 3]`

---

## 6. Git Repository

**Repository URL:** `[βάλε εδώ το GitHub/GitLab repository link]`

**Branch ή commit που αντιστοιχεί στο παραδοτέο:** `[branch name ή commit hash]`

**Σύντομη περιγραφή repository:**

- `backend/`: Express API, PostgreSQL σύνδεση, authentication, pets/adoptions/admin routes.
- `frontend/`: React UI για auth, pet browsing, adoption requests, shelter dashboard, admin panel.
- `docs/`: API specification, screenshots, prompt history και βοηθητική τεκμηρίωση.
- `docker-compose.yml`: Τοπική εκτέλεση PostgreSQL, backend και frontend.

---

## 7. Τελική Δήλωση Συνεισφοράς

Δηλώνω ότι η παραπάνω εργασία περιγράφει τη δική μου συμμετοχή στο project. Τα εργαλεία Coding Agents χρησιμοποιήθηκαν ως βοηθοί ανάπτυξης και τεκμηρίωσης, ενώ ο κώδικας και τα αποτελέσματα ελέγχθηκαν και προσαρμόστηκαν σύμφωνα με τις ανάγκες της ομάδας και τα παραδοτέα του μαθήματος.

**Ονοματεπώνυμο:** `[Ονοματεπώνυμο]`  
**ΑΜ:** `[ΑΜ]`  
**Ημερομηνία:** `[Ημερομηνία]`
