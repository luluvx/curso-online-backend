const db = require("../models");
const VideoModel = db.videos;
const CursoModel = db.cursos;
const UsuarioModel = db.usuarios;
const InscripcionModel = db.inscripciones;
const {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
} = require("../utils/errors");

const createVideo = async (cursoId, titulo, url, orden, usuarioId) => {
    if (!titulo || !url || orden == null) {
        throw new BadRequestError("Título, URL y orden son requeridos");
    }

    const curso = await CursoModel.findByPk(cursoId);
    if (!curso) {
        throw new NotFoundError("Curso no encontrado");
    }

    const usuario = await UsuarioModel.findByPk(usuarioId, { include: "rol" });
    if (!usuario) {
        throw new BadRequestError("Usuario no encontrado");
    }

    const nombreRol = usuario.rol.nombre;
    const esPropietario = curso.profesorId === usuarioId;
    if (nombreRol !== "administrador" && !esPropietario) {
        throw new ForbiddenError(
        "No tienes permiso para agregar vídeos a este curso"
        );
    }

    return await VideoModel.create({ titulo, url, orden, cursoId });
};


const getVideos = async (cursoId, usuarioId) => {
    const curso = await CursoModel.findByPk(cursoId);
    if (!curso) {
        throw new NotFoundError("Curso no encontrado");
    }

    const usuario = await UsuarioModel.findByPk(usuarioId, { include: "rol" });
    if (!usuario) {
        throw new BadRequestError("Usuario no encontrado");
    }

    const nombreRol = usuario.rol.nombre;
    const esPropietario = curso.profesorId === usuarioId;
    if (nombreRol !== "administrador" && !esPropietario) {
        const inscripcion = await InscripcionModel.findOne({
        where: { cursoId, estudianteId: usuarioId },
        });
        if (!inscripcion) {
        throw new ForbiddenError("Debes estar inscrito para ver los vídeos");
        }
    }

    return await VideoModel.findAll({
        where: { cursoId },
        order: [["orden", "ASC"]],
    });
};


const getVideoById = async (videoId, usuarioId) => {
    const video = await VideoModel.findByPk(videoId);
    if (!video) {
        throw new NotFoundError("Vídeo no encontrado");
    }

    await getVideos(video.cursoId, usuarioId);

    return video;
};


const updateVideo = async (videoId, cambios, usuarioId) => {
    const video = await VideoModel.findByPk(videoId);
    if (!video) {
        throw new NotFoundError("Vídeo no encontrado");
    }

    const curso = await CursoModel.findByPk(video.cursoId);
    const usuario = await UsuarioModel.findByPk(usuarioId, { include: "rol" });
    const nombreRol = usuario.rol.nombre;
    const esPropietario = curso.profesorId === usuarioId;
    if (nombreRol !== "administrador" && !esPropietario) {
        throw new ForbiddenError("No tienes permiso para editar este vídeo");
    }

    const { titulo, url, orden } = cambios;
    if (titulo) video.titulo = titulo;
    if (url) video.url = url;
    if (orden != null) video.orden = orden;

    await video.save();
    return video;
};


const deleteVideo = async (videoId, usuarioId) => {
    const video = await VideoModel.findByPk(videoId);
    if (!video) {
        throw new NotFoundError("Vídeo no encontrado");
    }

    const curso = await CursoModel.findByPk(video.cursoId);
    const usuario = await UsuarioModel.findByPk(usuarioId, { include: "rol" });
    const nombreRol = usuario.rol.nombre;
    const esPropietario = curso.profesorId === usuarioId;
    if (nombreRol !== "administrador" && !esPropietario) {
        throw new ForbiddenError("No tienes permiso para eliminar este vídeo");
    }

    await video.destroy();
    return { message: "Vídeo eliminado exitosamente" };
};

module.exports = {
    createVideo,
    getVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
};
