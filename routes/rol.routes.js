module.exports = app => {
    const router = require('express').Router();
    const controller = require('../controllers/rol.controller.js');
    const auth = require('../middlewares/auth.middleware.js');
    const { PERMISSIONS } = require('../config/permission.config');
    const permission      = require('../middlewares/permission.middleware');



    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.CREATE_ROLE),
        controller.create
    );

    router.get(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIEW_ROLES),
        controller.findAll
    );

    router.get(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIEW_ROLE),
        controller.findOne
    );

    router.put(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.UPDATE_ROLE),
        controller.update
    );

    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.DELETE_ROLE),
        controller.remove
    );

    app.use('/api/roles', router);
};
