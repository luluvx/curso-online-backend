const permisoService = require('@modules/permiso/permiso.service');

exports.findAll = async (req, res, next) => {
    try {
        const permisos = await permisoService.findAll();
        res.status(200).json(permisos);
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { codigo, nombre } = req.body;
        const nuevoPermiso = await permisoService.create(codigo, nombre);
        res.status(201).json(nuevoPermiso);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { nombre } = req.body;
        const actualizado = await permisoService.update(id, nombre);
        res.status(200).json(actualizado);
    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const id = req.params.id;
        await permisoService.remove(id);
        res.status(200).json({ message: 'Permiso eliminado exitosamente' });
    } catch (error) {
        next(error);
    }
};
