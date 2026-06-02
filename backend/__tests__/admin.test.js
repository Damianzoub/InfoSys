process.env.JWT_SECRET = 'test-secret';

jest.mock('../src/db', () => ({ query: jest.fn() }));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const db = require('../src/db');
const app = require('../src/app');

function makeToken(payload) {
    return `Bearer ${jwt.sign(payload, 'test-secret')}`;
}

beforeEach(() => {
    db.query.mockReset();
});

describe('GET /api/admin/stats', () => {
    it('returns 401 without an auth token', async () => {
        const res = await request(app).get('/api/admin/stats');
        expect(res.status).toBe(401);
    });

    it('returns 403 for a non-admin user', async () => {
        const res = await request(app)
            .get('/api/admin/stats')
            .set('Authorization', makeToken({ id: 1, role: 'user' }));
        expect(res.status).toBe(403);
    });

    it('returns 403 for a shelter user', async () => {
        const res = await request(app)
            .get('/api/admin/stats')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }));
        expect(res.status).toBe(403);
    });

    it('returns 200 with stats object for an admin', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [{ count: '42' }] })
            .mockResolvedValueOnce({ rows: [{ count: '5' }] })
            .mockResolvedValueOnce({ rows: [{ count: '30' }] })
            .mockResolvedValueOnce({
                rows: [{ total: '10', pending: '4', approved: '4', rejected: '2' }],
            });

        const res = await request(app)
            .get('/api/admin/stats')
            .set('Authorization', makeToken({ id: 1, role: 'admin' }));

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            users: 42,
            shelters: 5,
            pets: 30,
            adoptions: {
                total: 10,
                pending: 4,
                approved: 4,
                rejected: 2,
            },
        });
    });
});

describe('GET /api/admin/report', () => {
    it('returns 401 without an auth token', async () => {
        const res = await request(app).get('/api/admin/report');
        expect(res.status).toBe(401);
    });

    it('returns 403 for a non-admin role', async () => {
        const res = await request(app)
            .get('/api/admin/report')
            .set('Authorization', makeToken({ id: 1, role: 'shelter' }));
        expect(res.status).toBe(403);
    });

    it('returns 200 with a report object for an admin', async () => {
        db.query
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .get('/api/admin/report')
            .set('Authorization', makeToken({ id: 1, role: 'admin' }));

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('generated_at');
        expect(res.body).toHaveProperty('shelters');
        expect(res.body).toHaveProperty('recent_adoptions');
        expect(Array.isArray(res.body.shelters)).toBe(true);
    });
});
