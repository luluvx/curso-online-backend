module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/inscripcion/inscripcion.controller');
    const auth = require('@middlewares/auth.middleware');
    const permission = require('@middlewares/permission.middleware');
    const { PERMISSIONS } = require('@config/permission.config');

    // Inscribirse a un curso (solo estudiantes)
    router.post(
        '/cursos/:cursoId/inscripcion',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ENROLL_IN_COURSE),
        controlador.create
    );

    // Listar inscripciones a un curso (admin o profesor dueño)
    router.get(
        '/cursos/:cursoId/inscripciones',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ENROLLMENT_LIST),
        controlador.findByCurso
    );

    //  Ver cursos donde estoy inscrito (solo estudiante)
    router.get(
        '/mis-cursos',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.MY_COURSES_VIEW),
        controlador.findByEstudiante
    );

    app.use('/api', router);
};
