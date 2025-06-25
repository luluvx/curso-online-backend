const db = require('@db');
const Nota = db.notas;
const Inscripcion = db.inscripciones;
const Curso = db.cursos;
const Usuario = db.usuarios;
const { BadRequestError, NotFoundError, ForbiddenError } = require('@utils/errors');
const ROLES = require('@constants/roles');

const create = async (inscripcionId, valor, descripcion, usuarioId) => {
    const inscripcion = await Inscripcion.findByPk(inscripcionId);
    if (!inscripcion) throw new NotFoundError('Inscripción no encontrada');

    const curso = await Curso.findByPk(inscripcion.cursoId);
    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    const esAdmin = usuario.rol?.codigo === ROLES.ADMIN;
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

    const esAdmin = usuario.rol?.codigo === ROLES.ADMIN;
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

const update = async (id, datos, usuarioId) => {
    const nota = await Nota.findByPk(id, { include: { model: Inscripcion, as: 'inscripcion' } });
    if (!nota) throw new NotFoundError('Nota no encontrada');

    const inscripcion = nota.inscripcion;
    const curso = await Curso.findByPk(inscripcion.cursoId);
    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    const esAdmin = usuario.rol?.codigo === ROLES.ADMIN;
    const esProfesor = curso.profesorId === usuarioId;
    if (!esAdmin && !esProfesor) {
        throw new ForbiddenError('No tienes permiso para editar esta nota');
    }

    if (datos.valor !== undefined) nota.valor = datos.valor;
    if (datos.descripcion !== undefined) nota.descripcion = datos.descripcion;
    await nota.save();
    return nota;
};

const remove = async (id, usuarioId) => {
    const nota = await Nota.findByPk(id, { include: { model: Inscripcion, as: 'inscripcion' } });
    if (!nota) throw new NotFoundError('Nota no encontrada');

    const inscripcion = nota.inscripcion;
    const curso = await Curso.findByPk(inscripcion.cursoId);
    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    const esAdmin = usuario.rol?.codigo === ROLES.ADMIN;
    const esProfesor = curso.profesorId === usuarioId;
    if (!esAdmin && !esProfesor) {
        throw new ForbiddenError('No tienes permiso para eliminar esta nota');
    }

    await nota.destroy();
    return { message: 'Nota eliminada exitosamente' };
};

module.exports = {
    create,
    findByInscripcion,
    findMine,
    update,
    remove
};
