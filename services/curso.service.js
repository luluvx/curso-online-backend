const db = require('../models');
const Curso = db.cursos;
const Usuario = db.usuarios;
const { BadRequestError, NotFoundError } = require('../utils/errors');

const createCurso = async (
    titulo,
    descripcion,
    categoriaId,
    currentUserId,
    assignedProfesorId
    ) => {

    if (!titulo || !descripcion || !categoriaId) {
        throw new BadRequestError('Título, descripción y categoría son requeridos');
    }


    const categoria = await db.categorias.findByPk(categoriaId);
    if (!categoria) {
        throw new BadRequestError('Categoría no válida');
    }


    const caller = await Usuario.findByPk(currentUserId, { include: 'rol' });
    if (!caller) {
        throw new BadRequestError('Usuario no encontrado');
    }


    let ownerId;
    if (caller.rol.nombre === 'administrador') {
        if (!assignedProfesorId) {
        throw new BadRequestError('El campo profesorId es requerido para administradores');
        }
        ownerId = assignedProfesorId;
    } else {
        ownerId = currentUserId;
    }


    const profesor = await Usuario.findByPk(ownerId, { include: 'rol' });
    if (!profesor || profesor.rol.nombre !== 'profesor') {
        throw new BadRequestError('El usuario asignado no es profesor válido');
    }

    const newCurso = await Curso.create({
        titulo,
        descripcion,
        categoriaId,
        profesorId: ownerId
    });

    return newCurso;
};

const getCursos = async () => {
    return await Curso.findAll({
        include: [
        { model: db.categorias, as: 'categoria', attributes: ['id','nombre'] },
        { model: db.usuarios,   as: 'profesor',   attributes: ['id','nombre','apellido'] }
        ]
    });
};

const getCursoById = async (id) => {
    const curso = await Curso.findByPk(id, {
        include: [
        { model: db.categorias, as: 'categoria', attributes: ['id','nombre'] },
        { model: db.usuarios,   as: 'profesor',   attributes: ['id','nombre','apellido'] },
        { model: db.videos,     as: 'videos' }
        ]
    });
    if (!curso) {
        throw new NotFoundError('Curso no encontrado');
    }
    return curso;
};

const updateCurso = async (id, datos, usuarioId) => {
    const curso = await Curso.findByPk(id);
    if (!curso) {
        throw new NotFoundError('Curso no encontrado');
    }
    if (curso.profesorId !== usuarioId) {
        throw new BadRequestError('No tienes permiso para editar este curso');
    }

    const { titulo, descripcion, categoriaId } = datos;
    if (categoriaId) {
        const cat = await db.categorias.findByPk(categoriaId);
        if (!cat) throw new BadRequestError('Categoría no válida');
        curso.categoriaId = categoriaId;
    }
    if (titulo)       curso.titulo       = titulo;
    if (descripcion)  curso.descripcion  = descripcion;
    await curso.save();
    return curso;
};

const deleteCurso = async (id, usuarioId) => {
    const curso = await Curso.findByPk(id);
    if (!curso) {
        throw new NotFoundError('Curso no encontrado');
    }
    if (curso.profesorId !== usuarioId) {
        throw new BadRequestError('No tienes permiso para eliminar este curso');
    }
    await curso.destroy();
    return { message: 'Curso eliminado exitosamente' };
};


const updateCursoPicture = async (id, imagenUrl, currentUserId) => {

    const curso = await Curso.findByPk(id);
    if (!curso) {
        throw new NotFoundError('Curso no encontrado');
    }


    const caller = await Usuario.findByPk(currentUserId, { include: 'rol' });
    if (!caller) {
        throw new BadRequestError('Usuario no encontrado');
    }

    const rol = caller.rol.nombre;
    if (rol !== 'administrador' && curso.profesorId !== currentUserId) {
        throw new BadRequestError('No tienes permiso para modificar este curso');
    }

    curso.imagenUrl = imagenUrl;
    await curso.save();
    return curso;
};

module.exports = {
    createCurso,
    getCursos,
    getCursoById,
    updateCurso,
    deleteCurso,
    updateCursoPicture
};
