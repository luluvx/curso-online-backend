const categoriaService = require('@modules/categoria/categoria.service');

exports.create = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const nuevaCategoria = await categoriaService.create({ nombre, descripcion });
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const categorias = await categoriaService.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const categoria = await categoriaService.findById(req.params.id);
        res.status(200).json(categoria);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const categoria = await categoriaService.update(req.params.id, { nombre, descripcion });
        res.status(200).json(categoria);
    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const result = await categoriaService.remove(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
