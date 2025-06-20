module.exports = (app) => {
    const router      = require('express').Router();
    const auth        = require('../middlewares/auth.middleware');
    const controlador = require('../controllers/nota.controller');

    // Asignar nota a una inscripción (solo admin o profesor dueño)
    router.post(
        '/inscripciones/:inscripcionId/notas',
        auth.verifyToken,
        auth.isAdminOrProfessor,
        controlador.create
    );

    // Ver notas de una inscripción (admin, profesor dueño o estudiante)
    router.get(
        '/inscripciones/:inscripcionId/notas',
        auth.verifyToken,
        controlador.findAllByInscripcion
    );

    // Ver mis notas (solo estudiante)
    router.get(
        '/mis-notas',
        auth.verifyToken,
        auth.isStudent,
        controlador.findMyNotas
    );

    app.use('/api', router);
};
