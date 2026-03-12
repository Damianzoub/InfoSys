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

# Important Rules

Δεν επιτρέπεται **direct push to main branch**

changes should happen in **sub-branch** and later do a pull request in order for the other person to see before merging
