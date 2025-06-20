// controllers/video.controller.js
const servicio = require("../services/video.service");
const { BadRequestError } = require("../utils/errors");

exports.create = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
        throw new BadRequestError(
            "El cuerpo de la petición no puede estar vacío"
        );
        }
        const cursoId = req.params.cursoId;
        const { titulo, url, orden } = req.body;
        const usuarioId = req.user.id;

        const nuevoVideo = await servicio.createVideo(
        cursoId,
        titulo,
        url,
        orden,
        usuarioId
        );
        res.status(201).json(nuevoVideo);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const cursoId = req.params.cursoId;
        const usuarioId = req.user.id;

        const videos = await servicio.getVideos(cursoId, usuarioId);
        res.status(200).json(videos);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const usuarioId = req.user.id;

        const video = await servicio.getVideoById(videoId, usuarioId);
        res.status(200).json(video);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
        throw new BadRequestError(
            "El cuerpo de la petición no puede estar vacío"
        );
        }
        const videoId = req.params.id;
        const cambios = req.body;
        const usuarioId = req.user.id;

        const videoActualizado = await servicio.updateVideo(
        videoId,
        cambios,
        usuarioId
        );
        res.status(200).json(videoActualizado);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const usuarioId = req.user.id;

        const resultado = await servicio.deleteVideo(videoId, usuarioId);
        res.status(200).json(resultado);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};
