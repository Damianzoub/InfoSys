# Σειρά Ανάπτυξης — Dependencies & Βήματα

> Κάθε φάση ξεκινάει μόνο όταν ολοκληρωθεί η προηγούμενη.  
> Φάσεις 1–4 τρέχουν **παράλληλα** εντός της φάσης.

---

## Φάση 0 — Υποδομή (Δαμιανός · ~1 μέρα)

> ⚠️ Κανείς δεν ξεκινάει κώδικα πριν ολοκληρωθεί αυτή η φάση.

- [ ] **Βήμα 1** — DB schema: δημιουργία tables `users`, `shelters`, `pets`, `photos`, `adoption_requests`
- [ ] **Βήμα 2** — Express project init + middleware (cors, dotenv, jwt, multer, error handler)
- [ ] **Βήμα 3** — `docs/api-spec.md` με όλα τα endpoints, request/response shapes

> ✅ Όταν το Βήμα 3 είναι στο repo, ξεκλειδώνονται όλοι οι υπόλοιποι.

---

## Φάση 1 — Backend + Frontend με mocks (παράλληλα · ~2–3 μέρες)

> Προϋπόθεση: Φάση 0 ολοκληρωμένη.

- [ ] **Βήμα 4** — (Χρήστος) Pet CRUD endpoints + image upload + Shelter endpoints
- [ ] **Βήμα 5** — (Ιωάννης) Adoption request endpoints + Approve/Reject logic + Admin stats API
- [ ] **Βήμα 6** — (Αλεσία) Register/Login forms — με mock responses (δεν χρειάζεται real backend ακόμα)
- [ ] **Βήμα 7** — (Άγγελος) Pet list + φίλτρα + σελίδα προφίλ ζώου — με hardcoded mock JSON

---

## Φάση 2 — Σύνδεση Auth (παράλληλα · ~1 μέρα)

> Προϋπόθεση: Βήμα 2 (auth backend) ολοκληρωμένο.

- [ ] **Βήμα 8** — (Αλεσία) Αντικατάσταση mocks με real `/api/auth/register` + `/api/auth/login`
- [ ] **Βήμα 9** — (Άγγελος) Προσθήκη JWT token στα Axios calls για protected routes

---

## Φάση 3 — Σύνδεση Pet Data (παράλληλα · ~1 μέρα)

> Προϋπόθεση: Βήμα 4 (pet endpoints) ολοκληρωμένο.

- [ ] **Βήμα 10** — (Άγγελος) Σύνδεση pet list + φίλτρα με real `/api/pets`
- [ ] **Βήμα 11** — (Άγγελος) Σελίδα προφίλ ζώου με real data από `/api/pets/:id`

---

## Φάση 4 — Σύνδεση Adoption + Shelter + Admin UI (~1–2 μέρες)

> Προϋπόθεση: Βήμα 5 (adoption + admin endpoints) ολοκληρωμένο.

- [ ] **Βήμα 12** — (Άγγελος + Αλεσία) Adoption form UI συνδεδεμένο με `/api/adoptions`
- [ ] **Βήμα 13** — (Χρήστος + Ιωάννης) Shelter dashboard UI — λίστα αιτήσεων + Approve/Reject buttons
- [ ] **Βήμα 14** — (Ιωάννης) Admin panel UI με stats + report view

---

## Φάση 5 — Integration, Screenshots & Παραδοτέο (όλοι · ~1 μέρα)

> Προϋπόθεση: Φάσεις 1–4 ολοκληρωμένες.

- [ ] **Βήμα 15** — End-to-end δοκιμή: εγγραφή → αναζήτηση → αίτηση → έγκριση → admin report
- [ ] **Βήμα 16** — Screenshots για κάθε Κριτήριο Ολοκλήρωσης (US1.1 → US5.2)
- [ ] **Βήμα 17** — README ενημέρωση με οδηγίες `docker-compose up` + env variables
- [ ] **Βήμα 18** — Κάθε μέλος ολοκληρώνει το `docs/prompts-<AM>.md` με τα Coding Agent entries
- [ ] **Βήμα 19** — Sprint Retrospective section στο `SPRINT3_PLANNING.md`
- [ ] **Βήμα 20** — Ατομικό PDF παραδοτέο (ρόλος + tasks + screenshots + prompts + retrospective)

---

## Σύνοψη εξαρτήσεων

```
Βήμα 1 ──┐
Βήμα 2 ──┼──► Βήμα 3 (API spec) ──► Βήματα 4,5,6,7 (παράλληλα)
          │                                    │
          │              ┌─────────────────────┤
          │              ▼                     ▼
          │         Βήμα 8,9            Βήμα 10,11
          │         (auth UI)           (pet UI)
          │              │                     │
          └──────────────┴──────────────────────► Βήματα 12,13,14
                                                        │
                                                        ▼
                                               Βήματα 15–20
                                               (integration + παραδοτέο)
```

---

*Τελευταία ενημέρωση: Sprint 3 kickoff*
