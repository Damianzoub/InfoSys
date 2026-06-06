# CI/CD στο Project

---

# Τι είναι το CI/CD

Το **CI/CD (Continuous Integration / Continuous Delivery)** είναι μια πρακτική ανάπτυξης λογισμικού που επιτρέπει την αυτόματη δοκιμή και επαλήθευση του κώδικα.

Με αυτό τον τρόπο μειώνονται τα προβλήματα όταν πολλά μέλη της ομάδας δουλεύουν στον ίδιο κώδικα.

---

# Continuous Integration (CI)

Το CI σημαίνει ότι κάθε αλλαγή στον κώδικα ελέγχεται αυτόματα.

Για παράδειγμα:

- εγκατάσταση dependencies
- tests
- build validation

---

# Continuous Delivery (CD)

Το CD εξασφαλίζει ότι το σύστημα μπορεί να εκτελεστεί σωστά σε κάθε στιγμή.

Για το project αυτό μπορεί να περιλαμβάνει:

- Docker build
- validation του docker-compose
- προετοιμασία για deployment

---

# Pipeline Checks
Το CI/CD pipeline του εκτελεί αυτόματα:

- Backend dependency installation
- Backend tests
- Frontend dependency installation
- ESLint code quality validation
- Prettier formatting validation
- Frontend build validation
- Deployment simulation

Με αυτόν τον τρόπο διασφαλίζεται ότι ο κώδικας είναι λειτουργικός και ακολουθεί τα πρότυπα ποιότητας της ομάδας.

# Code Quality

Για τον έλεγχο ποιότητας κώδικα χρησιμοποιούνται:

-ESLint
-Prettier
-GitHub Actions

Το ESLint εντοπίζει πιθανά προβλήματα στον JavaScript/React κώδικα.
Το Prettier διασφαλίζει ενιαία μορφοποίηση σε όλα τα αρχεία του project.
Οι έλεγχοι αυτοί εκτελούνται αυτόματα μέσα από το CI/CD pipeline.

# Repository

Repository URL:
https://github.com/Damianzoub/InfoSys

Το repository περιλαμβάνει:
- GitHub Actions Workflows
- Test Suite
- ESLint Configuration
- Prettier Configuration
- Docker Configuration
- Project Documentation
