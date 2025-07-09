module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/permiso/permiso.controller');
    const auth = require('@middlewares/auth.middleware');
    const PERMISSIONS = require('@constants/permissions');
    const permission = require('@middlewares/permission.middleware');
    const permisoValidation = require('@validations/permiso.validation');
    const validate = require('@middlewares/validationResult.middleware');


    router.get(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.PERMISSION_LIST),
        controlador.findAll
    );


    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.PERMISSION_CREATE),
        permisoValidation.createPermiso,
        validate,
        controlador.create
    );


    router.put(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.PERMISSION_UPDATE),
        permisoValidation.updatePermiso,
        validate,
        controlador.update
    );


    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.PERMISSION_DELETE),
        controlador.remove
    );

    app.use('/api/permisos', router);
};
