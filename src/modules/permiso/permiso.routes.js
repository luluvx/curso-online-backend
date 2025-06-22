module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/permiso/permiso.controller');
    const auth = require('@middlewares/auth.middleware');
    const { PERMISSIONS } = require('@config/permission.config');
    const permission = require('@middlewares/permission.middleware');

    router.get('/', auth.verifyToken, controlador.findAll);

    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.CREATE_PERMISSION),
        controlador.create
    );

    router.put(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.UPDATE_PERMISSION),
        controlador.update
    );

    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.DELETE_PERMISSION),
        controlador.remove
    );

    app.use('/api/permisos', router);
};
