const notaService = require('@modules/nota/nota.service');

exports.create = async (req, res, next) => {
    try {
        const { valor, tipoNotaId } = req.body;
        const inscripcionId = req.params.inscripcionId;
        const usuarioId = req.user.id;

        const nota = await notaService.create(inscripcionId, valor, tipoNotaId, usuarioId);
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

exports.update = async (req, res, next) => {
    try {
        const notaId = req.params.id;
        const usuarioId = req.user.id;
        const nota = await notaService.update(notaId, req.body, usuarioId);
        res.status(200).json(nota);
    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const notaId = req.params.id;
        const usuarioId = req.user.id;
        const result = await notaService.remove(notaId, usuarioId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
