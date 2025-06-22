const notaService = require('@modules/nota/nota.service');

exports.create = async (req, res, next) => {
    try {
        const { valor, descripcion } = req.body;
        const inscripcionId = req.params.inscripcionId;
        const usuarioId = req.user.id;

        const nota = await notaService.create(inscripcionId, valor, descripcion, usuarioId);
        res.status(201).json(nota);
    } catch (error) {
        next(error);
    }
};

exports.findByInscripcion = async (req, res, next) => {
    try {
        const inscripcionId = req.params.inscripcionId;
        const usuarioId = req.user.id;

        const notas = await notaService.findByInscripcion(inscripcionId, usuarioId);
        res.status(200).json(notas);
    } catch (error) {
        next(error);
    }
};

exports.findMine = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;
        const notas = await notaService.findMine(usuarioId);
        res.status(200).json(notas);
    } catch (error) {
        next(error);
    }
};
