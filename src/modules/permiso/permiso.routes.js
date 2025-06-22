module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/permiso/permiso.controller');
    const auth = require('@middlewares/auth.middleware');
    const { PERMISSIONS } = require('@config/permission.config');
    const permission = require('@middlewares/permission.middleware');

    // Listar todos los permisos
    router.get(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.PERMISSION_LIST),
        controlador.findAll
    );

    // Crear un permiso
    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.PERMISSION_CREATE),
        controlador.create
    );

    // Actualizar un permiso
    router.put(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.PERMISSION_UPDATE),
        controlador.update
    );

    // Eliminar un permiso
    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.PERMISSION_DELETE),
        controlador.remove
    );

    app.use('/api/permisos', router);
};
