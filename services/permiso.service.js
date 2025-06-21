const db = require('../models');
const Permiso = db.permisos;
const { NotFoundError, BadRequestError } = require('../utils/errors');

exports.findAll = async () => {
    return await Permiso.findAll();
};

exports.create = async (codigo, nombre) => {
    if (!codigo || !nombre) {
        throw new BadRequestError('Código y nombre del permiso son requeridos');
    }

    const existingPermiso = await Permiso.findOne({ where: { codigo } });
    if (existingPermiso) {
        throw new BadRequestError('Ya existe un permiso con este código');
    }

    return await Permiso.create({ codigo, nombre });
};

exports.update = async (id, nombre) => {
    if (!nombre) {
        throw new BadRequestError('El nombre del permiso es requerido');
    }

    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
        throw new NotFoundError('Permiso no encontrado');
    }

    permiso.nombre = nombre;
    await permiso.save();
    return permiso;
};

exports.remove = async (id) => {
    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
        throw new NotFoundError('Permiso no encontrado');
    }

    await permiso.destroy();
    return { message: 'Permiso eliminado exitosamente' };
};
