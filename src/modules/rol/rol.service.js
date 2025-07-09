const db = require('@db');
const Rol = db.roles;
const { BadRequestError, NotFoundError } = require('@utils/errors');

const create = async (codigo, nombre) => {
    if (!codigo || !nombre) {
        throw new BadRequestError('Código y nombre del rol son requeridos');
    }

    const existente = await Rol.findOne({ where: { codigo } });
    if (existente) {
        throw new BadRequestError('Ya existe un rol con este código');
    }

    return await Rol.create({ codigo, nombre });
};

const findAll = async () => {
    return await Rol.findAll();
};

const findById = async id => {
    const rol = await Rol.findByPk(id);
    if (!rol) {
        throw new NotFoundError('Rol no encontrado');
    }
    return rol;
};

const update = async (id, nombre) => {
    if (!nombre) {
        throw new BadRequestError('El nombre del rol es requerido');
    }

    const rol = await Rol.findByPk(id);
    if (!rol) {
        throw new NotFoundError('Rol no encontrado');
    }

    rol.nombre = nombre;
    await rol.save();
    return rol;
};

const remove = async id => {
    const rol = await Rol.findByPk(id);
    if (!rol) {
        throw new NotFoundError('Rol no encontrado');
    }

    await rol.destroy();
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};
