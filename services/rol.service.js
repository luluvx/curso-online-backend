const db = require('../models');


const create = async (nombre) => {
    if (!nombre) {
        throw new Error('El nombre del rol es requerido');
    }

    const existingRole = await db.roles.findOne({ where: { nombre } });
    if (existingRole) {
        throw new Error('El rol ya existe');
    }

    const newRole = await db.roles.create({ nombre });
    return newRole;
}

const findAll = async () => {
    const roles = await db.roles.findAll();
    return roles;
}


const findOne = async (id) => {
    const role = await db.roles.findByPk(id);
    if (!role) {
        throw new Error('Rol no encontrado');
    }
    return role;
}

const update = async (id, nombre) => {
    if (!nombre) {
        throw new Error('El nombre del rol es requerido');
    }

    const role = await db.roles.findByPk(id);
    if (!role) {
        throw new Error('Rol no encontrado');
    }

    role.nombre = nombre;
    await role.save();
    return role;
}

const remove = async (id) => {
    const role = await db.roles.findByPk(id);
    if (!role) {
        throw new Error('Rol no encontrado');
    }

    await role.destroy();
    return { message: 'Rol eliminado exitosamente' };
}


module.exports = {
    create,
    findAll,
    findOne,
    update,
    remove
};