const db = require('@db');
const Inscripcion = db.inscripciones;
const Curso = db.cursos;
const Usuario = db.usuarios;
const { BadRequestError, NotFoundError, ForbiddenError } = require('@utils/errors');
const ROLES = require('@constants/roles');

const create = async (cursoId, estudianteId) => {
    const curso = await Curso.findByPk(cursoId);
    if (!curso) throw new NotFoundError('Curso no encontrado');

    const usuario = await Usuario.findByPk(estudianteId, { include: 'rol' });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    if (usuario.rol?.nombre !== ROLES.ESTUDIANTE_NOMBRE) {
        throw new BadRequestError('Solo los estudiantes pueden inscribirse');
    }

    const yaInscrito = await Inscripcion.findOne({ where: { cursoId, estudianteId } });
    if (yaInscrito) throw new BadRequestError('Ya estás inscrito en este curso');

    return await Inscripcion.create({ cursoId, estudianteId });
};

const findByCurso = async cursoId => {
    const curso = await Curso.findByPk(cursoId);
    if (!curso) throw new NotFoundError('Curso no encontrado');

    return await Inscripcion.findAll({
        where: { cursoId },
        include: [
            {
                model: Usuario,
                as: 'estudiante',
                attributes: ['id', 'nombre', 'apellido', 'email']
            }
        ]
    });
};

const findByEstudiante = async estudianteId => {
    return await Inscripcion.findAll({
        where: { estudianteId },
        include: [
            {
                model: Curso,
                as: 'curso',
                attributes: ['id', 'titulo', 'descripcion']
            }
        ]
    });
};

const findById = async inscripcionId => {
    const inscripcion = await Inscripcion.findByPk(inscripcionId, {
        include: [
            {
                model: Usuario,
                as: 'estudiante',
                attributes: ['id', 'nombre', 'apellido', 'email']
            },
            {
                model: Curso,
                as: 'curso',
                attributes: ['id', 'titulo', 'descripcion']
            }
        ]
    });
    if (!inscripcion) throw new NotFoundError('Inscripción no encontrada');
    return inscripcion;
};

const remove = async (inscripcionId, usuarioId) => {
    const inscripcion = await Inscripcion.findByPk(inscripcionId);
    if (!inscripcion) throw new NotFoundError('Inscripción no encontrada');

    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    const esAdmin = usuario.rol?.codigo === ROLES.ADMIN;
    const esEstudiante = inscripcion.estudianteId === usuarioId;

    // Solo el admin puede eliminar cualquier inscripción, o el estudiante sus propias inscripciones
    if (!esAdmin && !esEstudiante) {
        throw new ForbiddenError('No tienes permiso para eliminar esta inscripción');
    }

    await inscripcion.destroy();
    return { message: 'Inscripción eliminada exitosamente' };
};

module.exports = {
    create,
    findById,
    remove,
    findByCurso,
    findByEstudiante
};
