const rolPermisoService = require('@modules/rol-permisos/rol-permisos.service');
const { BadRequestError } = require('@utils/errors');

exports.assignPermissions = async (req, res, next) => {
    try {
        const { rolId, permisoIds } = req.body;

        if (!rolId || !Array.isArray(permisoIds) || permisoIds.length === 0) {
            throw new BadRequestError('El rolId y una lista de permisoIds son requeridos');
        }

        const resultado = await rolPermisoService.assignPermissions(rolId, permisoIds);
        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
};

exports.getPermissionsByRole = async (req, res, next) => {
    try {
        const rolId = req.params.rolId;
        const permisos = await rolPermisoService.getPermissionsByRole(rolId);
        res.status(200).json(permisos);
    } catch (error) {
        next(error);
    }
};
