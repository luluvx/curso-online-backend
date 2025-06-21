const db = require('../models');
const RolePermission = db.rolePermissions;
const Rol = db.roles;
const { NotFoundError } = require('../utils/errors');

exports.assignPermissions = async (rolId, permisoIds) => {
    const rol = await Rol.findByPk(rolId);
    if (!rol) throw new NotFoundError('Rol no encontrado');

    await RolePermission.destroy({ where: { rolId } });

    const assignments = permisoIds.map(permisoId => ({ rolId, permisoId }));
    await RolePermission.bulkCreate(assignments);
};

exports.getPermissionsByRole = async (rolId) => {
    const rol = await Rol.findByPk(rolId, {
        include: {
        model: db.permisos,
        as: 'permisos',
        through: { attributes: [] }
        }
    });

    if (!rol) throw new NotFoundError('Rol no encontrado');
    return rol.permisos;
};
