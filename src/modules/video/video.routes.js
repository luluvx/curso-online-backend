module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/video/video.controller');
    const auth = require('@middlewares/auth.middleware');
    const PERMISSIONS = require('@constants/permissions');
    const permission = require('@middlewares/permission.middleware');
   


    router.post(
        '/cursos/:cursoId/videos',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIDEO_ADD),
        controlador.create
    );


    router.get(
        '/cursos/:cursoId/videos',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIDEO_LIST),
        controlador.findAll
    );


    router.get(
        '/videos/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIDEO_VIEW),
        controlador.findById
    );


    router.patch(
        '/videos/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIDEO_UPDATE),
        controlador.update
    );


    router.delete(
        '/videos/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIDEO_DELETE),
        controlador.remove
    );

    app.use('/api', router);
};
