module.exports = app => {
    const router = require('express').Router();
    const controller = require('../controllers/rol.controller.js');
    const auth = require('../middlewares/auth.middleware.js');

    router.use(auth.verifyToken, auth.isAdmin);

    router.post('/', controller.create);

    router.get('/', controller.findAll);

    router.get('/:id', controller.findOne);

    router.put('/:id', controller.update);

    router.delete('/:id', controller.remove);

    app.use('/api/roles', router);
};
