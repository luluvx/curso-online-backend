
const rolService = require('../services/rol.service');
const { BadRequestError } = require('../utils/errors');

exports.create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
        throw new BadRequestError(
            "El cuerpo de la petición no puede estar vacío"
        );
        }
        const { codigo, nombre } = req.body;
        const newRole = await rolService.create(codigo,nombre);
        res.status(201).json(newRole);
    } catch (error) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
}

exports.findAll = async (req, res) => {
    try {
        const roles = await rolService.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los roles: ' + error.message });
    }
}

exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const role = await rolService.findOne(id);
        res.status(200).json(role);
    } catch (error) {
        res.status(404).json({ error: 'Error al obtener el rol: ' + error.message });
    }
}

exports.update = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Por favor, complete todos los campos requeridos.' });
    }
    const id = req.params.id;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre del rol es requerido' });
    }

    try {
        const updatedRole = await rolService.update(id, nombre);
        if (!updatedRole) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el rol: ' + error.message });
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await rolService.remove(id);
        if (!result) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el rol: ' + error.message });
    }
}