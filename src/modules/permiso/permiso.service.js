const db = require('@db');
const Permiso = db.permisos;
const { NotFoundError, BadRequestError } = require('@utils/errors');

const findAll = async () => {
    return await Permiso.findAll();
};

const create = async (codigo, nombre) => {
    if (!codigo || !nombre) {
        throw new BadRequestError('Código y nombre del permiso son requeridos');
    }

    const existente = await Permiso.findOne({ where: { codigo } });
    if (existente) {
        throw new BadRequestError('Ya existe un permiso con este código');
    }

    return await Permiso.create({ codigo, nombre });
};

const update = async (id, nombre) => {
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

const remove = async id => {
    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
        throw new NotFoundError('Permiso no encontrado');
    }

    await permiso.destroy();
};

module.exports = {
    findAll,
    create,
    update,
    remove
};
