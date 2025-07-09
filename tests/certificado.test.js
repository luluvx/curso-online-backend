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

jest.mock('../src/modules/certificado/certificado.service', () => ({
    generarCertificado: jest.fn()
}));

const certificadoService = require('../src/modules/certificado/certificado.service');
const app = express();
app.use(bodyParser.json());
require('../src/modules/certificado/certificado.routes')(app);
const errorHandler = require('../src/middlewares/error.middleware');
app.use(errorHandler);

describe('📄 GET /api/cursos/:cursoId/certificado (Mock Test)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('✅ Descarga el certificado exitosamente (PDF)', async () => {
        const pdfBuffer = Buffer.from('PDF-DATA');
        certificadoService.generarCertificado.mockResolvedValue(pdfBuffer);

        const res = await request(app)
            .get('/api/cursos/10/certificado');

        expect(res.status).toBe(200);
        expect(res.header['content-type']).toBe('application/pdf');
        expect(res.header['content-disposition']).toContain('attachment; filename=certificado.pdf');
        expect(res.body).toEqual(pdfBuffer);
        expect(certificadoService.generarCertificado).toHaveBeenCalledWith(1, '10');
    });

    it('❌ Error si no está inscrito en el curso', async () => {
        certificadoService.generarCertificado.mockRejectedValue({ status: 403, message: 'No estás inscrito en este curso' });
        const res = await request(app).get('/api/cursos/10/certificado');
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('error', 'No estás inscrito en este curso');
    });

    it('❌ Error si no ha visto todos los videos', async () => {
        certificadoService.generarCertificado.mockRejectedValue({ status: 403, message: 'Debes ver todos los videos para obtener el certificado' });
        const res = await request(app).get('/api/cursos/10/certificado');
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('error', 'Debes ver todos los videos para obtener el certificado');
    });

    it('❌ Error si no tiene notas registradas', async () => {
        certificadoService.generarCertificado.mockRejectedValue({ status: 403, message: 'No tienes notas registradas en este curso' });
        const res = await request(app).get('/api/cursos/10/certificado');
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('error', 'No tienes notas registradas en este curso');
    });

    it('❌ Error si no alcanza la nota mínima', async () => {
        certificadoService.generarCertificado.mockRejectedValue({ status: 403, message: 'No tienes la nota mínima para obtener el certificado' });
        const res = await request(app).get('/api/cursos/10/certificado');
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('error', 'No tienes la nota mínima para obtener el certificado');
    });

    it('❌ Error si faltan datos', async () => {
        certificadoService.generarCertificado.mockRejectedValue({ status: 404, message: 'Datos no encontrados' });
        const res = await request(app).get('/api/cursos/10/certificado');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Datos no encontrados');
    });

    it('🔥 Maneja error inesperado del servidor', async () => {
        certificadoService.generarCertificado.mockRejectedValue(new Error('Fallo inesperado'));
        const res = await request(app).get('/api/cursos/10/certificado');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
}); 