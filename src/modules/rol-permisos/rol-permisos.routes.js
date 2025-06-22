module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/rol-permisos/rol-permisos.controller');
    const auth = require('@middlewares/auth.middleware');
    const permission = require('@middlewares/permission.middleware');
    const { PERMISSIONS } = require('@config/permission.config');

    // Ver permisos asignados a un rol
    router.get(
        '/:rolId',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_PERMISSIONS_VIEW),
        controlador.getPermissionsByRole
    );

    // Asignar permisos a un rol
    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_ASSIGN_PERMISSIONS),
        controlador.assignPermissions
    );

    app.use('/api/rol-permisos', router);
};
