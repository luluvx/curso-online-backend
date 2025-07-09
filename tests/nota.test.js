const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

process.env.JWT_SECRET = 'secreto-prueba';

// Mock de middlewares y servicios
jest.mock('../src/middlewares/auth.middleware', () => ({
    verifyToken: (req, res, next) => {
        req.user = { id: 1 };
        next();
    }
}));
jest.mock('../src/middlewares/permission.middleware', () => ({
    hasPermission: () => (req, res, next) => next()
}));

jest.mock('../src/modules/nota/nota.service', () => ({
    create: jest.fn(),
    findByInscripcion: jest.fn(),
    findMine: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}));

const notaService = require('../src/modules/nota/nota.service');
const app = express();
app.use(bodyParser.json());
require('../src/modules/nota/nota.routes')(app);
const errorHandler = require('../src/middlewares/error.middleware');
app.use(errorHandler);

describe('📝 POST /api/inscripciones/:inscripcionId/notas (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Crea una nota exitosamente', async () => {
        const notaMock = { id: 1, inscripcionId: '10', valor: 8, tipoNotaId: 2 };
        notaService.create.mockResolvedValue(notaMock);

        const res = await request(app)
            .post('/api/inscripciones/10/notas')
            .send({ valor: 8, tipoNotaId: 2 });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(notaMock);
        expect(notaService.create).toHaveBeenCalledWith('10', 8, 2, 1);
    });

    it('❌ Error si faltan datos requeridos', async () => {
        const res = await request(app)
            .post('/api/inscripciones/10/notas')
            .send({ valor: '', tipoNotaId: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('❌ Error si la inscripción no existe', async () => {
        notaService.create.mockRejectedValue({ status: 404, message: 'Inscripción no encontrada' });
        const res = await request(app)
            .post('/api/inscripciones/999/notas')
            .send({ valor: 8 });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Inscripción no encontrada');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        notaService.create.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .post('/api/inscripciones/10/notas')
            .send({ valor: 8 });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
}); 