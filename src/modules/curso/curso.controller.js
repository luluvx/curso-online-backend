const cursoService = require('@modules/curso/curso.service');
const { BadRequestError } = require('@utils/errors');

exports.create = async (req, res, next) => {
    try {
        const { titulo, descripcion, categoriaId, profesorId: assignedProfesorId } = req.body;
        const currentUserId = req.user.id;

        const curso = await cursoService.createCurso(
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
        const filtros = {};

        // Extraer parámetros de query
        if (req.query.profesorId) {
            filtros.profesorId = parseInt(req.query.profesorId);
            if (isNaN(filtros.profesorId)) {
                return res.status(400).json({ error: 'profesorId debe ser un número válido' });
            }
        }

        if (req.query.categoriaId) {
            filtros.categoriaId = parseInt(req.query.categoriaId);
            if (isNaN(filtros.categoriaId)) {
                return res.status(400).json({ error: 'categoriaId debe ser un número válido' });
            }
        }

        const cursos = await cursoService.getCursos(filtros);
        res.status(200).json(cursos);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        next(err);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const curso = await cursoService.getCursoById(req.params.id);
        res.status(200).json(curso);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const datos = req.body;
        const usuarioId = req.user.id;
        const curso = await cursoService.updateCurso(req.params.id, datos, usuarioId);
        res.status(200).json(curso);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;
        const result = await cursoService.deleteCurso(req.params.id, usuarioId);
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

        const imagenUrl = `/uploads/cursos/${req.file.filename}`;
        const profesorId = req.user.id;
        const curso = await cursoService.updateCursoPicture(req.params.id, imagenUrl, profesorId);

        res.status(200).json(curso);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};
