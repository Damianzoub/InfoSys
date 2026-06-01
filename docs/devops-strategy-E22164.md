# Στρατηγική DevOps & Διαχείριση Εκδόσεων

**Μάθημα:** Μεθοδολογίες Ανάπτυξης Πληροφοριακών Συστημάτων
**Ομάδα:** 3 · **Sprint:** 3 (Υλοποίηση CI/CD)
**Συντάκτης ενότητας:** Ιωάννης Ταχμαζίδης — **AM:** Ε22164
**Ενότητα παραδοτέου:** *DevOps Strategy & Release Management*

---

## 1. Εισαγωγή & Στόχοι

Η ομάδα μας ανέπτυξε την **Πλατφόρμα Υιοθεσίας Κατοικιδίων** ως πέντε προγραμματιστές που
δουλεύουν **ασύγχρονα** και σε διαφορετικά υποσυστήματα (auth, pet-browse, shelter,
adoption/admin). Σε ένα τέτοιο περιβάλλον η **στρατηγική DevOps** δεν είναι προαιρετική:
είναι ο μηχανισμός που εγγυάται ότι ο κώδικας πέντε ανθρώπων ενσωματώνεται με ασφάλεια,
ελέγχεται αυτόματα και πακετάρεται με επαναλήψιμο τρόπο.

Οι στόχοι που θέσαμε για το DevOps κομμάτι του Sprint 3 ήταν:

| Στόχος | Πώς επιτυγχάνεται |
|---|---|
| **Αυτοματοποίηση (Automation)** | Κάθε `push` / `Pull Request` ενεργοποιεί αυτόματα build, tests και ελέγχους ποιότητας — χωρίς χειροκίνητα βήματα. |
| **Επαναληψιμότητα (Reproducibility)** | Containerization με Docker — η εφαρμογή τρέχει ίδια σε κάθε μηχάνημα και στο CI runner. |
| **Γρήγορη ανατροφοδότηση (Fast feedback)** | Τα σφάλματα εντοπίζονται στο pipeline **πριν** το merge στο `main`, όχι στην παραγωγή. |
| **Ποιότητα ως πύλη (Quality gate)** | Linting + tests αποτρέπουν την ενσωμάτωση κώδικα που δεν πληροί τα πρότυπα. |
| **Ασφαλής παράδοση (Safe delivery)** | Το `main` παραμένει πάντα «deployable»· κάθε merge παράγει αυτόματα έτοιμο Docker image. |
| **Ασφάλεια secrets** | Καμία ευαίσθητη πληροφορία στον κώδικα ή στα images — μόνο μέσω `.env` και GitHub Secrets. |

---

## 2. Επιλεγμένα Εργαλεία (DevOps Toolchain)

Η φιλοσοφία επιλογής ήταν **«όλα μέσα στο GitHub, μηδενική επιπλέον υποδομή»**: εφόσον ο
κώδικας ήδη φιλοξενείται στο GitHub, επιλέξαμε εργαλεία που ενσωματώνονται φυσικά με αυτό,
είναι **δωρεάν** για ακαδημαϊκή χρήση και δεν απαιτούν δικό μας server να συντηρούμε.

| Εργαλείο | Κατηγορία | Ρόλος στο project | Αρχείο/Τοποθεσία |
|---|---|---|---|
| **GitHub Actions** | CI/CD Orchestration | Εκτέλεση pipelines σε κάθε push/PR | `.github/workflows/ci.yml`, `cd.yml` |
| **Docker** | Containerization | Πακετάρισμα του backend σε φορητό image | `backend/Dockerfile` |
| **Docker Compose** | Local Orchestration | Ενορχήστρωση postgres + backend + frontend τοπικά | `docker-compose.yml` |
| **GitHub Container Registry (GHCR)** | Artifact Registry | Αποθήκευση/διανομή του παραγόμενου image | `ghcr.io/<repo>/backend` |
| **Jest + Supertest** | Testing | Unit & integration tests του backend με coverage | `backend/__tests__/` |
| **ESLint + Prettier** | Code Quality / Linting | Στατικός έλεγχος & ενιαία μορφοποίηση frontend | `frontend/` |

### 2.1 GitHub Actions — *γιατί αυτό και όχι GitLab CI / Jenkins*

Επιλέχθηκε ως ο **κεντρικός ενορχηστρωτής CI/CD**. Τα pipelines περιγράφονται δηλωτικά σε
YAML μέσα στον φάκελο `.github/workflows/`, οπότε **η ίδια η διαμόρφωση του pipeline είναι
version-controlled** μαζί με τον κώδικα.

- **vs Jenkins:** Το Jenkins θα απαιτούσε δικό μας self-hosted server (εγκατάσταση,
  συντήρηση, ασφάλεια, plugins). Για μια φοιτητική ομάδα είναι υπερβολικό overhead.
- **vs GitLab CI:** Εξαιρετικό εργαλείο, αλλά προϋποθέτει μετακόμιση του repository στο
  GitLab. Εφόσον ήδη συνεργαζόμαστε μέσω **GitHub Pull Requests**, το GitHub Actions
  ενσωματώνεται άμεσα (status checks πάνω στο PR, χωρίς integrations τρίτων).
- **Κόστος:** Δωρεάν minutes για δημόσια/ακαδημαϊκά repos· κανένα κόστος υποδομής.

### 2.2 Docker — *Containerization*

Το backend πακετάρεται σε ένα Docker image με βάση `node:22-alpine` (ελαφρύ image). Έτσι
λύνεται το κλασικό πρόβλημα **«δουλεύει στο μηχάνημά μου»**: το ίδιο artifact τρέχει
πανομοιότυπα στον υπολογιστή κάθε μέλους, στο CI runner και σε ένα μελλοντικό περιβάλλον
παραγωγής. Το `Dockerfile` εγκαθιστά μόνο production dependencies (`npm ci --omit=dev`),
κρατώντας το image μικρό και ασφαλές.

### 2.3 Docker Compose — *Τοπικό περιβάλλον & Local Staging*

Η εφαρμογή είναι **multi-service** (PostgreSQL + Express backend + React frontend). Το
`docker-compose.yml` τα ενορχηστρώνει με μία εντολή (`docker compose up`), περιλαμβάνοντας:

- δικό του δίκτυο (`pet_adoption_network`) ώστε τα services να επικοινωνούν μεταξύ τους,
- **healthcheck** στη βάση (`pg_isready`) ώστε το backend να ξεκινά μόνο όταν η βάση είναι έτοιμη (`depends_on: condition: service_healthy`),
- persistent volume για τα δεδομένα της PostgreSQL.

Αυτό λειτουργεί ταυτόχρονα ως **τοπικό εξομοιωμένο περιβάλλον (Local Staging)** για δοκιμές
end-to-end πριν την παράδοση.

### 2.4 GitHub Container Registry (GHCR) — *Artifact Registry*

Το παραγόμενο Docker image αποθηκεύεται στο **GHCR** (`ghcr.io`). Επιλέχθηκε αντί π.χ. του
Docker Hub επειδή ανήκει στο ίδιο οικοσύστημα GitHub: η αυθεντικοποίηση γίνεται αυτόματα με
το ενσωματωμένο `GITHUB_TOKEN` (χωρίς χειροκίνητη διαχείριση credentials) και το package
συνδέεται απευθείας με το repository.

### 2.5 Εργαλεία Ελέγχου & Ποιότητας

Ως μέρος της στρατηγικής DevOps (αλλά αναλυτικά στις ενότητες *Automated Testing* και *Code
Quality* των συναδέλφων):

- **Jest + Supertest** — unit & integration tests του backend με αναφορά coverage (`npm run test:ci`).
- **ESLint** — στατικός έλεγχος ποιότητας JavaScript/React.
- **Prettier** — έλεγχος ενιαίας μορφοποίησης κώδικα (`format:check`).

> **Γιατί αυτή η στοίβα συνολικά:** μηδενική επιπλέον υποδομή προς συντήρηση, πλήρης
> ενσωμάτωση με τη ροή GitHub Pull Requests, δωρεάν για το project και χαμηλό operational
> overhead — ιδανικό για μια ομάδα 5 ατόμων με χρονικό περιορισμό ενός sprint.

---

## 3. Στρατηγική Διαχείρισης Branches

### 3.1 Επιλεγμένο μοντέλο: **GitHub Flow** (Feature-Branch Workflow)

Υιοθετήσαμε το **GitHub Flow** — ένα ελαφρύ μοντέλο με **ένα μόνιμο, πάντα deployable κλαδί
(`main`)** και βραχύβια κλαδιά ανά feature που ενσωματώνονται μέσω **Pull Request**.

**Γιατί GitHub Flow και όχι Git Flow:**
Το πλήρες **Git Flow** (με μόνιμα `develop`, `release/*`, `hotfix/*` κλαδιά) είναι σχεδιασμένο
για προϊόντα με προγραμματισμένες εκδόσεις και παράλληλη συντήρηση παλαιών versions. Για ένα
ακαδημαϊκό project **ενός sprint**, χωρίς ανάγκη hotfix σε παλιές εκδόσεις, αυτή η
πολυπλοκότητα δεν προσφέρει αξία — προσθέτει μόνο overhead.

**Γιατί όχι «καθαρό» Trunk-Based Development:**
Το pure trunk-based ενθαρρύνει συχνά commits απευθείας στο trunk. Όμως **απαίτηση του μαθήματος
και της ομάδας** είναι κάθε αλλαγή να περνά από **review του Scrum Master** μέσω Pull Request.
Έτσι το GitHub Flow είναι η σωστή «μέση λύση»: κρατά το πλεονέκτημα του ενός trunk, αλλά
επιβάλλει την πύλη του code review.

### 3.2 Δομή & Ροή Εργασίας

```
   feature/*  ┐
   bugfix/*   ├─►  Pull Request  ──►  CI (tests + lint + build)  ──►  Review (Scrum Master)  ──►  merge ──►  main
   docs/*     ┘         │                      │                              │                              │
   (βραχύβια)           └─ status checks ──────┘                       (απαιτείται έγκριση)          (πάντα deployable)
                                                                                                            │
                                                                                                            ▼
                                                                                                  CD ► Docker image ► GHCR
```

**Κανόνες (Branching Rules):**

1. **Κανείς δεν κάνει push απευθείας στο `main`.** Το `main` προστατεύεται και ενημερώνεται μόνο μέσω εγκεκριμένου PR.
2. Κάθε μέλος δουλεύει σε **δικό του βραχύβιο κλαδί** ανά task/feature.
3. Όταν ολοκληρωθεί ένα task, ανοίγει **Pull Request** προς το `main`.
4. Ο **Scrum Master (Δαμιανός)** κάνει review και merge — μόνο αφού περάσουν τα **CI status checks**.
5. Κάθε PR αναφέρει το αντίστοιχο **Jira task ID** (π.χ. `Closes PB-13`).

*Τεκμηρίωση:* μέχρι στιγμής έχουν ολοκληρωθεί **10 Pull Requests** προς το `main` με αυτή τη
ροή (PR #1–#10), όλα reviewed/merged από τον Scrum Master.

### 3.3 Σύμβαση Ονοματοδοσίας (Naming Conventions)

**Κλαδιά** — πρόθεμα ανάλογα με τον σκοπό:

| Πρόθεμα | Χρήση | Παράδειγμα |
|---|---|---|
| `feature/*` | Νέα λειτουργικότητα | `feature/adoption-admin` |
| `bugfix/*` | Διόρθωση σφάλματος | `bugfix/login-404` |
| `docs/*` | Τεκμηρίωση | `docs/api-spec` |

**Commits** — σύμβαση *Conventional Commits*:

```
feat(adoption): add approve/reject endpoint
fix(auth): handle duplicate email on register
docs(planning): update API contract
```

Η ενιαία σύμβαση κάνει το ιστορικό αναγνώσιμο και διευκολύνει το review.

### 3.4 Πύλες Ποιότητας ανά Branch (σύνδεση με το CI)

Η διαμόρφωση του CI ορίζει **ποιοι έλεγχοι τρέχουν πού**, ώστε κάθε κλαδί να ελέγχεται πριν φτάσει στο `main`:

| Συμβάν (trigger) | Κλαδιά | Τι εκτελείται |
|---|---|---|
| `pull_request` | `main`, `develop` | Πλήρες CI (tests + frontend quality + docker validate) ως **gate πριν το merge** |
| `push` | `develop`, `feature/**`, `bugfix/**`, `docs/**` | Το ίδιο CI σε κάθε ενημέρωση κλαδιού (έγκαιρη ανατροφοδότηση) |
| `push` | `main` | **CD** — build & push του Docker image στο GHCR |

> **Σημείωση ειλικρίνειας / μελλοντική ευθυγράμμιση:** Το CI είναι ήδη ρυθμισμένο να
> υποστηρίζει και ένα προαιρετικό κλαδί ολοκλήρωσης `develop` και τα προθέματα
> `feature/*` · `bugfix/*` · `docs/*`. Στην πράξη, στο τρέχον sprint κάποια κλαδιά
> ονομάστηκαν ανά μέλος (π.χ. `Tachma`, `Aggelos`). Η σύμβαση `feature/*` υιοθετείται
> ως **πρότυπο για το επόμενο sprint**, ώστε η ονοματοδοσία να συμφωνεί πλήρως με τα
> triggers του pipeline.

---

## 4. Διαχείριση Εκδόσεων (Release Management)

### 4.1 Ροή Έκδοσης

Μια «έκδοση» στο μοντέλο μας ταυτίζεται με **κάθε επιτυχημένο merge στο `main`**. Επειδή το
`main` είναι πάντα deployable, κάθε merge μπορεί δυνητικά να γίνει release:

```
PR εγκρίνεται ──► merge στο main ──► ενεργοποιείται το CD (cd.yml) ──► Docker image στο GHCR ──► έτοιμο για deploy
```

### 4.2 Πακετάρισμα & Artifact

Το CD pipeline (`.github/workflows/cd.yml`):

1. Κάνει checkout τον κώδικα.
2. Συνδέεται στο GHCR με το αυτόματο `GITHUB_TOKEN` (`docker/login-action`).
3. Κτίζει το backend image από το `backend/Dockerfile` (`docker/build-push-action`).
4. Το ανεβάζει (push) στο `ghcr.io/<repository>/backend`.

Έτσι το παραδοτέο artifact δεν είναι «πηγαίος κώδικας» αλλά **έτοιμο, εκτελέσιμο Docker
image** — μπορεί να τραβηχτεί (`docker pull`) και να τρέξει οπουδήποτε χωρίς εγκατάσταση
dependencies.

### 4.3 Στρατηγική Versioning / Tagging των Images

Χρησιμοποιούμε `docker/metadata-action` με **δύο ετικέτες (tags)** ανά image:

| Tag | Τύπος | Σκοπός |
|---|---|---|
| `sha-<commit>` | **Αμετάβλητη (immutable)** | Κάθε build αντιστοιχεί μονοσήμαντα σε ένα συγκεκριμένο commit — πλήρης ιχνηλασιμότητα (traceability) & δυνατότητα rollback. |
| `latest` | **Μεταβλητή (mutable)** | Δείχνει πάντα στην πιο πρόσφατη έκδοση του `main` — βολικό για deploy «τελευταίας σταθερής». |

> **Μελλοντική βελτίωση:** προσθήκη **σημασιολογικών git tags** (`v1.0.0`, `v1.1.0`) που θα
> παράγουν αντίστοιχα image tags, για επίσημες, αριθμημένες εκδόσεις (Semantic Versioning).

### 4.4 Περιβάλλοντα & Promotion

| Περιβάλλον | Πώς στήνεται | Σκοπός |
|---|---|---|
| **Local Dev** | `npm run dev` (backend & frontend) | Καθημερινή ανάπτυξη |
| **Local Staging (Docker)** | `docker compose up` | End-to-end δοκιμή όλης της στοίβας πριν το PR |
| **Image / Release (GHCR)** | Αυτόματα από το CD σε merge στο `main` | Διανομή έτοιμου artifact για deployment |

Η «προαγωγή» (promotion) μιας αλλαγής είναι γραμμική: *branch → PR (CI) → main (CD) → GHCR
image*, με πύλη ελέγχου σε κάθε βήμα.

---

## 5. Διαχείριση Secrets & Ασφάλεια (σύνοψη)

Στο πλαίσιο της στρατηγικής έκδοσης, εφαρμόζουμε τις προτεινόμενες πρακτικές διαχείρισης
secrets (αναλυτικότερα στην ενότητα *Code Quality / Secrets* της ομάδας):

- **Καμία ευαίσθητη πληροφορία στον κώδικα ή στα images.** Οι ρυθμίσεις περνούν ως
  μεταβλητές περιβάλλοντος.
- Το `.env` είναι **gitignored**· στο repo υπάρχει μόνο το πρότυπο `backend/.env.example`.
- Στο CI, μυστικά όπως το `JWT_SECRET` δίνονται ως **environment μεταβλητές του job**
  (στο test job χρησιμοποιείται προσωρινό `test-secret-ci`), όχι hardcoded.
- Η σύνδεση στο GHCR γίνεται με το **αυτόματο `GITHUB_TOKEN`** του Actions, με ελάχιστα
  δικαιώματα (`packages: write`) — δεν αποθηκεύουμε δικά μας credentials registry.

---

## 6. Σύνοψη Αποφάσεων (Decision Summary)

| Απόφαση | Επιλογή | Κύρια αιτιολόγηση |
|---|---|---|
| Εργαλείο CI/CD | **GitHub Actions** | Native στο GitHub, δωρεάν, καμία υποδομή προς συντήρηση |
| Containerization | **Docker + Compose** | Επαναληψιμότητα & multi-service ενορχήστρωση |
| Artifact Registry | **GHCR** | Ενσωμάτωση με GitHub auth, δωρεάν |
| Branching strategy | **GitHub Flow** | Ελαφρύ, ένα deployable trunk, υποχρεωτικό PR review |
| Release trigger | **Merge στο `main`** | «Always deployable main» → αυτόματο image build |
| Image versioning | **`sha-<commit>` + `latest`** | Ιχνηλασιμότητα + βολική «τελευταία» έκδοση |
| Secrets | **`.env` + GitHub Secrets** | Καμία ευαίσθητη πληροφορία σε κώδικα/images |

---

## 7. Σημεία για Screenshots (για το κοινό παραδοτέο)

Για την τεκμηρίωση αυτής της ενότητας προτείνεται να αποτυπωθούν:

1. **GitHub → Actions tab:** ένα πράσινο (✓) επιτυχημένο run του *Backend CI*.
2. **Σελίδα Pull Request:** τα *status checks* (test / frontend-quality / docker-validate) πράσινα, πριν το merge.
3. **GitHub → Packages (GHCR):** το δημοσιευμένο `backend` image με τα tags `sha-...` και `latest`.
4. **README badge:** το *Build: Passing* badge που αντλεί κατάσταση από το pipeline.

---

*Συντάχθηκε από τον Ιωάννη Ταχμαζίδη (Ε22164) για το Sprint 3 — ενότητα «DevOps Strategy & Release Management».*
