const request = require('supertest');
const jwt = require('jsonwebtoken');

const mockQuery = jest.fn();
jest.mock('../db', () => ({ query: mockQuery, end: jest.fn() }));

process.env.JWT_SECRET = 'test-secret';
const app = require('../app');

function makeToken(payload = {}) {
    return jwt.sign({ id: 1, email: 'test@example.com', role: 'user', ...payload }, 'test-secret');
}

beforeEach(() => {
    jest.resetAllMocks();
});

// ── GET /api/pets ─────────────────────────────────────────────────────────────
describe('GET /api/pets', () => {
    it('returns 200 with list of available pets', async () => {
        const fakePets = [
            { id: 1, name: 'Rex', species: 'dog', breed: 'Labrador', age: 2, gender: 'male', location: 'Athens', status: 'available', shelter_name: 'Happy Paws', primary_photo: null },
            { id: 2, name: 'Mimi', species: 'cat', breed: null, age: 1, gender: 'female', location: 'Thessaloniki', status: 'available', shelter_name: 'Cats Home', primary_photo: null },
        ];
        mockQuery.mockResolvedValueOnce({ rows: fakePets });

        const res = await request(app).get('/api/pets');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toBe('Rex');
    });

    it('returns 200 with empty array when no pets exist', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get('/api/pets');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('accepts query filters without crashing', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get('/api/pets?species=dog&gender=male&age=3&location=Athens');
        expect(res.statusCode).toBe(200);
        // Verify the query was called (filters were applied)
        expect(mockQuery).toHaveBeenCalledTimes(1);
    });
});

// ── GET /api/pets/:id ─────────────────────────────────────────────────────────
describe('GET /api/pets/:id', () => {
    it('returns 404 when pet does not exist', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get('/api/pets/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toMatch(/not found/i);
    });

    it('returns 200 with pet details and photos', async () => {
        const fakePet = {
            id: 1, name: 'Rex', species: 'dog', breed: 'Labrador', age: 2,
            gender: 'male', description: 'Friendly dog', location: 'Athens',
            status: 'available', created_at: new Date(),
            shelter_id: 10, shelter_name: 'Happy Paws', shelter_city: 'Athens', shelter_phone: '210-0000000'
        };
        const fakePhotos = [{ id: 1, url: '/uploads/photo.jpg', is_primary: true }];

        mockQuery
            .mockResolvedValueOnce({ rows: [fakePet] })
            .mockResolvedValueOnce({ rows: fakePhotos });

        const res = await request(app).get('/api/pets/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Rex');
        expect(res.body.shelter).toHaveProperty('name', 'Happy Paws');
        expect(res.body.photos).toHaveLength(1);
    });
});

// ── POST /api/pets (shelter only) ─────────────────────────────────────────────
describe('POST /api/pets', () => {
    it('returns 401 when not authenticated', async () => {
        const res = await request(app).post('/api/pets').send({ name: 'Buddy', species: 'dog' });
        expect(res.statusCode).toBe(401);
    });

    it('returns 403 when authenticated as regular user', async () => {
        const token = makeToken({ role: 'user' });
        const res = await request(app)
            .post('/api/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Buddy', species: 'dog' });

        expect(res.statusCode).toBe(403);
    });

    it('returns 400 when name or species is missing', async () => {
        const token = makeToken({ role: 'shelter' });
        mockQuery.mockResolvedValueOnce({ rows: [{ id: 5, name: 'Happy Paws', city: 'Athens', phone: null }] });

        const res = await request(app)
            .post('/api/pets')
            .set('Authorization', `Bearer ${token}`)
            .send({ species: 'dog' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/required/i);
    });

    it('returns 201 with new pet when shelter adds a pet', async () => {
        const token = makeToken({ role: 'shelter' });
        const fakeShelter = { id: 5, name: 'Happy Paws', city: 'Athens', phone: '210-0000000' };
        const fakePet = { id: 10, shelter_id: 5, name: 'Buddy', species: 'dog', breed: 'Beagle', age: 1, gender: 'male', description: null, location: 'Athens', status: 'available', created_at: new Date(), updated_at: new Date() };

        mockQuery
            .mockResolvedValueOnce({ rows: [fakeShelter] })
            .mockResolvedValueOnce({ rows: [fakePet] });

        const res = await request(app)
            .post('/api/pets')
            .set('Authorization', `Bearer ${token}`)
            .field('name', 'Buddy')
            .field('species', 'dog');

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Buddy');
        expect(res.body.shelter).toHaveProperty('name', 'Happy Paws');
    });
});
