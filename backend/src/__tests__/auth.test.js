const request = require('supertest');
const bcrypt = require('bcryptjs');

// Mock the DB before requiring app
const mockQuery = jest.fn();
jest.mock('../db', () => ({ query: mockQuery, end: jest.fn() }));

process.env.JWT_SECRET = 'test-secret';
const app = require('../app');

beforeEach(() => {
    jest.resetAllMocks();
});

// ── POST /api/auth/register ───────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
    it('returns 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/required/i);
    });

    it('returns 400 for invalid role', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'test@example.com', password: '123456', role: 'superadmin' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/role/i);
    });

    it('returns 400 when shelter role is missing shelter_name', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test Shelter', email: 'shelter@example.com', password: '123456', role: 'shelter' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/shelter_name/i);
    });

    it('returns 409 when email already exists', async () => {
        mockQuery.mockRejectedValueOnce({ code: '23505' });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'dup@example.com', password: '123456' });

        expect(res.statusCode).toBe(409);
        expect(res.body.error).toMatch(/already in use/i);
    });

    it('returns 201 with token and user on successful registration', async () => {
        const fakeUser = { id: 1, name: 'Test User', email: 'new@example.com', role: 'user', created_at: new Date() };
        mockQuery.mockResolvedValueOnce({ rows: [fakeUser] });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'new@example.com', password: 'securepass' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe('new@example.com');
        expect(res.body.user.role).toBe('user');
    });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
    it('returns 400 when email or password is missing', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/required/i);
    });

    it('returns 401 when user does not exist', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nobody@example.com', password: 'wrong' });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/invalid credentials/i);
    });

    it('returns 401 when password is wrong', async () => {
        const hash = await bcrypt.hash('correctpass', 10);
        mockQuery.mockResolvedValueOnce({
            rows: [{ id: 1, name: 'User', email: 'user@example.com', role: 'user', password_hash: hash }]
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@example.com', password: 'wrongpass' });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/invalid credentials/i);
    });

    it('returns 200 with token on valid credentials', async () => {
        const hash = await bcrypt.hash('mypassword', 10);
        mockQuery.mockResolvedValueOnce({
            rows: [{ id: 2, name: 'Jane', email: 'jane@example.com', role: 'user', password_hash: hash }]
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'jane@example.com', password: 'mypassword' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe('jane@example.com');
    });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
describe('GET /api/auth/me', () => {
    it('returns 401 when no Authorization header is provided', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.statusCode).toBe(401);
    });

    it('returns 401 for an invalid token', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', 'Bearer invalidtoken');

        expect(res.statusCode).toBe(401);
    });
});
