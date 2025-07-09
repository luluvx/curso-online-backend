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

jest.mock('../src/modules/comentario/comentario.service', () => ({
    create: jest.fn(),
    findByCurso: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}));

const comentarioService = require('../src/modules/comentario/comentario.service');
const app = express();
app.use(bodyParser.json());
require('../src/modules/comentario/comentario.routes')(app);
const errorHandler = require('../src/middlewares/error.middleware');
app.use(errorHandler);

describe('💬 POST /api/cursos/:cursoId/comentarios (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Crea un comentario exitosamente', async () => {
        const comentarioMock = { id: 1, cursoId: '10', usuarioId: 1, contenido: '¡Este curso es realmente excelente y lo recomiendo mucho!' };
        comentarioService.create.mockResolvedValue(comentarioMock);

        const res = await request(app)
            .post('/api/cursos/10/comentarios')
            .send({ cursoId: 10, contenido: '¡Este curso es realmente excelente y lo recomiendo mucho!' });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(comentarioMock);
        expect(comentarioService.create).toHaveBeenCalledWith({ cursoId: '10', usuarioId: 1, contenido: '¡Este curso es realmente excelente y lo recomiendo mucho!' });
    });

    it('❌ Error si falta el contenido', async () => {
        const res = await request(app)
            .post('/api/cursos/10/comentarios')
            .send({ contenido: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors[0]).toHaveProperty('msg');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        comentarioService.create.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .post('/api/cursos/10/comentarios')
            .send({ cursoId: 10, contenido: '¡Este curso es realmente excelente y lo recomiendo mucho!' });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('💬 GET /api/cursos/:cursoId/comentarios (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Lista los comentarios de un curso', async () => {
        const comentariosMock = [
            { id: 1, cursoId: '10', usuarioId: 1, contenido: 'Comentario 1' },
            { id: 2, cursoId: '10', usuarioId: 2, contenido: 'Comentario 2' }
        ];
        comentarioService.findByCurso.mockResolvedValue(comentariosMock);

        const res = await request(app).get('/api/cursos/10/comentarios');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(comentariosMock);
        expect(comentarioService.findByCurso).toHaveBeenCalledWith('10');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        comentarioService.findByCurso.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/cursos/10/comentarios');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('💬 PUT /api/comentarios/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Actualiza un comentario exitosamente', async () => {
        const comentarioMock = { id: 1, cursoId: '10', usuarioId: 1, contenido: 'Comentario actualizado' };
        comentarioService.update.mockResolvedValue(comentarioMock);

        const res = await request(app)
            .put('/api/comentarios/1')
            .send({ contenido: 'Comentario actualizado' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(comentarioMock);
        expect(comentarioService.update).toHaveBeenCalledWith('1', 1, 'Comentario actualizado');
    });

    it('❌ Error si no autorizado o comentario no encontrado', async () => {
        comentarioService.update.mockRejectedValue({ status: 404, message: 'No autorizado o comentario no encontrado' });
        const res = await request(app)
            .put('/api/comentarios/999')
            .send({ contenido: 'Comentario actualizado' });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'No autorizado o comentario no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        comentarioService.update.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .put('/api/comentarios/1')
            .send({ contenido: 'Comentario actualizado' });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('💬 DELETE /api/comentarios/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Elimina un comentario exitosamente', async () => {
        comentarioService.remove.mockResolvedValue({ message: 'Comentario eliminado' });
        const res = await request(app).delete('/api/comentarios/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Comentario eliminado' });
        expect(comentarioService.remove).toHaveBeenCalledWith('1', 1);
    });

    it('❌ Error si no autorizado o comentario no encontrado', async () => {
        comentarioService.remove.mockRejectedValue({ status: 404, message: 'No autorizado o comentario no encontrado' });
        const res = await request(app).delete('/api/comentarios/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'No autorizado o comentario no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        comentarioService.remove.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).delete('/api/comentarios/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
}); 