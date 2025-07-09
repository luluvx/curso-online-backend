const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

process.env.JWT_SECRET = 'secreto-prueba';

jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

jest.mock('../src/database', () => ({
  usuarios: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  roles: {
    findByPk: jest.fn()
  }
}));

const db = require('../src/database');
const app = express();
app.use(bodyParser.json());
require('../src/modules/auth/auth.routes')(app);

describe('/api/auth/register (Mock Test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('✅ Registra usuario exitosamente', async () => {
    // Mock de rol existente
    db.roles.findByPk.mockResolvedValue({ id: 1, nombre: 'Admin' });

    // No hay usuario registrado con ese email
    db.usuarios.findOne.mockResolvedValue(null);

    // Simulamos bcrypt.hash
    bcrypt.hash.mockResolvedValue('hashed-password');

    // Mock creación de usuario
    db.usuarios.create.mockResolvedValue({
      save: jest.fn().mockResolvedValue()
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'nuevo',
        nombre: 'Nuevo',
        apellido: 'Usuario',
        email: 'nuevo@mail.com',
        password: '1234',
        rolId: 1
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuario registrado exitosamente');
  });

  it('❌ Retorna error si el email ya existe', async () => {
    db.roles.findByPk.mockResolvedValue({ id: 1, nombre: 'Admin' });
    db.usuarios.findOne.mockResolvedValue({ id: 99, email: 'existente@mail.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'existente',
        nombre: 'Ya',
        apellido: 'Registrado',
        email: 'existente@mail.com',
        password: '1234',
        rolId: 1
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'El email ya está registrado');
  });

  it('❌ Retorna error si el rol no existe', async () => {
    db.roles.findByPk.mockResolvedValue(null); // rol no encontrado

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'sinrol',
        nombre: 'Sin',
        apellido: 'Rol',
        email: 'sinrol@mail.com',
        password: '1234',
        rolId: 999
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Rol no encontrado');
  });

    it('🔥 Maneja error del servidor', async () => {
        db.roles.findByPk.mockResolvedValue({ id: 1, nombre: 'Admin' });
        db.usuarios.findOne.mockResolvedValue(null);

        bcrypt.hash.mockRejectedValue(new Error('Falla de hash'));

        const res = await request(app)
        .post('/api/auth/register')
        .send({
            username: 'error',
            nombre: 'Falla',
            apellido: 'Interna',
            email: 'error@mail.com',
            password: '1234',
            rolId: 1
        });

        expect(res.status).toBe(400); 
        expect(res.body).toHaveProperty('error', 'Falla de hash');
    });

});
