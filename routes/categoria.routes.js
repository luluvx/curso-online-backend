module.exports = (app) => {
    const router = require('express').Router();
    const controlador   = require('../controllers/categoria.controller');

    router.post('/', controlador.crear);

    router.get('/', controlador.findAll);

    router.get('/:id', controlador.findOne);

    router.put('/:id', controlador.update);

    router.delete('/:id', controlador.remove);

    app.use('/api/categorias', router);
};
