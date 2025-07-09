const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

process.env.JWT_SECRET = 'secreto-prueba';

// Mock de middlewares y servicios
jest.mock('../src/middlewares/auth.middleware', () => ({
    verifyToken: (req, res, next) => {
        req.user = { id: 1 }; // Simula usuario autenticado
        next();
    }
}));
jest.mock('../src/middlewares/permission.middleware', () => ({
    hasPermission: () => (req, res, next) => next()
}));

jest.mock('../src/modules/curso/curso.service', () => ({
    createCurso: jest.fn(),
    getCursos: jest.fn(),
    getCursoById: jest.fn(),
    updateCurso: jest.fn(),
    deleteCurso: jest.fn(),
    updateCursoPicture: jest.fn()
}));

const cursoService = require('../src/modules/curso/curso.service');
const app = express();
app.use(bodyParser.json());
require('../src/modules/curso/curso.routes')(app);
const errorHandler = require('../src/middlewares/error.middleware');
app.use(errorHandler);

describe('🎓 POST /api/cursos (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Crea un curso exitosamente', async () => {
        const cursoMock = {
            id: 10,
            titulo: 'Curso Test',
            descripcion: 'Descripción',
            categoriaId: 2,
            profesorId: 1
        };
        cursoService.createCurso.mockResolvedValue(cursoMock);

        const res = await request(app)
            .post('/api/cursos')
            .send({
                titulo: 'Curso Test',
                descripcion: 'Descripción',
                categoriaId: 2,
                profesorId: 1
            });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(cursoMock);
        expect(cursoService.createCurso).toHaveBeenCalledWith(
            'Curso Test',
            'Descripción',
            2,
            1,
            1
        );
    });

    it('❌ Retorna error si la categoría es inválida', async () => {
        cursoService.createCurso.mockRejectedValue({ status: 400, message: 'Categoría no válida' });

        const res = await request(app)
            .post('/api/cursos')
            .send({
                titulo: 'Curso Test',
                descripcion: 'Descripción',
                categoriaId: 999,
                profesorId: 1
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Categoría no válida');
    });

    it('❌ Retorna error si el usuario no existe', async () => {
        cursoService.createCurso.mockRejectedValue({ status: 400, message: 'Usuario no encontrado' });

        const res = await request(app)
            .post('/api/cursos')
            .send({
                titulo: 'Curso Test',
                descripcion: 'Descripción',
                categoriaId: 2,
                profesorId: 1
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
    });

    it('❌ Retorna error si el profesor es inválido', async () => {
        cursoService.createCurso.mockRejectedValue({ status: 400, message: 'El usuario asignado no es profesor válido' });

        const res = await request(app)
            .post('/api/cursos')
            .send({
                titulo: 'Curso Test',
                descripcion: 'Descripción',
                categoriaId: 2,
                profesorId: 999
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'El usuario asignado no es profesor válido');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        cursoService.createCurso.mockRejectedValue(new Error('Fallo inesperado'));

        const res = await request(app)
            .post('/api/cursos')
            .send({
                titulo: 'Curso Test',
                descripcion: 'Descripción',
                categoriaId: 2,
                profesorId: 1
            });

        // El middleware de error global debería devolver 500 si no hay status
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('📚 GET /api/cursos (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Lista todos los cursos', async () => {
        const cursosMock = [
            { id: 1, titulo: 'Curso 1' },
            { id: 2, titulo: 'Curso 2' }
        ];
        cursoService.getCursos.mockResolvedValue(cursosMock);

        const res = await request(app).get('/api/cursos');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(cursosMock);
        expect(cursoService.getCursos).toHaveBeenCalledWith({});
    });

    it('✅ Lista cursos filtrando por profesorId', async () => {
        const cursosMock = [{ id: 1, titulo: 'Curso 1', profesorId: 5 }];
        cursoService.getCursos.mockResolvedValue(cursosMock);

        const res = await request(app).get('/api/cursos?profesorId=5');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(cursosMock);
        expect(cursoService.getCursos).toHaveBeenCalledWith({ profesorId: 5 });
    });

    it('❌ Error si profesorId no es un número', async () => {
        const res = await request(app).get('/api/cursos?profesorId=abc');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'profesorId debe ser un número válido');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        cursoService.getCursos.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/cursos');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('📖 GET /api/cursos/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Devuelve un curso por id', async () => {
        const cursoMock = { id: 1, titulo: 'Curso 1' };
        cursoService.getCursoById.mockResolvedValue(cursoMock);

        const res = await request(app).get('/api/cursos/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(cursoMock);
        expect(cursoService.getCursoById).toHaveBeenCalledWith('1');
    });

    it('❌ Error si el curso no existe', async () => {
        cursoService.getCursoById.mockRejectedValue({ status: 404, message: 'Curso no encontrado' });
        const res = await request(app).get('/api/cursos/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Curso no encontrado');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        cursoService.getCursoById.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/cursos/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('✏️ PATCH /api/cursos/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Actualiza un curso exitosamente', async () => {
        const cursoMock = { id: 1, titulo: 'Curso Actualizado' };
        cursoService.updateCurso.mockResolvedValue(cursoMock);

        const res = await request(app)
            .patch('/api/cursos/1')
            .send({ titulo: 'Curso Actualizado' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(cursoMock);
        expect(cursoService.updateCurso).toHaveBeenCalledWith('1', { titulo: 'Curso Actualizado' }, 1);
    });

    it('❌ Error si el curso no existe', async () => {
        cursoService.updateCurso.mockRejectedValue({ status: 404, message: 'Curso no encontrado' });
        const res = await request(app)
            .patch('/api/cursos/999')
            .send({ titulo: 'Curso Actualizado' });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Curso no encontrado');
    });

    it('❌ Error si no tiene permiso', async () => {
        cursoService.updateCurso.mockRejectedValue({ status: 400, message: 'No tienes permiso para editar este curso' });
        const res = await request(app)
            .patch('/api/cursos/1')
            .send({ titulo: 'Curso Actualizado' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'No tienes permiso para editar este curso');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        cursoService.updateCurso.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .patch('/api/cursos/1')
            .send({ titulo: 'Curso Actualizado' });
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🗑️ DELETE /api/cursos/:id (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Elimina un curso exitosamente', async () => {
        const resultMock = { message: 'Curso eliminado exitosamente' };
        cursoService.deleteCurso.mockResolvedValue(resultMock);

        const res = await request(app).delete('/api/cursos/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(resultMock);
        expect(cursoService.deleteCurso).toHaveBeenCalledWith('1', 1);
    });

    it('❌ Error si el curso no existe', async () => {
        cursoService.deleteCurso.mockRejectedValue({ status: 404, message: 'Curso no encontrado' });
        const res = await request(app).delete('/api/cursos/999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Curso no encontrado');
    });

    it('❌ Error si no tiene permiso', async () => {
        cursoService.deleteCurso.mockRejectedValue({ status: 400, message: 'No tienes permiso para eliminar este curso' });
        const res = await request(app).delete('/api/cursos/1');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'No tienes permiso para eliminar este curso');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        cursoService.deleteCurso.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).delete('/api/cursos/1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

describe('🖼️ POST /api/cursos/:id/imagen (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Sube imagen exitosamente', async () => {
        const cursoMock = { id: 1, imagenUrl: '/uploads/cursos/imagen.jpg' };
        cursoService.updateCursoPicture.mockResolvedValue(cursoMock);

        const res = await request(app)
            .post('/api/cursos/1/imagen')
            .attach('imagen', Buffer.from('fake-image'), 'imagen.jpg');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(cursoMock);
        expect(cursoService.updateCursoPicture).toHaveBeenCalledWith('1', expect.stringContaining('/uploads/cursos/'), 1);
    });

    it('❌ Error si no se envía archivo', async () => {
        // El controlador lanza BadRequestError si no hay req.file
        const res = await request(app)
            .post('/api/cursos/1/imagen');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Archivo de imagen es requerido');
    });

    it('❌ Error si no tiene permiso', async () => {
        cursoService.updateCursoPicture.mockRejectedValue({ status: 400, message: 'No tienes permiso para modificar este curso' });
        const res = await request(app)
            .post('/api/cursos/1/imagen')
            .attach('imagen', Buffer.from('fake-image'), 'imagen.jpg');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'No tienes permiso para modificar este curso');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        cursoService.updateCursoPicture.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app)
            .post('/api/cursos/1/imagen')
            .attach('imagen', Buffer.from('fake-image'), 'imagen.jpg');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
}); 