const db = require('../models');
const Categoria = db.categorias;
const { BadRequestError, NotFoundError } = require('../utils/errors');

const createCategoria = async (nombre, descripcion) => {
    if (!nombre) {
        throw new BadRequestError('El nombre de la categoría es requerido');
    }
    const existente = await Categoria.findOne({ where: { nombre } });
    if (existente) {
        throw new BadRequestError('Ya existe una categoría con ese nombre');
    }
    return await Categoria.create({ nombre, descripcion });
};

const getCategorias = async () => {
    return await Categoria.findAll();
};

const getCategoriaById = async (id) => {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        throw new NotFoundError('Categoría no encontrada');
    }
    return categoria;
    };

    const updateCategoria = async (id, nombre, descripcion) => {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        throw new NotFoundError('Categoría no encontrada');
    }
    if (nombre) {
        const otra = await Categoria.findOne({ where: { nombre } });
        if (otra && otra.id !== categoria.id) {
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

const deleteCategoria = async (id) => {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        throw new NotFoundError('Categoría no encontrada');
    }
    await categoria.destroy();
    return { message: 'Categoría eliminada exitosamente' };
};

module.exports = {
    createCategoria,
    getCategorias,
    getCategoriaById,
    updateCategoria,
    deleteCategoria
};
