const request = require('supertest');

jest.mock('../db', () => ({ query: jest.fn(), end: jest.fn() }));

const app = require('../app');

describe('GET /health', () => {
    it('returns 200 with status ok', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });

    it('returns 404 for unknown routes', async () => {
        const res = await request(app).get('/nonexistent');
        expect(res.statusCode).toBe(404);
    });
});
