const servicio = require('../services/curso.service');
const { BadRequestError } = require('../utils/errors');


exports.create = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
        throw new BadRequestError('El cuerpo de la petición no puede estar vacío');
        }

        const { titulo, descripcion, categoriaId, profesorId: assignedProfesorId } = req.body;
        const currentUserId = req.user.id;


        const curso = await servicio.createCurso(
        titulo,
        descripcion,
        categoriaId,
        currentUserId,
        assignedProfesorId
        );

        res.status(201).json(curso);
    } catch (err) {
        if (err.status) {
        return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const cursos = await servicio.getCursos();
        res.status(200).json(cursos);
    } catch (err) {
        next(err);
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const curso = await servicio.getCursoById(req.params.id);
        res.status(200).json(curso);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new BadRequestError('El cuerpo de la petición no puede estar vacío');
        }
        const datos = req.body;
        const usuarioId = req.user.id;
        const curso = await servicio.updateCurso(req.params.id, datos, usuarioId);
        res.status(200).json(curso);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;
        const result = await servicio.deleteCurso(req.params.id, usuarioId);
        res.status(200).json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.uploadPicture = async (req, res, next) => {
    try {
        if (!req.file) {
        throw new BadRequestError('Archivo de imagen es requerido');
        }

        const urlImagen = `/uploads/cursos/${req.file.filename}`;
        const profesorId = req.user.id;
        const curso = await servicio.updateCursoPicture(
        req.params.id,
        urlImagen,
        profesorId
        );
        res.status(200).json(curso);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

