module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/rol-permisos/rol-permisos.controller');
    const auth = require('@middlewares/auth.middleware');
    const permission = require('@middlewares/permission.middleware');
    const { PERMISSIONS } = require('@config/permission.config');

    router.get(
        '/:rolId',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIEW_ROLE_PERMISSIONS),
        controlador.getPermissionsByRole
    );

    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ASSIGN_PERMISSIONS),
        controlador.assignPermissions
    );

    app.use('/api/rol-permisos', router);
};
