const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

process.env.JWT_SECRET = 'secreto-prueba';

const app = express();
app.use(bodyParser.json());
require('../src/modules/auth/auth.routes')(app); 

describe('/api/auth/logout (Test)', () => {
  it('✅ Devuelve mensaje y limpia la cookie', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', 'authToken=abc123');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logout exitoso');

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/authToken=;/); // Cookie vacía
  });

  it('🔥 Maneja error del servidor con try-catch (simulado)', async () => {
    // Simulamos error reemplazando temporalmente clearCookie
    const originalClearCookie = app.response.clearCookie;
    app.response.clearCookie = () => {
      throw new Error('Falló clearCookie');
    };

    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Error durante el logout');

    app.response.clearCookie = originalClearCookie;
  });
});
