const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

process.env.JWT_SECRET = 'secreto-prueba';

jest.mock('../src/middlewares/auth.middleware', () => ({
  verifyToken: (req, res, next) => {
    req.user = { id: 1 };
    next();
  }
}));

jest.mock('../src/middlewares/permission.middleware', () => ({
  hasPermission: () => (req, res, next) => next()
}));

jest.mock('../src/modules/progreso/progreso.service', () => ({
  marcarVisto: jest.fn(),
  obtenerProgresoCurso: jest.fn()
}));

const service = require('../src/modules/progreso/progreso.service');
const app = express();
app.use(bodyParser.json());
require('../src/modules/progreso/progreso.routes')(app);
const errorHandler = require('../src/middlewares/error.middleware');
app.use(errorHandler);

describe('📘 POST /api/videos/:videoId/visto', () => {
  beforeEach(() => jest.clearAllMocks());

  it('✅ Marca como visto exitosamente', async () => {
    const progresoMock = { usuarioId: 1, videoId: 2, visto: true };
    service.marcarVisto.mockResolvedValue(progresoMock);

    const res = await request(app).post('/api/videos/2/visto');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(progresoMock);
    expect(service.marcarVisto).toHaveBeenCalledWith(1, '2');
  });

  it('❌ Falla si no está inscrito', async () => {
    service.marcarVisto.mockRejectedValue({ status: 403, message: 'Debes estar inscrito en el curso para marcar como visto' });

    const res = await request(app).post('/api/videos/2/visto');

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Debes estar inscrito en el curso para marcar como visto');
  });

  it('🔥 Maneja error inesperado', async () => {
    service.marcarVisto.mockRejectedValue(new Error('Error inesperado'));

    const res = await request(app).post('/api/videos/2/visto');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

describe('📘 GET /api/cursos/:cursoId/progreso', () => {
  beforeEach(() => jest.clearAllMocks());

  it('✅ Devuelve progreso correctamente', async () => {
    const progresoMock = { total: 5, vistos: 3, porcentaje: 60 };
    service.obtenerProgresoCurso.mockResolvedValue(progresoMock);

    const res = await request(app).get('/api/cursos/10/progreso');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(progresoMock);
    expect(service.obtenerProgresoCurso).toHaveBeenCalledWith(1, '10');
  });

  it('🔥 Maneja error inesperado', async () => {
    service.obtenerProgresoCurso.mockRejectedValue(new Error('Error inesperado'));

    const res = await request(app).get('/api/cursos/10/progreso');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
