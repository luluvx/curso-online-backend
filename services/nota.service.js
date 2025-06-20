const db = require("../models");
const Nota = db.notas;
const Inscripcion = db.inscripciones;
const Curso = db.cursos;
const Usuario = db.usuarios;
const {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
} = require("../utils/errors");


const createNota = async (inscripcionId, valor, descripcion, usuarioId) => {
    if (valor == null) {
        throw new BadRequestError("El valor de la nota es requerido");
    }

    // 2) Validar existencia de la inscripción
    const inscripcion = await Inscripcion.findByPk(inscripcionId);
    if (!inscripcion) {
        throw new NotFoundError("Inscripción no encontrada");
    }

    // 3) Validar permiso sobre el curso
    const curso = await Curso.findByPk(inscripcion.cursoId);
    const usuario = await Usuario.findByPk(usuarioId, { include: "rol" });
    if (!usuario) {
        throw new NotFoundError("Usuario no encontrado");
    }
    const nombreRol = usuario.rol.nombre;
    const esPropietario = curso.profesorId === usuarioId;
    if (nombreRol !== "administrador" && !esPropietario) {
        throw new ForbiddenError(
        "No tienes permiso para asignar notas en este curso"
        );
    }

    // 4) Crear y devolver la nota
    return await Nota.create({ inscripcionId, valor, descripcion });
};


const getNotasPorInscripcion = async (inscripcionId, usuarioId) => {
    // 2) Validar inscripción
    const inscripcion = await Inscripcion.findByPk(inscripcionId);
    if (!inscripcion) {
        throw new NotFoundError("Inscripción no encontrada");
    }

    // 3) Validar permiso
    const curso = await Curso.findByPk(inscripcion.cursoId);
    const usuario = await Usuario.findByPk(usuarioId, { include: "rol" });
    if (!usuario) {
        throw new NotFoundError("Usuario no encontrado");
    }
    const nombreRol = usuario.rol.nombre;
    const esPropietario = curso.profesorId === usuarioId;
    const esEstudiante = inscripcion.estudianteId === usuarioId;
    if (nombreRol !== "administrador" && !esPropietario && !esEstudiante) {
        throw new ForbiddenError("No tienes permiso para ver estas notas");
    }

    // 4) Devolver notas ordenadas
    return await Nota.findAll({
        where: { inscripcionId },
        order: [["createdAt", "ASC"]],
    });
};


const getMisNotas = async (usuarioId) => {
    // 2) Obtener sus inscripciones
    const inscripciones = await Inscripcion.findAll({
        where: { estudianteId: usuarioId },
    });
    const inscripcionIds = inscripciones.map((i) => i.id);

    // 3) Devolver notas con datos del curso
    return await Nota.findAll({
        where: { inscripcionId: inscripcionIds },
        include: [
        {
            model: Inscripcion,
            as: "inscripcion",
            attributes: ["cursoId"],
            include: [
            {
                model: Curso,
                as: "curso",
                attributes: ["id", "titulo"],
            },
            ],
        },
        ],
        order: [["createdAt", "ASC"]],
    });
};

module.exports = {
    createNota,
    getNotasPorInscripcion,
    getMisNotas,
};
