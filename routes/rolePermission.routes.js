module.exports = app => {
    const router = require('express').Router();
    const controller = require('../controllers/rolePermission.controller');
    const auth = require('../middlewares/auth.middleware');
    const permission = require('../middlewares/permission.middleware');
    const { PERMISSIONS } = require('../config/permission.config');


    router.get(
        '/:rolId',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.VIEW_ROLE_PERMISSIONS),
        controller.getPermissionsByRole
    );


    router.post(
        '/',
        auth.verifyToken,
        permission.hasPermission(PERMISSIONS.ASSIGN_PERMISSIONS),
        controller.assignPermissions
    );

    app.use('/api/role-permissions', router);
};
