module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/nota/nota.controller');
    const auth = require('@middlewares/auth.middleware');
    const PERMISSIONS = require('@constants/permissions');
    const permission = require('@middlewares/permission.middleware');
  

    router.post(
        '/inscripciones/:inscripcionId/notas',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.GRADE_ASSIGN),
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

    app.use('/api', router);
};
