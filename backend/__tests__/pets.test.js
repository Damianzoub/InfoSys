process.env.JWT_SECRET = 'test-secret';

jest.mock('../src/db', () => ({ query: jest.fn() }));

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../src/db');
const petsRouter = require('../src/routes/pets');
const errorHandler = require('../src/middleware/errorHandler');

// The pets router is not yet mounted in app.js, so we create a minimal test app
const app = express();
app.use(express.json());
app.use('/api/pets', petsRouter);
app.use(errorHandler);

function makeToken(payload) {
    return `Bearer ${jwt.sign(payload, 'test-secret')}`;
}

const SAMPLE_PET = {
    id: 1, name: 'Buddy', species: 'dog', breed: 'Labrador',
    age: 3, gender: 'male', location: 'Athens', status: 'available',
    shelter_name: 'Happy Paws', primary_photo: null,
};

beforeEach(() => {
    db.query.mockReset();
});

describe('GET /api/pets', () => {
    it('returns 200 with a list of available pets', async () => {
        db.query.mockResolvedValueOnce({ rows: [SAMPLE_PET] });

        const res = await request(app).get('/api/pets');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('name', 'Buddy');
    });

    it('returns 200 with filtered results when species query param is given', async () => {
        db.query.mockResolvedValueOnce({ rows: [SAMPLE_PET] });

        const res = await request(app).get('/api/pets?species=dog');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns an empty array when no pets match the filters', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get('/api/pets?species=unicorn');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns 200 when filtering by gender', async () => {
        db.query.mockResolvedValueOnce({ rows: [SAMPLE_PET] });

        const res = await request(app).get('/api/pets?gender=male');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 200 when filtering by age', async () => {
        db.query.mockResolvedValueOnce({ rows: [SAMPLE_PET] });

        const res = await request(app).get('/api/pets?age=5');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 200 when filtering by location', async () => {
        db.query.mockResolvedValueOnce({ rows: [SAMPLE_PET] });

        const res = await request(app).get('/api/pets?location=Athens');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('GET /api/pets/:id', () => {
    it('returns 200 with full pet details', async () => {
        const petRow = { ...SAMPLE_PET, shelter_id: 1, shelter_city: 'Athens', shelter_phone: '210000000', description: 'Friendly dog', created_at: new Date() };
        db.query
            .mockResolvedValueOnce({ rows: [petRow] })
            .mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get('/api/pets/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('shelter');
        expect(res.body).toHaveProperty('photos');
    });

    it('returns 404 when the pet does not exist', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get('/api/pets/9999');
        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/Pet not found/);
    });
});

describe('POST /api/pets', () => {
    it('returns 401 without an auth token', async () => {
        const res = await request(app).post('/api/pets').send({ name: 'Max', species: 'cat' });
        expect(res.status).toBe(401);
    });

    it('returns 403 when the user is not a shelter', async () => {
        const res = await request(app)
            .post('/api/pets')
            .set('Authorization', makeToken({ id: 1, role: 'user' }))
            .send({ name: 'Max', species: 'cat' });
        expect(res.status).toBe(403);
    });

    it('returns 400 when name is missing', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Happy Paws', city: 'Athens', phone: '210' }] });

        const res = await request(app)
            .post('/api/pets')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ species: 'cat' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Name and species are required/);
    });

    it('returns 403 when shelter is not associated with the user', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .post('/api/pets')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ name: 'Max', species: 'cat' });
        expect(res.status).toBe(403);
    });

    it('returns 201 on successful creation without photos', async () => {
        const newPet = {
            id: 5, shelter_id: 1, name: 'Max', species: 'cat',
            breed: null, age: null, gender: null, description: null,
            location: null, status: 'available', created_at: new Date(),
        };
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Happy Paws', city: 'Athens', phone: '210' }] })
            .mockResolvedValueOnce({ rows: [newPet] });

        const res = await request(app)
            .post('/api/pets')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ name: 'Max', species: 'cat' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id', 5);
        expect(res.body).toHaveProperty('shelter');
        expect(res.body.photos).toEqual([]);
    });
});

describe('PUT /api/pets/:id', () => {
    it('returns 401 without an auth token', async () => {
        const res = await request(app).put('/api/pets/1').send({ name: 'NewName' });
        expect(res.status).toBe(401);
    });

    it('returns 403 when the pet does not belong to the requesting shelter', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 99 }] })        // shelter lookup → shelter id 99
            .mockResolvedValueOnce({ rows: [{ id: 1, shelter_id: 50 }] }); // pet belongs to shelter 50

        const res = await request(app)
            .put('/api/pets/1')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ name: 'NewName' });
        expect(res.status).toBe(403);
    });

    it('returns 404 when the pet does not exist', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })  // shelter found
            .mockResolvedValueOnce({ rows: [] });            // pet not found

        const res = await request(app)
            .put('/api/pets/9999')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ status: 'adopted' });
        expect(res.status).toBe(404);
    });

    it('returns 403 when the user is not associated with a shelter', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .put('/api/pets/1')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ name: 'UpdatedName' });
        expect(res.status).toBe(403);
        expect(res.body.error).toMatch(/not associated/);
    });

    it('returns 200 on successful update', async () => {
        const updatedPet = { id: 1, name: 'UpdatedName', species: 'dog', shelter_id: 1, status: 'available' };
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })                  // shelter found
            .mockResolvedValueOnce({ rows: [{ id: 1, shelter_id: 1 }] })   // pet belongs to shelter
            .mockResolvedValueOnce({ rows: [updatedPet] });                 // update result

        const res = await request(app)
            .put('/api/pets/1')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ name: 'UpdatedName' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'UpdatedName');
    });
});
