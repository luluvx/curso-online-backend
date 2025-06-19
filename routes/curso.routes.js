module.exports = (app) => {
    const router = require('express').Router();
    const controlador   = require('../controllers/curso.controller');
    const auth   = require('../middlewares/auth.middleware');
    const upload = require('../middlewares/upload.middleware');


    router.post(
        '/',
        auth.verifyToken,
        auth.isAdminOrProfessor,
        controlador.create
    );

    router.get(
        '/',
        controlador.findAll
    );


    router.get(
        '/:id',
        controlador.findOne
    );


    router.patch(
        '/:id',
        auth.verifyToken,
        auth.isAdminOrProfessor,
        controlador.update
    );


    router.delete(
        '/:id',
        auth.verifyToken,
        auth.isAdminOrProfessor,
        controlador.remove
    );

    router.post(
    '/:id/imagen',
    auth.verifyToken,
    auth.isAdminOrProfessor,
    upload.single('imagen'),
    controlador.uploadPicture
    );


    app.use('/api/cursos', router);
};
