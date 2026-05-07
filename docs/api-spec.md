# API Specification — Pet Adoption Platform

> **Canonical contract for Sprint 3.**  
> Frontend developers use mock data shaped exactly like the responses below until the backend endpoint is ready.  
> All protected routes require `Authorization: Bearer <JWT>` header.

Base URL (local): `http://localhost:8000`

---

## Auth

### `POST /api/auth/register`

Register a new user account.

**Request body**
```json
{
  "name": "Γιώργος Παπαδόπουλος",
  "email": "giorgos@example.com",
  "password": "secret123",
  "role": "user"
}
```
`role` is optional; defaults to `"user"`. Accepted values: `"user"`, `"shelter"`.

**201 Created**
```json
{
  "token": "<JWT>",
  "user": {
    "id": 1,
    "name": "Γιώργος Παπαδόπουλος",
    "email": "giorgos@example.com",
    "role": "user"
  }
}
```

**409 Conflict** — email already registered
```json
{ "error": "Email already in use" }
```

---

### `POST /api/auth/login`

Authenticate and receive a JWT.

**Request body**
```json
{
  "email": "giorgos@example.com",
  "password": "secret123"
}
```

**200 OK**
```json
{
  "token": "<JWT>",
  "user": {
    "id": 1,
    "name": "Γιώργος Παπαδόπουλος",
    "email": "giorgos@example.com",
    "role": "user"
  }
}
```

**401 Unauthorized**
```json
{ "error": "Invalid credentials" }
```

---

### `GET /api/auth/me` 🔒

Return the logged-in user's profile and their adoption request history.

**200 OK**
```json
{
  "id": 1,
  "name": "Γιώργος Παπαδόπουλος",
  "email": "giorgos@example.com",
  "role": "user",
  "created_at": "2026-05-01T10:00:00Z",
  "adoption_requests": [
    {
      "id": 7,
      "pet_id": 3,
      "pet_name": "Rex",
      "shelter_name": "Καταφύγιο Αθήνας",
      "status": "pending",
      "created_at": "2026-05-05T14:30:00Z"
    }
  ]
}
```

---

## Pets

### `GET /api/pets`

List available pets. All query params are optional.

**Query params**

| Param      | Type   | Example          |
|------------|--------|------------------|
| `species`  | string | `dog`            |
| `age`      | number | `2` (max years)  |
| `gender`   | string | `female`         |
| `location` | string | `Αθήνα`          |

**200 OK**
```json
[
  {
    "id": 3,
    "name": "Rex",
    "species": "dog",
    "breed": "Labrador",
    "age": 2.0,
    "gender": "male",
    "location": "Αθήνα",
    "status": "available",
    "primary_photo": "/uploads/1234-rex.jpg",
    "shelter_name": "Καταφύγιο Αθήνας"
  }
]
```

---

### `GET /api/pets/:id`

Return full pet detail including all photos.

**200 OK**
```json
{
  "id": 3,
  "name": "Rex",
  "species": "dog",
  "breed": "Labrador",
  "age": 2.0,
  "gender": "male",
  "description": "Φιλικός, εκπαιδευμένος, αγαπά τα παιδιά.",
  "location": "Αθήνα",
  "status": "available",
  "shelter": {
    "id": 1,
    "name": "Καταφύγιο Αθήνας",
    "city": "Αθήνα",
    "phone": "210-1234567"
  },
  "photos": [
    { "id": 5, "url": "/uploads/1234-rex.jpg", "is_primary": true },
    { "id": 6, "url": "/uploads/1235-rex2.jpg", "is_primary": false }
  ],
  "created_at": "2026-04-20T09:00:00Z"
}
```

**404 Not Found**
```json
{ "error": "Pet not found" }
```

---

### `POST /api/pets` 🔒 shelter

Create a new pet listing. Body is `multipart/form-data`.

**Form fields**

| Field         | Type     | Required |
|---------------|----------|----------|
| `name`        | string   | yes      |
| `species`     | string   | yes      |
| `breed`       | string   | no       |
| `age`         | number   | no       |
| `gender`      | string   | no       |
| `description` | string   | no       |
| `location`    | string   | no       |
| `photos`      | file[]   | no       |

**201 Created** — returns the created pet object (same shape as `GET /api/pets/:id`)

**403 Forbidden** — caller is not a shelter account

---

### `PUT /api/pets/:id` 🔒 shelter

Update an existing pet. Body is `multipart/form-data` (same fields as POST, all optional).

**200 OK** — returns the updated pet object

**403 Forbidden** — caller does not own this pet's shelter

**404 Not Found**

---

## Adoptions

### `POST /api/adoptions` 🔒 user

Submit an adoption request.

**Request body**
```json
{
  "pet_id": 3,
  "message": "Έχω σπίτι με κήπο και δύο παιδιά."
}
```

**201 Created**
```json
{
  "id": 7,
  "user_id": 1,
  "pet_id": 3,
  "shelter_id": 1,
  "status": "pending",
  "message": "Έχω σπίτι με κήπο και δύο παιδιά.",
  "created_at": "2026-05-05T14:30:00Z"
}
```

**409 Conflict** — user already has an open request for this pet
```json
{ "error": "You already have a pending request for this pet" }
```

---

### `GET /api/adoptions/user` 🔒 user

Return all adoption requests made by the logged-in user.

**200 OK**
```json
[
  {
    "id": 7,
    "pet_id": 3,
    "pet_name": "Rex",
    "pet_photo": "/uploads/1234-rex.jpg",
    "shelter_name": "Καταφύγιο Αθήνας",
    "status": "pending",
    "created_at": "2026-05-05T14:30:00Z"
  }
]
```

---

### `GET /api/adoptions/shelter` 🔒 shelter

Return all adoption requests for the logged-in shelter's pets.

**200 OK**
```json
[
  {
    "id": 7,
    "pet_id": 3,
    "pet_name": "Rex",
    "applicant_name": "Γιώργος Παπαδόπουλος",
    "applicant_email": "giorgos@example.com",
    "message": "Έχω σπίτι με κήπο και δύο παιδιά.",
    "status": "pending",
    "created_at": "2026-05-05T14:30:00Z"
  }
]
```

---

### `PUT /api/adoptions/:id` 🔒 shelter

Approve or reject an adoption request.

**Request body**
```json
{ "status": "approved" }
```
Accepted values: `"approved"`, `"rejected"`.

**200 OK**
```json
{
  "id": 7,
  "status": "approved",
  "updated_at": "2026-05-06T10:00:00Z"
}
```

**403 Forbidden** — request does not belong to this shelter

**404 Not Found**

---

## Admin

### `GET /api/admin/stats` 🔒 admin

**200 OK**
```json
{
  "users": 42,
  "shelters": 5,
  "pets": 130,
  "adoptions": {
    "total": 88,
    "pending": 14,
    "approved": 60,
    "rejected": 14
  }
}
```

---

### `GET /api/admin/report` 🔒 admin

Full data dump for reporting.

**200 OK**
```json
{
  "generated_at": "2026-05-07T12:00:00Z",
  "shelters": [
    {
      "id": 1,
      "name": "Καταφύγιο Αθήνας",
      "city": "Αθήνα",
      "total_pets": 40,
      "total_adoptions": 22
    }
  ],
  "recent_adoptions": [
    {
      "id": 7,
      "pet_name": "Rex",
      "shelter_name": "Καταφύγιο Αθήνας",
      "applicant_name": "Γιώργος Παπαδόπουλος",
      "status": "approved",
      "created_at": "2026-05-05T14:30:00Z"
    }
  ]
}
```

---

## Error envelope

All error responses follow this shape:

```json
{ "error": "<human-readable message>" }
```

HTTP status codes used:

| Code | Meaning              |
|------|----------------------|
| 400  | Bad request / validation error |
| 401  | Missing or invalid JWT |
| 403  | Forbidden (wrong role) |
| 404  | Resource not found   |
| 409  | Conflict             |
| 500  | Internal server error |
