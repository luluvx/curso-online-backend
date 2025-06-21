const db = require('../models');
const {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
} = require("../utils/errors");

const create = async (codigo, nombre) => {
    if (!codigo || !nombre) {
        throw new BadRequestError('Código y nombre del rol son requeridos');
    }

    const existingRole = await db.roles.findOne({ where: { codigo } });
    if (existingRole) {
        throw new BadRequestError('Ya existe un rol con este código');
    }

    const newRole = await db.roles.create({ codigo, nombre });
    return newRole;
}

const findAll = async () => {
    const roles = await db.roles.findAll();
    return roles;
}


const findOne = async (id) => {
    const role = await db.roles.findByPk(id);
    if (!role) {
        throw new NotFoundError('Rol no encontrado');
    }
    return role;
}

const update = async (id, nombre) => {
    if (!nombre) {
        throw new Error('El nombre del rol es requerido');
    }

    const role = await db.roles.findByPk(id);
    if (!role) {
        throw new NotFoundError('Rol no encontrado');
    }

    role.nombre = nombre;
    await role.save();
    return role;
}

const remove = async (id) => {
    const role = await db.roles.findByPk(id);
    if (!role) {
        throw new NotFoundError('Rol no encontrado');
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