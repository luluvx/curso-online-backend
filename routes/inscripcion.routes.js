module.exports = (app) => {
    const router = require('express').Router();
    const auth   = require('../middlewares/auth.middleware');
    const controlador   = require('../controllers/inscripcion.controller');

    // Inscribirse a un curso (solo estudiantes)
    router.post(
        '/cursos/:cursoId/inscripcion',
        auth.verifyToken,
        auth.isStudent,
        controlador.create
    );

    // Listar inscripciones de un curso (admin o profesor dueño)
    router.get(
        '/cursos/:cursoId/inscripciones',
        auth.verifyToken,
        auth.isAdminOrProfessor,
        controlador.findAllByCurso
    );

    // Listar cursos donde estoy inscrito (solo estudiante)
    router.get(
        '/mis-cursos',
        auth.verifyToken,
        auth.isStudent,
        controlador.findAllByStudent
    );

    app.use('/api', router);
};
