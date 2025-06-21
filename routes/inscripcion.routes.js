module.exports = (app) => {
    const router = require('express').Router();
    const controlador   = require('../controllers/inscripcion.controller');
    const auth   = require('../middlewares/auth.middleware');
    const { PERMISSIONS } = require('../config/permission.config');
    const permission      = require('../middlewares/permission.middleware');


    // Inscribirse a un curso (solo estudiantes)
    router.post(
        '/cursos/:cursoId/inscripcion',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ENROLL_COURSE),
        controlador.create
    );

    // Listar inscripciones de un curso (admin o profesor dueño)
    router.get(
        '/cursos/:cursoId/inscripciones',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.LIST_ENROLLMENTS),
        controlador.findAllByCurso
    );

    // Listar cursos donde estoy inscrito (solo estudiante)
    router.get(
        '/mis-cursos',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIEW_MY_COURSES),
        controlador.findAllByStudent
    );

    app.use('/api', router);
};
