module.exports = (app) => {
    const router = require('express').Router();
    const controlador   = require('../controllers/categoria.controller');
    const auth   = require('../middlewares/auth.middleware');

    router.post(
        '/',
        auth.verifyToken,
        auth.isAdmin,
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
        auth.isAdmin,
        controlador.update
    );

    router.delete(
        '/:id',
        auth.verifyToken,
        auth.isAdmin,
        controlador.remove
    );

    app.use('/api/categorias', router);
};
