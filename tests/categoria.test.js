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

jest.mock('../src/modules/categoria/categoria.service', () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}));

const categoriaService = require('../src/modules/categoria/categoria.service');
const app = express();
app.use(bodyParser.json());
require('../src/modules/categoria/categoria.routes')(app);
const errorHandler = require('../src/middlewares/error.middleware');
app.use(errorHandler);

describe('🏷️ POST /api/categorias (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Crea una categoría exitosamente', async () => {
        const categoriaMock = { id: 1, nombre: 'Programación', descripcion: 'Cursos de programación' };
        categoriaService.create.mockResolvedValue(categoriaMock);

        const res = await request(app)
            .post('/api/categorias')
            .send({ nombre: 'Programación', descripcion: 'Cursos de programación' });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(categoriaMock);
        expect(categoriaService.create).toHaveBeenCalledWith({ nombre: 'Programación', descripcion: 'Cursos de programación' });
    });

    it('❌ Error si falta el nombre', async () => {
        const res = await request(app)
            .post('/api/categorias')
            .send({ nombre: '', descripcion: 'Sin nombre' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors[0]).toHaveProperty('msg', 'El nombre es muy corto');
    });

    it('❌ Error si el nombre ya existe', async () => {
        categoriaService.create.mockRejectedValue({ status: 400, message: 'Ya existe una categoría con ese nombre' });
        const res = await request(app)
            .post('/api/categorias')
            .send({ nombre: 'Programación', descripcion: 'Cursos duplicados' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Ya existe una categoría con ese nombre');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        categoriaService.create.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .post('/api/categorias')
            .send({ nombre: 'Programación', descripcion: 'Error' });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🏷️ GET /api/categorias (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Lista todas las categorías', async () => {
        const categoriasMock = [
            { id: 1, nombre: 'Programación' },
            { id: 2, nombre: 'Matemáticas' }
        ];
        categoriaService.findAll.mockResolvedValue(categoriasMock);

        const res = await request(app).get('/api/categorias');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(categoriasMock);
        expect(categoriaService.findAll).toHaveBeenCalled();
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        categoriaService.findAll.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/categorias');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🏷️ GET /api/categorias/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Devuelve una categoría por id', async () => {
        const categoriaMock = { id: 1, nombre: 'Programación' };
        categoriaService.findById.mockResolvedValue(categoriaMock);

        const res = await request(app).get('/api/categorias/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(categoriaMock);
        expect(categoriaService.findById).toHaveBeenCalledWith('1');
    });

    it('❌ Error si la categoría no existe', async () => {
        categoriaService.findById.mockRejectedValue({ status: 404, message: 'Categoría no encontrada' });
        const res = await request(app).get('/api/categorias/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Categoría no encontrada');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        categoriaService.findById.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/categorias/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🏷️ PUT /api/categorias/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Actualiza una categoría exitosamente', async () => {
        const categoriaMock = { id: 1, nombre: 'Programación Avanzada', descripcion: 'Nivel avanzado' };
        categoriaService.update.mockResolvedValue(categoriaMock);

        const res = await request(app)
            .put('/api/categorias/1')
            .send({ nombre: 'Programación Avanzada', descripcion: 'Nivel avanzado' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(categoriaMock);
        expect(categoriaService.update).toHaveBeenCalledWith('1', { nombre: 'Programación Avanzada', descripcion: 'Nivel avanzado' });
    });

    it('❌ Error si la categoría no existe', async () => {
        categoriaService.update.mockRejectedValue({ status: 404, message: 'Categoría no encontrada' });
        const res = await request(app)
            .put('/api/categorias/999')
            .send({ nombre: 'No existe', descripcion: '...' });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Categoría no encontrada');
    });

    it('❌ Error si el nombre ya existe', async () => {
        categoriaService.update.mockRejectedValue({ status: 400, message: 'Ya existe una categoría con ese nombre' });
        const res = await request(app)
            .put('/api/categorias/1')
            .send({ nombre: 'Duplicada', descripcion: '...' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Ya existe una categoría con ese nombre');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        categoriaService.update.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .put('/api/categorias/1')
            .send({ nombre: 'Programación Avanzada', descripcion: 'Nivel avanzado' });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🏷️ DELETE /api/categorias/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Elimina una categoría exitosamente', async () => {
        categoriaService.remove.mockResolvedValue({ message: 'Categoría eliminada exitosamente' });
        const res = await request(app).delete('/api/categorias/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Categoría eliminada exitosamente' });
        expect(categoriaService.remove).toHaveBeenCalledWith('1');
    });

    it('❌ Error si la categoría no existe', async () => {
        categoriaService.remove.mockRejectedValue({ status: 404, message: 'Categoría no encontrada' });
        const res = await request(app).delete('/api/categorias/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Categoría no encontrada');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        categoriaService.remove.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).delete('/api/categorias/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
}); 