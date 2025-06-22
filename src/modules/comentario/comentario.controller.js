const comentarioService = require('./comentario.service');

exports.create = async (req, res, next) => {
    try {
        const data = await comentarioService.create({
        cursoId: req.params.cursoId,
        usuarioId: req.user.id,
        contenido: req.body.contenido
        });
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

exports.findByCurso = async (req, res, next) => {
    try {
        const data = await comentarioService.findByCurso(req.params.cursoId);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const data = await comentarioService.update(
        req.params.id,
        req.user.id,
        req.body.contenido
        );
        res.json(data);
    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const data = await comentarioService.remove(req.params.id, req.user.id);
        res.json(data);
    } catch (error) {
        next(error);
    }
};
