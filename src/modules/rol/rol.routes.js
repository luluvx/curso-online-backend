module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/rol/rol.controller');
    const auth = require('@middlewares/auth.middleware');
    const { PERMISSIONS } = require('@config/permission.config');
    const permission = require('@middlewares/permission.middleware');

    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.CREATE_ROLE),
        controlador.create
    );

    router.get(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIEW_ROLES),
        controlador.findAll
    );

    router.get(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIEW_ROLE),
        controlador.findById
    );

    router.put(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.UPDATE_ROLE),
        controlador.update
    );

    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.DELETE_ROLE),
        controlador.remove
    );

    app.use('/api/roles', router);
};
