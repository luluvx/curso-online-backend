module.exports = app => {
    const router = require('express').Router();
    const controlador = require('./usuario.controller');
    const auth = require('@middlewares/auth.middleware');
    const permission = require('@middlewares/permission.middleware');
    const PERMISSIONS = require('@constants/permissions');
    const usuarioValidation = require('@validations/usuario.validation');
    const validate = require('@middlewares/validationResult.middleware');


    router.get(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.USER_LIST),
        controlador.findAll
    );

    router.get(
        '/me',
        auth.verifyToken,
        controlador.getMe
    );

    router.get(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.USER_VIEW),
        controlador.findById
    );

    router.patch(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.USER_UPDATE),
        usuarioValidation.updateUser,
        validate,
        controlador.update
    );

    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.USER_DELETE),
        controlador.remove
    );

    app.use('/api/usuarios', router);
}; 