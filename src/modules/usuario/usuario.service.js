const db = require('@db');
const Usuario = db.usuarios;
const { NotFoundError, BadRequestError } = require('@utils/errors');

const findAll = async (rolCodigo) => {
    const where = {};
    let include = [{
        model: db.roles,
        as: 'rol',
        attributes: ['id', 'codigo', 'nombre']
    }];
    if (rolCodigo) {
        include[0].where = { codigo: rolCodigo };
    }
    return await Usuario.findAll({
        attributes: { exclude: ['password', 'rolId'] },
        include
    });
};

const findById = async id => {
    const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['password', 'rolId'] },
        include: [{
            model: db.roles,
            as: 'rol',
            attributes: ['id', 'codigo', 'nombre']
        }]
    });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    return usuario;
};

const update = async (id, datos) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    const { nombre, apellido, email } = datos;
    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (email) usuario.email = email;
    await usuario.save();
    return usuario;
};

const remove = async id => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    await usuario.destroy();
    return { message: 'Usuario eliminado exitosamente' };
};

module.exports = { findAll, findById, update, remove }; 