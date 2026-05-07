-- Pet Adoption Platform — Database Schema
-- Run once against the pet_adoption_db database.
-- psql -U postgres -d pet_adoption_db -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────
-- users
-- role: 'user' | 'shelter' | 'admin'
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120)        NOT NULL,
    email         VARCHAR(255)        NOT NULL UNIQUE,
    password_hash TEXT                NOT NULL,
    role          VARCHAR(20)         NOT NULL DEFAULT 'user'
                      CHECK (role IN ('user', 'shelter', 'admin')),
    created_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- shelters
-- One shelter record per shelter-role user.
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shelters (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(200)        NOT NULL,
    address     TEXT,
    city        VARCHAR(100),
    phone       VARCHAR(30),
    description TEXT,
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS shelters_user_id_uq ON shelters(user_id);

-- ─────────────────────────────────────────
-- pets
-- status: 'available' | 'adopted' | 'pending'
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pets (
    id          SERIAL PRIMARY KEY,
    shelter_id  INTEGER             NOT NULL REFERENCES shelters(id) ON DELETE CASCADE,
    name        VARCHAR(100)        NOT NULL,
    species     VARCHAR(60)         NOT NULL,   -- e.g. 'dog', 'cat', 'rabbit'
    breed       VARCHAR(100),
    age         NUMERIC(4,1),                   -- years, e.g. 1.5
    gender      VARCHAR(10)         CHECK (gender IN ('male', 'female', 'unknown')),
    description TEXT,
    location    VARCHAR(150),                   -- city / area shown to users
    status      VARCHAR(20)         NOT NULL DEFAULT 'available'
                    CHECK (status IN ('available', 'pending', 'adopted')),
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pets_set_updated_at ON pets;
CREATE TRIGGER pets_set_updated_at
    BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────
-- photos
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS photos (
    id          SERIAL PRIMARY KEY,
    pet_id      INTEGER             NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    url         TEXT                NOT NULL,   -- path relative to /uploads or full URL
    is_primary  BOOLEAN             NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- only one primary photo per pet
CREATE UNIQUE INDEX IF NOT EXISTS photos_primary_uq
    ON photos(pet_id) WHERE is_primary = TRUE;

-- ─────────────────────────────────────────
-- adoption_requests
-- status: 'pending' | 'approved' | 'rejected'
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS adoption_requests (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id      INTEGER             NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    shelter_id  INTEGER             NOT NULL REFERENCES shelters(id) ON DELETE CASCADE,
    status      VARCHAR(20)         NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected')),
    message     TEXT,                          -- optional note from applicant
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS adoption_requests_set_updated_at ON adoption_requests;
CREATE TRIGGER adoption_requests_set_updated_at
    BEFORE UPDATE ON adoption_requests
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- one open request per user per pet
CREATE UNIQUE INDEX IF NOT EXISTS adoption_requests_open_uq
    ON adoption_requests(user_id, pet_id)
    WHERE status = 'pending';
