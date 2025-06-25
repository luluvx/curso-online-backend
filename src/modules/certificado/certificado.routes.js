module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/certificado/certificado.controller');
    const auth = require('@middlewares/auth.middleware');

    router.get(
        '/cursos/:cursoId/certificado',
        auth.verifyToken,
        controlador.descargarCertificado
    );

    app.use('/api', router);
}; 