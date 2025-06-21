module.exports = (app) => {
    const router = require('express').Router();
    const controlador   = require('../controllers/categoria.controller');
    const auth   = require('../middlewares/auth.middleware');
    const { PERMISSIONS } = require('../config/permission.config');
    const permission      = require('../middlewares/permission.middleware');


    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.CREATE_CATEGORY),
        controlador.crear
    );

    router.get(
        '/',
        controlador.findAll
    );

    router.get(
        '/:id',
        controlador.findOne
    );

    router.put(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.UPDATE_CATEGORY),
        controlador.update
    );

    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.DELETE_CATEGORY),
        controlador.remove
    );

    app.use('/api/categorias', router);
};
