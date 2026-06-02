process.env.JWT_SECRET = 'test-secret';

jest.mock('../src/db', () => ({ query: jest.fn() }));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const db = require('../src/db');
const app = require('../src/app');

function makeToken(payload = { id: 1, role: 'user' }) {
    return `Bearer ${jwt.sign(payload, 'test-secret')}`;
}

beforeEach(() => {
    db.query.mockReset();
});

describe('POST /api/adoptions', () => {
    it('returns 401 without an auth token', async () => {
        const res = await request(app).post('/api/adoptions').send({ pet_id: 1 });
        expect(res.status).toBe(401);
    });

    it('returns 400 when pet_id is missing', async () => {
        const res = await request(app)
            .post('/api/adoptions')
            .set('Authorization', makeToken())
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/pet_id/);
    });

    it('returns 404 when the pet does not exist', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .post('/api/adoptions')
            .set('Authorization', makeToken())
            .send({ pet_id: 999 });
        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/Pet not found/);
    });

    it('returns 409 when the pet is not available', async () => {
        db.query.mockResolvedValueOnce({
            rows: [{ id: 1, shelter_id: 1, status: 'adopted' }],
        });

        const res = await request(app)
            .post('/api/adoptions')
            .set('Authorization', makeToken())
            .send({ pet_id: 1 });
        expect(res.status).toBe(409);
        expect(res.body.error).toMatch(/not available/);
    });

    it('returns 201 on a successful adoption request', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 1, shelter_id: 1, status: 'available' }] })
            .mockResolvedValueOnce({
                rows: [{
                    id: 10, user_id: 1, pet_id: 1, shelter_id: 1,
                    status: 'pending', message: 'I want to adopt', created_at: new Date(),
                }],
            });

        const res = await request(app)
            .post('/api/adoptions')
            .set('Authorization', makeToken())
            .send({ pet_id: 1, message: 'I want to adopt' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.status).toBe('pending');
    });

    it('returns 409 when the user already has a pending request for this pet', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 1, shelter_id: 1, status: 'available' }] })
            .mockRejectedValueOnce(Object.assign(new Error('duplicate'), { code: '23505' }));

        const res = await request(app)
            .post('/api/adoptions')
            .set('Authorization', makeToken())
            .send({ pet_id: 1 });
        expect(res.status).toBe(409);
        expect(res.body.error).toMatch(/pending request/);
    });
});

describe('GET /api/adoptions/user', () => {
    it('returns 401 without an auth token', async () => {
        const res = await request(app).get('/api/adoptions/user');
        expect(res.status).toBe(401);
    });

    it('returns 200 with the list of the user\'s adoption requests', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get('/api/adoptions/user')
            .set('Authorization', makeToken());
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('GET /api/adoptions/shelter', () => {
    it('returns 401 without an auth token', async () => {
        const res = await request(app).get('/api/adoptions/shelter');
        expect(res.status).toBe(401);
    });

    it('returns 403 when the user is not a shelter', async () => {
        const res = await request(app)
            .get('/api/adoptions/shelter')
            .set('Authorization', makeToken({ id: 1, role: 'user' }));
        expect(res.status).toBe(403);
    });

    it('returns 404 when shelter profile is not found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get('/api/adoptions/shelter')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }));
        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/Shelter profile not found/);
    });

    it('returns 200 with a list of adoption requests for the shelter', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })
            .mockResolvedValueOnce({
                rows: [{
                    id: 5, pet_id: 1, pet_name: 'Buddy', applicant_name: 'Alice',
                    applicant_email: 'alice@example.com', message: 'Hi',
                    status: 'pending', created_at: new Date(),
                }],
            });

        const res = await request(app)
            .get('/api/adoptions/shelter')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }));
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('applicant_name');
    });
});

describe('PUT /api/adoptions/:id', () => {
    it('returns 401 without an auth token', async () => {
        const res = await request(app).put('/api/adoptions/1').send({ status: 'approved' });
        expect(res.status).toBe(401);
    });

    it('returns 403 when the user is not a shelter', async () => {
        const res = await request(app)
            .put('/api/adoptions/1')
            .set('Authorization', makeToken({ id: 1, role: 'user' }))
            .send({ status: 'approved' });
        expect(res.status).toBe(403);
    });

    it('returns 400 when status value is invalid', async () => {
        const res = await request(app)
            .put('/api/adoptions/1')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ status: 'invalid_status' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/approved.*rejected/);
    });

    it('returns 404 when shelter profile is not found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .put('/api/adoptions/1')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ status: 'approved' });
        expect(res.status).toBe(404);
    });

    it('returns 404 when the adoption request does not exist', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })  // shelter found
            .mockResolvedValueOnce({ rows: [] })             // not in this shelter
            .mockResolvedValueOnce({ rows: [] });            // not found at all

        const res = await request(app)
            .put('/api/adoptions/999')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ status: 'approved' });
        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/not found/);
    });

    it('returns 403 when the request belongs to another shelter', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })   // shelter found
            .mockResolvedValueOnce({ rows: [] })              // not in this shelter
            .mockResolvedValueOnce({ rows: [{ id: 5 }] });   // exists but belongs to other shelter

        const res = await request(app)
            .put('/api/adoptions/5')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ status: 'approved' });
        expect(res.status).toBe(403);
        expect(res.body.error).toMatch(/does not belong/);
    });

    it('returns 200 on successful rejection', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })   // shelter found
            .mockResolvedValueOnce({ rows: [{ id: 5 }] })   // request found
            .mockResolvedValueOnce({ rows: [{ id: 5, status: 'rejected', updated_at: new Date() }] });

        const res = await request(app)
            .put('/api/adoptions/5')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ status: 'rejected' });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('rejected');
    });

    it('returns 200 on successful approval and cascades pet/other-requests update', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [{ id: 1 }] })   // shelter found
            .mockResolvedValueOnce({ rows: [{ id: 5 }] })   // request found
            .mockResolvedValueOnce({ rows: [{ id: 5, status: 'approved', updated_at: new Date() }] })
            .mockResolvedValueOnce({ rows: [{ pet_id: 3 }] }) // get pet_id for cascade
            .mockResolvedValueOnce({ rows: [] })               // update pet to adopted
            .mockResolvedValueOnce({ rows: [] });              // reject other pending requests

        const res = await request(app)
            .put('/api/adoptions/5')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }))
            .send({ status: 'approved' });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('approved');
        expect(db.query).toHaveBeenCalledTimes(6);
    });
});
