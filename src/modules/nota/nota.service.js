const db = require('@db');
const Nota = db.notas;
const Inscripcion = db.inscripciones;
const Curso = db.cursos;
const Usuario = db.usuarios;
const { BadRequestError, NotFoundError, ForbiddenError } = require('@utils/errors');

const create = async (inscripcionId, valor, descripcion, usuarioId) => {
    if (valor == null) throw new BadRequestError('El valor de la nota es requerido');

    const inscripcion = await Inscripcion.findByPk(inscripcionId);
    if (!inscripcion) throw new NotFoundError('Inscripción no encontrada');

    const curso = await Curso.findByPk(inscripcion.cursoId);
    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    const esAdmin = usuario.rol?.nombre === 'administrador';
    const esProfesor = curso.profesorId === usuarioId;
    if (!esAdmin && !esProfesor) {
        throw new ForbiddenError('No tienes permiso para asignar notas en este curso');
    }

    return await Nota.create({ inscripcionId, valor, descripcion });
};

const findByInscripcion = async (inscripcionId, usuarioId) => {
    const inscripcion = await Inscripcion.findByPk(inscripcionId);
    if (!inscripcion) throw new NotFoundError('Inscripción no encontrada');

    const curso = await Curso.findByPk(inscripcion.cursoId);
    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    const esAdmin = usuario.rol?.nombre === 'administrador';
    const esProfesor = curso.profesorId === usuarioId;
    const esEstudiante = inscripcion.estudianteId === usuarioId;

    if (!esAdmin && !esProfesor && !esEstudiante) {
        throw new ForbiddenError('No tienes permiso para ver estas notas');
    }

    return await Nota.findAll({
        where: { inscripcionId },
        order: [['createdAt', 'ASC']]
    });
};

const findMine = async usuarioId => {
    const inscripciones = await Inscripcion.findAll({ where: { estudianteId: usuarioId } });
    const inscripcionIds = inscripciones.map(i => i.id);

    return await Nota.findAll({
        where: { inscripcionId: inscripcionIds },
        include: [
            {
                model: Inscripcion,
                as: 'inscripcion',
                attributes: ['cursoId'],
                include: [
                    {
                        model: Curso,
                        as: 'curso',
                        attributes: ['id', 'titulo']
                    }
                ]
            }
        ],
        order: [['createdAt', 'ASC']]
    });
};

module.exports = {
    create,
    findByInscripcion,
    findMine
};
