# Coding Agent Prompts — Αλεσία Γκίνι (Ε22043)

**Ρόλος:** Team Member · Frontend Auth UI & Profile  
**Branch:** `feature/auth-ui`

---

## 2026-05-05 — Claude Code

**Task:** PB1, PB3, PB6, PB7 — Auth Page UI (Βήμα 6 / Phase 1)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Create an AuthPage.jsx React component for a pet adoption platform.
> It should have two modes: login and register, switched by tabs.
> Login form fields: email, password. Register form fields: name, email, password.
> On submit, call POST http://localhost:8000/api/auth/login or /api/auth/register via axios.
> On success: save token and user to localStorage, show success message.
> On failure: show the error from response.data.error.
> Style it as a split card: left side with purple gradient and welcome text,
> right side with the form. Add a smooth hover animation on the card.
> Use purple color palette (#790075, #5c0258).

**Αποτέλεσμα:**
- Παρήγαγε `AuthPage.jsx` και `AuthPage.css` με split card layout
- Πρόσθεσα χειροκίνητα το mouse-move parallax effect στο left panel
- Διόρθωσα το CSS input color (text color was invisible — added `color: #1a1a1a`)

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting (δόθηκε color palette + layout description)
- [x] Review πριν commit
- [x] Iterative (2 iterations για το CSS)

---

## 2026-05-09 — Claude Code

**Task:** PB12 — Profile Page (Βήμα 8 / Phase 2 + Phase 4)  
**Platform:** Claude Code (CLI)

**Prompt:**
> Create a ProfilePage.jsx for the pet adoption React app.
> Fetch user data from GET /api/auth/me (Authorization: Bearer token from localStorage).
> If not logged in, redirect to /auth.
> Layout — dashboard cards style:
> 1. Hero card: purple gradient background, avatar circle with initials, name, role badge, email, member since date, logout button.
> 2. Three stat cards in a row: Total requests (purple), Pending (yellow), Approved (green).
> 3. Adoption history table: columns pet name (link to /pets/:id), shelter name, date, status badge.
> Status badge colors: pending=yellow, approved=green, rejected=red.
> On logout: clear localStorage token and user, redirect to /auth.
> Match the purple theme: #790075, #5c0258.

**Αποτέλεσμα:**
- Παρήγαγε `ProfilePage.jsx` και `ProfilePage.css`
- Πρόσθεσα χειροκίνητα το `initials()` helper για το avatar
- Βελτίωσα τα stat cards με hover animation

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first (δόθηκε ακριβής περιγραφή layout και χρώματα)
- [x] Review πριν commit
- [x] Iterative (2 iterations για responsive mobile layout)

---

## 2026-05-10 — Claude Code

**Task:** — Navbar profile avatar link  
**Platform:** Claude Code (CLI)

**Prompt:**
> Update Navbar.jsx for the pet adoption app.
> When a user is logged in (user object in localStorage), show a circular avatar button
> in the top-right instead of the "Σύνδεση" link. The avatar shows the user's initials (first 2 words).
> Clicking it navigates to /profile. Style it as a 36px purple circle with white text.
> Show role-specific nav links: 'user' → Οι αιτήσεις μου, 'shelter' → Πίνακας Καταφυγίου,
> 'admin' → Διαχείριση. When not logged in show Login/Register link.

**Αποτέλεσμα:**
- Ενημερώθηκε `Navbar.jsx` με conditional rendering βάσει role
- Πρόσθεσα `.nav-avatar` CSS class στο `Navbar.css`
- Επαληθεύτηκε ότι το active state λειτουργεί σωστά με NavLink

**Ορθές πρακτικές που ακολουθήθηκαν:**
- [x] Context-first prompting
- [x] Review πριν commit
- [ ] Iterative
