module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/rol/rol.controller');
    const auth = require('@middlewares/auth.middleware');
    const { PERMISSIONS } = require('@config/permission.config');
    const permission = require('@middlewares/permission.middleware');

    // Crear rol
    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_CREATE),
        controlador.create
    );

    // Listar roles
    router.get(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_LIST),
        controlador.findAll
    );

    // Ver un rol
    router.get(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_VIEW),
        controlador.findById
    );

    // Actualizar rol
    router.put(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_UPDATE),
        controlador.update
    );

    // Eliminar rol
    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_DELETE),
        controlador.remove
    );

    app.use('/api/roles', router);
};
