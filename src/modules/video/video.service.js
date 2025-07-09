const db = require('@db');
const Video = db.videos;
const Curso = db.cursos;
const Usuario = db.usuarios;
const Inscripcion = db.inscripciones;
const { BadRequestError, NotFoundError, ForbiddenError } = require('@utils/errors');
const ROLES = require('@constants/roles');

const create = async (cursoId, titulo, url, orden, usuarioId) => {
    const curso = await Curso.findByPk(cursoId);
    if (!curso) throw new NotFoundError('Curso no encontrado');

    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) throw new BadRequestError('Usuario no encontrado');

    const esAdmin = usuario.rol.codigo === ROLES.ADMIN;
    const esPropietario = curso.profesorId === usuarioId;
    if (!esAdmin && !esPropietario) {
        throw new ForbiddenError('No tienes permiso para agregar vídeos a este curso');
    }

    const existeOrden = await Video.findOne({ where: { cursoId, orden } });
    if (existeOrden) throw new BadRequestError('El orden del vídeo ya existe');

    return await Video.create({ titulo, url, orden, cursoId });
};

const findAll = async (cursoId, usuarioId) => {
    const curso = await Curso.findByPk(cursoId);
    if (!curso) throw new NotFoundError('Curso no encontrado');

    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) throw new BadRequestError('Usuario no encontrado');

    const esAdmin = usuario.rol.codigo === ROLES.ADMIN;
    const esPropietario = curso.profesorId === usuarioId;

    if (!esAdmin && !esPropietario) {
        const inscripcion = await Inscripcion.findOne({
            where: { cursoId, estudianteId: usuarioId }
        });
        if (!inscripcion) {
            throw new ForbiddenError('Debes estar inscrito para ver los vídeos');
        }
    }

    return await Video.findAll({
        where: { cursoId },
        order: [['orden', 'ASC']],
        include: [
            {
                model: Curso,
                as: 'curso',
            }
        ]
    });
};

const findById = async (id, usuarioId) => {
    const video = await Video.findByPk(id);
    if (!video) throw new NotFoundError('Vídeo no encontrado');

    await findAll(video.cursoId, usuarioId);
    return video;
};

const update = async (id, cambios, usuarioId) => {
    const video = await Video.findByPk(id);
    if (!video) throw new NotFoundError('Vídeo no encontrado');

    const curso = await Curso.findByPk(video.cursoId);
    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });

    const esAdmin = usuario.rol.codigo === ROLES.ADMIN;
    const esPropietario = curso.profesorId === usuarioId;
    if (!esAdmin && !esPropietario) {
        throw new ForbiddenError('No tienes permiso para editar este vídeo');
    }

    if (cambios.orden && cambios.orden !== video.orden) {
        const existeOrden = await Video.findOne({ where: { cursoId: video.cursoId, orden: cambios.orden } });
        if (existeOrden) throw new BadRequestError('El orden del vídeo ya existe');
    }

    Object.assign(video, {
        titulo: cambios.titulo ?? video.titulo,
        url: cambios.url ?? video.url,
        orden: cambios.orden ?? video.orden
    });

    await video.save();
    return video;
};

const remove = async (id, usuarioId) => {
    const video = await Video.findByPk(id);
    if (!video) throw new NotFoundError('Vídeo no encontrado');

    const curso = await Curso.findByPk(video.cursoId);
    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    const esAdmin = usuario.rol.codigo === ROLES.ADMIN;
    const esPropietario = curso.profesorId === usuarioId;
    if (!esAdmin && !esPropietario) {
        throw new ForbiddenError('No tienes permiso para eliminar este vídeo');
    }

    await video.destroy();
    return { message: 'Vídeo eliminado exitosamente' };
};

const reordenarVideos = async (cursoId, ordenes, usuarioId) => {
    const curso = await Curso.findByPk(cursoId);
    if (!curso) throw new NotFoundError('Curso no encontrado');

    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) throw new BadRequestError('Usuario no encontrado');

    const esAdmin = usuario.rol.codigo === ROLES.ADMIN;
    const esPropietario = curso.profesorId === usuarioId;
    if (!esAdmin && !esPropietario) {
        throw new ForbiddenError('No tienes permiso para reordenar los vídeos de este curso');
    }

    // Validar que todos los videos existen y pertenecen al curso
    const videoIds = ordenes.map(v => v.id);
    const videos = await Video.findAll({ where: { id: videoIds, cursoId } });
    if (videos.length !== ordenes.length) {
        throw new BadRequestError('Uno o más videos no existen o no pertenecen al curso');
    }

    // Validar que no haya órdenes duplicados
    const ordenSet = new Set(ordenes.map(v => v.orden));
    if (ordenSet.size !== ordenes.length) {
        throw new BadRequestError('No puede haber órdenes duplicados');
    }

    // Actualizar todos los videos
    for (const { id, orden } of ordenes) {
        const video = videos.find(v => v.id === id);
        video.orden = orden;
        await video.save();
    }
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove,
    reordenarVideos
};
