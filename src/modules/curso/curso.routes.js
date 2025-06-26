module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/curso/curso.controller');
    const auth = require('@middlewares/auth.middleware');
    const permission = require('@middlewares/permission.middleware');
    const PERMISSIONS = require('@constants/permissions');
    const upload = require('@middlewares/upload.middleware')('cursos');
    const cursoValidation = require('@validations/curso.validation');
    const validate = require('@middlewares/validationResult.middleware');



    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COURSE_CREATE),
        cursoValidation.createCurso,
        validate,
        controlador.create
    );


    router.get('/', controlador.findAll);


    router.get('/:id', controlador.findById);


    router.patch(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COURSE_UPDATE),
        cursoValidation.updateCurso,
        validate,
        controlador.update
    );


    router.delete(
        '/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COURSE_DELETE),
        controlador.remove
    );


    router.post(
        '/:id/imagen',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.COURSE_UPDATE),
        upload.single('imagen'),
        controlador.uploadPicture
    );

    app.use('/api/cursos', router);
};
