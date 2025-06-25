const db = require('@db');
const Inscripcion = db.inscripciones;
const Curso = db.cursos;
const Usuario = db.usuarios;
const { BadRequestError, NotFoundError } = require('@utils/errors');
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

module.exports = {
    create,
    findByCurso,
    findByEstudiante
};
