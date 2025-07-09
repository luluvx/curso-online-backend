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

jest.mock('../src/modules/video/video.service', () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    reordenarVideos: jest.fn()
}));

const videoService = require('../src/modules/video/video.service');
const app = express();
app.use(bodyParser.json());
require('../src/modules/video/video.routes')(app);
const errorHandler = require('../src/middlewares/error.middleware');
app.use(errorHandler);

describe('🎬 POST /api/cursos/:cursoId/videos (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Crea un video exitosamente', async () => {
        const videoMock = { id: 1, cursoId: '10', titulo: 'Video 1', url: 'https://video.com/1', orden: 1, usuarioId: 1 };
        videoService.create.mockResolvedValue(videoMock);

        const res = await request(app)
            .post('/api/cursos/10/videos')
            .send({ titulo: 'Video 1', url: 'https://video.com/1', orden: 1 });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(videoMock);
        expect(videoService.create).toHaveBeenCalledWith('10', 'Video 1', 'https://video.com/1', 1, 1);
    });

    it('❌ Error si faltan datos requeridos', async () => {
        const res = await request(app)
            .post('/api/cursos/10/videos')
            .send({ titulo: '', url: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        videoService.create.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .post('/api/cursos/10/videos')
            .send({ titulo: 'Video 1', url: 'https://video.com/1', orden: 1 });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🎬 GET /api/cursos/:cursoId/videos (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Lista los videos de un curso', async () => {
        const videosMock = [
            { id: 1, cursoId: '10', titulo: 'Video 1' },
            { id: 2, cursoId: '10', titulo: 'Video 2' }
        ];
        videoService.findAll.mockResolvedValue(videosMock);

        const res = await request(app).get('/api/cursos/10/videos');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(videosMock);
        expect(videoService.findAll).toHaveBeenCalledWith('10', 1);
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        videoService.findAll.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/cursos/10/videos');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🎬 GET /api/videos/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Devuelve un video por id', async () => {
        const videoMock = { id: 1, cursoId: '10', titulo: 'Video 1' };
        videoService.findById.mockResolvedValue(videoMock);

        const res = await request(app).get('/api/videos/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(videoMock);
        expect(videoService.findById).toHaveBeenCalledWith('1', 1);
    });

    it('❌ Error si el video no existe', async () => {
        videoService.findById.mockRejectedValue({ status: 404, message: 'Video no encontrado' });
        const res = await request(app).get('/api/videos/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Video no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        videoService.findById.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/videos/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🎬 PATCH /api/videos/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Actualiza un video exitosamente', async () => {
        const videoMock = { id: 1, cursoId: '10', titulo: 'Video actualizado' };
        videoService.update.mockResolvedValue(videoMock);

        const res = await request(app)
            .patch('/api/videos/1')
            .send({ titulo: 'Video actualizado' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(videoMock);
        expect(videoService.update).toHaveBeenCalledWith('1', { titulo: 'Video actualizado' }, 1);
    });

    it('❌ Error si el video no existe', async () => {
        videoService.update.mockRejectedValue({ status: 404, message: 'Video no encontrado' });
        const res = await request(app)
            .patch('/api/videos/999')
            .send({ titulo: 'Video actualizado' });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Video no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        videoService.update.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .patch('/api/videos/1')
            .send({ titulo: 'Video actualizado' });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🎬 DELETE /api/videos/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Elimina un video exitosamente', async () => {
        videoService.remove.mockResolvedValue({ message: 'Video eliminado exitosamente' });
        const res = await request(app).delete('/api/videos/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Video eliminado exitosamente' });
        expect(videoService.remove).toHaveBeenCalledWith('1', 1);
    });

    it('❌ Error si el video no existe', async () => {
        videoService.remove.mockRejectedValue({ status: 404, message: 'Video no encontrado' });
        const res = await request(app).delete('/api/videos/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Video no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        videoService.remove.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).delete('/api/videos/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🎬 PATCH /api/cursos/:cursoId/videos/orden (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Reordena videos exitosamente', async () => {
        videoService.reordenarVideos.mockResolvedValue();
        const res = await request(app)
            .patch('/api/cursos/10/videos/orden')
            .send({ ordenes: [{ id: 1, orden: 2 }, { id: 2, orden: 1 }] });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Orden de videos actualizado correctamente' });
        expect(videoService.reordenarVideos).toHaveBeenCalledWith('10', [{ id: 1, orden: 2 }, { id: 2, orden: 1 }], 1);
    });

    it('❌ Error si el array ordenes es inválido', async () => {
        const res = await request(app)
            .patch('/api/cursos/10/videos/orden')
            .send({ ordenes: [] });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'El array ordenes es requerido y no puede estar vacío');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        videoService.reordenarVideos.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .patch('/api/cursos/10/videos/orden')
            .send({ ordenes: [{ id: 1, orden: 2 }, { id: 2, orden: 1 }] });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
}); 