module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/tipo-nota/tipo-nota.controller');
    const auth = require('@middlewares/auth.middleware');
    const permission = require('@middlewares/permission.middleware');
    const PERMISSIONS = require('@constants/permissions');

    router.post(
        '/cursos/:cursoId/tipos-nota',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.GRADE_ASSIGN),
        controlador.create
    );

    router.get(
        '/cursos/:cursoId/tipos-nota',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.GRADE_LIST),
        controlador.findByCurso
    );

    app.use('/api', router);
}; 