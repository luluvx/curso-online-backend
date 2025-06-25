const servicio = require('./usuario.service');
const { BadRequestError } = require('@utils/errors');

exports.findAll = async (req, res, next) => {
    try {
        const usuarios = await servicio.findAll();
        res.status(200).json(usuarios);
    } catch (err) {
        next(err);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const usuario = await servicio.findById(req.params.id);
        res.status(200).json(usuario);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const usuarioId = req.params.id;
        const usuario = await servicio.update(usuarioId, req.body);
        res.status(200).json(usuario);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const usuarioId = req.params.id;
        const result = await servicio.remove(usuarioId);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const usuario = await servicio.findById(req.user.id);
        res.status(200).json(usuario);
    } catch (err) {
        next(err);
    }
}; 