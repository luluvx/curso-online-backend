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

jest.mock('../src/modules/usuario/usuario.service', () => ({
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}));

const usuarioService = require('../src/modules/usuario/usuario.service');
const app = express();
app.use(bodyParser.json());
require('../src/modules/usuario/usuario.routes')(app);
const errorHandler = require('../src/middlewares/error.middleware');
app.use(errorHandler);

describe('👤 GET /api/usuarios/me (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Devuelve el usuario autenticado', async () => {
        const usuarioMock = { id: 1, username: 'pikachu', nombre: 'Pika', apellido: 'Chu', email: 'pika@poke.com', rol: { id: 1, codigo: 'admin', nombre: 'Administrador' } };
        usuarioService.findById.mockResolvedValue(usuarioMock);

        const res = await request(app)
            .get('/api/usuarios/me')
            .set('Authorization', 'Bearer token-fake');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(usuarioMock);
        expect(usuarioService.findById).toHaveBeenCalledWith(1);
    });

    it('❌ Error si no se encuentra el usuario', async () => {
        usuarioService.findById.mockRejectedValue({ status: 404, message: 'Usuario no encontrado' });
        const res = await request(app)
            .get('/api/usuarios/me')
            .set('Authorization', 'Bearer token-fake');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        usuarioService.findById.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .get('/api/usuarios/me')
            .set('Authorization', 'Bearer token-fake');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('👤 GET /api/usuarios (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Lista todos los usuarios', async () => {
        const usuariosMock = [
            { id: 1, nombre: 'Pika' },
            { id: 2, nombre: 'Chu' }
        ];
        usuarioService.findAll.mockResolvedValue(usuariosMock);

        const res = await request(app).get('/api/usuarios');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(usuariosMock);
        expect(usuarioService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('✅ Lista usuarios filtrando por rol', async () => {
        const usuariosMock = [{ id: 1, nombre: 'Pika', rol: 'admin' }];
        usuarioService.findAll.mockResolvedValue(usuariosMock);

        const res = await request(app).get('/api/usuarios?rol=admin');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(usuariosMock);
        expect(usuarioService.findAll).toHaveBeenCalledWith('admin');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        usuarioService.findAll.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/usuarios');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('👤 GET /api/usuarios/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Devuelve un usuario por id', async () => {
        const usuarioMock = { id: 1, nombre: 'Pika' };
        usuarioService.findById.mockResolvedValue(usuarioMock);

        const res = await request(app).get('/api/usuarios/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(usuarioMock);
        expect(usuarioService.findById).toHaveBeenCalledWith('1');
    });

    it('❌ Error si el usuario no existe', async () => {
        usuarioService.findById.mockRejectedValue({ status: 404, message: 'Usuario no encontrado' });
        const res = await request(app).get('/api/usuarios/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        usuarioService.findById.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/usuarios/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('👤 PATCH /api/usuarios/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Actualiza un usuario exitosamente', async () => {
        const usuarioMock = { id: 1, nombre: 'Pika actualizado' };
        usuarioService.update.mockResolvedValue(usuarioMock);

        const res = await request(app)
            .patch('/api/usuarios/1')
            .send({ nombre: 'Pika actualizado' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(usuarioMock);
        expect(usuarioService.update).toHaveBeenCalledWith('1', { nombre: 'Pika actualizado' });
    });

    it('❌ Error si el usuario no existe', async () => {
        usuarioService.update.mockRejectedValue({ status: 404, message: 'Usuario no encontrado' });
        const res = await request(app)
            .patch('/api/usuarios/999')
            .send({ nombre: 'Pika actualizado' });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        usuarioService.update.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .patch('/api/usuarios/1')
            .send({ nombre: 'Pika actualizado' });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('👤 DELETE /api/usuarios/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Elimina un usuario exitosamente', async () => {
        usuarioService.remove.mockResolvedValue({ message: 'Usuario eliminado exitosamente' });
        const res = await request(app).delete('/api/usuarios/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Usuario eliminado exitosamente' });
        expect(usuarioService.remove).toHaveBeenCalledWith('1');
    });

    it('❌ Error si el usuario no existe', async () => {
        usuarioService.remove.mockRejectedValue({ status: 404, message: 'Usuario no encontrado' });
        const res = await request(app).delete('/api/usuarios/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        usuarioService.remove.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).delete('/api/usuarios/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
}); 