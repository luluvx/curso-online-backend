module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/video/video.controller');
    const auth = require('@middlewares/auth.middleware');
    const { PERMISSIONS } = require('@config/permission.config');
    const permission = require('@middlewares/permission.middleware');

    // Agregar vídeo a un curso
    router.post(
        '/cursos/:cursoId/videos',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIDEO_ADD),
        controlador.create
    );

    // Listar vídeos de un curso
    router.get(
        '/cursos/:cursoId/videos',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIDEO_LIST),
        controlador.findAll
    );

    // Ver detalle de un vídeo
    router.get(
        '/videos/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIDEO_VIEW),
        controlador.findById
    );

    // Actualizar un vídeo
    router.patch(
        '/videos/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIDEO_UPDATE),
        controlador.update
    );

    // Eliminar un vídeo
    router.delete(
        '/videos/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIDEO_DELETE),
        controlador.remove
    );

    app.use('/api', router);
};
