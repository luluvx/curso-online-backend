const rolService = require('@modules/rol/rol.service');

exports.create = async (req, res, next) => {
    try {
        const { codigo, nombre } = req.body;
        const nuevoRol = await rolService.create(codigo, nombre);
        res.status(201).json(nuevoRol);
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const roles = await rolService.findAll();
        res.status(200).json(roles);
    } catch (error) {
        next(error);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const rol = await rolService.findById(req.params.id);
        res.status(200).json(rol);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        const actualizado = await rolService.update(req.params.id, nombre);
        res.status(200).json(actualizado);
    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        await rolService.remove(req.params.id);
        res.status(200).json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
        next(error);
    }
};
