module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/nota/nota.controller');
    const auth = require('@middlewares/auth.middleware');
    const PERMISSIONS = require('@constants/permissions');
    const permission = require('@middlewares/permission.middleware');
    const notaValidation = require('@validations/nota.validation');
    const validate = require('@middlewares/validationResult.middleware');


    router.post(
        '/inscripciones/:inscripcionId/notas',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.GRADE_ASSIGN),
        notaValidation.createNota,
        validate,
        controlador.create
    );


    router.get(
        '/inscripciones/:inscripcionId/notas',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.GRADE_LIST),
        controlador.findByInscripcion
    );


    router.get(
        '/mis-notas',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.MY_GRADES_VIEW),
        controlador.findMine
    );

    router.patch(
        '/notas/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.GRADE_UPDATE),
        notaValidation.updateNota,
        validate,
        controlador.update
    );

    router.delete(
        '/notas/:id',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.GRADE_DELETE),
        notaValidation.deleteNota,
        validate,
        controlador.remove
    );

    app.use('/api', router);
};
