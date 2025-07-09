const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

process.env.JWT_SECRET = 'secreto-prueba';

// Mocks
jest.mock('../src/database', () => ({
  usuarios: {
    findByPk: jest.fn()
  },
  roles: {}
}));

jest.mock('../src/middlewares/auth.middleware', () => ({
  verifyToken: (req, res, next) => {
    // Simulamos que el token fue verificado y el usuario tiene ID 123
    req.user = { id: 123 };
    next();
  }
}));

const db = require('../src/database');
const errorHandler = require('../src/middlewares/error.middleware');

const app = express();
app.use(bodyParser.json());

// Carga rutas
require('../src/modules/usuario/usuario.routes')(app);

// Middleware global de manejo de errores
app.use(errorHandler);

describe('🔐 GET /api/usuarios/me (Mock)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('✅ Devuelve datos del usuario autenticado', async () => {
    db.usuarios.findByPk.mockResolvedValue({
      id: 123,
      username: 'pikachu',
      nombre: 'Pika',
      apellido: 'Chu',
      email: 'pika@poke.com',
      rol: { id: 1, codigo: 'admin', nombre: 'Administrador' }
    });

    const res = await request(app)
      .get('/api/usuarios/me')
      .set('Authorization', 'Bearer token-fake');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 123,
      username: 'pikachu',
      nombre: 'Pika',
      apellido: 'Chu',
      email: 'pika@poke.com',
      rol: {
        id: 1,
        codigo: 'admin',
        nombre: 'Administrador'
      }
    });
  });

  it('❌ Devuelve error si no se encuentra el usuario', async () => {
    db.usuarios.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/usuarios/me')
      .set('Authorization', 'Bearer token-fake');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
  });
});
