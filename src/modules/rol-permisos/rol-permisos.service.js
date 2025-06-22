const db = require('@db');
const RolPermiso = db.rolPermisos;
const Rol = db.roles;
const Permiso = db.permisos;
const { NotFoundError } = require('@utils/errors');

const assignPermissions = async (rolId, permisoIds) => {
    const rol = await Rol.findByPk(rolId);
    if (!rol) throw new NotFoundError('Rol no encontrado');

    await RolPermiso.destroy({ where: { rolId } });

    const permisos = permisoIds.map(permisoId => ({ rolId, permisoId }));
    await RolPermiso.bulkCreate(permisos);

    return { message: 'Permisos asignados correctamente' };
};

const getPermissionsByRole = async rolId => {
    const rol = await Rol.findByPk(rolId, {
        include: {
            model: Permiso,
            as: 'permisos',
            through: { attributes: [] }
        }
    });

    if (!rol) throw new NotFoundError('Rol no encontrado');
    return rol.permisos;
};

module.exports = {
    assignPermissions,
    getPermissionsByRole
};
