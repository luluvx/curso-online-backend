const permisoService = require('../services/permiso.service');
const { BadRequestError } = require('../utils/errors');

exports.findAll = async (req, res) => {
    try {
        const permisos = await permisoService.findAll();
        res.json(permisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { codigo, nombre } = req.body;
        const nuevo = await permisoService.create(codigo, nombre);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre } = req.body;
        const actualizado = await permisoService.update(id, nombre);
        res.json(actualizado);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const id = req.params.id;
        await permisoService.remove(id);
        res.json({ message: 'Permiso eliminado' });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};
