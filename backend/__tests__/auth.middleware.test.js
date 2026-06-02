process.env.JWT_SECRET = 'test-secret';

const jwt = require('jsonwebtoken');
const { requireAuth, requireRole } = require('../src/middleware/auth');

function mockRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
}

describe('requireAuth', () => {
    it('returns 401 when Authorization header is missing', () => {
        const req = { headers: {} };
        const res = mockRes();
        const next = jest.fn();

        requireAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when token is malformed', () => {
        const req = { headers: { authorization: 'Bearer not.a.valid.token' } };
        const res = mockRes();
        const next = jest.fn();

        requireAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next() and attaches user when token is valid', () => {
        const payload = { id: 1, role: 'user' };
        const token = jwt.sign(payload, 'test-secret');
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = mockRes();
        const next = jest.fn();

        requireAuth(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.user).toMatchObject({ id: 1, role: 'user' });
    });
});

describe('requireRole', () => {
    it('returns 403 when user role does not match required role', () => {
        const token = jwt.sign({ id: 1, role: 'user' }, 'test-secret');
        const [authMw, roleMw] = requireRole('admin');
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = mockRes();
        const next = jest.fn();

        authMw(req, res, next);
        roleMw(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('calls next() when user has the required role', () => {
        const token = jwt.sign({ id: 1, role: 'shelter' }, 'test-secret');
        const [authMw, roleMw] = requireRole('shelter');
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = mockRes();
        const next = jest.fn();

        authMw(req, res, next);
        roleMw(req, res, next);

        expect(next).toHaveBeenCalledTimes(2);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('returns 401 if no token provided (auth step fails first)', () => {
        const [authMw] = requireRole('shelter');
        const req = { headers: {} };
        const res = mockRes();
        const next = jest.fn();

        authMw(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
    });
});
