const rolePermissionService = require('../services/rolePermission.service');
const { BadRequestError } = require('../utils/errors');

exports.assignPermissions = async (req, res) => {
    try {
        const { rolId, permisoIds } = req.body;
        if (!rolId || !permisoIds || !Array.isArray(permisoIds) || permisoIds.length === 0) {
            throw new BadRequestError('Rol ID y permisos son requeridos');
        }
        const asignados = await rolePermissionService.assignPermissions(rolId, permisoIds);
        res.status(201).json(asignados);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
    }
};

exports.getPermissionsByRole = async (req, res) => {
    try {
        const rolId = req.params.rolId;
        const permisos = await rolePermissionService.getPermissionsByRole(rolId);
        res.json(permisos);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};
