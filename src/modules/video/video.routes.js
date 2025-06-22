module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/video/video.controller');
    const auth = require('@middlewares/auth.middleware');
    const { PERMISSIONS } = require('@config/permission.config');
    const permission = require('@middlewares/permission.middleware');

    // Agregar vídeo a un curso (solo admin o profesor dueño)
    router.post(
        '/cursos/:cursoId/videos',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ADD_VIDEO),
        controlador.create
    );

    // Listar vídeos de un curso (solo usuarios con acceso: inscritos, profe o admin)
    router.get(
        '/cursos/:cursoId/videos',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIEW_VIDEOS),
        controlador.findAll
    );

    // Ver detalle de un vídeo (solo usuarios con acceso)
    router.get(
        '/videos/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIEW_VIDEO),
        controlador.findById
    );

    // Actualizar un vídeo (solo admin o profesor dueño)
    router.patch(
        '/videos/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.UPDATE_VIDEO),
        controlador.update
    );

    // Eliminar un vídeo (solo admin o profesor dueño)
    router.delete(
        '/videos/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.DELETE_VIDEO),
        controlador.remove
    );

    app.use('/api', router);
};
