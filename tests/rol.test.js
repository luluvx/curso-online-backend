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

jest.mock('../src/modules/rol/rol.service', () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}));

const rolService = require('../src/modules/rol/rol.service');
const app = express();
app.use(bodyParser.json());
require('../src/modules/rol/rol.routes')(app);
const errorHandler = require('../src/middlewares/error.middleware');
app.use(errorHandler);

describe('🛡️ POST /api/roles (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Crea un rol exitosamente', async () => {
        const rolMock = { id: 1, codigo: 'ADMIN', nombre: 'Administrador' };
        rolService.create.mockResolvedValue(rolMock);

        const res = await request(app)
            .post('/api/roles')
            .send({ codigo: 'ADMIN', nombre: 'Administrador' });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(rolMock);
        expect(rolService.create).toHaveBeenCalledWith('ADMIN', 'Administrador');
    });

    it('❌ Error si faltan datos requeridos', async () => {
        rolService.create.mockRejectedValue({ status: 400, message: 'Código y nombre del rol son requeridos' });
        const res = await request(app)
            .post('/api/roles')
            .send({ codigo: '', nombre: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Código y nombre del rol son requeridos');
    });

    it('❌ Error si el código ya existe', async () => {
        rolService.create.mockRejectedValue({ status: 400, message: 'Ya existe un rol con este código' });
        const res = await request(app)
            .post('/api/roles')
            .send({ codigo: 'ADMIN', nombre: 'Administrador' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Ya existe un rol con este código');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        rolService.create.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .post('/api/roles')
            .send({ codigo: 'ADMIN', nombre: 'Administrador' });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🛡️ GET /api/roles (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Lista todos los roles', async () => {
        const rolesMock = [
            { id: 1, codigo: 'ADMIN', nombre: 'Administrador' },
            { id: 2, codigo: 'USER', nombre: 'Usuario' }
        ];
        rolService.findAll.mockResolvedValue(rolesMock);

        const res = await request(app).get('/api/roles');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(rolesMock);
        expect(rolService.findAll).toHaveBeenCalled();
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        rolService.findAll.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/roles');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🛡️ GET /api/roles/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Devuelve un rol por id', async () => {
        const rolMock = { id: 1, codigo: 'ADMIN', nombre: 'Administrador' };
        rolService.findById.mockResolvedValue(rolMock);

        const res = await request(app).get('/api/roles/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(rolMock);
        expect(rolService.findById).toHaveBeenCalledWith('1');
    });

    it('❌ Error si el rol no existe', async () => {
        rolService.findById.mockRejectedValue({ status: 404, message: 'Rol no encontrado' });
        const res = await request(app).get('/api/roles/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Rol no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        rolService.findById.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/roles/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🛡️ PUT /api/roles/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Actualiza un rol exitosamente', async () => {
        const rolMock = { id: 1, codigo: 'ADMIN', nombre: 'Admin Actualizado' };
        rolService.update.mockResolvedValue(rolMock);

        const res = await request(app)
            .put('/api/roles/1')
            .send({ nombre: 'Admin Actualizado' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(rolMock);
        expect(rolService.update).toHaveBeenCalledWith('1', 'Admin Actualizado');
    });

    it('❌ Error si el nombre es requerido', async () => {
        rolService.update.mockRejectedValue({ status: 400, message: 'El nombre del rol es requerido' });
        const res = await request(app)
            .put('/api/roles/1')
            .send({ nombre: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'El nombre del rol es requerido');
    });

    it('❌ Error si el rol no existe', async () => {
        rolService.update.mockRejectedValue({ status: 404, message: 'Rol no encontrado' });
        const res = await request(app)
            .put('/api/roles/999')
            .send({ nombre: 'Admin Actualizado' });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Rol no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        rolService.update.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .put('/api/roles/1')
            .send({ nombre: 'Admin Actualizado' });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🛡️ DELETE /api/roles/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Elimina un rol exitosamente', async () => {
        rolService.remove.mockResolvedValue();
        const res = await request(app).delete('/api/roles/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Rol eliminado exitosamente' });
        expect(rolService.remove).toHaveBeenCalledWith('1');
    });

    it('❌ Error si el rol no existe', async () => {
        rolService.remove.mockRejectedValue({ status: 404, message: 'Rol no encontrado' });
        const res = await request(app).delete('/api/roles/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Rol no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        rolService.remove.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).delete('/api/roles/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
}); 