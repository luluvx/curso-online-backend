const categoriaService = require('../services/categoria.service');

exports.crear = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const categoria = await categoriaService.createCategoria(nombre, descripcion);
        res.status(201).json(categoria);
    } catch (err) {
        if (err.status) {
        return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const categorias = await categoriaService.getCategorias();
        res.status(200).json(categorias);
    } catch (err) {
        next(err);
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const categoria = await categoriaService.getCategoriaById(req.params.id);
        res.status(200).json(categoria);
    } catch (err) {
        if (err.status) {
        return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const categoria = await categoriaService.updateCategoria(req.params.id, nombre, descripcion);
        res.status(200).json(categoria);
    } catch (err) {
        if (err.status) {
        return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const result = await categoriaService.deleteCategoria(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        if (err.status) {
        return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};
