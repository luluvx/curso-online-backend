const servicio = require('../services/nota.service');
const { BadRequestError } = require('../utils/errors');

exports.create = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new BadRequestError('El cuerpo de la petición no puede estar vacío');
        }
        const inscripcionId = req.params.inscripcionId;
        const { valor, descripcion } = req.body;
        if (valor == null) {
            throw new BadRequestError('El valor de la nota es requerido');
        }
        const usuarioId = req.user.id;
        const nuevaNota = await servicio.createNota(
            inscripcionId,
            valor,
            descripcion,
            usuarioId
        );
        res.status(201).json(nuevaNota);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};

exports.findAllByInscripcion = async (req, res, next) => {
    try {
        const inscripcionId = req.params.inscripcionId;
        const usuarioId     = req.user.id;
        const notas = await servicio.getNotasPorInscripcion(inscripcionId, usuarioId);
        res.status(200).json(notas);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};

exports.findMyNotas = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;
        const notas     = await servicio.getMisNotas(usuarioId);
        res.status(200).json(notas);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};
