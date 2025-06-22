module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/curso/curso.controller');
    const auth = require('@middlewares/auth.middleware');
    const permission = require('@middlewares/permission.middleware');
    const { PERMISSIONS } = require('@config/permission.config');
    const upload = require('@middlewares/upload.middleware')('cursos');

    // Crear un curso (solo profesores o admin)
    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COURSE_CREATE),
        controlador.create
    );

    // Listar todos los cursos (público o autenticado)
    router.get('/', controlador.findAll);

    // Ver detalle de un curso específico
    router.get(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COURSE_VIEW),
        controlador.findById
    );

    // Actualizar un curso (solo el dueño o admin)
    router.patch(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COURSE_UPDATE),
        controlador.update
    );

    // Eliminar un curso (solo el dueño o admin)
    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COMMENT_DELETE),
        controlador.remove
    );

    // Subir o actualizar imagen de un curso
    router.post(
        '/:id/imagen',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COURSE_UPDATE),
        upload.single('imagen'),
        controlador.uploadPicture
    );

    app.use('/api/cursos', router);
};
