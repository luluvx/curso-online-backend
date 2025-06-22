const db = require('@db/index');
const Categoria = db.categorias;
const { BadRequestError, NotFoundError } = require('@utils/errors');

const create = async ({ nombre, descripcion }) => {
    if (!nombre) {
        throw new BadRequestError('El nombre de la categoría es requerido');
    }

    const existente = await Categoria.finOne({ where: { nombre } });
    if (existente) {
        throw new BadRequestError('Ya existe una categoría con ese nombre');
    }

    return await Categoria.create({ nombre, descripcion });
};

const findAll = async () => {
    return await Categoria.findAll();
};

const findById = async id => {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        throw new NotFoundError('Categoría no encontrada');
    }
    return categoria;
};

const update = async (id, { nombre, descripcion }) => {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        throw new NotFoundError('Categoría no encontrada');
    }

    if (nombre) {
        const duplicada = await Categoria.findOne({ where: { nombre } });
        if (duplicada && duplicada.id !== categoria.id) {
            throw new BadRequestError('Ya existe una categoría con ese nombre');
        }
        categoria.nombre = nombre;
    }

    if (descripcion !== undefined) {
        categoria.descripcion = descripcion;
    }

    await categoria.save();
    return categoria;
};

const remove = async id => {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        throw new NotFoundError('Categoría no encontrada');
    }

    await categoria.destroy();
    return { message: 'Categoría eliminada exitosamente' };
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};
