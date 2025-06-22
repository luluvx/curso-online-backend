const videoService = require('@modules/video/video.service');

exports.create = async (req, res, next) => {
    try {
        const cursoId = req.params.cursoId;
        const usuarioId = req.user.id;
        const { titulo, url, orden } = req.body;

        const nuevo = await videoService.create(cursoId, titulo, url, orden, usuarioId);
        res.status(201).json(nuevo);
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const cursoId = req.params.cursoId;
        const usuarioId = req.user.id;

        const lista = await videoService.findAll(cursoId, usuarioId);
        res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const usuarioId = req.user.id;

        const video = await videoService.findById(id, usuarioId);
        res.status(200).json(video);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const usuarioId = req.user.id;
        const cambios = req.body;

        const actualizado = await videoService.update(id, cambios, usuarioId);
        res.status(200).json(actualizado);
    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const id = req.params.id;
        const usuarioId = req.user.id;

        const resultado = await videoService.remove(id, usuarioId);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};
