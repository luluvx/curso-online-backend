const db = require('../models');
const Inscripcion = db.inscripciones;
const Curso        = db.cursos;
const Usuario      = db.usuarios;
const { BadRequestError, NotFoundError } = require('../utils/errors');

const createInscripcion = async (cursoId, estudianteId) => {
    // 1) Validar que el curso exista
    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
        throw new NotFoundError('Curso no encontrado');
    }

    // 2) Validar que el usuario exista y sea estudiante
    const usuario = await Usuario.findByPk(estudianteId, { include: 'rol' });
    if (!usuario) {
        throw new NotFoundError('Usuario no encontrado');
    }
    if (usuario.rol.nombre !== 'estudiante') {
        throw new BadRequestError('Solo los estudiantes pueden inscribirse');
    }

    // 3) Verificar que no esté ya inscrito
    const inscripcionExistente = await Inscripcion.findOne({
        where: { cursoId, estudianteId }
    });
    if (inscripcionExistente) {
        throw new BadRequestError('Ya estás inscrito en este curso');
    }

    // 4) Crear y devolver la inscripción
    return await Inscripcion.create({ cursoId, estudianteId });
};

const getInscripcionesPorCurso = async (cursoId) => {
    // Validar curso
    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
        throw new NotFoundError('Curso no encontrado');
    }

    return await Inscripcion.findAll({
        where: { cursoId },
        include: [{
        model: Usuario,
        as: 'estudiante',
        attributes: ['id', 'nombre', 'apellido', 'email']
        }]
    });
};

const getCursosPorEstudiante = async (estudianteId) => {
    return await Inscripcion.findAll({
        where: { estudianteId },
        include: [{
        model: Curso,
        as: 'curso',
        attributes: ['id', 'titulo', 'descripcion']
        }]
    });
};

module.exports = {
    createInscripcion,
    getInscripcionesPorCurso,
    getCursosPorEstudiante
};
