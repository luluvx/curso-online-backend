module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/comentario/comentario.controller');
    const auth = require('@middlewares/auth.middleware');
    const permission = require('@middlewares/permission.middleware');
    const PERMISSIONS = require('@constants/permissions');
    const comentarioValidation = require('@validations/comentario.validation');
    const validate = require('@middlewares/validationResult.middleware');

    router.post(
        '/cursos/:cursoId/comentarios',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COMMENT_ADD),
        comentarioValidation.createComentario,
        validate,
        controlador.create
    );

    router.get(
        '/cursos/:cursoId/comentarios',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COMMENT_LIST),
        controlador.findByCurso
    );

    router.put(
        '/comentarios/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COMMENT_UPDATE),
        comentarioValidation.updateComentario,
        validate,
        controlador.update
    );

    router.delete(
        '/comentarios/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COMMENT_DELETE),
        controlador.remove
    );

    app.use('/api', router);
};
