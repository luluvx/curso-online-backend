module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/inscripcion/inscripcion.controller');
    const auth = require('@middlewares/auth.middleware');
    const permission = require('@middlewares/permission.middleware');
    const PERMISSIONS = require('@constants/permissions');
    const inscripcionValidation = require('@validations/inscripcion.validation');
    const validate = require('@middlewares/validationResult.middleware');

    router.post(
        '/cursos/:cursoId/inscripcion',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ENROLL_IN_COURSE),
        inscripcionValidation.createInscripcion,
        validate,
        controlador.create
    );


    router.get(
        '/cursos/:cursoId/inscripciones',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ENROLLMENT_LIST),
        controlador.findByCurso
    );


    router.get(
        '/mis-cursos',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.MY_COURSES_VIEW),
        controlador.findByEstudiante
    );

    router.get(
        '/inscripciones/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ENROLLMENT_VIEW),
        controlador.findById
    );

    router.delete(
        '/inscripciones/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ENROLLMENT_DELETE),
        controlador.remove
    );

    app.use('/api', router);
};
