module.exports = (app) => {
    const router = require('express').Router();
    const controlador   = require('../controllers/curso.controller');
    const auth   = require('../middlewares/auth.middleware');
    const { PERMISSIONS } = require('../config/permission.config');
    const permission      = require('../middlewares/permission.middleware');


    const upload = require('../middlewares/upload.middleware');


    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.CREATE_COURSE),
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
        permission.hasPermission(PERMISSIONS.UPDATE_COURSE),
        controlador.update
    );


    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.DELETE_COURSE),
        controlador.remove
    );

    router.post(
    '/:id/imagen',
    auth.verifyToken,
    permission.hasPermission(PERMISSIONS.UPDATE_COURSE),
    upload.single('imagen'),
    controlador.uploadPicture
    );


    app.use('/api/cursos', router);
};
