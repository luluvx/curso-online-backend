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

jest.mock('../src/modules/inscripcion/inscripcion.service', () => ({
    create: jest.fn(),
    findById: jest.fn(),
    remove: jest.fn(),
    findByCurso: jest.fn(),
    findByEstudiante: jest.fn()
}));

const inscripcionService = require('../src/modules/inscripcion/inscripcion.service');
const app = express();
app.use(bodyParser.json());
require('../src/modules/inscripcion/inscripcion.routes')(app);
const errorHandler = require('../src/middlewares/error.middleware');
app.use(errorHandler);

describe('📝 POST /api/cursos/:cursoId/inscripcion (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Crea una inscripción exitosamente', async () => {
        const inscripcionMock = { id: 1, cursoId: '10', estudianteId: 1 };
        inscripcionService.create.mockResolvedValue(inscripcionMock);

        const res = await request(app)
            .post('/api/cursos/10/inscripcion')
            .send();

        expect(res.status).toBe(201);
        expect(res.body).toEqual(inscripcionMock);
        expect(inscripcionService.create).toHaveBeenCalledWith('10', 1);
    });

    it('❌ Error si el curso no existe', async () => {
        inscripcionService.create.mockRejectedValue({ status: 404, message: 'Curso no encontrado' });
        const res = await request(app)
            .post('/api/cursos/999/inscripcion')
            .send();
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Curso no encontrado');
    });

    it('❌ Error si el usuario no existe', async () => {
        inscripcionService.create.mockRejectedValue({ status: 404, message: 'Usuario no encontrado' });
        const res = await request(app)
            .post('/api/cursos/10/inscripcion')
            .send();
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
    });

    it('❌ Error si el usuario no es estudiante', async () => {
        inscripcionService.create.mockRejectedValue({ status: 400, message: 'Solo los estudiantes pueden inscribirse' });
        const res = await request(app)
            .post('/api/cursos/10/inscripcion')
            .send();
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Solo los estudiantes pueden inscribirse');
    });

    it('❌ Error si ya está inscrito', async () => {
        inscripcionService.create.mockRejectedValue({ status: 400, message: 'Ya estás inscrito en este curso' });
        const res = await request(app)
            .post('/api/cursos/10/inscripcion')
            .send();
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Ya estás inscrito en este curso');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        inscripcionService.create.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .post('/api/cursos/10/inscripcion')
            .send();
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('📝 GET /api/cursos/:cursoId/inscripciones (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Lista las inscripciones de un curso', async () => {
        const inscripcionesMock = [
            { id: 1, cursoId: '10', estudianteId: 1 },
            { id: 2, cursoId: '10', estudianteId: 2 }
        ];
        inscripcionService.findByCurso.mockResolvedValue(inscripcionesMock);

        const res = await request(app).get('/api/cursos/10/inscripciones');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(inscripcionesMock);
        expect(inscripcionService.findByCurso).toHaveBeenCalledWith('10');
    });

    it('❌ Error si el curso no existe', async () => {
        inscripcionService.findByCurso.mockRejectedValue({ status: 404, message: 'Curso no encontrado' });
        const res = await request(app).get('/api/cursos/999/inscripciones');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Curso no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        inscripcionService.findByCurso.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/cursos/10/inscripciones');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('📝 GET /api/mis-cursos (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Lista los cursos del estudiante', async () => {
        const cursosMock = [
            { id: 1, titulo: 'Curso 1' },
            { id: 2, titulo: 'Curso 2' }
        ];
        inscripcionService.findByEstudiante.mockResolvedValue(cursosMock);

        const res = await request(app).get('/api/mis-cursos');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(cursosMock);
        expect(inscripcionService.findByEstudiante).toHaveBeenCalledWith(1);
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        inscripcionService.findByEstudiante.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/mis-cursos');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('📝 GET /api/inscripciones/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Devuelve una inscripción por id', async () => {
        const inscripcionMock = { id: 1, cursoId: '10', estudianteId: 1 };
        inscripcionService.findById.mockResolvedValue(inscripcionMock);

        const res = await request(app).get('/api/inscripciones/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(inscripcionMock);
        expect(inscripcionService.findById).toHaveBeenCalledWith('1');
    });

    it('❌ Error si la inscripción no existe', async () => {
        inscripcionService.findById.mockRejectedValue({ status: 404, message: 'Inscripción no encontrada' });
        const res = await request(app).get('/api/inscripciones/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Inscripción no encontrada');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        inscripcionService.findById.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/inscripciones/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('📝 DELETE /api/inscripciones/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Elimina una inscripción exitosamente', async () => {
        inscripcionService.remove.mockResolvedValue({ message: 'Inscripción eliminada exitosamente' });
        const res = await request(app).delete('/api/inscripciones/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Inscripción eliminada exitosamente' });
        expect(inscripcionService.remove).toHaveBeenCalledWith('1', 1);
    });

    it('❌ Error si la inscripción no existe', async () => {
        inscripcionService.remove.mockRejectedValue({ status: 404, message: 'Inscripción no encontrada' });
        const res = await request(app).delete('/api/inscripciones/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Inscripción no encontrada');
    });

    it('❌ Error si no tiene permiso para eliminar', async () => {
        inscripcionService.remove.mockRejectedValue({ status: 403, message: 'No tienes permiso para eliminar esta inscripción' });
        const res = await request(app).delete('/api/inscripciones/1');
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('error', 'No tienes permiso para eliminar esta inscripción');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        inscripcionService.remove.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).delete('/api/inscripciones/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
}); 