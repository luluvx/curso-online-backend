const db = require('@db/index');
const Comentario = db.comentarios;
const { NotFoundError, BadRequestError } = require('@utils/errors');

const create = async ({ cursoId, usuarioId, contenido }) => {
    if (!contenido) throw new BadRequestError('El contenido no puede estar vacío');
    return await Comentario.create({ cursoId, usuarioId, contenido });
};

const findByCurso = async cursoId => {
    return await Comentario.findAll({
        where: { cursoId },
        include: [{ association: 'autor', attributes: ['id', 'nombre', 'apellido'] }],
        order: [['createdAt', 'DESC']]
    });
};

const update = async (id, usuarioId, contenido) => {
    const comentario = await Comentario.findByPk(id);
    if (!comentario || comentario.usuarioId !== usuarioId) {
        throw new NotFoundError('No autorizado o comentario no encontrado');
    }
    comentario.contenido = contenido;
    await comentario.save();
    return comentario;
};

const remove = async (id, usuarioId) => {
    const comentario = await Comentario.findByPk(id);
    if (!comentario || comentario.usuarioId !== usuarioId) {
        throw new NotFoundError('No autorizado o comentario no encontrado');
    }
    await comentario.destroy();
    return { message: 'Comentario eliminado' };
};

module.exports = { create, findByCurso, update, remove };
