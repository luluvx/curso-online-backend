module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/categoria/categoria.controller');
    const auth = require('@middlewares/auth.middleware');
    const { PERMISSIONS } = require('@config/permission.config');
    const permission = require('@middlewares/permission.middleware');

    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.CATEGORY_CREATE),
        controlador.create
    );

    router.get('/', controlador.findAll);

    router.get('/:id', controlador.findById);

    router.put(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.CATEGORY_UPDATE),
        controlador.update
    );

    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.CATEGORY_DELETE),
        controlador.remove
    );

    app.use('/api/categorias', router);
};
