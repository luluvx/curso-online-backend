const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

process.env.JWT_SECRET = 'secreto-prueba';

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

jest.mock('../src/database', () => ({
  usuarios: {
    findOne: jest.fn()
  },
  roles: {},
  permisos: {}
}));

const db = require('../src/database');
const app = express();
app.use(bodyParser.json());
require('../src/modules/auth/auth.routes')(app);

describe('/api/auth/login (Mock Test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('✅ Devuelve mensaje si credenciales son válidas', async () => {
    // Mock del usuario
    db.usuarios.findOne.mockResolvedValue({
      id: 1,
      username: 'admin',
      email: 'admin@mail.com',
      password: 'hash-fake',
      rol: {
        codigo: 'admin',
        nombre: 'Administrador',
        permisos: [{ codigo: 'GESTION_USUARIOS' }]
      }
    });

    bcrypt.compare.mockResolvedValue(true); // contraseña válida

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@mail.com', password: '1234' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login exitoso');

    // Valida cookie seteada
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/authToken=.*HttpOnly/);
  });

  it('❌ Devuelve error con credenciales inválidas', async () => {
    db.usuarios.findOne.mockResolvedValue({
      id: 1,
      username: 'admin',
      email: 'admin@mail.com',
      password: 'hash-fake',
      rol: {
        codigo: 'admin',
        nombre: 'Administrador',
        permisos: []
      }
    });

    bcrypt.compare.mockResolvedValue(false); // contraseña inválida

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@mail.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Contraseña incorrecta');
  });

  it('🔥 Maneja error del servidor', async () => {
    db.usuarios.findOne.mockRejectedValue(new Error('Error intencional'));
    bcrypt.compare.mockResolvedValue(true); // no importa

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@mail.com', password: '1234' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Error intencional');
  });
});
