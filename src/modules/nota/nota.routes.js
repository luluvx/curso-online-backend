module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/nota/nota.controller');
    const auth = require('@middlewares/auth.middleware');
    const { PERMISSIONS } = require('@config/permission.config');
    const permission = require('@middlewares/permission.middleware');

    // Asignar nota a una inscripción (solo admin o profesor dueño)
    router.post(
        '/inscripciones/:inscripcionId/notas',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.GRADE_ASSIGN),
        controlador.create
    );

    // Ver notas de una inscripción (admin, profesor dueño o estudiante)
    router.get(
        '/inscripciones/:inscripcionId/notas',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.GRADE_LIST),
        controlador.findByInscripcion
    );

    // Ver mis notas (solo estudiante)
    router.get(
        '/mis-notas',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.MY_GRADES_VIEW),
        controlador.findMine
    );

    app.use('/api', router);
};
