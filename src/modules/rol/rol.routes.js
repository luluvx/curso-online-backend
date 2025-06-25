module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/rol/rol.controller');
    const auth = require('@middlewares/auth.middleware');
    const PERMISSIONS = require('@constants/permissions');
    const permission = require('@middlewares/permission.middleware');
    const rolValidation = require('@validations/rol.validation');
    const validate = require('@middlewares/validationResult.middleware');


    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_CREATE),
        rolValidation.createRol,
        validate,
        controlador.create
    );


    router.get(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_LIST),
        controlador.findAll
    );


    router.get(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_VIEW),
        controlador.findById
    );


    router.put(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_UPDATE),
        rolValidation.updateRol,
        validate,
        controlador.update
    );


    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ROLE_DELETE),
        controlador.remove
    );

    app.use('/api/roles', router);
};
