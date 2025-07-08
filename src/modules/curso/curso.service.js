const db = require('@db/index');
const Curso = db.cursos;
const Usuario = db.usuarios;
const { BadRequestError, NotFoundError } = require('@utils/errors');
const ROLES = require('@constants/roles');

const createCurso = async (titulo, descripcion, categoriaId, currentUserId, assignedProfesorId) => {
    const categoria = await db.categorias.findByPk(categoriaId);
    if (!categoria) {
        throw new BadRequestError('Categoría no válida');
    }

    const caller = await Usuario.findByPk(currentUserId, { include: 'rol' });
    if (!caller) {
        throw new BadRequestError('Usuario no encontrado');
    }

    let ownerId;
    if (caller.rol.codigo === ROLES.ADMIN) {
        if (!assignedProfesorId) {
            throw new BadRequestError('El campo profesorId es requerido para administradores');
        }
        ownerId = assignedProfesorId;
    } else {
        ownerId = currentUserId;
    }

    const profesor = await Usuario.findByPk(ownerId, { include: 'rol' });
    if (!profesor || profesor.rol.codigo !== ROLES.PROFESOR) {
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

const getCursos = async (filtros = {}) => {
    const where = {};

    // Filtrar por profesor si se especifica
    if (filtros.profesorId) {
        // Verificar que el profesor existe y es válido
        const profesor = await Usuario.findByPk(filtros.profesorId, { include: 'rol' });
        if (!profesor) {
            throw new NotFoundError('Profesor no encontrado');
        }
        if (profesor.rol.codigo !== ROLES.PROFESOR) {
            throw new BadRequestError('El usuario especificado no es un profesor');
        }
        where.profesorId = filtros.profesorId;
    }

    // Filtrar por categoría si se especifica
    if (filtros.categoriaId) {
        where.categoriaId = filtros.categoriaId;
    }

    return await Curso.findAll({
        where,
        include: [
            { model: db.categorias, as: 'categoria', attributes: ['id', 'nombre'] },
            {
                model: db.usuarios,
                as: 'profesor',
                attributes: ['id', 'nombre', 'apellido']
            }
        ]
    });
};

const getCursoById = async id => {
    const curso = await Curso.findByPk(id, {
        include: [
            { model: db.categorias, as: 'categoria', attributes: ['id', 'nombre'] },
            {
                model: db.usuarios,
                as: 'profesor',
                attributes: ['id', 'nombre', 'apellido']
            },
            { model: db.videos, as: 'videos' }
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

    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) {
        throw new BadRequestError('Usuario no encontrado');
    }

    const esAdmin = usuario.rol.codigo === ROLES.ADMIN;
    const esPropietario = curso.profesorId === usuarioId;

    if (!esAdmin && !esPropietario) {
        throw new BadRequestError('No tienes permiso para editar este curso');
    }

    const { titulo, descripcion, categoriaId, profesorId } = datos;
    if (categoriaId) {
        const cat = await db.categorias.findByPk(categoriaId);
        if (!cat) throw new BadRequestError('Categoría no válida');
        curso.categoriaId = categoriaId;
    }
    if (titulo) curso.titulo = titulo;
    if (descripcion) curso.descripcion = descripcion;
    // Permitir que el admin cambie el profesor
    if (esAdmin && profesorId) {
        const nuevoProfesor = await Usuario.findByPk(profesorId, { include: 'rol' });
        if (!nuevoProfesor || nuevoProfesor.rol.codigo !== ROLES.PROFESOR) {
            throw new BadRequestError('El usuario asignado no es profesor válido');
        }
        curso.profesorId = profesorId;
    }
    await curso.save();
    return curso;
};

const deleteCurso = async (id, usuarioId) => {
    const curso = await Curso.findByPk(id);
    if (!curso) {
        throw new NotFoundError('Curso no encontrado');
    }

    const usuario = await Usuario.findByPk(usuarioId, { include: 'rol' });
    if (!usuario) {
        throw new BadRequestError('Usuario no encontrado');
    }

    const esAdmin = usuario.rol.codigo === ROLES.ADMIN;
    const esPropietario = curso.profesorId === usuarioId;

    if (!esAdmin && !esPropietario) {
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

    const rol = caller.rol.codigo;
    if (rol !== ROLES.ADMIN && curso.profesorId !== currentUserId) {
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
