const servicio = require("../services/inscripcion.service");

exports.create = async (req, res, next) => {
    try {
        const cursoId = req.params.cursoId;
        const estudianteId = req.user.id;
        const nuevaInscripcion = await servicio.createInscripcion(
        cursoId,
        estudianteId
        );
        res.status(201).json(nuevaInscripcion);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.findAllByCurso = async (req, res, next) => {
    try {
        const cursoId = req.params.cursoId;
        const inscripciones = await servicio.getInscripcionesPorCurso(cursoId);
        res.status(200).json(inscripciones);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

exports.findAllByStudent = async (req, res, next) => {
    try {
        const estudianteId = req.user.id;
        const cursosInscritos = await servicio.getCursosPorEstudiante(estudianteId);
        res.status(200).json(cursosInscritos);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};
