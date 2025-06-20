module.exports = (app) => {
    const router = require('express').Router();
    const auth   = require('../middlewares/auth.middleware');
    const controlador   = require('../controllers/video.controller');

    // Agregar vídeo a un curso (solo admin o profesor dueño)
    router.post(
        '/cursos/:cursoId/videos',
        auth.verifyToken,
        auth.isAdminOrProfessor,
        controlador.create
    );

    // Listar vídeos de un curso (solo usuarios con acceso: inscritos, profe o admin)
    router.get(
        '/cursos/:cursoId/videos',
        auth.verifyToken,
        controlador.findAll
    );

    // Ver detalle de un vídeo (solo usuarios con acceso)
    router.get(
        '/videos/:id',
        auth.verifyToken,
        controlador.findOne
    );

    // Actualizar un vídeo (solo admin o profesor dueño)
    router.patch(
        '/videos/:id',
        auth.verifyToken,
        auth.isAdminOrProfessor,
        controlador.update
    );

    // Eliminar un vídeo (solo admin o profesor dueño)
    router.delete(
        '/videos/:id',
        auth.verifyToken,
        auth.isAdminOrProfessor,
        controlador.remove
    );

    app.use('/api', router);
};
