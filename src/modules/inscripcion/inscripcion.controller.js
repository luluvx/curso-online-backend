const inscripcionService = require('@modules/inscripcion/inscripcion.service');

exports.create = async (req, res, next) => {
    try {
        const cursoId = req.params.cursoId;
        const estudianteId = req.user.id;
        const inscripcion = await inscripcionService.create(cursoId, estudianteId);
        res.status(201).json(inscripcion);
    } catch (error) {
        next(error);
    }
};

exports.findByCurso = async (req, res, next) => {
    try {
        const cursoId = req.params.cursoId;
        const inscripciones = await inscripcionService.findByCurso(cursoId);
        res.status(200).json(inscripciones);
    } catch (error) {
        next(error);
    }
};

exports.findByEstudiante = async (req, res, next) => {
    try {
        const estudianteId = req.user.id;
        const cursos = await inscripcionService.findByEstudiante(estudianteId);
        res.status(200).json(cursos);
    } catch (error) {
        next(error);
    }
};
