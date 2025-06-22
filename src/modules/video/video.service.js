const db = require('@db');
const Video = db.videos;
const Curso = db.cursos;
const Usuario = db.usuarios;
const Inscripcion = db.inscripciones;
const { BadRequestError, NotFoundError, ForbiddenError } = require('@utils/errors');

const create = async (cursoId, titulo, url, orden, usuarioId) => {
  if (!titulo || !url || orden == null) {
    throw new BadRequestError('Título, URL y orden son requeridos');
  }

  const curso = await Curso.findByPk(cursoId);
  if (!curso) throw new NotFoundError('Curso no encontrado');

  const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
  if (!usuario) throw new BadRequestError('Usuario no encontrado');

  const esAdmin = usuario.rol.nombre === 'administrador';
  const esPropietario = curso.profesorId === usuarioId;
  if (!esAdmin && !esPropietario) {
    throw new ForbiddenError('No tienes permiso para agregar vídeos a este curso');
  }

  return await Video.create({ titulo, url, orden, cursoId });
};

const findAll = async (cursoId, usuarioId) => {
  const curso = await Curso.findByPk(cursoId);
  if (!curso) throw new NotFoundError('Curso no encontrado');

  const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
  if (!usuario) throw new BadRequestError('Usuario no encontrado');

  const esAdmin = usuario.rol.nombre === 'administrador';
  const esPropietario = curso.profesorId === usuarioId;

  if (!esAdmin && !esPropietario) {
    const inscripcion = await Inscripcion.findOne({ where: { cursoId, estudianteId: usuarioId } });
    if (!inscripcion) {
      throw new ForbiddenError('Debes estar inscrito para ver los vídeos');
    }
  }

  return await Video.findAll({
    where: { cursoId },
    order: [['orden', 'ASC']]
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

  const esAdmin = usuario.rol.nombre === 'administrador';
  const esPropietario = curso.profesorId === usuarioId;
  if (!esAdmin && !esPropietario) {
    throw new ForbiddenError('No tienes permiso para editar este vídeo');
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
  const esAdmin = usuario.rol.nombre === 'administrador';
  const esPropietario = curso.profesorId === usuarioId;
  if (!esAdmin && !esPropietario) {
    throw new ForbiddenError('No tienes permiso para eliminar este vídeo');
  }

  await video.destroy();
  return { message: 'Vídeo eliminado exitosamente' };
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
