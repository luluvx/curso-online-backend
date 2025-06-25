module.exports = app => {
    const router = require('express').Router();
    const controlador = require('@modules/progreso/progreso.controller');
    const auth = require('@middlewares/auth.middleware');
    const PERMISSIONS = require('@constants/permissions');
    const permission = require('@middlewares/permission.middleware');
  

    router.post(
        '/videos/:videoId/visto',
        auth.verifyToken,
        controlador.marcarVisto
    );

    router.get(
        '/cursos/:cursoId/progreso',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIEW_PROGRESS),
        controlador.getProgresoCurso
    );

    app.use('/api', router);
};
